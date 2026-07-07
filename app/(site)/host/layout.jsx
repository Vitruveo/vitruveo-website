'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HostConnectButton } from '@/vitruveo/components/host/connect-button';

// Dynamic import to avoid SSR issues with WalletConnect's indexedDB usage
const WalletProvider = dynamic(
  () => import('@/vitruveo/components/wallet-provider').then(mod => mod.WalletProvider),
  { ssr: false }
);

function HostLayoutInner({ children }) {
  const pathname = usePathname();

  // Check if we're on the landing page or a demo page
  const isLandingPage = pathname === '/host';
  const isRequestPage = pathname === '/host/request';
  const isExamplePage = pathname.startsWith('/host/examples');
  const currentDemo = !isLandingPage && !isRequestPage ? pathname.split('/').pop() : null;

  const getTitle = () => {
    if (isLandingPage) return 'HOST (HTTP Outbound Service Trigger)';
    if (isRequestPage) return 'HOST Request Generator';
    if (pathname.startsWith('/host/examples/')) {
      const example = pathname.split('/').pop();
      return `HOST Example: ${example?.charAt(0).toUpperCase()}${example?.slice(1)}`;
    }
    if (pathname === '/host/examples') return 'HOST Examples';
    return `HOST Demo: ${currentDemo?.charAt(0).toUpperCase()}${currentDemo?.slice(1)}`;
  };

  return (
    <>
      <div className="host-nav-bar">
        <div className="container d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            {!isLandingPage && (
              <Link
                href="/host"
                title="Back to demos"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
            )}
            <h5 className="host-title mb-0">{getTitle()}</h5>
          </div>
          {!isExamplePage && (
            <div className="d-flex align-items-center gap-3">
              {!isRequestPage && (
                <Link
                  href="/host/request"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    background: 'rgba(161, 255, 117, 0.1)',
                    border: '1px solid rgba(161, 255, 117, 0.3)',
                    color: '#a1ff75',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                  }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Request Generator
                </Link>
              )}
              <HostConnectButton />
            </div>
          )}
        </div>
      </div>
      <div className="host-content">
        {children}
      </div>

      <style jsx>{`
        .host-nav-bar {
          background-color: #1a1a1a;
          border-bottom: 1px solid #333;
          padding: 0.75rem 0;
          position: fixed;
          top: 108px;
          left: 0;
          right: 0;
          z-index: 101;
        }
        .host-title {
          color: #fff;
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .host-title {
            font-size: 0.9rem;
          }
        }
        .host-content {
          padding-top: 60px;
        }
      `}</style>
    </>
  );
}

export default function HostLayout({ children }) {
  return (
    <WalletProvider>
      <HostLayoutInner>{children}</HostLayoutInner>
    </WalletProvider>
  );
}
