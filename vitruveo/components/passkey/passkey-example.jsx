'use client';

import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { PSC_ADDRESSES, NETWORK_CONFIG } from '../../lib/psc-constants';

// Convert ArrayBuffer to hex string
function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Convert hex string to Uint8Array
function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

// Parse COSE public key to extract x, y coordinates
function parseCOSEPublicKey(coseKey) {
  // COSE_Key format for P-256:
  // Map with keys: 1 (kty), 3 (alg), -1 (crv), -2 (x), -3 (y)
  // We need to decode CBOR to extract x and y
  const data = new Uint8Array(coseKey);

  // Simple CBOR parser for COSE EC2 key
  // Looking for -2 (x) and -3 (y) which are 0x21 and 0x22 in CBOR negative int encoding
  let x = null, y = null;

  for (let i = 0; i < data.length - 33; i++) {
    // -2 in CBOR is encoded as 0x21
    if (data[i] === 0x21 && data[i + 1] === 0x58 && data[i + 2] === 0x20) {
      x = data.slice(i + 3, i + 3 + 32);
    }
    // -3 in CBOR is encoded as 0x22
    if (data[i] === 0x22 && data[i + 1] === 0x58 && data[i + 2] === 0x20) {
      y = data.slice(i + 3, i + 3 + 32);
    }
  }

  if (!x || !y) {
    throw new Error('Failed to parse COSE public key');
  }

  return { x: bufferToHex(x), y: bufferToHex(y) };
}

// P-256 curve order
const P256_N = BigInt('0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551');
const P256_N_DIV_2 = P256_N / BigInt(2);

// Convert BigInt to 32-byte hex string
function bigIntToHex32(n) {
  return n.toString(16).padStart(64, '0');
}

// Parse DER-encoded signature to extract r, s values (with low-S normalization)
function parseDERSignature(derSig) {
  const data = new Uint8Array(derSig);

  // DER format: 0x30 [total-len] 0x02 [r-len] [r] 0x02 [s-len] [s]
  if (data[0] !== 0x30) {
    throw new Error('Invalid DER signature');
  }

  let offset = 2; // Skip 0x30 and total length

  // Parse r
  if (data[offset] !== 0x02) throw new Error('Invalid DER: expected 0x02 for r');
  const rLen = data[offset + 1];
  offset += 2;
  let r = data.slice(offset, offset + rLen);
  offset += rLen;

  // Parse s
  if (data[offset] !== 0x02) throw new Error('Invalid DER: expected 0x02 for s');
  const sLen = data[offset + 1];
  offset += 2;
  let s = data.slice(offset, offset + sLen);

  // Remove leading zero if present (DER uses signed integers)
  if (r.length === 33 && r[0] === 0) r = r.slice(1);
  if (s.length === 33 && s[0] === 0) s = s.slice(1);

  // Pad to 32 bytes if needed
  if (r.length < 32) {
    const padded = new Uint8Array(32);
    padded.set(r, 32 - r.length);
    r = padded;
  }
  if (s.length < 32) {
    const padded = new Uint8Array(32);
    padded.set(s, 32 - s.length);
    s = padded;
  }

  // Convert to BigInt for S normalization
  let sValue = BigInt('0x' + bufferToHex(s));

  // Normalize to low-S: if s > n/2, use n - s
  if (sValue > P256_N_DIV_2) {
    sValue = P256_N - sValue;
  }

  return { r: bufferToHex(r), s: bigIntToHex32(sValue) };
}

// SHA-256 hash
async function sha256(data) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(hashBuffer);
}

