'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { PSC_ADDRESSES, NETWORK_CONFIG } from '../../lib/psc-constants';

// Encode a BigInt as 32-byte hex (64 hex chars)
function toBytes32(value) {
  return value.toString(16).padStart(64, '0');
}

// Format large numbers with commas
function formatNumber(num, decimals = 2) {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

export function CompoundInterestExample() {
  const [activeTab, setActiveTab] = useState('demo');
  const [principal, setPrincipal] = useState('1000');
  const [rate, setRate] = useState('5');
  const [periods, setPeriods] = useState('12');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCalculate = async () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const n = parseInt(periods, 10);

    if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || r <= 0 || n <= 0) {
      setError('Please enter valid positive numbers for all fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Scale values for the PSC (18 decimals)
      const SCALE = BigInt('1000000000000000000'); // 1e18

      // Principal scaled to 18 decimals
      const principalScaled = BigInt(Math.floor(p * 1e18));

      // Rate as decimal scaled to 18 decimals (5% = 0.05 * 1e18)
      const rateScaled = BigInt(Math.floor((r / 100) * 1e18));

      // Periods as integer
      const periodsValue = BigInt(n);

      // Encode: principal(32) | rate(32) | periods(32)
      const data = '0x' + toBytes32(principalScaled) + toBytes32(rateScaled) + toBytes32(periodsValue);

      const response = await fetch(NETWORK_CONFIG.rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_call',
          params: [{
            to: PSC_ADDRESSES.COMPOUND_INTEREST,
            data
          }, 'latest']
        })
      });

      const json = await response.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      // Decode result (32-byte value scaled by 1e18)
      const pscResultBigInt = BigInt(json.result);
      const pscResultFloat = Number(pscResultBigInt) / 1e18;

      // JavaScript floating-point calculation: A = P × (1 + r)^n
      const jsResult = p * Math.pow(1 + r / 100, n);

      // Calculate difference
      const difference = Math.abs(pscResultFloat - jsResult);
      const percentDiff = (difference / jsResult) * 100;

      setResult({
        psc: pscResultFloat,
        pscRaw: json.result,
        js: jsResult,
        difference,
        percentDiff,
        principal: p,
        rate: r,
        periods: n
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const codeSnippet = `// Calculate compound interest using Vitruveo PSC
const RPC = '${NETWORK_CONFIG.rpc}';
const COMPOUND_ADDRESS = '${PSC_ADDRESSES.COMPOUND_INTEREST}';

// Values (scaled to 18 decimals)
const principal = 1000n * 10n**18n;  // 1000 tokens
const rate = 5n * 10n**16n;          // 5% = 0.05 * 1e18
const periods = 12n;                  // 12 compounding periods

// Encode: principal(32) | rate(32) | periods(32)
function toBytes32(value) {
  return value.toString(16).padStart(64, '0');
}

const data = '0x' + toBytes32(principal) + toBytes32(rate) + toBytes32(periods);

const response = await fetch(RPC, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_call',
    params: [{ to: COMPOUND_ADDRESS, data }, 'latest']
  })
});

const { result } = await response.json();

// Decode: result is 32-byte value scaled by 1e18
const finalAmount = Number(BigInt(result)) / 1e18;
console.log(finalAmount); // ~1795.86 (for 1000 at 5% over 12 periods)`;

  const soliditySnippet = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DeFiVault {
    address constant COMPOUND_PSC = ${PSC_ADDRESSES.COMPOUND_INTEREST};

    /// @notice Calculate compound interest with 18-decimal precision
    /// @param principal Initial amount (scaled by 1e18)
    /// @param rate Interest rate per period (scaled by 1e18, e.g., 5% = 5e16)
    /// @param periods Number of compounding periods
    /// @return finalAmount The final amount after interest (scaled by 1e18)
    function calculateCompoundInterest(
        uint256 principal,
        uint256 rate,
        uint256 periods
    ) public view returns (uint256 finalAmount) {
        bytes memory input = abi.encodePacked(principal, rate, periods);
        (bool success, bytes memory result) = COMPOUND_PSC.staticcall(input);
        require(success, "Compound interest calculation failed");
        return abi.decode(result, (uint256));
    }

    /// @notice Calculate APY from periodic rate
    /// @param periodicRate Rate per period (scaled by 1e18)
    /// @param periodsPerYear Number of periods in a year
    function calculateAPY(uint256 periodicRate, uint256 periodsPerYear)
        public
        view
        returns (uint256)
    {
        // APY = (1 + r)^n - 1, we calculate (1 + r)^n then subtract 1e18
        uint256 onePlusR = 1e18 + periodicRate;
        bytes memory input = abi.encodePacked(
            uint256(1e18),     // principal = 1
            periodicRate,      // rate
            periodsPerYear     // periods
        );
        (bool success, bytes memory result) = COMPOUND_PSC.staticcall(input);
        require(success, "APY calculation failed");
        return abi.decode(result, (uint256)) - 1e18;
    }

    /// @notice Example: Calculate yield on a deposit
    function previewYield(
        uint256 depositAmount,
        uint256 annualRate,
        uint256 compoundingFrequency,
        uint256 numYears
    ) public view returns (uint256) {
        uint256 periodicRate = annualRate / compoundingFrequency;
        uint256 totalPeriods = compoundingFrequency * numYears;
        return calculateCompoundInterest(depositAmount, periodicRate, totalPeriods);
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
            Compare PSC precision (18 decimals) with JavaScript floating-point: A = P × (1 + r)<sup>n</sup>
          </p>

          <div className="d-flex gap-3 align-items-end mb-4 flex-wrap">
            <div>
              <label className="form-label text-white small">Principal (P)</label>
              <input
                type="number"
                className="form-control bg-dark text-white border-secondary"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                style={{ width: '140px' }}
                placeholder="1000"
              />
            </div>
            <div>
              <label className="form-label text-white small">Rate % (r)</label>
              <input
                type="number"
                className="form-control bg-dark text-white border-secondary"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                style={{ width: '100px' }}
                step="0.1"
                placeholder="5"
              />
            </div>
            <div>
              <label className="form-label text-white small">Periods (n)</label>
              <input
                type="number"
                className="form-control bg-dark text-white border-secondary"
                value={periods}
                onChange={(e) => setPeriods(e.target.value)}
                style={{ width: '100px' }}
                placeholder="12"
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={handleCalculate}
              disabled={loading}
            >
              {loading ? 'Calculating...' : 'Calculate'}
            </button>
          </div>

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {result && (
            <div className="result-card">
              <div className="formula mb-3">
                <span className="text-muted-light">Formula: </span>
                <span className="text-white">
                  {formatNumber(result.principal, 0)} × (1 + {result.rate}%)<sup>{result.periods}</sup>
                </span>
              </div>

              <div className="comparison-grid">
                <div className="comparison-item psc">
                  <div className="label">PSC Result</div>
                  <div className="value">{formatNumber(result.psc, 12)}</div>
                  <div className="sublabel">18-decimal precision</div>
                </div>

                <div className="comparison-item js">
                  <div className="label">JavaScript Result</div>
                  <div className="value">{formatNumber(result.js, 12)}</div>
                  <div className="sublabel">64-bit floating point</div>
                </div>

                <div className="comparison-item diff">
                  <div className="label">Difference</div>
                  <div className="value">
                    {result.difference < 1e-15
                      ? 'Identical'
                      : result.difference < 1e-9
                        ? 'Less than 1 billionth'
                        : result.difference < 1e-6
                          ? 'Less than 1 millionth'
                          : formatNumber(result.difference, 6)}
                  </div>
                  <div className="sublabel">
                    {result.percentDiff < 1e-10
                      ? 'Negligible'
                      : `${formatNumber(result.percentDiff, 10)}%`}
                  </div>
                </div>
              </div>

              <div className="raw-result mt-3">
                <span className="text-muted-light small">Raw hex: </span>
                <code className="text-vtru-green small">{result.pscRaw}</code>
              </div>
            </div>
          )}

          {!result && !error && (
            <div className="result-placeholder">
              <p className="text-muted-light mb-0">
                Enter values and click Calculate to compare results
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
        .result-card {
          background: var(--vtru-dark-3);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 3rem;
        }
        .formula {
          font-family: var(--bs-font-monospace);
          font-size: 1.1rem;
        }
        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }
        .comparison-item {
          background: var(--vtru-dark-4);
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
        }
        .comparison-item .label {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 0.5rem;
        }
        .comparison-item .value {
          font-size: 1.5rem;
          font-weight: 600;
          font-family: var(--bs-font-monospace);
        }
        .comparison-item .sublabel {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          margin-top: 0.25rem;
        }
        .comparison-item.psc .value {
          color: #a1ff75;
        }
        .comparison-item.js .value {
          color: #60a5fa;
        }
        .comparison-item.diff .value {
          color: #fbbf24;
        }
        .raw-result {
          word-break: break-all;
        }
        .result-placeholder {
          background: var(--vtru-dark-3);
          border-radius: 12px;
          padding: 3rem;
          text-align: center;
          margin-bottom: 3rem;
        }
      `}</style>
    </div>
  );
}
