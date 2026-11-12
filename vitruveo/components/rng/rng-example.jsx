'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { PSC_ADDRESSES, NETWORK_CONFIG } from '../../lib/psc-constants';

const EXPLORER_URL = 'https://explorer.vitruveo.ai';

// Generate a color based on the number
function getColorForNumber(num, min, max) {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8B500', '#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9',
    '#92A8D1', '#955251', '#B565A7', '#009B77', '#DD4124'
  ];
  return colors[Math.abs(num) % colors.length];
}

export function RngExample() {
  const [activeTab, setActiveTab] = useState('demo');
  const [count, setCount] = useState('1');
  const [minVal, setMinVal] = useState('1');
  const [maxVal, setMaxVal] = useState('100');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [txDetails, setTxDetails] = useState(null);

  const handleGenerate = async () => {
    const min = parseInt(minVal, 10);
    const max = parseInt(maxVal, 10);
    const countNum = parseInt(count, 10);

    if (isNaN(min) || isNaN(max) || min >= max) {
      setError('Invalid range. Min must be less than max.');
      return;
    }

    if (isNaN(countNum) || countNum < 1 || countNum > 255) {
      setError('Count must be between 1 and 255.');
      return;
    }

    setLoading(true);
    setError(null);
    setTxHash(null);
    setTxDetails(null);

    try {
      const response = await fetch('/api/psc/rng', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: countNum })
      });

      const json = await response.json();

      if (!json.success) {
        throw new Error(json.error || 'RNG failed');
      }

      setTxHash(json.txHash);
      setTxDetails({
        gasUsed: json.gasUsed,
        blockNumber: json.blockNumber
      });

      // Convert hex values to BigInt, then to range
      const range = BigInt(max - min + 1);
      const newResults = json.values.map((hexValue, idx) => {
        const randomBigInt = BigInt(hexValue);
        return {
          value: Number(randomBigInt % range) + min,
          raw: hexValue,
          timestamp: Date.now() + idx
        };
      });

      setResults(prev => [...newResults, ...prev]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const codeSnippet = `// Generate random numbers using Vitruveo RNG PSC
const RPC = '${NETWORK_CONFIG.rpc}';
const RNG_ADDRESS = '${PSC_ADDRESSES.RNG}';

// Input: single byte for count (1-255)
const count = 5;
const data = '0x' + count.toString(16).padStart(2, '0');

const response = await fetch(RPC, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_call',
    params: [{ to: RNG_ADDRESS, data }, 'latest']
  })
});

const { result } = await response.json();

// Decode ABI encoded uint256[] response
function decodeUint256Array(hex) {
  hex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const length = parseInt(hex.slice(64, 128), 16);
  const values = [];
  for (let i = 0; i < length; i++) {
    values.push(BigInt('0x' + hex.slice(128 + i*64, 192 + i*64)));
  }
  return values;
}

const randomValues = decodeUint256Array(result);

// Convert to range [min, max]
const min = 1, max = 100;
const range = BigInt(max - min + 1);
const numbers = randomValues.map(v => Number(v % range) + min);

console.log(numbers); // e.g., [42, 17, 89, 3, 56]`;

  const soliditySnippet = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RandomNumbers {
    address constant RNG_PSC = ${PSC_ADDRESSES.RNG};

    /// @notice Generate multiple random numbers
    /// @param count Number of random values (1-255)
    /// @return Array of random uint256 values
    function getRandomNumbers(uint8 count) public view returns (uint256[] memory) {
        bytes memory input = abi.encodePacked(count);
        (bool success, bytes memory result) = RNG_PSC.staticcall(input);
        require(success, "RNG failed");
        return abi.decode(result, (uint256[]));
    }

    /// @notice Generate a single random number in a range
    /// @param min Minimum value (inclusive)
    /// @param max Maximum value (inclusive)
    function getRandomInRange(uint256 min, uint256 max) public view returns (uint256) {
        require(max > min, "Invalid range");
        uint256[] memory randoms = getRandomNumbers(1);
        return (randoms[0] % (max - min + 1)) + min;
    }

    /// @notice Roll multiple dice
    /// @param numDice Number of dice to roll
    function rollDice(uint8 numDice) public view returns (uint256[] memory) {
        uint256[] memory randoms = getRandomNumbers(numDice);
        uint256[] memory rolls = new uint256[](numDice);
        for (uint i = 0; i < numDice; i++) {
            rolls[i] = (randoms[i] % 6) + 1;
        }
        return rolls;
    }

    /// @notice Flip multiple coins (0 = heads, 1 = tails)
    function flipCoins(uint8 numCoins) public view returns (uint256[] memory) {
        uint256[] memory randoms = getRandomNumbers(numCoins);
        uint256[] memory flips = new uint256[](numCoins);
        for (uint i = 0; i < numCoins; i++) {
            flips[i] = randoms[i] % 2;
        }
        return flips;
    }

    /// @notice Select random indices from array
    function randomIndices(uint256 arrayLength, uint8 count)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory randoms = getRandomNumbers(count);
        uint256[] memory indices = new uint256[](count);
        for (uint i = 0; i < count; i++) {
            indices[i] = randoms[i] % arrayLength;
        }
        return indices;
    }
}`;

  return (
    <div className="mb-5">
      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'demo' ? 'active' : ''}`}
            onClick={() => setActiveTab('demo')}
          >
            Demo
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'client' ? 'active' : ''}`}
            onClick={() => setActiveTab('client')}
          >
            Client Code
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'solidity' ? 'active' : ''}`}
            onClick={() => setActiveTab('solidity')}
          >
            Smart Contract
          </button>
        </li>
      </ul>

      {/* Demo Tab */}
      {activeTab === 'demo' && (
        <div>
          <p className="text-muted-light mb-4">
            Generate cryptographically secure random numbers using on-chain entropy.
          </p>

          <div className="d-flex gap-3 align-items-end mb-4 flex-wrap">
            <div>
              <label className="form-label text-white small">Count</label>
              <input
                type="number"
                className="form-control bg-dark text-white border-secondary"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                min="1"
                max="255"
                style={{ width: '80px' }}
              />
            </div>
            <div>
              <label className="form-label text-white small">Min</label>
              <input
                type="number"
                className="form-control bg-dark text-white border-secondary"
                value={minVal}
                onChange={(e) => setMinVal(e.target.value)}
                style={{ width: '100px' }}
              />
            </div>
            <div>
              <label className="form-label text-white small">Max</label>
              <input
                type="number"
                className="form-control bg-dark text-white border-secondary"
                value={maxVal}
                onChange={(e) => setMaxVal(e.target.value)}
                style={{ width: '100px' }}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
            {results.length > 0 && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => setResults([])}
              >
                Clear
              </button>
            )}
            {loading && (
              <span className="text-muted-light small">
                Sending transaction to Vitruveo...
              </span>
            )}
          </div>

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {(txHash || txDetails) && (
            <div className="tx-info mb-4">
              {txHash ? (
              <div className="tx-hash">
                <span className="label">Transaction:</span>
                <a
                  href={`${EXPLORER_URL}/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hash-link"
                >
                  {txHash.slice(0, 10)}...{txHash.slice(-8)}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                  </svg>
                </a>
              </div>
              ) : (
              <div className="tx-hash">
                <span className="label">Read-only call (eth_call) on mainnet. Nothing was written on-chain.</span>
              </div>
              )}
              {txDetails && (
                <div className="tx-details">
                  <span>Block: {txDetails.blockNumber}</span>
                  <span>{txHash ? 'Gas' : 'Gas (estimate)'}: {Number(txDetails.gasUsed).toLocaleString()}</span>
                </div>
              )}
            </div>
          )}

          <div className="tile-grid">
            {results.map((r) => (
              <div
                key={r.timestamp}
                className="number-tile"
                style={{ backgroundColor: getColorForNumber(r.value, parseInt(minVal), parseInt(maxVal)) }}
                title={`Raw: ${r.raw}`}
              >
                {r.value}
              </div>
            ))}
          </div>

          {results.length === 0 && (
            <div className="empty-state">
              <p className="text-muted-light mb-0">
                Click Generate to create random numbers
              </p>
            </div>
          )}
        </div>
      )}

      {/* Client Code Tab */}
      {activeTab === 'client' && (
        <SyntaxHighlighter
          language="javascript"
          style={oneDark}
          customStyle={{ borderRadius: '8px', fontSize: '14px' }}
        >
          {codeSnippet}
        </SyntaxHighlighter>
      )}

      {/* Smart Contract Tab */}
      {activeTab === 'solidity' && (
        <SyntaxHighlighter
          language="solidity"
          style={oneDark}
          customStyle={{ borderRadius: '8px', fontSize: '14px' }}
        >
          {soliditySnippet}
        </SyntaxHighlighter>
      )}

      <style jsx>{`
        .tile-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          min-height: 100px;
          margin-bottom: 3rem;
        }
        .number-tile {
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 700;
          color: #000;
          border-radius: 8px;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .empty-state {
          background: var(--vtru-dark-3);
          border-radius: 12px;
          padding: 3rem;
          text-align: center;
          margin-bottom: 3rem;
        }
        .nav-tabs {
          border-bottom: 1px solid #333;
        }
        .nav-tabs .nav-link {
          color: #888;
          border: none;
          border-bottom: 2px solid transparent;
          background: transparent;
          padding: 0.5rem 1rem;
        }
        .nav-tabs .nav-link:hover {
          color: #fff;
          border-bottom-color: #555;
        }
        .nav-tabs .nav-link.active {
          color: #a1ff75;
          border-bottom-color: #a1ff75;
          background: transparent;
        }
        .tx-info {
          background: rgba(161, 255, 117, 0.1);
          border: 1px solid rgba(161, 255, 117, 0.3);
          border-radius: 8px;
          padding: 1rem;
        }
        .tx-hash {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .tx-hash .label {
          color: #888;
          font-size: 0.9rem;
        }
        .hash-link {
          color: #a1ff75;
          text-decoration: none;
          font-family: monospace;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .hash-link:hover {
          color: #fff;
          text-decoration: underline;
        }
        .tx-details {
          display: flex;
          gap: 1.5rem;
          font-size: 0.85rem;
          color: #888;
        }
      `}</style>
    </div>
  );
}
