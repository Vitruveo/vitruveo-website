'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { PSC_ADDRESSES, NETWORK_CONFIG } from '../../lib/psc-constants';

const EXPLORER_URL = 'https://explorer.vitruveo.ai';


export function ShuffleExample() {
  const [activeTab, setActiveTab] = useState('demo');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [txDetails, setTxDetails] = useState(null);

  const handleShuffle = async () => {
    setLoading(true);
    setError(null);
    setTxHash(null);
    setTxDetails(null);

    try {
      const response = await fetch('/api/psc/shuffle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      const json = await response.json();

      if (!json.success) {
        throw new Error(json.error || 'Shuffle failed');
      }

      setCards(json.cards);
      setTxHash(json.txHash);
      setTxDetails({
        gasUsed: json.gasUsed,
        blockNumber: json.blockNumber
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const codeSnippet = `// Shuffle a 52-card deck using Vitruveo PSC
const RPC = '${NETWORK_CONFIG.rpc}';
const SHUFFLE_ADDRESS = '${PSC_ADDRESSES.SHUFFLE}';

// Call the Shuffle precompile
const response = await fetch(RPC, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_call',
    params: [{ to: SHUFFLE_ADDRESS, data: '0x' }, 'latest']
  })
});

const { result } = await response.json();

// Parse 104 bytes into 52 cards (2 ASCII chars each)
const cards = [];
const hex = result.slice(2); // remove 0x
for (let i = 0; i < hex.length; i += 4) {
  const suit = String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
  const rank = String.fromCharCode(parseInt(hex.slice(i + 2, i + 4), 16));
  cards.push(suit + rank); // e.g., "SA", "H7", "CQ"
}

console.log(cards); // ["SA", "H7", "CQ", ...]`;

  const soliditySnippet = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CardGame {
    address constant SHUFFLE_PSC = ${PSC_ADDRESSES.SHUFFLE};

    /// @notice Get a shuffled 52-card deck
    /// @param salt Random bytes for shuffle entropy
    /// @return deck 104 bytes representing 52 cards (2 bytes each)
    function getShuffledDeck(bytes memory salt) public view returns (bytes memory deck) {
        (bool success, bytes memory result) = SHUFFLE_PSC.staticcall(salt);
        require(success, "Shuffle failed");
        return result;
    }

    /// @notice Deal cards to players
    /// @param numPlayers Number of players
    /// @param cardsPerPlayer Cards per player
    function dealCards(uint8 numPlayers, uint8 cardsPerPlayer)
        public
        view
        returns (bytes[] memory hands)
    {
        bytes memory deck = getShuffledDeck(abi.encodePacked(msg.sender)); // no PREVRANDAO on Vitruveo
        hands = new bytes[](numPlayers);

        for (uint8 p = 0; p < numPlayers; p++) {
            hands[p] = new bytes(cardsPerPlayer * 2);
            for (uint8 c = 0; c < cardsPerPlayer; c++) {
                uint256 idx = (p * cardsPerPlayer + c) * 2;
                hands[p][c * 2] = deck[idx];         // Suit
                hands[p][c * 2 + 1] = deck[idx + 1]; // Rank
            }
        }
    }
}`;

  return (
    <div className="mb-5">
      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'demo' ? 'active' : ''}`}
            onClick={() => setActiveTab('demo')}
          >
            Demo
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'client' ? 'active' : ''}`}
            onClick={() => setActiveTab('client')}
          >
            Client Code
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'solidity' ? 'active' : ''}`}
            onClick={() => setActiveTab('solidity')}
          >
            Smart Contract
          </button>
        </li>
      </ul>

      {/* Demo Tab */}
      {activeTab === 'demo' && (
        <div>
          <div className="d-flex align-items-center gap-3 mb-4">
            <button
              className="btn btn-primary"
              onClick={handleShuffle}
              disabled={loading}
            >
              {loading ? 'Shuffling...' : 'Shuffle Deck'}
            </button>
            {loading && (
              <span className="text-muted-light small">
                Sending transaction to Vitruveo...
              </span>
            )}
          </div>

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {(txHash || txDetails) && (
            <div className="tx-info mb-4">
              {txHash ? (
              <div className="tx-hash">
                <span className="label">Transaction:</span>
                <a
                  href={`${EXPLORER_URL}/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hash-link"
                >
                  {txHash.slice(0, 10)}...{txHash.slice(-8)}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                  </svg>
                </a>
              </div>
              ) : (
              <div className="tx-hash">
                <span className="label">Read-only call (eth_call) on mainnet. Nothing was written on-chain.</span>
              </div>
              )}
              {txDetails && (
                <div className="tx-details">
                  <span>Block: {txDetails.blockNumber}</span>
                  <span>{txHash ? 'Gas' : 'Gas (estimate)'}: {Number(txDetails.gasUsed).toLocaleString()}</span>
                </div>
              )}
            </div>
          )}

          <div className="card-grid">
            {cards.map((card, idx) => (
              <div key={idx} className="playing-card">
                <img
                  src={`/vitruveo/images/cards/${card}.svg`}
                  alt={card}
                  title={card}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Client Code Tab */}
      {activeTab === 'client' && (
        <SyntaxHighlighter
          language="javascript"
          style={oneDark}
          customStyle={{ borderRadius: '8px', fontSize: '14px' }}
        >
          {codeSnippet}
        </SyntaxHighlighter>
      )}

      {/* Smart Contract Tab */}
      {activeTab === 'solidity' && (
        <SyntaxHighlighter
          language="solidity"
          style={oneDark}
          customStyle={{ borderRadius: '8px', fontSize: '14px' }}
        >
          {soliditySnippet}
        </SyntaxHighlighter>
      )}

      <style jsx>{`
        .card-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          min-height: 200px;
          margin-bottom: 3rem;
        }
        .playing-card {
          width: 60px;
        }
        .playing-card img {
          width: 100%;
          height: auto;
          border-radius: 3px;
        }
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
        .tx-info {
          background: rgba(161, 255, 117, 0.1);
          border: 1px solid rgba(161, 255, 117, 0.3);
          border-radius: 8px;
          padding: 1rem;
        }
        .tx-hash {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .tx-hash .label {
          color: #888;
          font-size: 0.9rem;
        }
        .hash-link {
          color: #a1ff75;
          text-decoration: none;
          font-family: monospace;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .hash-link:hover {
          color: #fff;
          text-decoration: underline;
        }
        .tx-details {
          display: flex;
          gap: 1.5rem;
          font-size: 0.85rem;
          color: #888;
        }
      `}</style>
    </div>
  );
}
