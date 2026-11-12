'use client';

import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { HOST_REGISTRY_ADDRESS } from '../../lib/psc-constants';

const jsEncryptCode = `const secp256k1 = require('secp256k1');  // v4.0.3 - CRITICAL: Must use v4.x
const crypto = require('crypto');

function encrypt(validatorPubkeyHex, plaintext) {
    const validatorPubkey = Buffer.from(validatorPubkeyHex, 'hex');

    // 1. Generate ephemeral keypair
    let ephemeralPriv;
    do {
        ephemeralPriv = crypto.randomBytes(32);
    } while (!secp256k1.privateKeyVerify(ephemeralPriv));

    const ephemeralPub = Buffer.from(secp256k1.publicKeyCreate(ephemeralPriv, false));

    // 2. ECDH - derive shared secret (raw x-coordinate)
    const shared = Buffer.from(
        secp256k1.ecdh(validatorPubkey, ephemeralPriv, { hashfn: (x, y) => x }, Buffer.alloc(32))
    );

    // 3. AES-256-GCM encrypt
    const nonce = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', shared, nonce);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    // 4. Output format: | + hex(ephemeralPub || nonce || ciphertext || tag)
    return '|' + Buffer.concat([ephemeralPub, nonce, encrypted, tag]).toString('hex');
}`;

const solidityUsageCode = `// Plaintext values - no encryption
string[] memory headerValues = new string[](2);
headerValues[0] = "application/json";

// Encrypted value - prefix with |
headerValues[1] = "|04abc123...def456";  // Encrypted API key

uint256 requestId = registry.addRequest(
    validator,                                            // validator node address
    "https://api.example.com/webhook",
    '{"Content-Type":"$1","Authorization":"Bearer $2"}',  // header template
    headerValues,
    '{"event":"$1"}',                                     // body template
    bodyValues
);
(bool ok, ) = HOST.call{gas: 130000}(abi.encode(requestId));`;

