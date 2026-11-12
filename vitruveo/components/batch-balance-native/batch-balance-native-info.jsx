'use client';

import { PSC_ADDRESSES, PSC_GAS } from '../../lib/psc-constants';

export function BatchBalanceNativeInfo() {
  return (
    <div className="mb-5">
      <div className="d-flex flex-wrap gap-3 mb-4">
        <div className="psc-badge">
          <span className="label">Address</span>
          <code>{PSC_ADDRESSES.BATCH_BALANCE_NATIVE}</code>
        </div>
        <div className="psc-badge">
          <span className="label">Gas</span>
          <code>{PSC_GAS.BATCH_BALANCE_NATIVE.base} + {(PSC_GAS.BATCH_BALANCE_NATIVE.perToken / 1000)}K/token</code>
        </div>
      </div>

      <h1 className="display-5 fw-bold text-white mb-2">BatchBalanceNative</h1>
      <p className="lead text-muted-light mb-5">Native + ERC20 Balance Query</p>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">What It Does</h3>
        <p className="text-muted-light">
          Query native VTRU balance plus multiple ERC20 balances in one call.
          Perfect for wallet displays.
        </p>
      </section>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Why It Matters</h3>
        <p className="text-muted-light">
          Same as BatchBalance but includes the native coin balance in the response.
          One call for complete portfolio snapshot.
        </p>
      </section>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Interface</h3>
        <div className="code-block"><pre>{`Input:  owner(20) | includeNative(1) | token1(20) | token2(20) | ...
Output: uint256[] (ABI-encoded: offset | length | [nativeBalance] | balance1 | ...)

// includeNative = 0x01 to include the native balance
// Native only (no tokens): output is the raw 32-byte balance, not an array`}</pre></div>
      </section>
    </div>
  );
}
