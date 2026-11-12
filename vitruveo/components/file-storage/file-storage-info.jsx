'use client';

import { PSC_ADDRESSES, PSC_GAS, FILE_GATEWAY_URL } from '../../lib/psc-constants';

export function FileStorageInfo() {
  const g = PSC_GAS.FILE_STORE;
  return (
    <div className="mb-5">
      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Why It Matters</h3>
        <p className="text-muted-light">
          Artwork, metadata and documents can live on chain instead of on IPFS or a cloud bucket.
          Files up to 10 MB are addressed by their SHA-256 and are immutable once finalized. File
          bytes live in the calldata of upload transactions (block bodies, kept by every node);
          state holds only the owner, size, content type and chunk locations. Transactions sent
          directly to this address pay {g.calldataByte} gas per calldata byte instead of 16.
        </p>
      </section>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Uploading</h3>
        <p className="text-muted-light">
          Upload from an EOA, in this order (consecutive nonces can be sent at once):
        </p>
        <ol className="text-muted-light">
          <li><code>begin(sha256, size, contentType)</code></li>
          <li>
            <code>upload(sha256, i, chunk)</code> for i = 0, 1, 2 ... with chunks of up to 512 KB
          </li>
          <li><code>finalize(sha256)</code> - checks the SHA-256 of all chunks</li>
        </ol>
        <ul className="text-muted-light">
          <li>
            <code>upload()</code> must be a transaction sent directly to{' '}
            <code>{PSC_ADDRESSES.FILE_STORE}</code>, not a call from a contract.
          </li>
          <li>Calling <code>begin()</code> again restarts an unfinished upload.</li>
          <li>Content type: printable ASCII, up to 127 characters.</li>
          <li>
            For files with embedded Content Credentials, use <code>beginWithCredential()</code> and
            pass the byte range of the embedded manifest store as the exclusion. See{' '}
            <a href="/developers/psc/content-credentials" className="text-vtru-green">Content Credentials</a>.
          </li>
          <li>The transaction size limit is 544 KB, so a 512 KB chunk plus ABI and transaction overhead fits.</li>
        </ul>
      </section>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">HTTP Gateway</h3>
        <p className="text-muted-light">
          Nodes serve finalized files over HTTP. Files are rebuilt from the upload transactions and
          checked against their SHA-256 before being served.
        </p>
        <div className="code-block"><pre>{`GET ${FILE_GATEWAY_URL}/<sha256 hex>
GET ${FILE_GATEWAY_URL}/<sha256 hex>.png     (extension is ignored)

- Hash: 64 hex characters, with or without 0x
- Content-Type: the stored content type (default application/octet-stream)
- Range requests (Accept-Ranges / 206 Partial Content)
- CORS: Access-Control-Allow-Origin: *  (GET, HEAD, OPTIONS)
- Cache-Control: public, max-age=31536000, immutable
- ETag: "<sha256 hex>"
- 400 invalid hash, 404 file not found`}</pre></div>
      </section>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Gas</h3>
        <div className="code-block"><pre>{`Calldata (direct txs)  ${g.calldataByte}/byte (instead of 16)
Every call             ${g.base}
begin                  ${g.begin.toLocaleString()}
upload (per chunk)     ${g.upload.toLocaleString()}
finalize               ${g.finalize.toLocaleString()}
View calls             ${g.read.toLocaleString()}`}</pre></div>
      </section>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Interface</h3>
        <div className="code-block"><pre>{`interface IFileStore {
    event FileStored(bytes32 indexed sha256Hash, address indexed owner, uint256 size, string contentType);

    function begin(bytes32 sha256Hash, uint256 size, string calldata contentType) external returns (bool);
    function beginWithCredential(bytes32 sha256Hash, uint256 size, string calldata contentType,
                                 uint256[] calldata exclusionStart, uint256[] calldata exclusionLength)
        external returns (bool);
    function upload(bytes32 sha256Hash, uint256 index, bytes calldata chunk) external returns (bool);
    function finalize(bytes32 sha256Hash) external returns (bool);

    function exists(bytes32 sha256Hash) external view returns (bool);
    function info(bytes32 sha256Hash) external view
        returns (address owner, uint256 size, string memory contentType, uint256 chunks, uint256 blockNumber);
    /// status: 0 none, 1 uploading, 2 finalized
    function session(address owner, bytes32 sha256Hash) external view
        returns (uint256 status, uint256 size, uint256 received, uint256 chunks);
    function credentialInfo(bytes32 sha256Hash) external view
        returns (bytes32 contentHash, uint256[] memory exclusionStart, uint256[] memory exclusionLength);
    /// Read chunk with eth_getTransactionByBlockNumberAndIndex and ABI-decode upload() calldata.
    function chunkLocation(bytes32 sha256Hash, uint256 index) external view
        returns (uint256 blockNumber, uint256 txIndex);
}`}</pre></div>
        <p className="text-muted-light small mt-2">
          Source: <code>contracts/filestore/IFileStore.sol</code> in the Vitruveo protocol repository.
        </p>
      </section>
    </div>
  );
}
