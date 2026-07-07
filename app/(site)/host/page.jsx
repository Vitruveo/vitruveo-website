'use client';

import Link from 'next/link';

const HOST_DEMOS = [
  {
    slug: 'scout',
    title: 'AI Alpha Scout',
    description: 'Trigger an AI research agent from the blockchain to discover crypto projects matching your risk profile.',
    icon: (
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
        <path d="M8 14l4-6 4 6" />
      </svg>
    ),
    color: '#60a5fa',
    comingSoon: false,
  },
  {
    slug: 'sheets',
    title: 'AI Google Sheets Update',
    description: 'Log on-chain data directly to Google Sheets from your smart contract. Perfect for analytics and reporting.',
    icon: (
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
      </svg>
    ),
    color: '#34a853',
    comingSoon: false,
  },
  {
    slug: 'ntfy',
    title: 'Ntfy Alerts',
    description: 'Send push notifications to any device directly from your smart contract function.',
    icon: (
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    color: '#4ade80',
    comingSoon: false,
  },
  {
    slug: 'pass',
    title: 'Mobile Wallet Pass',
    description: 'Deliver digital passes to Apple Wallet or Google Wallet, triggered by on-chain transactions.',
    icon: (
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2" />
      </svg>
    ),
    color: '#a78bfa',
    comingSoon: false,
  },
];

export default function HostLandingPage() {
  return (
    <section className="section-dark py-5">
      <div className="container py-4">
        {/* HOST Feature Callout */}
        <div className="card p-4 p-lg-5 rounded-4 mb-5" style={{ background: 'linear-gradient(135deg, rgba(161, 255, 117, 0.1) 0%, rgba(74, 222, 128, 0.05) 100%)', border: '1px solid rgba(161, 255, 117, 0.3)' }}>
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

        <div className="text-center mb-5">
          <h1 className="text-white mb-3">HOST Interactive Demos</h1>
          <p className="text-muted-light lead mx-auto" style={{ maxWidth: '700px' }}>
            <strong>HTTP Outbound Service Trigger</strong> gives your smart contracts a voice. Call any webhook,
            send notifications, trigger AI agents—all during transaction execution.
            Signed by the validator. No indexers. No polling. No middleware.
          </p>
          <p className="text-vtru-green display-6 fw-bold mt-4">Can your blockchain do that?</p>
        </div>

        <div className="row g-4 justify-content-center">
          {HOST_DEMOS.map((demo) => (
            <div key={demo.slug} className="col-md-6">
              {demo.comingSoon ? (
                <div className="demo-card demo-card-disabled">
                  <h4 className="demo-card-title">{demo.title}</h4>
                  <div className="demo-card-icon" style={{ color: demo.color }}>
                    {demo.icon}
                  </div>
                  <p className="demo-card-description">{demo.description}</p>
                  <div className="demo-card-button demo-card-button-disabled">
                    Coming Soon
                  </div>
                </div>
              ) : (
                <Link href={`/host/${demo.slug}`} className="text-decoration-none">
                  <div className="demo-card">
                    <h4 className="demo-card-title">{demo.title}</h4>
                    <div className="demo-card-icon" style={{ color: demo.color }}>
                      {demo.icon}
                    </div>
                    <p className="demo-card-description">{demo.description}</p>
                    <div className="demo-card-button" style={{ backgroundColor: demo.color }}>
                      Launch
                    </div>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Use-case Examples Section */}
        <div className="mt-5 pt-5 border-top border-secondary">
          <h2 className="text-white text-center mb-4">HOST Use-case Examples</h2>
          <p className="text-muted-light text-center mb-5 mx-auto" style={{ maxWidth: '600px' }}>
            Real-world applications that demonstrate the transformative power of HOST.
          </p>
          <div className="row g-4 justify-content-center">
            {/* SmartLease */}
            <div className="col-sm-6 col-lg-4">
              <Link href="/host/examples/smartlease" className="text-decoration-none">
                <div className="demo-card">
                  <h4 className="demo-card-title">SmartLease</h4>
                  <div className="demo-card-icon" style={{ color: '#f59e0b' }}>
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <p className="demo-card-description">Self-enforcing asset financing. When payment stops, the machine stops. The holy grail of RWA financing.</p>
                  <div className="demo-card-button" style={{ backgroundColor: '#f59e0b' }}>
                    Read More
                  </div>
                </div>
              </Link>
            </div>

            {/* Access Control */}
            <div className="col-sm-6 col-lg-4">
              <Link href="/host/examples/access-control" className="text-decoration-none">
                <div className="demo-card">
                  <h4 className="demo-card-title">Access Control</h4>
                  <div className="demo-card-icon" style={{ color: '#8b5cf6' }}>
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <p className="demo-card-description">NFT-gated physical spaces. Hold the token, open the door. Sell the token, lose access instantly.</p>
                  <div className="demo-card-button" style={{ backgroundColor: '#8b5cf6' }}>
                    Read More
                  </div>
                </div>
              </Link>
            </div>

            {/* Supply Chain */}
            <div className="col-sm-6 col-lg-4">
              <Link href="/host/examples/supply-chain" className="text-decoration-none">
                <div className="demo-card">
                  <h4 className="demo-card-title">Supply Chain</h4>
                  <div className="demo-card-icon" style={{ color: '#06b6d4' }}>
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p className="demo-card-description">Authenticated IoT sensor data. Tamper-proof provenance from factory to consumer.</p>
                  <div className="demo-card-button" style={{ backgroundColor: '#06b6d4' }}>
                    Read More
                  </div>
                </div>
              </Link>
            </div>

            {/* SmartEscrow */}
            <div className="col-sm-6 col-lg-4">
              <Link href="/host/examples/smart-escrow" className="text-decoration-none">
                <div className="demo-card">
                  <h4 className="demo-card-title">SmartEscrow</h4>
                  <div className="demo-card-icon" style={{ color: '#3b82f6' }}>
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="demo-card-description">Atomic real estate closings. Payment, document release, and title recording in one transaction.</p>
                  <div className="demo-card-button" style={{ backgroundColor: '#3b82f6' }}>
                    Read More
                  </div>
                </div>
              </Link>
            </div>

            {/* AutoLien */}
            <div className="col-sm-6 col-lg-4">
              <Link href="/host/examples/auto-lien" className="text-decoration-none">
                <div className="demo-card">
                  <h4 className="demo-card-title">AutoLien</h4>
                  <div className="demo-card-icon" style={{ color: '#ef4444' }}>
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="demo-card-description">Self-filing debt. Missed DeFi payments trigger automatic UCC lien filings.</p>
                  <div className="demo-card-button" style={{ backgroundColor: '#ef4444' }}>
                    Read More
                  </div>
                </div>
              </Link>
            </div>

            {/* Credit Bridge */}
            <div className="col-sm-6 col-lg-4">
              <Link href="/host/examples/credit-bridge" className="text-decoration-none">
                <div className="demo-card">
                  <h4 className="demo-card-title">Credit Bridge</h4>
                  <div className="demo-card-icon" style={{ color: '#10b981' }}>
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="demo-card-description">DeFi builds credit. On-chain loan payments reported to traditional credit bureaus.</p>
                  <div className="demo-card-button" style={{ backgroundColor: '#10b981' }}>
                    Read More
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .demo-card {
          background: linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%);
          border-radius: 16px;
          padding: 1.75rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          border: 1px solid #333;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .demo-card:hover {
          transform: scale(1.05);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          border-color: #444;
        }
        .demo-card-disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .demo-card-disabled:hover {
          transform: none;
          box-shadow: none;
          border-color: #333;
        }
        .demo-card-title {
          color: #fff;
          font-weight: 600;
          font-size: 1.25rem;
          margin-bottom: 1.25rem;
        }
        .demo-card-icon {
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }
        .demo-card-description {
          color: #999;
          font-size: 0.9rem;
          line-height: 1.5;
          flex-grow: 1;
          margin-bottom: 1.5rem;
        }
        .demo-card-button {
          width: 100%;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          color: #000;
          text-align: center;
        }
        .demo-card-button-disabled {
          background: #444;
          color: #888;
        }
      `}</style>
    </section>
  );
}
