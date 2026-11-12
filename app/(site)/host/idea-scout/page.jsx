'use client';

import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  useHostDemo,
  buildPayload,
  HostDemoStatus,
  HostDemoButton,
} from '@/vitruveo/components/host';
import { HostConnectButton } from '@/vitruveo/components/host/connect-button';
import { useAccount } from 'wagmi';

const N8N_WEBHOOK_URL = 'https://vitruveo.app.n8n.cloud/webhook/idea-scout';
const MIN_CONTENT_LENGTH = 200;
const MAX_CONTENT_LENGTH = 10000;

function EditorToolbar({ editor }) {
  if (!editor) return null;

  return (
    <div className="editor-toolbar">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'active' : ''}
        title="Bold"
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'active' : ''}
        title="Italic"
      >
        <em>I</em>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
        title="Heading"
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}
        title="Subheading"
      >
        H3
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'active' : ''}
        title="Bullet List"
      >
        •
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'active' : ''}
        title="Numbered List"
      >
        1.
      </button>
    </div>
  );
}

export default function AIIdeaScoutPage() {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const { address } = useAccount();
  const { isConnected, isSubmitting, txStatus, txHash, submit, reset } = useHostDemo();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Describe your business idea...\n\n• What problem does it solve?\n• How does it use HOST on Vitruveo?\n• Who is the target market?\n• What is your go-to-market strategy?',
      }),
    ],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'idea-editor-content',
      },
    },
  });

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const getContentLength = () => {
    if (!editor) return 0;
    return editor.getText().length;
  };

  const isContentValid = () => {
    const len = getContentLength();
    return len >= MIN_CONTENT_LENGTH && len <= MAX_CONTENT_LENGTH;
  };

  const handleSubmit = async () => {
    reset();
    setValidationError(null);

    const contentLength = getContentLength();
    if (contentLength < MIN_CONTENT_LENGTH) {
      setValidationError(`Please write at least ${MIN_CONTENT_LENGTH} characters (currently ${contentLength})`);
      return;
    }
    if (contentLength > MAX_CONTENT_LENGTH) {
      setValidationError(`Content must be under ${MAX_CONTENT_LENGTH} characters (currently ${contentLength})`);
      return;
    }
    if (!isValidEmail(email)) {
      setValidationError('Please enter a valid email address');
      return;
    }
    if (!agreed) {
      setValidationError('Please agree to the terms');
      return;
    }
    if (!address) {
      setValidationError('Please connect your wallet');
      return;
    }

    const content = editor.getHTML();
    const plainText = editor.getText();

    const bodyTemplate = JSON.stringify({
      walletAddress: '$1',
      email: '$2',
      content: '$3',
      plainText: '$4',
      timestamp: Date.now(),
    });

    const payload = await buildPayload({
      url: N8N_WEBHOOK_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      bodyTemplate: bodyTemplate,
      // JSON-escape free text: values are substituted into the JSON template as-is
      bodyValues: [address, email, JSON.stringify(content).slice(1, -1), JSON.stringify(plainText).slice(1, -1)],
    });

    const txResult = await submit(payload);
    if (txResult) {
      editor.commands.clearContent();
      setEmail('');
      setAgreed(false);
    }
  };

  return (
    <section className="section-dark py-5">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-5">
              <div className="demo-icon mb-4">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.5">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h1 className="text-white mb-3">AI Idea Scout</h1>
              <p className="text-muted-light lead">
                Submit a business plan that leverages HOST on Vitruveo. Our AI evaluates your concept and awards VTRU based on viability. No building required—just a solid plan.
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
                  <li><strong>Grant Application Scoring</strong> — When a grant proposal is submitted on-chain, AI evaluates and scores it instantly</li>
                  <li><strong>Hackathon Submission Review</strong> — When a project is submitted, AI provides initial scoring and feedback</li>
                  <li><strong>Proposal Quality Gates</strong> — When a DAO proposal is created, AI assesses viability before it goes to vote</li>
                  <li><strong>Bug Bounty Validation</strong> — When a vulnerability report is submitted, AI triages severity and validity</li>
                  <li><strong>Content Moderation</strong> — When user content is posted on-chain, AI reviews for policy compliance</li>
                </ul>
              </div>
            </details>

            <div className="demo-card">
              {/* Fund Info */}
              <div className="fund-info mb-4">
                <div className="row text-center">
                  <div className="col-6">
                    <div className="fund-stat">
                      <span className="fund-value">250,000</span>
                      <span className="fund-label">VTRU Fund</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="fund-stat">
                      <span className="fund-value">10,000</span>
                      <span className="fund-label">Max Award</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="step-section">
                <div className="step-header">
                  <span className="step-number">1</span>
                  <h3>Describe Your Idea</h3>
                </div>
                <p className="text-muted-light mb-3">
                  Explain your business concept that uses HOST. Include the problem you're solving, target market, competitive advantage, and go-to-market strategy.
                </p>
                <div className="idea-editor">
                  <EditorToolbar editor={editor} />
                  <EditorContent editor={editor} />
                </div>
                <div className="d-flex align-items-center justify-content-between mt-2">
                  <div className="d-flex align-items-center gap-3">
                    <span className="encrypt-badge">Encrypted</span>
                    <small className="text-muted">Your idea is encrypted on-chain</small>
                  </div>
                  <small className={`char-count ${isContentValid() ? 'valid' : ''}`}>
                    {getContentLength()} / {MAX_CONTENT_LENGTH}
                  </small>
                </div>
              </div>

              <div className="step-section">
                <div className="step-header">
                  <span className="step-number">2</span>
                  <h3>Your Email</h3>
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
                  <small className="text-muted">Results delivered here</small>
                </div>
              </div>

              <div className="step-section">
                <div className="step-header">
                  <span className="step-number">3</span>
                  <h3>Terms</h3>
                </div>
                <div className="terms-box">
                  <label className="terms-checkbox">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    <span className="terms-text">
                      I understand that Vitruveo does not acquire any ownership or interest in my idea.
                      By submitting, I grant Vitruveo the right to publicly publish winning entries
                      and the VTRU amounts awarded.
                    </span>
                  </label>
                </div>
              </div>

              <div className="step-section">
                <div className="step-header">
                  <span className="step-number">4</span>
                  <h3>Submit for Evaluation</h3>
                </div>
                <p className="text-muted-light mb-3">
                  Connect your wallet to receive VTRU if your idea scores well. The AI will analyze your concept and determine the award amount (0-10,000 VTRU).
                </p>

                <div className="d-flex flex-column flex-sm-row gap-3 align-items-start">
                  <HostConnectButton />
                  <HostDemoButton
                    onClick={handleSubmit}
                    isSubmitting={isSubmitting}
                    isConnected={isConnected}
                    disabled={!isContentValid() || !isValidEmail(email) || !agreed}
                  >
                    Submit Idea
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

      <style jsx global>{`
        .idea-editor {
          background: #1a1a1a;
          border: 1px solid #444;
          border-radius: 8px;
          overflow: hidden;
        }
        .editor-toolbar {
          display: flex;
          gap: 4px;
          padding: 8px;
          border-bottom: 1px solid #333;
          background: #222;
        }
        .editor-toolbar button {
          background: transparent;
          border: 1px solid #444;
          color: #999;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }
        .editor-toolbar button:hover {
          background: #333;
          color: #fff;
        }
        .editor-toolbar button.active {
          background: #fbbf24;
          border-color: #fbbf24;
          color: #000;
        }
        .idea-editor-content {
          min-height: 300px;
          padding: 1rem;
          color: #fff;
          outline: none;
        }
        .idea-editor-content p {
          margin-bottom: 0.75rem;
        }
        .idea-editor-content h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #fbbf24;
        }
        .idea-editor-content h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #ddd;
        }
        .idea-editor-content ul,
        .idea-editor-content ol {
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .idea-editor-content p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #666;
          pointer-events: none;
          float: left;
          height: 0;
          white-space: pre-wrap;
        }
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #666;
          pointer-events: none;
          float: left;
          height: 0;
          white-space: pre-wrap;
        }
      `}</style>

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
        .fund-info {
          background: rgba(251, 191, 36, 0.1);
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
        }
        .fund-stat {
          display: flex;
          flex-direction: column;
        }
        .fund-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #fbbf24;
        }
        .fund-label {
          font-size: 0.875rem;
          color: #888;
        }
        .step-section {
          padding: 1.5rem 0;
          border-bottom: 1px solid #333;
        }
        .step-section:last-child {
          border-bottom: none;
          padding-bottom: 0;
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
          background: #fbbf24;
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
        .terms-box {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 1rem;
        }
        .terms-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          cursor: pointer;
        }
        .terms-checkbox input {
          display: none;
        }
        .checkmark {
          width: 20px;
          height: 20px;
          border: 2px solid #444;
          border-radius: 4px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          margin-top: 2px;
        }
        .terms-checkbox input:checked + .checkmark {
          background: #fbbf24;
          border-color: #fbbf24;
        }
        .terms-checkbox input:checked + .checkmark::after {
          content: '✓';
          color: #000;
          font-weight: bold;
          font-size: 14px;
        }
        .terms-text {
          color: #999;
          font-size: 0.9rem;
          line-height: 1.5;
        }
        .encrypt-badge {
          background: rgba(251, 191, 36, 0.2);
          color: #fbbf24;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .char-count {
          color: #666;
          font-size: 0.85rem;
        }
        .char-count.valid {
          color: #4ade80;
        }
        .form-control.bg-dark {
          border-color: #444;
        }
        .form-control.bg-dark:focus {
          border-color: #fbbf24;
          box-shadow: 0 0 0 0.2rem rgba(251, 191, 36, 0.25);
        }
        .form-control.bg-dark::placeholder {
          color: #666;
        }
        .use-cases-section {
          background: rgba(251, 191, 36, 0.05);
          border: 1px solid rgba(251, 191, 36, 0.2);
          border-radius: 12px;
          overflow: hidden;
        }
        .use-cases-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          cursor: pointer;
          color: #fbbf24;
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
