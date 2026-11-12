import { NETWORK_CONFIG, FILE_GATEWAY_URL } from '../../lib/psc-constants';

// A real file stored on Vitruveo mainnet through the File Storage precompile.
const SAMPLE = {
  name: 'Vitruveo.mp4',
  sha256: '8f684b47bd39dbd2140dbf3eb17e7d89d30ff249b140810f45f67bbd79f19a7c',
  size: 3046150,
  contentType: 'video/mp4',
  owner: '0x88Eb3738dc7B13773F570458cbC932521431FeA7',
  block: 5432211,
  txs: [
    { step: 'begin', hash: '0xe48947d70fc3d0d1a6747d643762caeb0450888b35ba10bf88828140c15d8cc8' },
    { step: 'upload 0', hash: '0x67920741d312ee42efe417b488c9949f860480dc053c60e17a72cbb156fe2cbf' },
    { step: 'upload 1', hash: '0x0bf01cfa5e33a84c68a939df08f5bc7a58d2cf82bc6cdf88a586a78c1941748c' },
    { step: 'upload 2', hash: '0x4c4b2c2cfb6f2eef7fcc7b90b79cf9b15f470fe5601c57c035a05dae179377c7' },
    { step: 'upload 3', hash: '0x62021f3ebee11476d4774c8a628004e1129d83479147ff572a28e568f4c4150c' },
    { step: 'upload 4', hash: '0xe33a91fc8433917b0b7d8525979d3287447b65af72c9432f94942be6798d8e39' },
    { step: 'upload 5', hash: '0x9b02cf8078d9ea133a55f03c112b24db35dc5ee7f76e6a8709e78388e7a11df0' },
    { step: 'finalize', hash: '0xc54d273ef6b14b78d274607cdeddbb17fe7f2ac3ae9153bd510cba3af807a9e8' },
  ],
};

const short = (h) => `${h.slice(0, 10)}…${h.slice(-8)}`;

export function FileStorageSample() {
  const fileUrl = `${FILE_GATEWAY_URL}/${SAMPLE.sha256}.mp4`;
  const txUrl = (h) => `${NETWORK_CONFIG.explorer}/tx/${h}`;
  const finalizeTx = SAMPLE.txs[SAMPLE.txs.length - 1].hash;

  return (
    <div className="card bg-dark border-secondary mb-4">
      <div className="card-body">
        <h2 className="h5 text-white mb-1">Live sample: a video stored on chain</h2>
        <p className="text-muted-light small mb-3">
          {SAMPLE.name} ({(SAMPLE.size / 1048576).toFixed(2)} MB, {SAMPLE.contentType}) was uploaded in 6 chunks of up
          to 512 KB and finalized in block {SAMPLE.block.toLocaleString()}. The player below streams it straight from
          a Vitruveo node.
        </p>

        <div className="row g-4 align-items-start">
          <div className="col-md-5">
            <video
              src={fileUrl}
              controls
              muted
              loop
              playsInline
              preload="metadata"
              className="w-100 rounded border border-secondary"
              style={{ maxHeight: 420, background: '#000' }}
            />
          </div>
          <div className="col-md-7">
            <div className="d-flex flex-wrap gap-2 mb-3">
              <a className="btn btn-primary btn-sm" href={fileUrl} download={SAMPLE.name}>
                Download from RPC
              </a>
              <a className="btn btn-outline-light btn-sm" href={txUrl(finalizeTx)} target="_blank" rel="noopener noreferrer">
                View upload on Explorer
              </a>
            </div>

            <div className="small mb-3">
              <div className="text-white-50 text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.06em' }}>File URL</div>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-vtru-green text-break font-monospace">
                {fileUrl}
              </a>
            </div>
            <div className="small mb-3">
              <div className="text-white-50 text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.06em' }}>SHA-256</div>
              <code className="text-white text-break">0x{SAMPLE.sha256}</code>
            </div>

            <div className="text-white-50 text-uppercase small mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.06em' }}>
              Upload transactions
            </div>
            <ul className="list-unstyled small mb-0">
              {SAMPLE.txs.map((t) => (
                <li key={t.hash} className="d-flex gap-3">
                  <span className="text-white-50" style={{ minWidth: 70 }}>{t.step}</span>
                  <a href={txUrl(t.hash)} target="_blank" rel="noopener noreferrer" className="text-vtru-green font-monospace">
                    {short(t.hash)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
