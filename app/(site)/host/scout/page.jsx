'use client';

import { useState } from 'react';
import {
  useHostDemo,
  buildPayload,
  HostDemoStatus,
  HostDemoButton,
} from '@/vitruveo/components/host';
import { HostConnectButton } from '@/vitruveo/components/host/connect-button';

const N8N_WEBHOOK_URL = 'https://vitruveo.app.n8n.cloud/webhook/ai-scout';

const RISK_PROFILES = [
  {
    id: 'conservative',
    label: 'Conservative',
    description: 'Established projects with proven track records. Lower risk, steady growth.',
    color: '#4ade80',
  },
  {
    id: 'moderate',
    label: 'Moderate',
    description: 'Mix of established and emerging projects. Balanced risk and reward.',
    color: '#fbbf24',
  },
  {
    id: 'aggressive',
    label: 'Aggressive',
    description: 'Early-stage projects with high potential. Higher risk, higher reward.',
    color: '#f87171',
  },
];

export default function AIScoutDemoPage() {
  const [riskProfile, setRiskProfile] = useState('');
  const [email, setEmail] = useState('');
  const [pastProjects, setPastProjects] = useState('');
  const [validationError, setValidationError] = useState(null);

  const { isConnected, isSubmitting, txStatus, txHash, submit, reset } = useHostDemo();

  const selectedProfile = RISK_PROFILES.find(p => p.id === riskProfile);

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async () => {
    reset();
    setValidationError(null);

    if (!riskProfile) {
      setValidationError('Please select a risk profile');
      return;
    }
    if (!isValidEmail(email)) {
      setValidationError('Please enter a valid email address');
      return;
    }

    const bodyTemplate = JSON.stringify({
      riskProfile: '$1',
      email: '$2',
      pastProjects: '$3',
      timestamp: Date.now(),
    });

    const payload = await buildPayload({
      url: N8N_WEBHOOK_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      bodyTemplate: bodyTemplate,
      // JSON-escape free text: values are substituted into the JSON template as-is
      bodyValues: [riskProfile, email, JSON.stringify(pastProjects.trim() || 'none specified').slice(1, -1)],
    });

    const result = await submit(payload);
    if (result) {
      setRiskProfile('');
      setEmail('');
      setPastProjects('');
    }
  };

  return (
    <section className="section-dark py-5">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-5">
              <div className="demo-icon mb-4">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                  <path d="M8 12l4-8 4 8" />
                  <path d="M9 18l3-2 3 2" />
                </svg>
              </div>
              <h1 className="text-white mb-3">AI Alpha Scout</h1>
              <p className="text-muted-light lead">
                Trigger an AI research agent from the blockchain to discover crypto projects matching your risk profile.
              </p>
            </div>

            <details className="use-cases-section mb-4">
              <summary className="use-cases-toggle">
                <span>Web3 Use-cases</span>
                <svg className="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="use-cases-content">
                <ul>
                  <li><strong>Stake-Triggered Research</strong> — When users stake tokens, AI analyzes their portfolio and emails personalized insights</li>
                  <li><strong>DAO Investment Due Diligence</strong> — When a treasury proposal passes, AI researches the target and reports to voters</li>
                  <li><strong>NFT Mint Intelligence</strong> — When minting from a collection, AI researches the project and sends a report to the buyer</li>
                  <li><strong>Loan Risk Assessment</strong> — When a DeFi loan is created, AI evaluates collateral risk and notifies the lender</li>
                  <li><strong>Token Launch Analysis</strong> — When someone participates in an IDO, AI researches the project and delivers findings</li>
                </ul>
              </div>
            </details>

            <div className="demo-card">
              <div className="step-section">
                <div className="step-header">
                  <span className="step-number">1</span>
                  <h3>Select Your Risk Profile</h3>
                </div>
                <div className="risk-profiles">
                  {RISK_PROFILES.map((profile) => (
                    <button
                      key={profile.id}
                      className={`risk-profile-btn ${riskProfile === profile.id ? 'active' : ''}`}
                      onClick={() => setRiskProfile(profile.id)}
                      style={{
                        '--profile-color': profile.color,
                        borderColor: riskProfile === profile.id ? profile.color : '#444',
                      }}
                    >
                      <div className="risk-profile-header">
                        <span className="risk-profile-indicator" style={{ backgroundColor: profile.color }} />
                        <span className="risk-profile-label">{profile.label}</span>
                      </div>
                      <p className="risk-profile-desc">{profile.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="step-section">
                <div className="step-header">
                  <span className="step-number">2</span>
                  <h3>Projects You've Liked <span className="optional-tag">Optional</span></h3>
                </div>
                <textarea
                  className="form-control bg-dark text-white"
                  placeholder="e.g., Ethereum, Solana, Uniswap, Aave..."
                  value={pastProjects}
                  onChange={(e) => setPastProjects(e.target.value)}
                  rows={2}
                  maxLength={200}
                />
                <div className="d-flex align-items-center gap-3 mt-2">
                  <span className="encrypt-badge">Encrypted</span>
                  <small className="text-muted">Helps AI find similar projects ({pastProjects.length}/200)</small>
                </div>
              </div>

              <div className="step-section">
                <div className="step-header">
                  <span className="step-number">3</span>
                  <h3>Enter Your Email</h3>
                </div>
                <input
                  type="email"
                  className="form-control form-control-lg bg-dark text-white"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="d-flex align-items-center gap-3 mt-2">
                  <span className="encrypt-badge">Encrypted</span>
                  <small className="text-muted">AI recommendations delivered here</small>
                </div>
              </div>

              <div className="step-section">
                <div className="step-header">
                  <span className="step-number">4</span>
                  <h3>Deploy Your Scout</h3>
                </div>
                <p className="text-muted-light mb-3">
                  Connect your wallet and submit a transaction. An AI agent will research the market and deliver personalized project recommendations to your email.
                </p>

                <div className="d-flex flex-column flex-sm-row gap-3 align-items-start">
                  <HostConnectButton />
                  <HostDemoButton
                    onClick={handleSubmit}
                    isSubmitting={isSubmitting}
                    isConnected={isConnected}
                    disabled={!riskProfile || !isValidEmail(email)}
                  >
                    Launch Scout
                  </HostDemoButton>
                </div>

                {validationError && (
                  <div className="alert alert-danger mt-3">{validationError}</div>
                )}

                <HostDemoStatus status={txStatus} txHash={txHash} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .demo-icon {
          display: flex;
          justify-content: center;
        }
        .demo-card {
          background: linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid #333;
        }
        .step-section {
          padding: 1.5rem 0;
          border-bottom: 1px solid #333;
        }
        .step-section:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .step-section:first-child {
          padding-top: 0;
        }
        .step-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .step-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #60a5fa;
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1rem;
          flex-shrink: 0;
        }
        .step-header h3 {
          margin: 0;
          color: #fff;
          font-size: 1.25rem;
          font-weight: 600;
        }
        .optional-tag {
          font-size: 0.75rem;
          font-weight: 400;
          color: #666;
          margin-left: 0.5rem;
        }
        .risk-profiles {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .risk-profile-btn {
          background: #1a1a1a;
          border: 2px solid #444;
          border-radius: 12px;
          padding: 1rem 1.25rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .risk-profile-btn:hover {
          border-color: #666;
          background: #222;
        }
        .risk-profile-btn.active {
          background: rgba(96, 165, 250, 0.1);
        }
        .risk-profile-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .risk-profile-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .risk-profile-label {
          color: #fff;
          font-weight: 600;
          font-size: 1.1rem;
        }
        .risk-profile-desc {
          color: #888;
          font-size: 0.9rem;
          margin: 0;
          line-height: 1.4;
        }
        .form-control.bg-dark {
          border-color: #444;
        }
        .form-control.bg-dark:focus {
          border-color: #60a5fa;
          box-shadow: 0 0 0 0.2rem rgba(96, 165, 250, 0.25);
        }
        .form-control.bg-dark::placeholder {
          color: #666;
        }
        .encrypt-badge {
          background: rgba(96, 165, 250, 0.2);
          color: #60a5fa;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .use-cases-section {
          background: rgba(96, 165, 250, 0.05);
          border: 1px solid rgba(96, 165, 250, 0.2);
          border-radius: 12px;
          overflow: hidden;
        }
        .use-cases-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          cursor: pointer;
          color: #60a5fa;
          font-weight: 600;
          font-size: 0.95rem;
          list-style: none;
        }
        .use-cases-toggle::-webkit-details-marker {
          display: none;
        }
        .use-cases-toggle .chevron {
          transition: transform 0.2s ease;
        }
        .use-cases-section[open] .use-cases-toggle .chevron {
          transform: rotate(180deg);
        }
        .use-cases-content {
          padding: 0 1.25rem 1.25rem;
          color: #999;
          font-size: 0.9rem;
          line-height: 1.6;
        }
        .use-cases-content ul {
          margin: 0;
          padding-left: 1.25rem;
        }
        .use-cases-content li {
          margin-bottom: 0.5rem;
        }
        .use-cases-content li:last-child {
          margin-bottom: 0;
        }
        .use-cases-content strong {
          color: #ccc;
        }
      `}</style>
    </section>
  );
}
