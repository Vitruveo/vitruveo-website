'use client';

import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { PSC_ADDRESSES, HOST_REGISTRY_ADDRESS } from '@/vitruveo/lib/psc-constants';

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

export default function HostPrimerPage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-gradient">
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
        <div className="container py-5">
          <div className="d-flex flex-wrap gap-3 mb-4">
            <div className="psc-badge">
              <span className="label">Precompile</span>
              <code>{PSC_ADDRESSES.HOST}</code>
            </div>
            <div className="psc-badge">
              <span className="label">Registry</span>
              <code>{HOST_REGISTRY_ADDRESS}</code>
            </div>
          </div>
          <h1 className="display-4 fw-bold text-white mb-3">HOST Primer</h1>
          <p className="lead text-muted-light mb-4">
            <strong className="text-white">HTTP Outbound Service Trigger</strong> — Smart contracts that speak HTTP.
            The first protocol-level outbound trigger in any EVM chain. Webhooks for Web3.
          </p>
          <Link href="/host" className="btn btn-primary btn-lg px-5 py-3" style={{ fontSize: '1.25rem' }}>
            Try HOST Demos →
          </Link>
        </div>
      </section>

      {/* Vision */}
      <section className="section-dark py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <h2 className="text-white mb-4">The Silent Problem</h2>
              <p className="text-muted-light">
                Web3 has been a one-way street. Transactions bring data in from Web2. Smart contracts
                execute. But nothing goes back out. <strong className="text-white">The silence is deafening.</strong>
              </p>
              <p className="text-muted-light">
                Web2 runs on webhooks—Stripe, Shopify, Slack, GitHub. All Web3 offers is unreliable event logs.
                Web2 apps have to index, poll, and react asynchronously. Result: low developer adoption.
              </p>
              <h2 className="text-white mb-4 mt-5">The Voice</h2>
              <p className="text-muted-light">
                HOST gives smart contracts a voice. The first protocol-level outbound trigger in any EVM chain.
                Contract sends data to your webhook during transaction execution.
                <strong className="text-white"> Signed by the validator. Provably authentic.</strong>
              </p>
              <p className="text-muted-light">
                Web2 → Web3 → Web2. Complete. Your app calls a contract, the contract speaks back,
                your app responds instantly. No indexers. No polling. No middleware.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chain of Trust */}
      <section className="section-dark-2 py-5">
        <div className="container">
          <h2 className="text-white mb-4">The Chain of Trust</h2>
          <p className="text-muted-light mb-5">
            HOST implements a strict security model to ensure that off-chain resources are accessed
            securely and only by authorized smart contracts. This prevents spam and ensures that
            Validator Nodes only expend resources on legitimate, approved requests.
          </p>
          <p className="text-muted-light mb-5">
            The security model consists of three distinct layers of authorization:
          </p>

          <div className="row g-4 mb-5">
            <div className="col-lg-4">
              <div className="card card-dark p-4 rounded-3 h-100 position-relative" style={{ borderLeft: '4px solid var(--vtru-green)' }}>
                <div className="position-absolute" style={{ top: '-15px', left: '20px', background: 'var(--vtru-green)', color: '#000', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.75rem' }}>
                  LAYER 1
                </div>
                <h4 className="text-white mt-3 mb-3">The Node</h4>
                <p className="text-muted-light mb-0">
                  The Validator who operates the physical infrastructure. Validators register their
                  nodes on-chain to signal availability for processing HOST requests. Each node is
                  identified by its unique address and linked to an owner address that manages approvals.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card card-dark p-4 rounded-3 h-100 position-relative" style={{ borderLeft: '4px solid var(--vtru-green)' }}>
                <div className="position-absolute" style={{ top: '-15px', left: '20px', background: 'var(--vtru-green)', color: '#000', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.75rem' }}>
                  LAYER 2
                </div>
                <h4 className="text-white mt-3 mb-3">The Developer</h4>
                <p className="text-muted-light mb-0">
                  An authenticated User (EOA) vetted by the Validator. Developers must request and
                  receive approval from a Validator before they can use that node's services. This
                  creates accountability and prevents anonymous abuse of validator resources.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card card-dark p-4 rounded-3 h-100 position-relative" style={{ borderLeft: '4px solid var(--vtru-green)' }}>
                <div className="position-absolute" style={{ top: '-15px', left: '20px', background: 'var(--vtru-green)', color: '#000', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.75rem' }}>
                  LAYER 3
                </div>
                <h4 className="text-white mt-3 mb-3">The Application</h4>
                <p className="text-muted-light mb-0">
                  A specific Smart Contract whitelisted by the Developer. Only contracts explicitly
                  registered by an approved Developer can create HOST requests. This ensures fine-grained
                  control over which code can trigger outbound HTTP calls.
                </p>
              </div>
            </div>
          </div>

          <div className="card card-dark p-4 rounded-3">
            <h5 className="text-vtru-green mb-3">Trust Flow</h5>
            <div className="d-flex align-items-center justify-content-center flex-wrap gap-3 text-center">
              <div>
                <div className="text-white fw-bold">Validator Node</div>
                <div className="text-muted-light small">registers & approves</div>
              </div>
              <svg width="40" height="20" className="text-vtru-green">
                <path d="M5 10 L30 10 M25 5 L30 10 L25 15" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <div>
                <div className="text-white fw-bold">Developer</div>
                <div className="text-muted-light small">whitelists contracts</div>
              </div>
              <svg width="40" height="20" className="text-vtru-green">
                <path d="M5 10 L30 10 M25 5 L30 10 L25 15" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <div>
                <div className="text-white fw-bold">Smart Contract</div>
                <div className="text-muted-light small">invokes HOST</div>
              </div>
              <svg width="40" height="20" className="text-vtru-green">
                <path d="M5 10 L30 10 M25 5 L30 10 L25 15" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <div>
                <div className="text-white fw-bold">AI Agent</div>
                <div className="text-muted-light small">executes workflow</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Lifecycle */}
      <section className="section-dark py-5">
        <div className="container">
          <h2 className="text-white mb-5">Workflow Lifecycle</h2>

          {/* Step 1 */}
          <div className="row mb-5">
            <div className="col-lg-1">
              <div className="d-flex align-items-center justify-content-center rounded-circle bg-vtru-green text-dark fw-bold" style={{ width: '48px', height: '48px', fontSize: '1.25rem' }}>1</div>
            </div>
            <div className="col-lg-11">
              <h4 className="text-white mb-3">Validator Onboarding</h4>
              <p className="text-muted-light mb-3">
                A Validator Node is made available to process HOST requests when the Registry admin calls
                <code className="text-vtru-green ms-1">registerValidator(name, publicKey, owner, price, nodeAddress)</code> on the Registry.
              </p>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="card card-dark p-3 rounded-3">
                    <h6 className="text-vtru-green mb-2">Mechanism</h6>
                    <p className="text-muted-light small mb-0">
                      The registration records the node address and the node&apos;s public key, which clients use
                      to encrypt values that only that node can decrypt.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card card-dark p-3 rounded-3">
                    <h6 className="text-vtru-green mb-2">Result</h6>
                    <p className="text-muted-light small mb-0">
                      The Registry maps the Node Address to an Owner Address (the administrative EOA
                      capable of approving users).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="row mb-5">
            <div className="col-lg-1">
              <div className="d-flex align-items-center justify-content-center rounded-circle bg-vtru-green text-dark fw-bold" style={{ width: '48px', height: '48px', fontSize: '1.25rem' }}>2</div>
            </div>
            <div className="col-lg-11">
              <h4 className="text-white mb-3">Developer Access Request</h4>
              <p className="text-muted-light mb-3">
                A Developer who wishes to utilize a specific Validator's node must request permission from the Validator's Owner.
              </p>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="card card-dark p-3 rounded-3">
                    <h6 className="text-vtru-green mb-2">Action</h6>
                    <p className="text-muted-light small mb-0">
                      The User asks the Validator's Owner for permission to use that validator's services.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card card-dark p-3 rounded-3">
                    <h6 className="text-vtru-green mb-2">Approval</h6>
                    <p className="text-muted-light small mb-0">
                      The Validator's Owner Address calls <code className="text-vtru-green">authorizeUser(validatorNodeAddress, user, true)</code>
                      to whitelist the User's address.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="row mb-5">
            <div className="col-lg-1">
              <div className="d-flex align-items-center justify-content-center rounded-circle bg-vtru-green text-dark fw-bold" style={{ width: '48px', height: '48px', fontSize: '1.25rem' }}>3</div>
            </div>
            <div className="col-lg-11">
              <h4 className="text-white mb-3">Contract Whitelisting</h4>
              <p className="text-muted-light mb-3">
                Once approved, the Developer can explicitly authorize their smart contracts to use the system.
              </p>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="card card-dark p-3 rounded-3">
                    <h6 className="text-vtru-green mb-2">Action</h6>
                    <p className="text-muted-light small mb-0">
                      The User calls <code className="text-vtru-green">authorizeContract(validatorNodeAddress, contractAddress, true)</code>
                      to whitelist their contract. The address must be a deployed contract (it must have code);
                      plain wallet addresses are rejected. When a Validator removes a User, every contract that User
                      whitelisted is removed with them.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card card-dark p-3 rounded-3">
                    <h6 className="text-vtru-green mb-2">Result</h6>
                    <p className="text-muted-light small mb-0">
                      The Registry now recognizes that <code className="text-vtru-green">contractAddress</code> is
                      managed by a trusted User and allowed to create requests for that Validator.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="row">
            <div className="col-lg-1">
              <div className="d-flex align-items-center justify-content-center rounded-circle bg-vtru-green text-dark fw-bold" style={{ width: '48px', height: '48px', fontSize: '1.25rem' }}>4</div>
            </div>
            <div className="col-lg-11">
              <h4 className="text-white mb-3">Request Execution</h4>
              <p className="text-muted-light mb-4">
                The authorized Smart Contract executes the request in a two-step atomic process:
              </p>

              <div className="row g-4">
                <div className="col-md-6">
                  <div className="card card-dark p-4 rounded-3 h-100" style={{ borderTop: '3px solid var(--vtru-green)' }}>
                    <h5 className="text-vtru-green mb-3">Step A: Registration</h5>
                    <p className="text-muted-light mb-3">
                      The contract calls the HostRegistry function:
                    </p>
                    <div className="code-block mb-3">
                      <pre className="mb-0">{`addRequest(
  validator,     // Validator node address
  url,           // Target endpoint
  headerInput,   // Header JSON template or template name
  headerValues,  // Values for $1, $2, ...
  bodyInput,     // Body JSON template or template name
  bodyValues
) → requestID`}</pre>
                    </div>
                    <ul className="text-muted-light small mb-0">
                      <li className="mb-2"><strong className="text-white">Validation:</strong> The Registry checks the Chain of Trust—Is this contract registered by a User? Is that User approved by the target Validator?</li>
                      <li className="mb-2"><strong className="text-white">Caller:</strong> <code className="text-vtru-green">msg.sender</code> must be a deployed contract, so <code className="text-vtru-green">addRequest</code> cannot be called from a constructor. Register requests in a separate call after deployment.</li>
                      <li><strong className="text-white">Output:</strong> If valid, returns a unique <code className="text-vtru-green">uint256 requestID</code>.</li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card card-dark p-4 rounded-3 h-100" style={{ borderTop: '3px solid var(--vtru-green)' }}>
                    <h5 className="text-vtru-green mb-3">Step B: Execution</h5>
                    <p className="text-muted-light mb-3">
                      The contract immediately invokes the HOST Precompile via static call (at least 125,000 gas):
                    </p>
                    <div className="code-block mb-3">
                      <pre className="mb-0">{`(HOST_PRECOMPILE).staticcall(
  abi.encode(requestID)
)`}</pre>
                    </div>
                    <ul className="text-muted-light small mb-0">
                      <li className="mb-2"><strong className="text-white">Action:</strong> The Validator node detects the call, verifies the ID against the Registry.</li>
                      <li><strong className="text-white">Outcome:</strong> Performs the secure HTTP/S request off-chain to the specified endpoint.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Encryption/Decryption */}
      <section className="section-dark-2 py-5">
        <div className="container">
          <h2 className="text-white mb-4">HOST Protocol Encryption</h2>
          <p className="text-muted-light mb-4">
            HOST allows smart contracts to trigger HTTP webhooks with encrypted sensitive data (API keys, tokens, secrets).
            The encryption ensures that only the designated validator can decrypt the values when executing the webhook.
          </p>

          <div className="row g-4 mb-5">
            <div className="col-lg-6">
              <div className="card card-dark p-4 rounded-3 h-100">
                <h5 className="text-vtru-green mb-3">Encryption Scheme</h5>
                <ul className="text-muted-light mb-0">
                  <li className="mb-2"><strong className="text-white">Algorithm:</strong> ECDH key agreement + AES-256-GCM symmetric encryption</li>
                  <li className="mb-2"><strong className="text-white">Curve:</strong> secp256k1 (same as Ethereum)</li>
                  <li><strong className="text-white">Prefix:</strong> Encrypted values start with <code className="text-vtru-green">|</code></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card card-dark p-4 rounded-3 h-100">
                <h5 className="text-vtru-green mb-3">Security Properties</h5>
                <ul className="text-muted-light mb-0">
                  <li className="mb-2"><strong className="text-white">Asymmetric:</strong> Only the validator with the private key can decrypt</li>
                  <li className="mb-2"><strong className="text-white">Forward Secrecy:</strong> Each encryption uses a fresh ephemeral keypair</li>
                  <li className="mb-2"><strong className="text-white">Authenticated:</strong> GCM tag prevents tampering</li>
                  <li><strong className="text-white">On-chain Privacy:</strong> Encrypted values appear as opaque hex blobs</li>
                </ul>
              </div>
            </div>
          </div>

          <h4 className="text-white mb-3">Ciphertext Format</h4>
          <div className="code-block mb-4">
            <pre className="mb-0">{`| + [ephemeralPubKey (65 bytes)] + [nonce (12 bytes)] + [ciphertext (variable)] + [authTag (16 bytes)]

|               - Magic prefix indicating encrypted value
ephemeralPubKey - Uncompressed secp256k1 public key (0x04 prefix + 64 bytes)
nonce           - Random 12-byte IV for AES-GCM
ciphertext      - Encrypted data
authTag         - 16-byte GCM authentication tag`}</pre>
          </div>

          <h4 className="text-white mb-3">Client-Side Encryption (JavaScript)</h4>
          <SyntaxHighlighter language="javascript" style={oneDark} customStyle={{ borderRadius: '8px', fontSize: '0.85rem' }}>
            {jsEncryptCode}
          </SyntaxHighlighter>

          <h4 className="text-white mb-3">Usage in Smart Contracts</h4>
          <SyntaxHighlighter language="solidity" style={oneDark} customStyle={{ borderRadius: '8px', fontSize: '0.85rem' }}>
            {solidityUsageCode}
          </SyntaxHighlighter>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section-dark py-5">
        <div className="container">
          <h2 className="text-white mb-5">Use Cases</h2>
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="card card-dark p-4 rounded-3 h-100">
                <h5 className="text-vtru-green mb-3">Autonomous Agents</h5>
                <p className="text-muted-light mb-0">
                  Smart contracts spawn AI agents that reason, plan, and execute multi-step tasks.
                  Build self-governing DAOs, autonomous trading systems, and intelligent automation.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card card-dark p-4 rounded-3 h-100">
                <h5 className="text-vtru-green mb-3">Agentic Workflows</h5>
                <p className="text-muted-light mb-0">
                  Chain AI tools together—research, analyze, decide, execute. On-chain events trigger
                  complex multi-step workflows that operate autonomously.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card card-dark p-4 rounded-3 h-100">
                <h5 className="text-vtru-green mb-3">Event-Driven AI</h5>
                <p className="text-muted-light mb-0">
                  On-chain events trigger AI analysis pipelines. Smart contracts invoke ML models
                  to process data, generate predictions, and initiate downstream workflows.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card card-dark p-4 rounded-3 h-100">
                <h5 className="text-vtru-green mb-3">Generative Content</h5>
                <p className="text-muted-light mb-0">
                  NFT mints trigger AI image generation pipelines. Game actions spawn content
                  creation workflows. On-chain events drive off-chain creative processes.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card card-dark p-4 rounded-3 h-100">
                <h5 className="text-vtru-green mb-3">AI-Powered DeFi</h5>
                <p className="text-muted-light mb-0">
                  DeFi events trigger AI analysis—liquidation predictions, yield optimization
                  calculations, portfolio rebalancing signals sent to off-chain systems.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card card-dark p-4 rounded-3 h-100">
                <h5 className="text-vtru-green mb-3">Intelligent Automation</h5>
                <p className="text-muted-light mb-0">
                  On-chain events trigger AI decision pipelines. From supply chain notifications
                  to customer service workflows—autonomous off-chain processes driven by blockchain state.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="section-dark-2 py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <div className="alert mb-0" style={{ backgroundColor: 'rgba(161, 255, 117, 0.1)', border: '1px solid var(--vtru-green)', borderRadius: '12px', padding: '2rem' }}>
                <svg width="48" height="48" fill="none" stroke="var(--vtru-green)" viewBox="0 0 24 24" className="mb-3">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <h4 className="text-vtru-green mb-3">Host Registry App Coming Soon</h4>
                <p className="text-muted-light mb-0" style={{ maxWidth: '500px', margin: '0 auto' }}>
                  A dedicated application for validators and developers to register nodes, request access,
                  and whitelist contracts is currently under development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-dark py-5">
        <div className="container text-center">
          <h3 className="text-white mb-4">Ready to Build?</h3>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link href="/host" className="btn btn-primary btn-lg">
              Try HOST Demos
            </Link>
            <Link href="/host/examples" className="btn btn-outline-light btn-lg">
              Read HOST Examples
            </Link>
            <Link href="/developers/psc" className="btn btn-outline-light btn-lg">
              All Protocol Contracts
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