export function PasskeyExample() {
  const [activeTab, setActiveTab] = useState('demo');
  const [credential, setCredential] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('register'); // 'register' | 'verify'

  // Load saved credential from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('vitruveo-passkey');
    if (saved) {
      const parsed = JSON.parse(saved);
      setCredential(parsed.credentialId);
      setPublicKey(parsed.publicKey);
      setStep('verify');
    }
  }, []);

  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create credential options
      const challenge = crypto.getRandomValues(new Uint8Array(32));

      const createOptions = {
        publicKey: {
          challenge,
          rp: {
            name: 'Vitruveo PSC Demo',
            id: window.location.hostname,
          },
          user: {
            id: crypto.getRandomValues(new Uint8Array(16)),
            name: 'demo@vitruveo.xyz',
            displayName: 'Vitruveo Demo User',
          },
          pubKeyCredParams: [
            { type: 'public-key', alg: -7 },   // ES256 (P-256) - required for our PSC
            { type: 'public-key', alg: -257 }, // RS256 fallback (won't work with PSC but avoids warning)
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
          },
          timeout: 60000,
        },
      };

      const cred = await navigator.credentials.create(createOptions);

      // Check the algorithm used - must be ES256 (P-256)
      const pubKeyAlg = cred.response.getPublicKeyAlgorithm?.();
      if (pubKeyAlg && pubKeyAlg !== -7) {
        throw new Error(`Authenticator used algorithm ${pubKeyAlg}, but P-256 (ES256, -7) is required for the Passkey PSC.`);
      }

      // Extract public key from attestation
      const attestationObject = cred.response.attestationObject;
      const authData = new Uint8Array(attestationObject);

      // Parse authenticator data to find public key
      // authData: rpIdHash(32) + flags(1) + signCount(4) + attestedCredData(variable)
      // attestedCredData: aaguid(16) + credIdLen(2) + credId(credIdLen) + publicKey(COSE)

      // For simplicity, we'll get the public key from getPublicKey() if available
      let pubKeyData;
      if (cred.response.getPublicKey) {
        pubKeyData = cred.response.getPublicKey();
      } else {
        // Fallback: parse from attestation object (more complex)
        throw new Error('getPublicKey() not supported. Please use a modern browser.');
      }

      // Parse the SubjectPublicKeyInfo format
      // For P-256, the key is: 0x04 + x(32) + y(32)
      const spki = new Uint8Array(pubKeyData);
      // Find the uncompressed point (starts with 0x04)
      let keyStart = -1;
      for (let i = 0; i < spki.length - 64; i++) {
        if (spki[i] === 0x04) {
          keyStart = i;
          break;
        }
      }

      if (keyStart === -1) {
        throw new Error('Could not find public key in SPKI');
      }

      const x = bufferToHex(spki.slice(keyStart + 1, keyStart + 33));
      const y = bufferToHex(spki.slice(keyStart + 33, keyStart + 65));

      const pubKey = { x, y };
      const credId = bufferToHex(cred.rawId);

      // Save to localStorage
      localStorage.setItem('vitruveo-passkey', JSON.stringify({
        credentialId: credId,
        publicKey: pubKey,
      }));

      setCredential(credId);
      setPublicKey(pubKey);
      setStep('verify');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError(null);
    setVerificationResult(null);

    try {
      const challenge = crypto.getRandomValues(new Uint8Array(32));

      const getOptions = {
        publicKey: {
          challenge,
          rpId: window.location.hostname,
          allowCredentials: [{
            type: 'public-key',
            id: hexToBytes(credential),
          }],
          userVerification: 'required',
          timeout: 60000,
        },
      };

      const assertion = await navigator.credentials.get(getOptions);

      // Get signature components
      const signature = assertion.response.signature;
      const { r, s } = parseDERSignature(signature);

      // Compute the hash that was signed
      // WebAuthn authenticator signs: authenticatorData || SHA256(clientDataJSON)
      // ECDSA internally hashes this, so we need SHA256 of the concatenation
      const authenticatorData = new Uint8Array(assertion.response.authenticatorData);
      const clientDataJSON = new Uint8Array(assertion.response.clientDataJSON);
      const clientDataHash = await sha256(clientDataJSON);

      // The signed message is: authenticatorData || clientDataHash
      const signedData = new Uint8Array(authenticatorData.length + clientDataHash.length);
      signedData.set(authenticatorData);
      signedData.set(clientDataHash, authenticatorData.length);

      // ECDSA P-256 hashes this internally with SHA-256
      const messageHash = await sha256(signedData);
      const hashHex = bufferToHex(messageHash);

      // Build the 160-byte payload: hash(32) | r(32) | s(32) | x(32) | y(32)
      const payload = '0x' + hashHex + r + s + publicKey.x + publicKey.y;

      // Call the Passkey PSC
      const response = await fetch(NETWORK_CONFIG.rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_call',
          params: [{
            to: PSC_ADDRESSES.PASSKEY,
            data: payload
          }, 'latest']
        })
      });

      const json = await response.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      // Result is 0x01 for valid, 0x00 for invalid
      const isValid = json.result && json.result !== '0x' &&
        BigInt(json.result) === BigInt(1);

      setVerificationResult({
        valid: isValid,
        hash: hashHex,
        r,
        s,
        raw: json.result
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('vitruveo-passkey');
    setCredential(null);
    setPublicKey(null);
    setVerificationResult(null);
    setStep('register');
  };

  const codeSnippet = `// Verify P-256 signature using Vitruveo Passkey PSC
const RPC = '${NETWORK_CONFIG.rpc}';
const PASSKEY_ADDRESS = '${PSC_ADDRESSES.PASSKEY}';

// After WebAuthn authentication, you have (64-char hex strings, no 0x):
// - messageHash: SHA256(authenticatorData + SHA256(clientDataJSON))
// - r, s: signature components (parsed from DER)
// - x, y: public key coordinates

// The PSC only accepts low-S signatures: if s > n/2, use n - s
const N = 0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551n;
const sLow = BigInt('0x' + s) > N / 2n ? (N - BigInt('0x' + s)).toString(16).padStart(64, '0') : s;

// Build 160-byte payload
const payload = '0x' + messageHash + r + sLow + x + y;

// Call the Passkey precompile
const response = await fetch(RPC, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_call',
    params: [{ to: PASSKEY_ADDRESS, data: payload }, 'latest']
  })
});

const { result } = await response.json();
const isValid = BigInt(result) === BigInt(1);

console.log(isValid ? 'Signature valid!' : 'Signature invalid');`;

  const soliditySnippet = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PasskeyAuth {
    address constant PASSKEY_PSC = ${PSC_ADDRESSES.PASSKEY};

    struct PublicKey {
        bytes32 x;
        bytes32 y;
    }

    // Store user public keys
    mapping(address => PublicKey) public userKeys;

    /// @notice Register a passkey public key
    function registerKey(bytes32 x, bytes32 y) external {
        userKeys[msg.sender] = PublicKey(x, y);
    }

    /// @notice Verify a P-256 signature
    /// @param hash The message hash (32 bytes)
    /// @param r Signature r component (32 bytes)
    /// @param s Signature s component (32 bytes)
    /// @param x Public key x coordinate (32 bytes)
    /// @param y Public key y coordinate (32 bytes)
    function verifySignature(
        bytes32 hash,
        bytes32 r,
        bytes32 s,
        bytes32 x,
        bytes32 y
    ) public view returns (bool) {
        bytes memory payload = abi.encodePacked(hash, r, s, x, y);
        (bool success, bytes memory result) = PASSKEY_PSC.staticcall(payload);

        if (!success || result.length == 0) return false;
        return uint256(bytes32(result)) == 1;
    }

    /// @notice Authenticate user action with passkey
    function authenticateAction(
        bytes32 actionHash,
        bytes32 r,
        bytes32 s
    ) external view returns (bool) {
        PublicKey memory key = userKeys[msg.sender];
        require(key.x != bytes32(0), "No key registered");

        return verifySignature(actionHash, r, s, key.x, key.y);
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
          {step === 'register' && (
            <div>
              <p className="text-muted-light mb-4">
                First, register a passkey. This will prompt for Face ID, Touch ID, or your device PIN.
              </p>
              <button
                className="btn btn-primary mb-4"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register Passkey'}
              </button>
            </div>
          )}

          {step === 'verify' && (
            <div>
              <div className="mb-4 p-3 rounded" style={{ backgroundColor: '#1a1a1a' }}>
                <p className="text-muted-light small mb-2">Registered Public Key:</p>
                <code className="text-vtru-green small d-block text-break">
                  x: {publicKey?.x}
                </code>
                <code className="text-vtru-green small d-block text-break">
                  y: {publicKey?.y}
                </code>
              </div>

              <div className="d-flex gap-3 mb-4">
                <button
                  className="btn btn-primary"
                  onClick={handleVerify}
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify with Passkey'}
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          <div className="result-area">
            {verificationResult && (
              <div className={`p-4 rounded ${verificationResult.valid ? 'bg-success' : 'bg-danger'}`}>
                <h4 className="text-white mb-3">
                  {verificationResult.valid ? 'Signature Valid!' : 'Signature Invalid'}
                </h4>
                <div className="small">
                  <p className="mb-1 text-white-50">Hash: <code className="text-white">{verificationResult.hash.slice(0, 20)}...</code></p>
                  <p className="mb-1 text-white-50">r: <code className="text-white">{verificationResult.r.slice(0, 20)}...</code></p>
                  <p className="mb-1 text-white-50">s: <code className="text-white">{verificationResult.s.slice(0, 20)}...</code></p>
                  <p className="mb-0 text-white-50">Raw result: <code className="text-white">{verificationResult.raw}</code></p>
                </div>
              </div>
            )}
          </div>
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
        .result-area {
          min-height: 150px;
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
        .bg-success {
          background-color: rgba(161, 255, 117, 0.2) !important;
          border: 1px solid #a1ff75;
        }
        .bg-danger {
          background-color: rgba(255, 107, 107, 0.2) !important;
          border: 1px solid #ff6b6b;
        }
      `}</style>
    </div>
  );
}