export function HostInfo() {
  return (
    <div className="mb-5">
      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Why It Matters</h3>
        <p className="text-muted-light">
          Smart contracts have always been silent. They execute, but they can't speak back.
          Web2 apps have to index, poll, and react asynchronously. HOST changes this—contracts
          call your webhooks directly during transaction execution.
        </p>
        <p className="text-muted-light">
          Web2 → Web3 → Web2. Complete. Your app calls a contract, the contract speaks back,
          your app responds instantly. Signed by the validator. Provably authentic.
          No indexers. No polling. No middleware.
        </p>
      </section>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Architecture</h3>
        <ul className="text-muted-light">
          <li className="mb-2"><strong className="text-white">Chain of Trust:</strong> Three-layer security model (Node → Developer → Application) ensures only authorized contracts can make requests</li>
          <li className="mb-2"><strong className="text-white">Decentralized Validators:</strong> Any validator can service HOST requests independently</li>
          <li className="mb-2"><strong className="text-white">5-Second Finality:</strong> AI agents can execute tasks and report results in under 15 seconds</li>
          <li className="mb-2"><strong className="text-white">Redundancy Pattern:</strong> Address multiple validators; endpoints dedupe by request ID</li>
        </ul>
      </section>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Registry Contract</h3>
        <p className="text-muted-light mb-3">
          All HOST requests are validated through the on-chain registry before execution:
        </p>
        <div className="code-block">
          <code>{HOST_REGISTRY_ADDRESS}</code>
        </div>
      </section>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Interface</h3>
        <div className="code-block">
          <pre>{`// Register a request with the Registry (caller must be whitelisted for the validator)
addRequest(
    address validator,        // Validator node to execute
    string url,               // Target webhook URL
    string headerInput,       // Header JSON template ("$1"...) or registered template name
    string[] headerValues,    // Values for $1, $2, ... ("|" prefix = encrypted)
    string bodyInput,         // Body template or registered template name
    string[] bodyValues
) → uint256 requestId

// Execute via precompile (needs at least 125,000 gas)
(HOST_PRECOMPILE).staticcall(abi.encode(requestId))`}</pre>
        </div>
      </section>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Encryption/Decryption</h3>
        <p className="text-muted-light mb-3">
          HOST allows smart contracts to trigger HTTP webhooks with encrypted sensitive data (API keys, tokens, secrets).
          The encryption ensures that only the designated validator can decrypt the values when executing the webhook.
        </p>

        <h5 className="text-white mt-4 mb-2">Encryption Scheme</h5>
        <ul className="text-muted-light mb-4">
          <li><strong className="text-white">Algorithm:</strong> ECDH (Elliptic Curve Diffie-Hellman) key agreement + AES-256-GCM symmetric encryption</li>
          <li><strong className="text-white">Curve:</strong> secp256k1 (same as Ethereum)</li>
        </ul>

        <h5 className="text-white mt-4 mb-2">Ciphertext Format</h5>
        <div className="code-block mb-3">
          <pre className="mb-0">{`| + [ephemeralPubKey (65 bytes)] + [nonce (12 bytes)] + [ciphertext (variable)] + [authTag (16 bytes)]

|               - Magic prefix indicating encrypted value
ephemeralPubKey - Uncompressed secp256k1 public key (0x04 prefix + 64 bytes)
nonce           - Random 12-byte IV for AES-GCM
ciphertext      - Encrypted data
authTag         - 16-byte GCM authentication tag`}</pre>
        </div>

        <h5 className="text-white mt-4 mb-2">Security Properties</h5>
        <ul className="text-muted-light mb-4">
          <li><strong className="text-white">Asymmetric:</strong> Only the validator with the private key can decrypt</li>
          <li><strong className="text-white">Forward Secrecy:</strong> Each encryption uses a fresh ephemeral keypair</li>
          <li><strong className="text-white">Authenticated:</strong> GCM tag prevents tampering</li>
          <li><strong className="text-white">On-chain Privacy:</strong> Encrypted values are stored/transmitted as opaque hex blobs</li>
        </ul>

        <h5 className="text-white mt-4 mb-2">Client-Side Encryption (JavaScript)</h5>
        <SyntaxHighlighter language="javascript" style={oneDark} customStyle={{ borderRadius: '8px', fontSize: '0.85rem' }}>
          {jsEncryptCode}
        </SyntaxHighlighter>

        <h5 className="text-white mt-4 mb-2">Usage in Smart Contracts</h5>
        <SyntaxHighlighter language="solidity" style={oneDark} customStyle={{ borderRadius: '8px', fontSize: '0.85rem' }}>
          {solidityUsageCode}
        </SyntaxHighlighter>
      </section>

      {/* Use Cases */}
      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Use Cases</h3>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="card card-dark p-3 rounded-3 h-100">
              <h6 className="text-white mb-2">Autonomous Agents</h6>
              <p className="text-muted-light small mb-0">Contracts spawn AI agents that reason, plan, and execute multi-step tasks autonomously</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card card-dark p-3 rounded-3 h-100">
              <h6 className="text-white mb-2">On-Chain Oracles</h6>
              <p className="text-muted-light small mb-0">AI models analyze data, generate predictions, and feed decisions back to contracts</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card card-dark p-3 rounded-3 h-100">
              <h6 className="text-white mb-2">Generative Content</h6>
              <p className="text-muted-light small mb-0">NFT mints trigger image generation, game actions spawn dynamic AI-driven content</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card card-dark p-3 rounded-3 h-100">
              <h6 className="text-white mb-2">Agentic Workflows</h6>
              <p className="text-muted-light small mb-0">Chain AI tools together—research, analyze, decide, execute—triggered by on-chain events</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA buttons at bottom */}
      <div className="d-flex justify-content-center gap-3 flex-wrap">
        <Link href="/host-primer" className="btn btn-host-primer btn-lg">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="me-2">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          HOST Primer
        </Link>
        <Link href="/host/examples" className="btn btn-outline-light btn-lg">
          Read HOST Examples
        </Link>
      </div>
    </div>
  );
}
