'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const RPC_URL = 'https://rpc.vitruveo.ai';
const DEX_URL = 'https://pancakeswap.finance/swap?inputCurrency=0xb08504D245713Ca9692C8fA605E76A0A11Ed4955&outputCurrency=0x55d398326f99059fF775485246999027B3197955';

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const copyRpc = () => {
    navigator.clipboard.writeText(RPC_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
    <nav className="navbar navbar-dark navbar-expand-lg fixed-top">
      <div className="container">
        <Link href="/" className="navbar-brand">
          <img src="/images/vitruveo-logo-horizontal.svg" alt="Vitruveo" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
          aria-expanded={mounted ? isOpen : false}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`navbar-collapse ${mounted && isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/" className="nav-link" onClick={closeMenu}>Home</Link>
            </li>
            <li className="nav-item">
              <Link href="/about" className="nav-link" onClick={closeMenu}>About</Link>
            </li>
            <li className="nav-item">
              <Link href="/host" className="nav-link" onClick={closeMenu}>HOST</Link>
            </li>
            <li className="nav-item">
              <Link href="/developers" className="nav-link" onClick={closeMenu}>Developers</Link>
            </li>
            <li className="nav-item">
              <Link href="/chat" className="nav-link" onClick={closeMenu}>AI Chat</Link>
            </li>
            <li className="nav-item ms-lg-3">
              <a
                href="https://explorer.vitruveo.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                Explorer
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div className="network-bar">
      <div className="container">
        <div className="network-bar-item">
          <span className="network-bar-label">RPC</span>
          <span className="network-bar-value">{RPC_URL}</span>
          <button type="button" className="network-bar-copy" onClick={copyRpc} aria-label="Copy RPC URL" title="Copy RPC URL">
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            )}
          </button>
        </div>
        <div className="network-bar-item">
          <span className="network-bar-label">Explorer</span>
          <a href="https://explorer.vitruveo.ai" target="_blank" rel="noopener noreferrer" className="network-bar-value">explorer.vitruveo.ai</a>
        </div>
        <div className="network-bar-item">
          <span className="network-bar-label">Chain ID</span>
          <span className="network-bar-value">1490</span>
        </div>
        <div className="network-bar-item">
          <span className="network-bar-label">Currency</span>
          <span className="network-bar-value">VTRU</span>
        </div>
        <div className="network-bar-item">
          <span className="network-bar-label">DEX</span>
          <a href={DEX_URL} target="_blank" rel="noopener noreferrer" className="network-bar-value">PancakeSwap</a>
        </div>
      </div>
    </div>
    </>
  );
}
