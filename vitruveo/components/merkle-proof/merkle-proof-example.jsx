'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { PSC_ADDRESSES, NETWORK_CONFIG } from '../../lib/psc-constants';

// Pre-computed Merkle tree for demo (4 addresses on an allowlist)
// Uses keccak256 and sorted-pair hashing (OpenZeppelin compatible)
// Leaves are keccak256(abi.encodePacked(address))
const DEMO_TREE = {
  description: 'Allowlist with 4 addresses',
  root: '0x8ea0e3a5b1bcc3d21d094be4a529068bb97ef23671d5a18bc24c5ae11cffdbf7',
  leaves: [
    {
      label: 'Alice',
      address: '0x1111111111111111111111111111111111111111',
      leaf: '0xe2c07404b8c1df4c46226425cac68c28d27a766bbddce62309f36724839b22c0',
      proof: [
        '0x2ab0a4443bbea3fbe4d0e1503d11ff1367842fb0c8b28a5c8550f27599a40751',
        '0x0aafebc39b02f78812dd98aa2d43138e57bf2e2129476469fcffb7c1d572f346'
      ]
    },
    {
      label: 'Bob',
      address: '0x2222222222222222222222222222222222222222',
      leaf: '0x2ab0a4443bbea3fbe4d0e1503d11ff1367842fb0c8b28a5c8550f27599a40751',
      proof: [
        '0xe2c07404b8c1df4c46226425cac68c28d27a766bbddce62309f36724839b22c0',
        '0x0aafebc39b02f78812dd98aa2d43138e57bf2e2129476469fcffb7c1d572f346'
      ]
    },
    {
      label: 'Carol',
      address: '0x3333333333333333333333333333333333333333',
      leaf: '0x37d95e0aa71e34defa88b4c43498bc8b90207e31ad0ef4aa6f5bea78bd25a1ab',
      proof: [
        '0x4cfa6af4bfa0111fd5e7625d43e84cd2d40629cf6008219d2c0e30ed48abf8b6',
        '0x4beda981c9d34f2dd099131be6049a1d87676d227e63f4a409ee629043314b4f'
      ]
    },
    {
      label: 'Dave',
      address: '0x4444444444444444444444444444444444444444',
      leaf: '0x4cfa6af4bfa0111fd5e7625d43e84cd2d40629cf6008219d2c0e30ed48abf8b6',
      proof: [
        '0x37d95e0aa71e34defa88b4c43498bc8b90207e31ad0ef4aa6f5bea78bd25a1ab',
        '0x4beda981c9d34f2dd099131be6049a1d87676d227e63f4a409ee629043314b4f'
      ]
    }
  ],
  invalidExample: {
    label: 'Eve (not on list)',
    address: '0x5555555555555555555555555555555555555555',
    leaf: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    proof: [
      '0x2ab0a4443bbea3fbe4d0e1503d11ff1367842fb0c8b28a5c8550f27599a40751',
      '0x0aafebc39b02f78812dd98aa2d43138e57bf2e2129476469fcffb7c1d572f346'
    ]
  }
};

