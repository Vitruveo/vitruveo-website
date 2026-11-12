'use client';

import { PSC_ADDRESSES, PSC_GAS } from '../../lib/psc-constants';

export function MultisigHeader() {
  return (
    <div className="mb-4">
      <h1 className="display-5 fw-bold text-white mb-2">Multisig</h1>
      <p className="text-muted-light mb-3">
        Native threshold wallets with EOA and passkey owners
        <span className="ms-3 small">
          <code className="text-vtru-green">{PSC_ADDRESSES.MULTISIG}</code>
          <span className="text-white-50 ms-2">~{PSC_GAS.MULTISIG.create.toLocaleString()}+ gas to create</span>
        </span>
      </p>
    </div>
  );
}
