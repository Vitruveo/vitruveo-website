'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const RPC_URL = 'https://rpc.vitruveo.ai';
const VITRUVEO_CHAIN = {
  chainId: '0x5d2',
  chainName: 'Vitruveo',
  nativeCurrency: { name: 'VTRU', symbol: 'VTRU', decimals: 18 },
  rpcUrls: [RPC_URL],
  blockExplorerUrls: ['https://explorer.vitruveo.ai'],
};

function getMetaMask() {
  if (typeof window === 'undefined' || !window.ethereum) return null;
  const { ethereum } = window;
  if (Array.isArray(ethereum.providers)) {
    return ethereum.providers.find((p) => p.isMetaMask) || ethereum.providers[0];
  }
  return ethereum;
}

const DEX_URL = 'https://pancakeswap.finance/swap?inputCurrency=0xb08504D245713Ca9692C8fA605E76A0A11Ed4955&outputCurrency=0x55d398326f99059fF775485246999027B3197955';

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [walletStatus, setWalletStatus] = useState('idle');

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

  const addToMetaMask = async () => {
    const provider = getMetaMask();
    if (!provider) {
      window.open('https://metamask.io/download/', '_blank', 'noopener,noreferrer');
      return;
    }
    setWalletStatus('pending');
    try {
      await provider.request({ method: 'eth_requestAccounts' });
      try {
        await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: VITRUVEO_CHAIN.chainId }] });
      } catch (err) {
        if (err?.code !== 4902 && err?.data?.originalError?.code !== 4902) throw err;
        await provider.request({ method: 'wallet_addEthereumChain', params: [VITRUVEO_CHAIN] });
      }
      setWalletStatus('done');
    } catch {
      setWalletStatus('error');
    }
    setTimeout(() => setWalletStatus('idle'), 2500);
  };

  const walletLabel = {
    idle: 'Connect MetaMask',
    pending: 'Check MetaMask…',
    done: 'Connected to Vitruveo',
    error: 'Not connected',
  }[walletStatus];

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
            <li className="nav-item nav-dropdown">
              <Link href="/ecosystem" className="nav-link" onClick={closeMenu}>Ecosystem</Link>
              <ul className="nav-dropdown-menu">
                <li><Link href="/ecosystem" className="nav-link" onClick={closeMenu}>Projects</Link></li>
                <li><Link href="/ecosystem/brands" className="nav-link" onClick={closeMenu}>Brands</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link href="/developers" className="nav-link" onClick={closeMenu}>Developers</Link>
            </li>
            <li className="nav-item">
              <Link href="/host" className="nav-link" onClick={closeMenu}>HOST</Link>
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
        <div className="network-bar-item">
          <button
            type="button"
            className={`network-bar-wallet ${walletStatus}`}
            onClick={addToMetaMask}
            disabled={walletStatus === 'pending'}
            title="Add the Vitruveo network to MetaMask and switch to it"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 7H5a2 2 0 0 1 0-4h13v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h15V7" />
              <path d="M16 14h.01" />
            </svg>
            {walletLabel}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
