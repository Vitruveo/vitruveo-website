'use client';

import Link from 'next/link';

const HOST_DEMOS = [
  {
    slug: 'scout',
    title: 'AI Alpha Scout',
    description: 'Trigger an AI research agent from the blockchain to discover crypto projects matching your risk profile.',
    color: '#60a5fa',
  },
  {
    slug: 'sheets',
    title: 'AI Google Sheets Update',
    description: 'Log on-chain data directly to Google Sheets from your smart contract. Perfect for analytics and reporting.',
    color: '#34a853',
  },
    {
    slug: 'ntfy',
    title: 'Ntfy Alerts',
    description: 'Send push notifications to any device directly from your smart contract function.',
    color: '#4ade80',
  },
  {
    slug: 'pass',
    title: 'Mobile Wallet Pass',
    description: 'Deliver digital passes to Apple Wallet or Google Wallet, triggered by on-chain transactions.',
    color: '#a78bfa',
  },
];

// Icons for each demo
const demoIcons = {
  scout: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
      <path d="M8 14l4-6 4 6" />
    </svg>
  ),
  ntfy: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  pass: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2" />
    </svg>
  ),
  sheets: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </svg>
  ),
};

export function HostDemos({ title = "Try HOST Interactive Demos", limit = 3 }) {
  // Show first N demos (no randomization to avoid hydration mismatch)
  const displayDemos = limit >= HOST_DEMOS.length ? HOST_DEMOS : HOST_DEMOS.slice(0, limit);

  return (
    <section className="section-dark py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="text-white mb-2">{title}</h2>
            <p className="text-muted-light mb-0">
              Smart contracts calling AI agents, sending notifications, and triggering real-world actions.
            </p>
          </div>
        </div>

        <div className="row g-3 mb-4">
          {displayDemos.map((demo) => (
            <div key={demo.slug} className="col-md-6 col-lg-4">
              <Link href={`/host/${demo.slug}`} className="text-decoration-none">
                <div className="card card-dark p-3 rounded-3 h-100 host-tile" style={{ borderLeft: `3px solid ${demo.color}` }}>
                  <div className="d-flex align-items-start gap-3">
                    <div className="host-icon" style={{ color: demo.color }}>
                      {demoIcons[demo.slug]}
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="text-white mb-1">{demo.title}</h5>
                      <p className="text-muted-light small mb-0">{demo.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/host" className="btn btn-host-primer">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="me-2">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            More Demos
          </Link>
        </div>
      </div>

      <style jsx>{`
        .host-tile {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
        }
        .host-tile:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        .host-icon {
          flex-shrink: 0;
        }
      `}</style>
    </section>
  );
}
