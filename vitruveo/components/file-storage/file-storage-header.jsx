'use client';

import { PSC_ADDRESSES, PSC_GAS } from '../../lib/psc-constants';

export function FileStorageHeader() {
  return (
    <div className="mb-4">
      <h1 className="display-5 fw-bold text-white mb-2">File Storage</h1>
      <p className="text-muted-light mb-3">
        On-chain files up to 10 MB, served over HTTP
        <span className="ms-3 small">
          <code className="text-vtru-green">{PSC_ADDRESSES.FILE_STORE}</code>
          <span className="text-white-50 ms-2">{PSC_GAS.FILE_STORE.calldataByte} gas/byte of calldata</span>
        </span>
      </p>
    </div>
  );
}