export function MerkleProofExample() {
  const [activeTab, setActiveTab] = useState('demo');
  const [mode, setMode] = useState('preset'); // 'preset' or 'custom'
  const [selectedLeaf, setSelectedLeaf] = useState(null);
  const [customRoot, setCustomRoot] = useState('');
  const [customLeaf, setCustomLeaf] = useState('');
  const [customProof, setCustomProof] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const verifyProof = async (root, leaf, proof) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Remove 0x prefix and concatenate: root | leaf | proof[0] | proof[1] | ...
      const rootHex = root.startsWith('0x') ? root.slice(2) : root;
      const leafHex = leaf.startsWith('0x') ? leaf.slice(2) : leaf;
      const proofHex = proof.map(p => p.startsWith('0x') ? p.slice(2) : p).join('');

      const data = '0x' + rootHex + leafHex + proofHex;

      console.log('MerkleProof PSC call:');
      console.log('  Address:', PSC_ADDRESSES.MERKLE_PROOF);
      console.log('  Data length:', (data.length - 2) / 2, 'bytes');
      console.log('  Data:', data);

      const response = await fetch(NETWORK_CONFIG.rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_call',
          params: [{
            to: PSC_ADDRESSES.MERKLE_PROOF,
            data
          }, 'latest']
        })
      });

      const json = await response.json();
      console.log('  Response:', json);

      if (json.error) {
        throw new Error(json.error.message);
      }

      // PSC returns 1 for valid, empty/0x for invalid
      const isValid = json.result && json.result !== '0x' && BigInt(json.result) === 1n;

      setResult({
        valid: isValid,
        root,
        leaf,
        proofLength: proof.length,
        rawResponse: json.result
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetVerify = (leafData, isInvalid = false) => {
    setSelectedLeaf({ ...leafData, isInvalid });
    verifyProof(DEMO_TREE.root, leafData.leaf, leafData.proof);
  };

  const handleCustomVerify = () => {
    // Parse proof (one hash per line or comma-separated)
    const proofArray = customProof
      .split(/[\n,]/)
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (!customRoot || !customLeaf || proofArray.length === 0) {
      setError('Please fill in all fields');
      return;
    }

    verifyProof(customRoot, customLeaf, proofArray);
  };

  const codeSnippet = `// Verify a Merkle proof using Vitruveo PSC
const RPC = '${NETWORK_CONFIG.rpc}';
const MERKLE_ADDRESS = '${PSC_ADDRESSES.MERKLE_PROOF}';

// Example: verify an address is on an allowlist
// Leaf = keccak256(abi.encodePacked(address))
const root = '0x8ea0e3a5b1bcc3d21d094be4a529068bb97ef23671d5a18bc24c5ae11cffdbf7';
const leaf = '0xe2c07404b8c1df4c46226425cac68c28d27a766bbddce62309f36724839b22c0';
const proof = [
  '0x2ab0a4443bbea3fbe4d0e1503d11ff1367842fb0c8b28a5c8550f27599a40751',
  '0x0aafebc39b02f78812dd98aa2d43138e57bf2e2129476469fcffb7c1d572f346'
];

// Encode: root(32) | leaf(32) | proof[0](32) | proof[1](32) | ...
const data = '0x' +
  root.slice(2) +
  leaf.slice(2) +
  proof.map(p => p.slice(2)).join('');

const response = await fetch(RPC, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_call',
    params: [{ to: MERKLE_ADDRESS, data }, 'latest']
  })
});

const { result } = await response.json();
// Valid: 32-byte 1. Invalid: empty result (0x)
const isValid = result !== '0x' && BigInt(result) === 1n;
console.log(isValid ? 'Proof valid!' : 'Proof invalid');`;

  const soliditySnippet = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Allowlist {
    address constant MERKLE_PSC = ${PSC_ADDRESSES.MERKLE_PROOF};

    bytes32 public merkleRoot;
    mapping(address => bool) public claimed;

    constructor(bytes32 _merkleRoot) {
        merkleRoot = _merkleRoot;
    }

    /// @notice Verify a Merkle proof using the PSC
    /// @param proof Array of sibling hashes
    /// @param leaf The leaf to verify
    function verifyProof(bytes32[] calldata proof, bytes32 leaf)
        public
        view
        returns (bool)
    {
        // Encode: root | leaf | proof[0] | proof[1] | ...
        bytes memory input = abi.encodePacked(merkleRoot, leaf);
        for (uint i = 0; i < proof.length; i++) {
            input = abi.encodePacked(input, proof[i]);
        }

        (bool success, bytes memory result) = MERKLE_PSC.staticcall(input);
        require(success, "Merkle verification failed");

        // Empty result = invalid proof
        return result.length == 32 && abi.decode(result, (uint256)) == 1;
    }

    /// @notice Claim from allowlist with Merkle proof
    function claim(bytes32[] calldata proof) external {
        require(!claimed[msg.sender], "Already claimed");

        // Hash the sender's address to get the leaf
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(verifyProof(proof, leaf), "Invalid proof");

        claimed[msg.sender] = true;
        // ... distribute tokens, NFT, etc.
    }

    /// @notice Update the Merkle root (admin only)
    function setMerkleRoot(bytes32 _merkleRoot) external {
        // Add access control in production
        merkleRoot = _merkleRoot;
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
          {/* Mode Toggle */}
          <div className="btn-group mb-4">
            <button
              className={`btn ${mode === 'preset' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setMode('preset')}
            >
              Sample Allowlist
            </button>
            <button
              className={`btn ${mode === 'custom' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setMode('custom')}
            >
              Custom Proof
            </button>
          </div>

          {/* Preset Mode */}
          {mode === 'preset' && (
            <div>
              <p className="text-muted-light mb-3">
                Sample Merkle tree with 4 allowlisted addresses. Click to verify each proof.
              </p>

              <div className="mb-3">
                <span className="text-muted-light small">Root: </span>
                <code className="text-vtru-green small">{DEMO_TREE.root}</code>
              </div>

              <div className="address-grid mb-4">
                {DEMO_TREE.leaves.map((leafData, idx) => (
                  <button
                    key={idx}
                    className={`address-card ${selectedLeaf?.label === leafData.label && !selectedLeaf?.isInvalid ? 'selected' : ''}`}
                    onClick={() => handlePresetVerify(leafData)}
                    disabled={loading}
                  >
                    <div className="name">{leafData.label}</div>
                    <div className="address">{leafData.address.slice(0, 10)}...{leafData.address.slice(-8)}</div>
                    <div className="status">On allowlist</div>
                  </button>
                ))}
                <button
                  className={`address-card invalid ${selectedLeaf?.label === DEMO_TREE.invalidExample.label ? 'selected' : ''}`}
                  onClick={() => handlePresetVerify(DEMO_TREE.invalidExample, true)}
                  disabled={loading}
                >
                  <div className="name">{DEMO_TREE.invalidExample.label}</div>
                  <div className="address">{DEMO_TREE.invalidExample.address.slice(0, 10)}...{DEMO_TREE.invalidExample.address.slice(-8)}</div>
                  <div className="status">NOT on allowlist</div>
                </button>
              </div>
            </div>
          )}

          {/* Custom Mode */}
          {mode === 'custom' && (
            <div>
              <p className="text-muted-light mb-3">
                Enter your own Merkle proof data to verify.
              </p>

              <div className="mb-3">
                <label className="form-label text-white small">Merkle Root (32 bytes hex)</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary font-monospace"
                  value={customRoot}
                  onChange={(e) => setCustomRoot(e.target.value)}
                  placeholder="0x..."
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-white small">Leaf (32 bytes hex)</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary font-monospace"
                  value={customLeaf}
                  onChange={(e) => setCustomLeaf(e.target.value)}
                  placeholder="0x..."
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-white small">Proof Hashes (one per line)</label>
                <textarea
                  className="form-control bg-dark text-white border-secondary font-monospace"
                  rows={4}
                  value={customProof}
                  onChange={(e) => setCustomProof(e.target.value)}
                  placeholder="0x...&#10;0x..."
                />
              </div>

              <button
                className="btn btn-primary mb-4"
                onClick={handleCustomVerify}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify Proof'}
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {/* Result */}
          {result && (
            <div className={`result-card ${result.valid ? 'valid' : 'invalid'}`}>
              <div className="result-icon">
                {result.valid ? '✓' : '✗'}
              </div>
              <div className="result-text">
                <div className="result-title">
                  {result.valid ? 'Proof Valid' : 'Proof Invalid'}
                </div>
                <div className="result-details">
                  {result.valid
                    ? 'The leaf is a member of the Merkle tree'
                    : 'The leaf is NOT a member of the Merkle tree'}
                </div>
              </div>
              <div className="result-meta">
                <span>Proof depth: {result.proofLength} hashes</span>
              </div>
            </div>
          )}

          {!result && !error && mode === 'preset' && (
            <div className="result-placeholder">
              <p className="text-muted-light mb-0">
                Click an address above to verify its Merkle proof
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
        .address-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        .address-card {
          background: var(--vtru-dark-3);
          border: 2px solid transparent;
          border-radius: 12px;
          padding: 1rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }
        .address-card:hover {
          border-color: var(--vtru-green);
        }
        .address-card.selected {
          border-color: var(--vtru-green);
          background: rgba(161, 255, 117, 0.1);
        }
        .address-card.invalid {
          border-color: rgba(239, 68, 68, 0.3);
        }
        .address-card.invalid:hover {
          border-color: #ef4444;
        }
        .address-card.invalid.selected {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
        .address-card .name {
          font-weight: 600;
          color: #fff;
          margin-bottom: 0.25rem;
        }
        .address-card .address {
          font-family: var(--bs-font-monospace);
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 0.5rem;
        }
        .address-card .status {
          font-size: 0.75rem;
          color: var(--vtru-green);
        }
        .address-card.invalid .status {
          color: #ef4444;
        }
        .result-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: var(--vtru-dark-3);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 3rem;
          border-left: 4px solid;
        }
        .result-card.valid {
          border-left-color: var(--vtru-green);
        }
        .result-card.invalid {
          border-left-color: #ef4444;
        }
        .result-icon {
          font-size: 2rem;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        .result-card.valid .result-icon {
          background: rgba(161, 255, 117, 0.2);
          color: var(--vtru-green);
        }
        .result-card.invalid .result-icon {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }
        .result-text {
          flex: 1;
        }
        .result-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #fff;
        }
        .result-details {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
        }
        .result-meta {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
        }
        .result-placeholder {
          background: var(--vtru-dark-3);
          border-radius: 12px;
          padding: 3rem;
          text-align: center;
          margin-bottom: 3rem;
        }
        .font-monospace {
          font-family: var(--bs-font-monospace);
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}
