'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * Tabbed code examples for PSC pages.
 * tabs: [{ id, label, language, code } | { id, label, content }]
 */
export function PscCodeTabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);
  const current = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div className="mb-5">
      <ul className="nav nav-tabs mb-4">
        {tabs.map((tab) => (
          <li key={tab.id} className="nav-item">
            <button
              className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {current && (current.content ?? (
        <SyntaxHighlighter
          language={current.language}
          style={oneDark}
          customStyle={{ borderRadius: '8px', fontSize: '14px' }}
        >
          {current.code}
        </SyntaxHighlighter>
      ))}

      <style jsx>{`
        .nav-tabs {
          border-bottom: 1px solid #333;
        }
        .nav-tabs .nav-link {
          color: #888;
          border: none;
          border-bottom: 2px solid transparent;
          background: transparent;
          padding: 0.5rem 1rem;
        }
        .nav-tabs .nav-link:hover {
          color: #fff;
          border-bottom-color: #555;
        }
        .nav-tabs .nav-link.active {
          color: #a1ff75;
          border-bottom-color: #a1ff75;
          background: transparent;
        }
      `}</style>
    </div>
  );
}
