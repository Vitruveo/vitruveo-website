'use client';

export function PasskeyInfo() {
  return (
    <div className="mb-5">
      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Why It Matters</h3>
        <p className="text-muted-light">
          Standard EVM only supports secp256k1. Verifying passkeys in Solidity: ~300,000 gas.
          This precompile: ~3,000 gas. <strong className="text-white">100x cheaper.</strong>
        </p>
      </section>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Interface</h3>
        <div className="code-block"><pre>{`Input:  hash(32) | r(32) | s(32) | x(32) | y(32) = 160 bytes
Output: uint256 (1 = valid, 0 = invalid)

// s must be low-S (s <= n/2); high-S signatures return 0`}</pre></div>
      </section>
    </div>
  );
}
