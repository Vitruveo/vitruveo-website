import { NextResponse } from 'next/server';
import { createPublicClient, http, getAddress } from 'viem';
import { randomBytes } from 'node:crypto';

const SHUFFLE_ADDRESS = getAddress('0x00000000000000000000000000000000000000AB');
const RPC_URL = 'https://rpc.vitruveo.ai';
const CHAIN_ID = 1490;

const vitruveoChain = {
  id: CHAIN_ID,
  name: 'Vitruveo',
  nativeCurrency: { name: 'VTRU', symbol: 'VTRU', decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] } }
};

// Parse 104-byte hex response into array of 52 card codes
function parseShuffleResponse(hexData) {
  const hex = hexData.startsWith('0x') ? hexData.slice(2) : hexData;
  if (hex.length < 4) {
    return [];
  }
  const cards = [];
  for (let i = 0; i < hex.length; i += 4) {
    const suit = String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
    const rank = String.fromCharCode(parseInt(hex.slice(i + 2, i + 4), 16));
    cards.push(`${suit}${rank}`);
  }
  return cards;
}

export async function POST(request) {
  try {

    // Parse optional salt from request body
    let salt = '0x';
    try {
      const body = await request.json();
      if (body.salt) {
        salt = body.salt.startsWith('0x') ? body.salt : '0x' + body.salt;
      }
    } catch {
      // No body or invalid JSON, use empty salt
    }

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
      publicClient.call({ account: caller, to: SHUFFLE_ADDRESS, data: salt, blockNumber: block }),
      publicClient.estimateGas({ account: caller, to: SHUFFLE_ADDRESS, data: salt, blockNumber: block })
    ]);

    if (!result.data || result.data === '0x') {
      return NextResponse.json(
        { error: 'Shuffle precompile returned no data' },
        { status: 500 }
      );
    }

    const cards = parseShuffleResponse(result.data);

    return NextResponse.json({
      success: true,
      simulated: true,
      cards,
      gasUsed: gasEstimate.toString(),
      blockNumber: block.toString()
    });

  } catch (error) {
    console.error('Shuffle API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Shuffle failed' },
      { status: 500 }
    );
  }
}
