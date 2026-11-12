'use client';

import { usePathname, useRouter } from 'next/navigation';

const PSC_LIST = [
  { name: 'HTTP Outbound Service Trigger', slug: 'host', href: '/developers/psc/host' },
  { name: 'Trend', slug: 'trend' },
  { name: 'Random Number Generator', slug: 'rng' },
  { name: 'Shuffle', slug: 'shuffle' },
  { name: 'Compound Interest', slug: 'compound-interest' },
  { name: 'Passkey', slug: 'passkey' },
  { name: 'Multisig', slug: 'multisig' },
  { name: 'Merkle Proof', slug: 'merkle-proof' },
  { name: 'Content Credentials', slug: 'content-credentials' },
  { name: 'Protobuf', slug: 'protobuf' },
  { name: 'File Storage', slug: 'file-storage' },
  { name: 'Batch Balance', slug: 'batch-balance' },
  { name: 'Batch Balance Native', slug: 'batch-balance-native' },
];

export default function PSCLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // Hide PSC nav bar when in HOST section (HOST has its own nav bar)
  const isHostSection = pathname.includes('/psc/host');

  const currentSlug = pathname.split('/').pop();
  const currentPSC = PSC_LIST.find(p => p.slug === currentSlug);

  const handleChange = (e) => {
    const slug = e.target.value;
    if (slug) {
      const psc = PSC_LIST.find(p => p.slug === slug);
      router.push(psc?.href || `/developers/psc/${slug}`);
    }
  };

  if (isHostSection) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="psc-nav-bar">
        <div className="container d-flex align-items-center justify-content-between">
          <h5 className="psc-title mb-0">Protocol Smart Contract</h5>
          <div className="d-flex align-items-center gap-3">
            <span className="nav-label">Go To:</span>
            <select
            className="psc-dropdown"
            value={currentSlug}
            onChange={handleChange}
          >
            {PSC_LIST.map(psc => (
              <option key={psc.slug} value={psc.slug}>
                {psc.name}
              </option>
            ))}
            </select>
          </div>
        </div>
      </div>
      <div className="psc-content">
        {children}
      </div>

      <style jsx>{`
        .psc-nav-bar {
          background-color: #1a1a1a;
          border-bottom: 1px solid #333;
          padding: 0.75rem 0;
          position: fixed;
          top: 108px;
          left: 0;
          right: 0;
          z-index: 100;
        }
        .psc-content {
          padding-top: 60px;
        }
        .psc-title {
          color: #fff;
          font-weight: 500;
        }
        .nav-label {
          color: #888;
          font-size: 0.9rem;
        }
        .psc-dropdown {
          background-color: #111;
          color: #a1ff75;
          border: 1px solid #444;
          padding: 0.4rem 0.75rem;
          border-radius: 4px;
          font-size: 0.9rem;
          cursor: pointer;
          min-width: 180px;
        }
        .psc-dropdown:hover {
          border-color: #a1ff75;
        }
        .psc-dropdown:focus {
          outline: none;
          border-color: #a1ff75;
        }
        .psc-dropdown option {
          background-color: #111;
          color: #fff;
        }
      `}</style>
    </>
  );
}
