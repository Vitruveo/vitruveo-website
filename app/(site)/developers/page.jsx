'use client';

import Link from 'next/link';
import { MCPSection } from '@/components/site/mcp-section';
import { PSC_ADDRESSES } from '@/vitruveo/lib/psc-constants';

// Shorten address: 0x00000000000000000000000000000000000000FF -> 0x00..FF
function shortenAddress(address) {
  if (!address) return '';
  const lastTwo = address.slice(-2);
  return `0x00..${lastTwo}`;
}

const pscList = [
  { name: 'HOST', slug: 'host', address: PSC_ADDRESSES.HOST, description: 'Trigger AI agents from contracts', category: 'Agentic', color: '#a1ff75', href: '/host' },
  { name: 'Trend', slug: 'trend', address: PSC_ADDRESSES.TREND, description: 'OLS regression + volatility analysis', category: 'Analysis', color: '#60a5fa' },
  { name: 'RNG', slug: 'rng', address: PSC_ADDRESSES.RNG, description: 'Protocol-level random numbers', category: 'Randomness', color: '#f472b6' },
  { name: 'Shuffle', slug: 'shuffle', address: PSC_ADDRESSES.SHUFFLE, description: 'Cryptographic card deck shuffle', category: 'Randomness', color: '#f472b6' },
  { name: 'Compound Interest', slug: 'compound-interest', address: PSC_ADDRESSES.COMPOUND_INTEREST, description: 'High-precision DeFi calculations', category: 'DeFi', color: '#fbbf24' },
  { name: 'Passkey', slug: 'passkey', address: PSC_ADDRESSES.PASSKEY, description: 'WebAuthn P-256 verification', category: 'Auth', color: '#c084fc' },
  { name: 'Multisig', slug: 'multisig', address: PSC_ADDRESSES.MULTISIG, description: 'Native wallets with EOA + passkey owners', category: 'Auth', color: '#c084fc' },
  { name: 'Merkle Proof', slug: 'merkle-proof', address: PSC_ADDRESSES.MERKLE_PROOF, description: 'Fast Merkle proof verification', category: 'Verification', color: '#34d399' },
  { name: 'Content Credentials', slug: 'content-credentials', address: PSC_ADDRESSES.CONTENT_CREDENTIALS, description: 'On-chain C2PA provenance verification', category: 'Verification', color: '#34d399' },
  { name: 'Protobuf', slug: 'protobuf', address: PSC_ADDRESSES.PROTOBUF, description: 'Protobuf codec + 1 gas/byte storage', category: 'Data', color: '#22d3ee' },
  { name: 'File Storage', slug: 'file-storage', address: PSC_ADDRESSES.FILE_STORE, description: 'On-chain files up to 10 MB, served over HTTP', category: 'Data', color: '#22d3ee' },
  { name: 'Batch Balance', slug: 'batch-balance', address: PSC_ADDRESSES.BATCH_BALANCE, description: 'Query multiple ERC20 balances', category: 'Batching', color: '#94a3b8' },
  { name: 'Batch Balance Native', slug: 'batch-balance-native', address: PSC_ADDRESSES.BATCH_BALANCE_NATIVE, description: 'Query native + ERC20 balances', category: 'Batching', color: '#94a3b8' },
];

// Icons for each PSC
const pscIcons = {
  host: <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  trend: <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  rng: <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
  shuffle: <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  'compound-interest': <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  passkey: <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>,
  'merkle-proof': <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  multisig: <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  'content-credentials': <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
  protobuf: <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
  'file-storage': <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  'batch-balance': <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  'batch-balance-native': <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
};

