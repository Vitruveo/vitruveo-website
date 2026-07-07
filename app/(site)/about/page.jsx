import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'About - Vitruveo',
  description: 'Webhooks for Web3. Smart contracts have always been silent—Vitruveo gives them a voice. The first EVM chain where contracts speak HTTP.',
};

export default function AboutPage() {
  return (
    <>
      {/* Hero with Video */}
      <section className="page-hero d-flex align-items-center" style={{ marginTop: '-108px' }}>
        <video autoPlay muted loop playsInline className="video-bg">
          <source src="/videos/ecosystem.mp4" type="video/mp4" />
        </video>
        <div className="overlay"></div>
        <div className="container py-5">
          <h1 className="display-4 fw-bold text-white mb-4">Webhooks for Web3</h1>
          <p className="lead text-white-50 mb-0">Smart contracts have always been silent. Vitruveo gives them a voice.</p>
        </div>
      </section>

      {/* Intro */}
      <section className="section-dark py-5">
        <div className="container">
          <p className="text-muted-light mb-0" style={{ fontSize: '1.25rem', lineHeight: '1.8' }}>
            Web3 has been a one-way street. Transactions bring data in, smart contracts execute, but nothing goes back out. Web2 apps must index, poll, and react asynchronously. Vitruveo changes this. HOST (HTTP Outbound Service Trigger) lets contracts speak HTTP during transaction execution—calling your webhooks directly, signed by the validator, provably authentic. Web2 → Web3 → Web2. Complete.
          </p>
        </div>
      </section>

      {/* The Problem & Our Approach */}
      <section className="section-dark-2 py-5">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6">
              <h2 className="text-white mb-3">The Silent Problem</h2>
              <p className="text-muted-light" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                Web2 runs on webhooks—Stripe, Shopify, Slack, GitHub. All Web3 offers is
                unreliable event logs. Execute. Wait. The silence is deafening. Result: low Web2 developer adoption.
              </p>
            </div>
            <div className="col-lg-6">
              <h2 className="text-white mb-3">The Voice</h2>
              <p className="text-muted-light" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                HOST gives smart contracts a voice. The first protocol-level outbound trigger in any
                EVM chain. Contract sends data to your webhook during transaction. Signed by the validator. Provably authentic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="section-dark py-5">
        <div className="container">
          <h2 className="text-white mb-4">Technology</h2>
          <div className="row g-4">
            {[
              ['EVM Compatible', 'Your Solidity skills transfer directly'],
              ['Protocol Extensions', 'Capabilities built into the node, not bolted on'],
              ['Decentralized Validators', 'No central authority for HOST requests'],
            ].map(([title, desc]) => (
              <div key={title} className="col-md-4">
                <div className="card card-dark p-4 rounded-3 h-100">
                  <h5 className="text-vtru-green mb-2">{title}</h5>
                  <p className="text-muted-light mb-0">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-World Scenarios */}
      <section className="section-dark-2 py-5">
        <div className="container">
          <h2 className="text-white mb-2">Real-World Scenarios</h2>
          <p className="text-muted-light mb-5">Concrete examples of what Protocol Smart Contracts enable</p>
          <div className="row g-4">
            {/* HOST - AI Agent */}
            <div className="col-md-4">
              <div className="card card-dark p-4 rounded-3 h-100">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', background: 'rgba(161, 255, 117, 0.15)' }}>
                    <svg width="24" height="24" fill="none" stroke="var(--vtru-green)" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <code className="text-vtru-green small">HOST</code>
                </div>
                <h6 className="text-white mb-2">DAO → AI Agent Execution</h6>
                <p className="text-muted-light small mb-0">Governance vote passes, HOST triggers Claude to analyze treasury and execute approved rebalancing strategy.</p>
              </div>
            </div>

            {/* HOST - Commerce */}
            <div className="col-md-4">
              <div className="card card-dark p-4 rounded-3 h-100">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', background: 'rgba(161, 255, 117, 0.15)' }}>
                    <svg width="24" height="24" fill="none" stroke="var(--vtru-green)" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <code className="text-vtru-green small">HOST</code>
                </div>
                <h6 className="text-white mb-2">NFT → Physical Fulfillment</h6>
                <p className="text-muted-light small mb-0">Collector buys art NFT, HOST calls Shopify API with shipping address, physical print ships automatically.</p>
              </div>
            </div>

            {/* HOST - IoT */}
            <div className="col-md-4">
              <div className="card card-dark p-4 rounded-3 h-100">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', background: 'rgba(161, 255, 117, 0.15)' }}>
                    <svg width="24" height="24" fill="none" stroke="var(--vtru-green)" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <code className="text-vtru-green small">HOST</code>
                </div>
                <h6 className="text-white mb-2">Payment → Smart Lock Access</h6>
                <p className="text-muted-light small mb-0">Rental deposit confirmed on-chain, HOST triggers August API, guest's phone can unlock the door.</p>
              </div>
            </div>

            {/* Passkey */}
            <div className="col-md-4">
              <div className="card card-dark p-4 rounded-3 h-100">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', background: 'rgba(161, 255, 117, 0.15)' }}>
                    <svg width="24" height="24" fill="none" stroke="var(--vtru-green)" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                  </div>
                  <code className="text-vtru-green small">Passkey</code>
                </div>
                <h6 className="text-white mb-2">Face ID Transaction Signing</h6>
                <p className="text-muted-light small mb-0">User approves swap with fingerprint. No seed phrase, no extension popup—just biometric confirmation via WebAuthn.</p>
              </div>
            </div>

            {/* RNG - Gaming */}
            <div className="col-md-4">
              <div className="card card-dark p-4 rounded-3 h-100">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', background: 'rgba(161, 255, 117, 0.15)' }}>
                    <svg width="24" height="24" fill="none" stroke="var(--vtru-green)" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <code className="text-vtru-green small">RNG</code>
                </div>
                <h6 className="text-white mb-2">Provably Fair Loot Drops</h6>
                <p className="text-muted-light small mb-0">Player defeats boss, RNG determines drop rarity. Result is verifiable on-chain—no rigged odds, no trust required.</p>
              </div>
            </div>

            {/* RNG - Lottery */}
            <div className="col-md-4">
              <div className="card card-dark p-4 rounded-3 h-100">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', background: 'rgba(161, 255, 117, 0.15)' }}>
                    <svg width="24" height="24" fill="none" stroke="var(--vtru-green)" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <code className="text-vtru-green small">RNG</code>
                </div>
                <h6 className="text-white mb-2">On-Chain Raffle Selection</h6>
                <p className="text-muted-light small mb-0">10,000 entries, one winner. RNG picks index 7,429. Anyone can verify the selection was random and untampered.</p>
              </div>
            </div>

            {/* CompoundInterest */}
            <div className="col-md-4">
              <div className="card card-dark p-4 rounded-3 h-100">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', background: 'rgba(161, 255, 117, 0.15)' }}>
                    <svg width="24" height="24" fill="none" stroke="var(--vtru-green)" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <code className="text-vtru-green small">CompoundInterest</code>
                </div>
                <h6 className="text-white mb-2">Precise DeFi Yield Calculation</h6>
                <p className="text-muted-light small mb-0">Staking contract calculates exact APY to 18 decimals. No rounding errors, no approximations—mathematically correct interest.</p>
              </div>
            </div>

            {/* Merkle - Airdrop */}
            <div className="col-md-4">
              <div className="card card-dark p-4 rounded-3 h-100">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', background: 'rgba(161, 255, 117, 0.15)' }}>
                    <svg width="24" height="24" fill="none" stroke="var(--vtru-green)" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <code className="text-vtru-green small">MerkleProof</code>
                </div>
                <h6 className="text-white mb-2">Gas-Efficient Airdrop Claims</h6>
                <p className="text-muted-light small mb-0">50,000 eligible addresses, but only a 32-byte root stored on-chain. Users prove eligibility with their Merkle path.</p>
              </div>
            </div>

            {/* Merkle - Whitelist */}
            <div className="col-md-4">
              <div className="card card-dark p-4 rounded-3 h-100">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', background: 'rgba(161, 255, 117, 0.15)' }}>
                    <svg width="24" height="24" fill="none" stroke="var(--vtru-green)" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <code className="text-vtru-green small">MerkleProof</code>
                </div>
                <h6 className="text-white mb-2">NFT Mint Whitelist</h6>
                <p className="text-muted-light small mb-0">Exclusive mint for 2,000 early supporters. Contract verifies membership in one cheap operation instead of checking a massive list.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured App: Pretrend */}
      <section className="section-dark py-5">
        <div className="container">
          <h2 className="text-white mb-4">Featured App: Pretrend</h2>
          <div className="row g-4 align-items-center">
            <div className="col-lg-8">
              <div className="d-flex align-items-center gap-3 mb-3">
                <Image src="/images/pretrend.png" alt="Pretrend" width={48} height={48} style={{ objectFit: 'contain' }} />
                <h4 className="text-white mb-0">Pretrend Protocol</h4>
              </div>
              <p className="text-muted-light mb-3">
                Pretrend is a trend-based oracle protocol that lets prediction markets resolve on
                directional movement instead of binary outcomes. Users predict the magnitude and
                direction of change—how far and which way—not just whether an event occurs. If
                Bitcoin rises from $60,000 to $99,000, a binary "$100K by year end?" market pays
                nothing to participants who were directionally correct. Pretrend captures that nuance.
              </p>
              <p className="text-muted-light mb-3">
                It runs on Vitruveo's native Trend precompile, computing OLS regression, R-squared,
                and volatility on-chain at compiled machine-code speed. Trend results map to one of
                five outcome buckets calibrated to each data source's historical volatility, a bonding
                curve rewards early conviction, and HOST pushes resolutions cross-chain to marketplace
                contracts on BSC and other EVM chains.
              </p>
              <a href="https://www.verticalfoundation.net/pretrend" target="_blank" rel="noopener noreferrer" className="text-vtru-green">
                Learn more at verticalfoundation.net →
              </a>
            </div>
            <div className="col-lg-4">
              <div className="d-flex flex-column gap-2">
                {[
                  ['Crash', 'Significant decline', '#ef4444'],
                  ['Bear', 'Moderate decline', '#f97316'],
                  ['Flat', 'Minimal change', '#a3a3a3'],
                  ['Bull', 'Moderate growth', '#4ade80'],
                  ['Moon', 'Significant growth', '#7bc47f'],
                ].map(([name, desc, color]) => (
                  <div key={name} className="card card-dark px-3 py-2 rounded-3 d-flex flex-row align-items-center gap-3" style={{ borderLeft: `3px solid ${color}` }}>
                    <span className="fw-bold" style={{ color, minWidth: '60px' }}>{name}</span>
                    <span className="text-muted-light small">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="section-dark-2 py-5">
        <div className="container">
          <h2 className="text-white mb-4">Infrastructure</h2>
          <div className="row g-4">
            {[
              ['Scope', 'The focal point for your Vitruveo assets', 'https://scope.vitruveo.ai'],
              ['Explorer', 'Block explorer', 'https://explorer.vitruveo.ai'],
              ['AI Chat', 'Ask Vitruveo AI', '/chat'],
            ].map(([title, desc, href]) => (
              <div key={title} className="col-sm-6 col-lg-4">
                <div className="card card-dark p-4 rounded-3 h-100 text-center">
                  <h4 className="text-white mb-2">{title}</h4>
                  <p className="text-muted-light small mb-3">{desc}</p>
                  {href.startsWith('/') ? (
                    <Link href={href} className="btn btn-primary btn-sm">
                      Open →
                    </Link>
                  ) : (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      Open →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-dark py-5">
        <div className="container">
          <h2 className="text-white mb-4">Frequently Asked Questions</h2>
          <div className="row g-4">
            {[
              ['What is Vitruveo?', 'Webhooks for Web3. The first EVM chain where smart contracts speak HTTP. Your contracts call webhooks directly during transaction execution—no indexers, no polling, no middleware.'],
              ['How is it different from Ethereum?', '100% EVM compatible—your Solidity works unchanged. The difference: HOST lets contracts talk back to Web2. Plus 11 other Protocol Smart Contracts for passkeys, randomness, and more.'],
              ['What are Protocol Smart Contracts?', 'Precompiled contracts built into Vitruveo\'s node software. They provide capabilities too expensive or impossible in pure Solidity—like outbound HTTP calls.'],
              ['What is HOST?', 'HTTP Outbound Service Trigger. Smart contracts that speak HTTP. Your contract sends data to your webhook during transaction. Signed by the validator. Provably authentic.'],
              ['Is it secure?', 'Every outbound call is signed by the validator. Your webhook can verify it came from the blockchain. Chain of custody, extended off-chain.'],
              ['What\'s the gas cost?', '4 gwei base price with 5-second blocks. Fast enough for AI agent workflows. PSC operations range from 500 gas (RNG) to 200,000+ gas (IBC).'],
            ].map(([question, answer]) => (
              <div key={question} className="col-md-6">
                <div className="card card-dark p-4 rounded-3 h-100">
                  <h5 className="text-white mb-3">{question}</h5>
                  <p className="text-muted-light mb-0 small">{answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
