'use client';

export function MerkleProofInfo() {
  return (
    <div className="mb-5">
      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Why It Matters</h3>
        <p className="text-muted-light">
          Whitelists, airdrops, and state proofs all use Merkle trees. This precompile
          is faster and cheaper than the Solidity implementation.
        </p>
      </section>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Interface</h3>
        <div className="code-block"><pre>{`Input:  root(32) | leaf(32) | proof[0](32) | proof[1](32) | ...
Output: uint256 1 (32 bytes) if valid; empty if invalid or malformed`}</pre></div>
      </section>
    </div>
  );
}
