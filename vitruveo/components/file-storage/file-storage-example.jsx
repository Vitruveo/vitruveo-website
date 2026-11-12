'use client';

import { useState } from 'react';
import { createPublicClient, http, parseAbi } from 'viem';
import { PSC_ADDRESSES, NETWORK_CONFIG, FILE_GATEWAY_URL } from '../../lib/psc-constants';
import { PscCodeTabs } from '../psc-code-tabs';

const FILE_STORE_ABI = parseAbi([
  'function exists(bytes32 sha256Hash) view returns (bool)',
  'function info(bytes32 sha256Hash) view returns (address owner, uint256 size, string contentType, uint256 chunks, uint256 blockNumber)',
]);

function FileLookup() {
  const [hash, setHash] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const lookup = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const hex = hash.trim().replace(/^0x/i, '').toLowerCase();
      if (!/^[0-9a-f]{64}$/.test(hex)) {
        throw new Error('Enter a SHA-256 hash (64 hex characters)');
      }
      const client = createPublicClient({ transport: http(NETWORK_CONFIG.rpc) });
      const key = `0x${hex}`;
      const exists = await client.readContract({
        address: PSC_ADDRESSES.FILE_STORE, abi: FILE_STORE_ABI, functionName: 'exists', args: [key],
      });
      if (!exists) {
        setResult({ exists: false });
        return;
      }
      const [owner, size, contentType, chunks, blockNumber] = await client.readContract({
        address: PSC_ADDRESSES.FILE_STORE, abi: FILE_STORE_ABI, functionName: 'info', args: [key],
      });
      setResult({ exists: true, hex, owner, size, contentType, chunks, blockNumber });
    } catch (err) {
      setError(err.shortMessage || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
        <input
          type="text"
          className="form-control hash-input"
          placeholder="SHA-256 of a stored file (hex)"
          value={hash}
          onChange={(e) => setHash(e.target.value)}
        />
        <button className="btn btn-primary" onClick={lookup} disabled={loading || !hash}>
          {loading ? 'Looking up...' : 'Look Up File'}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {result && !result.exists && (
        <div className="alert alert-secondary">No finalized file with this hash.</div>
      )}

      {result && result.exists && (
        <div className="file-info mb-4">
          <div><span className="label">Owner:</span> <code>{result.owner}</code></div>
          <div><span className="label">Size:</span> {Number(result.size).toLocaleString()} bytes</div>
          <div><span className="label">Content type:</span> <code>{result.contentType}</code></div>
          <div><span className="label">Chunks:</span> {result.chunks.toString()}</div>
          <div><span className="label">Block:</span> {result.blockNumber.toString()}</div>
          <div className="mt-2">
            <a
              href={`${FILE_GATEWAY_URL}/${result.hex}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-vtru-green"
            >
              {FILE_GATEWAY_URL}/{result.hex.slice(0, 12)}...
            </a>
          </div>
        </div>
      )}

      <style jsx>{`
        .hash-input {
          max-width: 560px;
          background: #111;
          color: #fff;
          border: 1px solid #444;
          font-family: monospace;
        }
        .file-info {
          background: rgba(161, 255, 117, 0.1);
          border: 1px solid rgba(161, 255, 117, 0.3);
          border-radius: 8px;
          padding: 1rem;
          color: #ccc;
          font-size: 0.9rem;
        }
        .file-info .label {
          color: #888;
        }
      `}</style>
    </div>
  );
}

export function FileStorageExample() {
  const clientSnippet = `// Upload a file (up to 10 MB) from an EOA, then fetch it over HTTP
import { createPublicClient, createWalletClient, custom, http, encodeFunctionData, parseAbi, toHex } from 'viem';

const FILE_STORE = '${PSC_ADDRESSES.FILE_STORE}';
const CHUNK = 512 * 1024; // max chunk size
const abi = parseAbi([
  'function begin(bytes32 sha256Hash, uint256 size, string contentType) returns (bool)',
  'function upload(bytes32 sha256Hash, uint256 index, bytes chunk) returns (bool)',
  'function finalize(bytes32 sha256Hash) returns (bool)',
]);

const publicClient = createPublicClient({ transport: http('${NETWORK_CONFIG.rpc}') });
const walletClient = createWalletClient({ transport: custom(window.ethereum) });
const [account] = await walletClient.getAddresses();

const bytes = new Uint8Array(await file.arrayBuffer());
const hash = toHex(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)));

// Every step is a transaction sent directly to the precompile
// (direct transactions pay 2 gas per calldata byte instead of 16).
// Wait for each receipt: the wallet's gas estimate for a step reverts until the previous one is mined.
const send = async (functionName, args) => {
  const txHash = await walletClient.sendTransaction({
    account, chain: null, to: FILE_STORE,
    data: encodeFunctionData({ abi, functionName, args }),
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  if (receipt.status !== 'success') throw new Error(functionName + ' failed');
};

await send('begin', [hash, BigInt(bytes.length), file.type || 'application/octet-stream']);
for (let i = 0; i * CHUNK < bytes.length; i++) {
  await send('upload', [hash, BigInt(i), toHex(bytes.slice(i * CHUNK, (i + 1) * CHUNK))]);
}
await send('finalize', [hash]); // checks the SHA-256 of all chunks

// Served by nodes with the stored content type, CORS and range support
const url = '${FILE_GATEWAY_URL}/' + hash.slice(2) + '.png';`;

  const soliditySnippet = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// IFileStore.sol from contracts/filestore in the Vitruveo protocol repo.
import {IFileStore} from "./IFileStore.sol";

contract OnChainArtwork {
    IFileStore constant FILES = IFileStore(${PSC_ADDRESSES.FILE_STORE});

    mapping(uint256 => bytes32) public imageOf;

    /// Link a token to a file that was already uploaded and finalized.
    function setImage(uint256 tokenId, bytes32 sha256Hash) external {
        require(FILES.exists(sha256Hash), "file not stored");
        (address owner,,,,) = FILES.info(sha256Hash);
        require(owner == msg.sender, "not file owner");
        imageOf[tokenId] = sha256Hash;
    }

    /// The image URL is the file's SHA-256 on the node HTTP gateway.
    function imageURI(uint256 tokenId) external view returns (string memory) {
        return string.concat("${FILE_GATEWAY_URL}/", _hex(imageOf[tokenId]));
    }

    function _hex(bytes32 h) private pure returns (string memory) {
        bytes16 digits = "0123456789abcdef";
        bytes memory s = new bytes(64);
        for (uint256 i = 0; i < 32; i++) {
            s[2 * i] = digits[uint8(h[i]) >> 4];
            s[2 * i + 1] = digits[uint8(h[i]) & 0x0f];
        }
        return string(s);
    }
}`;

  return (
    <PscCodeTabs
      tabs={[
        { id: 'lookup', label: 'Lookup', content: <FileLookup /> },
        { id: 'client', label: 'Client Code', language: 'javascript', code: clientSnippet },
        { id: 'solidity', label: 'Smart Contract', language: 'solidity', code: soliditySnippet },
      ]}
    />
  );
}
