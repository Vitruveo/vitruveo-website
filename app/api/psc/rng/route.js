import { NextResponse } from 'next/server';
import { createPublicClient, http, getAddress } from 'viem';
import { randomBytes } from 'node:crypto';

const RNG_ADDRESS = getAddress('0x00000000000000000000000000000000000000FF');
const RPC_URL = 'https://rpc.vitruveo.ai';
const CHAIN_ID = 1490;

const vitruveoChain = {
  id: CHAIN_ID,
  name: 'Vitruveo',
  nativeCurrency: { name: 'VTRU', symbol: 'VTRU', decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] } }
};

// Decode ABI encoded uint256[] array
function decodeUint256Array(hexResult) {
  const hex = hexResult.startsWith('0x') ? hexResult.slice(2) : hexResult;
  if (hex.length < 128) {
    return [];
  }
  const length = parseInt(hex.slice(64, 128), 16);
  const values = [];
  for (let i = 0; i < length; i++) {
    const start = 128 + (i * 64);
    const end = start + 64;
    values.push('0x' + hex.slice(start, end));
  }
  return values;
}

export async function POST(request) {
  try {

    // Parse count from request body (default 1)
    let count = 1;
    try {
      const body = await request.json();
      if (body.count && body.count >= 1 && body.count <= 255) {
        count = body.count;
      }
    } catch {
      // No body or invalid JSON, use default
    }

    // Input is single byte for count
    const data = '0x' + count.toString(16).padStart(2, '0');

    // Read-only eth_call against the latest block. On the current release the
    // precompile emits no log, so a transaction's output cannot be recovered
    // afterwards; a call returns exactly what was computed. A random caller
    // address (part of the seed) gives a fresh result on every request.
    const publicClient = createPublicClient({
      chain: vitruveoChain,
      transport: http(RPC_URL)
    });
    const caller = getAddress('0x' + randomBytes(20).toString('hex'));
    const block = await publicClient.getBlockNumber();

    const [result, gasEstimate] = await Promise.all([
      publicClient.call({ account: caller, to: RNG_ADDRESS, data: data, blockNumber: block }),
      publicClient.estimateGas({ account: caller, to: RNG_ADDRESS, data: data, blockNumber: block })
    ]);

    if (!result.data || result.data === '0x') {
      return NextResponse.json(
        { error: 'RNG precompile returned no data' },
        { status: 500 }
      );
    }

    const randomValues = decodeUint256Array(result.data);

    return NextResponse.json({
      success: true,
      simulated: true,
      values: randomValues,
      count,
      gasUsed: gasEstimate.toString(),
      blockNumber: block.toString()
    });

  } catch (error) {
    console.error('RNG API error:', error);
    return NextResponse.json(
      { error: error?.message || 'RNG failed' },
      { status: 500 }
    );
  }
}
