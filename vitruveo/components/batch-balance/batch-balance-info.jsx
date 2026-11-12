'use client';

import { PSC_ADDRESSES, PSC_GAS } from '../../lib/psc-constants';

export function BatchBalanceInfo() {
  return (
    <div className="mb-5">
      <div className="d-flex flex-wrap gap-3 mb-4">
        <div className="psc-badge">
          <span className="label">Address</span>
          <code>{PSC_ADDRESSES.BATCH_BALANCE}</code>
        </div>
        <div className="psc-badge">
          <span className="label">Gas</span>
          <code>{PSC_GAS.BATCH_BALANCE.base} + {(PSC_GAS.BATCH_BALANCE.perToken / 1000)}K/token</code>
        </div>
      </div>

      <h1 className="display-5 fw-bold text-white mb-2">BatchBalance</h1>
      <p className="lead text-muted-light mb-5">Multi-Token ERC20 Balance Query</p>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">What It Does</h3>
        <p className="text-muted-light">
          Query ERC20 balances for multiple tokens in a single call.
          100 tokens = 1 call instead of 100.
        </p>
      </section>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Why It Matters</h3>
        <p className="text-muted-light">
          Portfolio dashboards, DEX aggregators, and wallets need to query many
          token balances. This reduces RPC calls and improves UX.
        </p>
      </section>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Interface</h3>
        <div className="code-block"><pre>{`Input:  owner(20) | token1(20) | token2(20) | ...
Output: uint256[] (ABI-encoded: offset | length | balance1 | balance2 | ...)

// Reverts on malformed input; a token whose balanceOf fails reads as 0`}</pre></div>
      </section>
    </div>
  );
}
