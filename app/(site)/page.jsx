import Link from 'next/link';
import { HeroChat } from '@/components/site/hero-chat';
import { HeroVideo } from '@/components/site/hero-video';
import { HostDemos } from '@/components/site/host-demos';
import { PSCDemos } from '@/components/site/psc-demos';

export const metadata = {
  title: 'Vitruveo - Webhooks for Web3',
  description: 'Smart contracts have always been silent. Vitruveo gives them a voice. The first EVM chain where contracts speak HTTP.',
};

export default function HomePage() {
  return (
    <>
      {/* Hero Section with Video */}
      <section className="hero-video d-flex align-items-center" style={{ marginTop: '-108px', paddingTop: '108px' }}>
        <HeroVideo />
        <div className="overlay"></div>
        <div className="container py-4">
          <div className="row">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold text-white mb-3">
                <span className="text-vtru-green">Webhooks</span> for Web3
              </h1>
              <p className="lead text-white-50 mb-3">
                Smart contracts have always been silent. Vitruveo gives them a voice.
                The first EVM chain where contracts speak HTTP—no indexers, no polling,
                no middleware.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link href="/developers/psc" className="btn btn-host-primer">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="me-2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Start Building
                </Link>
                <Link href="/about" className="btn btn-host-primer">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="me-2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                  </svg>
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Try HOST Interactive Demos */}
      <HostDemos title="Try HOST Interactive Demos" limit={3} />

      {/* Try Protocol Smart Contract Demos */}
      <PSCDemos title="Try Protocol Smart Contract Demos" limit={3} excludeBatch={true} showMoreButton={true} />

      {/* Why Vitruveo */}
      <section className="section-dark-2 py-5">
        <div className="container py-4">
          <h2 className="text-center text-white mb-5">The Full Circle</h2>
          <p className="text-center text-muted-light mb-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Web2 → Web3 → Web2. Complete. Your app calls a contract, the contract speaks back.
          </p>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card card-dark h-100 p-4 rounded-3">
                <div className="mb-3">
                  <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-vtru-green">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h4 className="text-white">Contracts That Speak</h4>
                <p className="text-muted-light mb-0">
                  Smart contracts call your webhooks during transaction execution.
                  No indexers. No polling. No middleware.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card card-dark h-100 p-4 rounded-3">
                <div className="mb-3">
                  <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-vtru-green">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-white">Provably Authentic</h4>
                <p className="text-muted-light mb-0">
                  Every outbound call signed by the validator. Your webhook knows
                  it came from the blockchain. Trust extended off-chain.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card card-dark h-100 p-4 rounded-3">
                <div className="mb-3">
                  <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-vtru-green">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-white">Built for AI</h4>
                <p className="text-muted-light mb-0">
                  5-second blocks. On-chain events trigger agentic workflows instantly.
                  A blockchain designed for the AI era.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOST Protocol Feature */}
      <section className="section-dark py-5">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h2 className="text-white mb-4">HOST — Smart Contracts That Speak HTTP</h2>
              <p className="lead text-muted-light mb-4">
                The first protocol-level outbound trigger in any EVM chain.
                Contracts send data to your webhook during transaction execution.
                Signed by the validator. Provably authentic.
              </p>
              <Link href="/host-primer" className="btn btn-host-primer">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="me-2">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                HOST Primer
              </Link>
            </div>
            <div className="col-lg-6">
              <div className="card card-dark p-4 rounded-3">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-4">
                  <div className="text-center">
                    <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '60px', height: '60px', background: 'rgba(161, 255, 117, 0.1)', border: '2px solid var(--vtru-green)' }}>
                      <svg width="28" height="28" fill="none" stroke="var(--vtru-green)" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                      </svg>
                    </div>
                    <div className="text-white fw-semibold small">Smart Contract</div>
                  </div>
                  <svg width="40" height="20" className="text-vtru-green flex-shrink-0">
                    <path d="M5 10 L30 10 M25 5 L30 10 L25 15" fill="none" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <div className="text-center">
                    <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '60px', height: '60px', background: 'var(--vtru-green)' }}>
                      <span className="fw-bold text-dark">HOST</span>
                    </div>
                    <div className="text-white fw-semibold small">Precompile</div>
                  </div>
                  <svg width="40" height="20" className="text-vtru-green flex-shrink-0">
                    <path d="M5 10 L30 10 M25 5 L30 10 L25 15" fill="none" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <div className="text-center">
                    <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '60px', height: '60px', background: 'rgba(161, 255, 117, 0.1)', border: '2px solid var(--vtru-green)' }}>
                      <svg width="28" height="28" fill="none" stroke="var(--vtru-green)" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-white fw-semibold small">AI Agent</div>
                  </div>
                </div>
                <p className="text-muted-light text-center small mt-4 mb-0">
                  Contract speaks → Webhook receives → Your app responds
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol Smart Contracts */}
      <section className="section-dark-2 py-5">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <h2 className="text-white mb-4">13 Built-In Capabilities</h2>
              <p className="lead text-muted-light mb-4">
                Webhooks, passkeys, multisig wallets, on-chain file storage, content credentials,
                randomness, trend analysis and more—built directly into the protocol.
              </p>
              <Link href="/developers/psc" className="btn btn-host-primer">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="me-2">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Explore PSCs
              </Link>
            </div>
            <div className="col-lg-7">
              <div className="row g-2">
                {[
                  ['HOST', 'Trigger AI agents'],
                  ['Trend', 'Statistical analysis'],
                  ['RNG', 'Random number generation'],
                  ['Shuffle', 'Cryptographic card shuffle'],
                  ['CompoundInterest', 'High-precision DeFi calculations'],
                ].map(([name, desc]) => (
                  <div key={name} className="col-12">
                    <div className="card card-dark p-3 rounded-2">
                      <div className="d-flex align-items-center gap-3">
                        <code className="text-vtru-green fw-semibold" style={{ minWidth: '130px' }}>{name}</code>
                        <span className="text-muted-light small">{desc}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="col-12">
                  <Link href="/developers/psc" className="text-vtru-green text-center d-block py-2">
                    + 8 more...
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Network Stats */}
      <section className="section-dark-3 py-5">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-6 col-md-3">
              <h2 className="display-5 fw-bold text-vtru-green mb-2">1490</h2>
              <p className="text-muted-light mb-0">Chain ID</p>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="display-5 fw-bold text-vtru-green mb-2">5s</h2>
              <p className="text-muted-light mb-0">Block Time</p>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="display-5 fw-bold text-vtru-green mb-2">4</h2>
              <p className="text-muted-light mb-0">Gwei Gas</p>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="display-5 fw-bold text-vtru-green mb-2">EVM</h2>
              <p className="text-muted-light mb-0">Compatible</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
