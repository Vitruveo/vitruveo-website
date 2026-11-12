'use client';

import { PSC_ADDRESSES, PSC_GAS } from '../../lib/psc-constants';

export function ContentCredentialsHeader() {
  return (
    <div className="mb-4">
      <h1 className="display-5 fw-bold text-white mb-2">Content Credentials</h1>
      <p className="text-muted-light mb-3">
        On-chain C2PA provenance verification for stored files
        <span className="ms-3 small">
          <code className="text-vtru-green">{PSC_ADDRESSES.CONTENT_CREDENTIALS}</code>
          <span className="text-white-50 ms-2">
            {PSC_GAS.CONTENT_CREDENTIALS.base.toLocaleString()} + {PSC_GAS.CONTENT_CREDENTIALS.signature.toLocaleString()}/signature
          </span>
        </span>
      </p>
    </div>
  );
}