export default function DevelopersPage() {
  return (
    <>
      {/* Hero with Video */}
      <section className="page-hero d-flex align-items-center" style={{ marginTop: '-108px' }}>
        <video autoPlay muted loop playsInline className="video-bg">
          <source src="/videos/developers.mp4" type="video/mp4" />
        </video>
        <div className="overlay"></div>
        <div className="container py-5">
          <h1 className="display-4 fw-bold text-white mb-4">
            Familiar EVM. <span className="text-vtru-green">Unfamiliar Power.</span>
          </h1>
          <p className="lead text-white-50 mb-0" style={{ maxWidth: '600px' }}>
            Your Solidity works. Your tools work. Plus 13 protocol-level capabilities
            you can't get anywhere else.
          </p>
        </div>
      </section>

      {/* HOST Feature Callout */}
      <section className="section-dark py-5">
        <div className="container">
          <div className="card p-4 p-lg-5 rounded-4" style={{ background: 'linear-gradient(135deg, rgba(161, 255, 117, 0.1) 0%, rgba(74, 222, 128, 0.05) 100%)', border: '1px solid rgba(161, 255, 117, 0.3)' }}>
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <h3 className="text-white mb-3">HOST — Trigger AI Agents from Smart Contracts</h3>
                <p className="text-muted-light mb-0">
                  HTTP Outbound Service Trigger enables smart contracts to invoke AI agents and agentic
                  workflows during transaction execution. On-chain events become autonomous decisions.
                  The deep-dive primer covers the Chain of Trust security model and workflow lifecycle.
                </p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link href="/host-primer" className="btn btn-host-primer btn-lg">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="me-2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  HOST Primer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol Smart Contracts */}
      <section id="psc" className="section-dark-2 py-5">
        <div className="container">
          <h2 className="text-white mb-3">Protocol Smart Contracts</h2>
          <p className="text-muted-light mb-4">
            Every EVM has precompiles (ecrecover, sha256, etc.). Vitruveo adds 13 more
            that give contracts capabilities no standard EVM offers.
          </p>

          {/* PSC Tiles */}
          <div className="row g-3 mb-5">
            {pscList.map((psc) => (
              <div key={psc.slug} className="col-md-6 col-lg-4">
                <Link href={psc.href || `/developers/psc/${psc.slug}`} className="text-decoration-none">
                  <div className="card card-dark p-3 rounded-3 h-100 psc-tile" style={{ borderLeft: `3px solid ${psc.color}` }}>
                    <div className="d-flex align-items-start gap-3">
                      <div className="psc-icon" style={{ color: psc.color }}>
                        {pscIcons[psc.slug]}
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <h5 className="text-white mb-0">{psc.name}</h5>
                          <span className="psc-category-badge" style={{ backgroundColor: `${psc.color}20`, color: psc.color }}>
                            {psc.category}
                          </span>
                        </div>
                        <p className="text-muted-light small mb-2">{psc.description}</p>
                        <div className="psc-address">
                          <code className="text-vtru-green small">{shortenAddress(psc.address)}</code>
                          <button
                            className="psc-address-copy"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigator.clipboard.writeText(psc.address);
                            }}
                            title="Copy full address"
                          >
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* How to Call */}
          <h4 className="text-white mb-3">How to Call</h4>
          <div className="code-block mb-5">
            <pre>{`// Solidity
(bool success, bytes memory result) = address(0xFF).staticcall(abi.encode(input));

// JavaScript (ethers.js)
const result = await provider.call({
  to: "0x00000000000000000000000000000000000000FF",
  data: encodedInput
});`}</pre>
          </div>

          {/* By Category */}
          <h4 className="text-white mb-4">By Category</h4>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card card-dark p-4 rounded-3 h-100">
                <h5 className="text-vtru-green mb-3">Agentic</h5>
                <ul className="list-unstyled mb-0">
                  <li><Link href="/host" className="text-muted-light">HTTP Outbound Service Trigger</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card card-dark p-4 rounded-3 h-100">
                <h5 className="text-vtru-green mb-3">Analysis</h5>
                <ul className="list-unstyled mb-0">
                  <li><Link href="/developers/psc/trend" className="text-muted-light">Trend</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card card-dark p-4 rounded-3 h-100">
                <h5 className="text-vtru-green mb-3">Randomness</h5>
                <ul className="list-unstyled mb-0">
                  <li><Link href="/developers/psc/rng" className="text-muted-light">Random Number Generator</Link></li>
                  <li><Link href="/developers/psc/shuffle" className="text-muted-light">Shuffle</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card card-dark p-4 rounded-3 h-100">
                <h5 className="text-vtru-green mb-3">Math & Verification</h5>
                <ul className="list-unstyled mb-0">
                  <li><Link href="/developers/psc/compound-interest" className="text-muted-light">CompoundInterest</Link></li>
                  <li><Link href="/developers/psc/merkle-proof" className="text-muted-light">MerkleProof</Link></li>
                  <li><Link href="/developers/psc/content-credentials" className="text-muted-light">Content Credentials (C2PA)</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card card-dark p-4 rounded-3 h-100">
                <h5 className="text-vtru-green mb-3">Auth & Wallets</h5>
                <ul className="list-unstyled mb-0">
                  <li><Link href="/developers/psc/passkey" className="text-muted-light">Passkey</Link></li>
                  <li><Link href="/developers/psc/multisig" className="text-muted-light">Multisig</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card card-dark p-4 rounded-3 h-100">
                <h5 className="text-vtru-green mb-3">Data & Storage</h5>
                <ul className="list-unstyled mb-0">
                  <li><Link href="/developers/psc/protobuf" className="text-muted-light">Protobuf</Link></li>
                  <li><Link href="/developers/psc/file-storage" className="text-muted-light">File Storage</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card card-dark p-4 rounded-3 h-100">
                <h5 className="text-vtru-green mb-3">Batching</h5>
                <ul className="list-unstyled mb-0">
                  <li><Link href="/developers/psc/batch-balance" className="text-muted-light">BatchBalance</Link></li>
                  <li><Link href="/developers/psc/batch-balance-native" className="text-muted-light">BatchBalanceNative</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MCPSection />

      {/* Resources */}
      <section className="section-dark-2 py-5">
        <div className="container">
          <h2 className="text-white mb-4">Resources</h2>
          <div className="row g-4">
            {[
              ['GitHub', 'github.com/vitruveo', 'https://github.com/vitruveo'],
              ['Explorer', 'explorer.vitruveo.ai', 'https://explorer.vitruveo.ai'],
              ['AI Chat', 'Ask Vitruveo AI', '/chat'],
            ].map(([title, text, href]) => (
              <div key={title} className="col-sm-6 col-lg-3">
                <div className="card card-dark p-4 rounded-3 h-100">
                  <h5 className="text-white mb-2">{title}</h5>
                  {href.startsWith('/') ? (
                    <Link href={href} className="text-vtru-green small">
                      {text} →
                    </Link>
                  ) : (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-vtru-green small">
                      {text} →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Network */}
      <section className="section-dark py-5">
        <div className="container">
          <h2 className="text-white mb-4">Network</h2>
          <div className="code-block">
            <pre>{`Chain ID: 1490
RPC: https://rpc.vitruveo.ai
Explorer: https://explorer.vitruveo.ai`}</pre>
          </div>
        </div>
      </section>
    </>
  );
}
