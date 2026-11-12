'use client';

import { PSC_ADDRESSES, PSC_GAS } from '../../lib/psc-constants';

export function ContentCredentialsInfo() {
  const g = PSC_GAS.CONTENT_CREDENTIALS;
  return (
    <div className="mb-5">
      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Why It Matters</h3>
        <p className="text-muted-light">
          C2PA Content Credentials record who created or edited a piece of media and how. This
          precompile verifies a C2PA manifest store on chain against an on-chain trust list and
          records the result for a file in{' '}
          <a href="/developers/psc/file-storage" className="text-vtru-green">File Storage</a>{' '}
          ({PSC_ADDRESSES.FILE_STORE}). Any contract can then read the provenance and lineage of
          an artwork.
        </p>
      </section>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Flow</h3>
        <p className="text-muted-light">For an artwork with embedded Content Credentials (JPEG or PNG):</p>
        <ol className="text-muted-light">
          <li>
            Upload it with <code>IFileStore.beginWithCredential</code>, passing the byte range of
            the embedded manifest store as the exclusion. The file store computes the content hash
            (file without that range) during upload.
          </li>
          <li>
            Send <code>verify(fileHash, manifestStore)</code> as a direct transaction (calldata costs
            2 gas per byte). It checks every claim signature, assertion hash and ingredient link,
            that the active signer chains to a trust anchor with all certificates valid and unrevoked
            at the block time, and that the manifest&apos;s data hash equals the file&apos;s content
            hash. The result is stored.
          </li>
          <li>Contracts read <code>provenance(fileHash)</code> / <code>lineage(fileHash)</code>.</li>
        </ol>
        <p className="text-muted-light">
          <code>check(manifestStore)</code> verifies a manifest store without a stored file and
          without recording anything. <code>provenance()</code> returns <code>valid = false</code>{' '}
          if a certificate on the recorded path was later revoked effective at or before the
          verification time, or the anchor was removed.
        </p>
      </section>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Supported</h3>
        <ul className="text-muted-light">
          <li>COSE ES256/384/512, PS256/384/512, EdDSA</li>
          <li>Claim v1 and v2</li>
          <li><code>c2pa.hash.data</code> bindings with SHA-256</li>
          <li>
            Not supported yet: <code>hash.bmff</code> (MP4/HEIC) and timestamp-authority tokens
            (certificates are checked at block time)
          </li>
        </ul>
      </section>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Trust List</h3>
        <p className="text-muted-light">
          The trust list (anchor certificates and revocations) is changed only by the admin,
          initially a 2-of-2{' '}
          <a href="/developers/psc/multisig" className="text-vtru-green">native multisig</a> wallet
          created by <code>setupAdmin()</code> (anyone can call it once; owners are fixed in the
          node). Admin calls go through <code>IMultisig.execute</code> with this precompile as the
          target. The admin can hand control to another address with <code>setAdmin()</code>.
          Fingerprints are the SHA-256 of the DER certificate.
        </p>
        <p className="text-muted-light">
          On mainnet the admin is the 2-of-2 multisig{' '}
          <code>0x71db0c3Df067C0f0b4a81119b1D239BdCa7c94ca</code>, and the trust list holds one anchor:
          the Vitruveo Content Credentials Root CA (fingerprint{' '}
          <code className="text-break">0x66e2bfd431681a9a42d5f8a4a06e7656006bc383db81b7f7d435e49a38c5ab49</code>).
          Manifests signed with the Vitruveo signer certificate (ES256, issued by that root) pass{' '}
          <code>check()</code> and <code>verify()</code>. Manifests signed with any other certificate,
          including c2patool&apos;s built-in test certificate, revert with &quot;signer not trusted&quot;.
          The root and signer certificates are published in the protocol repository under{' '}
          <a href="https://github.com/Vitruveo/vitruveo-protocol/tree/Latest/contracts/c2pa/certs" target="_blank" rel="noopener noreferrer" className="text-vtru-green">contracts/c2pa/certs</a>.
        </p>
      </section>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Gas</h3>
        <div className="code-block"><pre>{`Every call                       ${g.base.toLocaleString()} + ${g.perByte}/byte of input
Hashing beyond the input         ${g.hash} per 32 bytes
Signature checked                ${g.signature.toLocaleString()} (claims and certificates)
Storage slot written             ${g.write.toLocaleString()}
View                             ${g.read.toLocaleString()}`}</pre></div>
      </section>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Interface</h3>
        <div className="code-block"><pre>{`interface IContentCredentials {
    event AdminChanged(address indexed admin);
    event AnchorAdded(bytes32 indexed fingerprint);
    event AnchorRemoved(bytes32 indexed fingerprint);
    event Revoked(bytes32 indexed fingerprint, uint256 effectiveTime);
    event Unrevoked(bytes32 indexed fingerprint);
    event ProvenanceVerified(bytes32 indexed fileHash, bytes32 indexed signer, bytes32 anchor);

    // Admin
    function setupAdmin() external returns (address wallet);
    function admin() external view returns (address);
    function setAdmin(address newAdmin) external returns (bool);
    function addAnchor(bytes calldata derCertificate) external returns (bytes32 fingerprint);
    function removeAnchor(bytes32 fingerprint) external returns (bool);
    function revoke(bytes32 fingerprint, uint256 effectiveTime) external returns (bool);
    function unrevoke(bytes32 fingerprint) external returns (bool);
    function isAnchor(bytes32 fingerprint) external view returns (bool);
    function revokedAt(bytes32 fingerprint) external view returns (bool revoked, uint256 effectiveTime);

    // Verification
    function verify(bytes32 fileHash, bytes calldata manifestStore) external
        returns (bytes32 signer, bytes32 anchor, string memory signerName, string memory claimGenerator, uint256 manifests);
    function check(bytes calldata manifestStore) external view
        returns (bytes32 signer, bytes32 anchor, string memory signerName, string memory claimGenerator,
                 uint256 manifests, bytes32 dataHash, uint256[] memory exclusionStart, uint256[] memory exclusionLength);
    function provenance(bytes32 fileHash) external view
        returns (bool valid, bytes32 signer, bytes32 anchor, string memory signerName, string memory claimGenerator,
                 uint256 manifests, uint256 blockNumber, address verifiedBy);
    function lineage(bytes32 fileHash) external view returns (bytes32[] memory signers);
}`}</pre></div>
        <p className="text-muted-light small mt-2">
          Source: <code>contracts/c2pa/IContentCredentials.sol</code> in the Vitruveo protocol repository.
        </p>
      </section>
    </div>
  );
}
