'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AddToMetaMaskButton } from './add-metamask-button';

export function SiteFooter() {
  const [input, setInput] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      router.push(`/chat?q=${encodeURIComponent(input.trim())}`);
    }
  };

  return (
    <footer className="py-5" style={{ marginTop: '300px' }}>
      <div className="container">
        <div className="row g-4">
          {/* Brand */}
          <div className="col-lg-3 col-md-6">
            <p className="text-muted-light small mb-3">
              The First Active Blockchain. Smart contracts that don't just execute—they act.
            </p>
            <div className="d-flex gap-3">
              <a href="https://twitter.com/vitruveochain" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://github.com/vitruveo" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
            <div className="mt-3">
              <AddToMetaMaskButton />
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white mb-3">Quick Links</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link href="/">Home</Link></li>
              <li className="mb-2"><Link href="/ecosystem">Ecosystem</Link></li>
            </ul>
          </div>

          {/* AI Chat */}
          <div className="col-lg-5 col-md-12">
            <h6 className="text-white mb-3">Ask Vitruveo AI</h6>
            <form onSubmit={handleSubmit}>
              <div className="footer-chat-input">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Vitruveo, PSCs, building on-chain..."
                  className="form-control"
                />
                <button type="submit" className="btn" aria-label="Send">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Bottom */}
        <div className="row mt-5 pt-4 border-top border-secondary align-items-center">
          <div className="col-md-6">
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted-light small">Powered by</span>
              <a href="https://www.verticalfnd.com" target="_blank" rel="noopener noreferrer">
                <img
                  src="/images/vertical-foundation-logo.png"
                  alt="Vertical Foundation"
                  style={{ width: '150px', height: 'auto' }}
                />
              </a>
            </div>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="text-muted-light small mb-0">
              © {new Date().getFullYear()} Vitruveo. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
