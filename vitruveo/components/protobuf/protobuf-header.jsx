'use client';

import { PSC_ADDRESSES, PSC_GAS } from '../../lib/psc-constants';

export function ProtobufHeader() {
  return (
    <div className="mb-4">
      <h1 className="display-5 fw-bold text-white mb-2">Protobuf</h1>
      <p className="text-muted-light mb-3">
        Protobuf wire codec and on-chain message storage
        <span className="ms-3 small">
          <code className="text-vtru-green">{PSC_ADDRESSES.PROTOBUF}</code>
          <span className="text-white-50 ms-2">
            {PSC_GAS.PROTOBUF.base} + {PSC_GAS.PROTOBUF.storeByte} gas/byte stored
          </span>
        </span>
      </p>
    </div>
  );
}
