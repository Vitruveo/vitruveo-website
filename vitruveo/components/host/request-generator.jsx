'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAccount, useWalletClient } from 'wagmi';
import * as secp from '@noble/secp256k1';
import templates from './templates.json';

// Config
const CHAIN_ID = 1490;
const RPC_URL = "https://rpc.vitruveo.ai";
const HOST_DEMO_ADDRESS = "0x89eB150D576f02Dc18858227aD36aD5D9111739C";
const REGISTRY_ADDRESS = "0xbdc8a59Ec92065848D0a6591F1a67Ce09D5E5FA7";

const HOST_DEMO_ABI = [
  "function makeDemoRequest(address validator, string calldata url, string calldata headerInput, string[] calldata headerValues, string calldata bodyInput, string[] calldata bodyValues) external"
];

const REGISTRY_ABI = [
  "function globalHeaderTemplates(string) view returns (string)",
  "function globalBodyTemplates(string) view returns (string)"
];

const VALIDATORS = [
  { address: '0x54Db0a8A3078C16cB4Ca6E289a68c23Ef3b127d0', pubKey: '04fd404a459b20b80650c4731ed4c86f1686a77df729042dbe386d122916c2a6f0cc20f3e0317ad4bfe39fb17281cbfacd96d7b8febd0eeae3b41d3054c354c50e', name: 'AppVinci' },
];

// Encryption helper
async function encryptValue(pubKeyHex, plainText) {
  pubKeyHex = pubKeyHex.replace(/^0x/, '');
  const ephemeralPriv = secp.utils.randomPrivateKey();
  const ephemeralPub = secp.getPublicKey(ephemeralPriv, false);
  const sharedPoint = secp.getSharedSecret(ephemeralPriv, pubKeyHex, false);
  const sharedX = sharedPoint.slice(1, 33);

  const aesKey = await window.crypto.subtle.importKey("raw", sharedX, { name: "AES-GCM" }, false, ["encrypt"]);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const ciphertextBuffer = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, aesKey, enc.encode(plainText));

  const combined = new Uint8Array(ephemeralPub.length + iv.length + ciphertextBuffer.byteLength);
  combined.set(ephemeralPub, 0);
  combined.set(iv, ephemeralPub.length);
  combined.set(new Uint8Array(ciphertextBuffer), ephemeralPub.length + iv.length);
  return "|" + secp.utils.bytesToHex(combined);
}

function KvRow({ id, keyVal, valVal, encrypt, onKeyChange, onValChange, onEncryptChange, onRemove }) {
  return (
    <div className="row g-2 mb-2 align-items-center">
      <div className="col-md-3">
        <input type="text" className="form-control form-control-sm bg-dark text-white border-secondary" placeholder="Key" value={keyVal} onChange={(e) => onKeyChange(id, e.target.value)} />
      </div>
      <div className="col-md-6">
        <input type="text" className="form-control form-control-sm bg-dark text-white border-secondary" placeholder="Value" value={valVal} onChange={(e) => onValChange(id, e.target.value)} />
      </div>
      <div className="col-md-2 text-center">
        <div className="form-check form-switch d-inline-block">
          <input className="form-check-input" type="checkbox" checked={encrypt} onChange={(e) => onEncryptChange(id, e.target.checked)} />
          <label className="form-check-label small text-muted-light">Encrypt</label>
        </div>
      </div>
      <div className="col-md-1 text-end">
        <button className="btn btn-outline-danger btn-sm" onClick={() => onRemove(id)}>×</button>
      </div>
    </div>
  );
}

function ValueRow({ index, valVal, encrypt, onValChange, onEncryptChange }) {
  return (
    <div className="row g-2 mb-2 align-items-center">
      <div className="col-md-2 text-center fw-bold text-secondary small">Value #{index}</div>
      <div className="col-md-7">
        <input type="text" className="form-control form-control-sm bg-dark text-white border-secondary" placeholder={`Enter content for ${index}`} value={valVal} onChange={(e) => onValChange(index - 1, e.target.value)} />
      </div>
      <div className="col-md-2 text-center">
        <div className="form-check form-switch d-inline-block">
          <input className="form-check-input" type="checkbox" checked={encrypt} onChange={(e) => onEncryptChange(index - 1, e.target.checked)} />
          <label className="form-check-label small text-muted-light">Encrypt</label>
        </div>
      </div>
      <div className="col-md-1"></div>
    </div>
  );
}

export function HostRequestGenerator() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [validator, setValidator] = useState(VALIDATORS[0]);
  const [url, setUrl] = useState('https://webhook.site/');

  // Header state
  const [headerMode, setHeaderMode] = useState('builder');
  const [headerRows, setHeaderRows] = useState([{ id: '1', key: '', val: '', encrypt: true }]);
  const [headerTemplateName, setHeaderTemplateName] = useState('');
  const [headerTemplateSource, setHeaderTemplateSource] = useState('');
  const [headerTemplateValues, setHeaderTemplateValues] = useState([]);
  const [headerShowSource, setHeaderShowSource] = useState(false);

  // Body state
  const [bodyMode, setBodyMode] = useState('builder');
  const [bodyRows, setBodyRows] = useState([{ id: '1', key: '', val: '', encrypt: true }]);
  const [bodyTemplateName, setBodyTemplateName] = useState('plaintext');
  const [bodyTemplateSource, setBodyTemplateSource] = useState('');
  const [bodyTemplateValues, setBodyTemplateValues] = useState([]);
  const [bodyShowSource, setBodyShowSource] = useState(false);

  // Generation state
  const [payloadData, setPayloadData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [txStatus, setTxStatus] = useState(null);

  const readProvider = new ethers.JsonRpcProvider(RPC_URL);

  // Check if there are header templates available
  const headerTemplateKeys = Object.keys(templates.headers);
  const bodyTemplateKeys = Object.keys(templates.body);
  const hasHeaderTemplates = headerTemplateKeys.length > 0;

  // Row management helpers
  const addRow = (setter) => {
    setter(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), key: '', val: '', encrypt: true }]);
  };

  const removeRow = (setter, id) => {
    setter(prev => prev.filter(row => row.id !== id));
  };

  const updateRowKey = (setter, id, key) => {
    setter(prev => prev.map(row => row.id === id ? { ...row, key } : row));
  };

  const updateRowVal = (setter, id, val) => {
    setter(prev => prev.map(row => row.id === id ? { ...row, val } : row));
  };

  const updateRowEncrypt = (setter, id, encrypt) => {
    setter(prev => prev.map(row => row.id === id ? { ...row, encrypt } : row));
  };

  // Template value helpers
  const updateTemplateVal = (setter, index, val) => {
    setter(prev => prev.map((item, i) => i === index ? { ...item, val } : item));
  };

  const updateTemplateEncrypt = (setter, index, encrypt) => {
    setter(prev => prev.map((item, i) => i === index ? { ...item, encrypt } : item));
  };

  // Fetch template from chain
  const fetchTemplate = async (section) => {
    const templateName = section === 'header' ? headerTemplateName : bodyTemplateName;
    if (!templateName) return alert("Select a template first.");

    try {
      const registry = new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, readProvider);
      let rawTemplate = section === 'header'
        ? await registry.globalHeaderTemplates(templateName)
        : await registry.globalBodyTemplates(templateName);

      if (!rawTemplate) {
        alert(`No template found for "${templateName}"`);
        return;
      }

      const setSource = section === 'header' ? setHeaderTemplateSource : setBodyTemplateSource;
      const setValues = section === 'header' ? setHeaderTemplateValues : setBodyTemplateValues;

      setSource(rawTemplate);

      const matches = rawTemplate.match(/\$\d+/g);
      let maxIndex = 0;
      if (matches) {
        matches.forEach(m => {
          const num = parseInt(m.substring(1));
          if (num > maxIndex) maxIndex = num;
        });
      }

      const newValues = [];
      for (let i = 0; i < maxIndex; i++) {
        newValues.push({ val: '', encrypt: true });
      }
      setValues(newValues);
    } catch (e) {
      console.error(e);
      alert("Fetch failed: " + e.message);
    }
  };

  // Generate payload
  const generatePayload = async () => {
    setIsGenerating(true);
    try {
      const processBuilder = async (rows) => {
        const obj = {};
        const vals = [];
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          if (!row.key) continue;
          let val = row.val;
          if (row.encrypt) val = await encryptValue(validator.pubKey, val);
          obj[row.key] = `$${vals.length + 1}`;
          vals.push(val);
        }
        return { input: JSON.stringify(obj), values: vals };
      };

      const processTemplate = async (templateName, templateValues) => {
        const vals = [];
        for (let i = 0; i < templateValues.length; i++) {
          let val = templateValues[i].val;
          if (templateValues[i].encrypt) val = await encryptValue(validator.pubKey, val);
          vals.push(val);
        }
        return { input: templateName, values: vals };
      };

      const headerRes = headerMode === 'builder'
        ? await processBuilder(headerRows)
        : await processTemplate(headerTemplateName, headerTemplateValues);

      const bodyRes = bodyMode === 'builder'
        ? await processBuilder(bodyRows)
        : await processTemplate(bodyTemplateName, bodyTemplateValues);

      const payload = {
        validator: validator.address,
        url,
        headerInput: headerRes.input,
        headerValues: headerRes.values,
        bodyInput: bodyRes.input,
        bodyValues: bodyRes.values
      };

      setPayloadData(payload);
    } catch (e) {
      alert("Encryption Error: " + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Send transaction
  const sendTransaction = async () => {
    if (!isConnected || !walletClient || !payloadData) {
      alert("Please connect wallet and generate payload first.");
      return;
    }

    setIsSending(true);
    setTxStatus({ type: 'warning', message: 'Signing transaction...' });

    try {
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(HOST_DEMO_ADDRESS, HOST_DEMO_ABI, signer);

      const tx = await contract.makeDemoRequest(
        payloadData.validator,
        payloadData.url,
        payloadData.headerInput,
        payloadData.headerValues,
        payloadData.bodyInput,
        payloadData.bodyValues
      );

      setTxStatus({ type: 'info', message: 'Transaction sent! Waiting for confirmation...' });
      await tx.wait();
      setTxStatus({ type: 'success', message: 'Success!', hash: tx.hash });
    } catch (e) {
      console.error(e);
      setTxStatus({ type: 'danger', message: `Failed: ${e.message}` });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="request-generator">
      {/* Step 1: Request Configuration */}
      <div className="card card-dark mb-4">
        <div className="card-header">
          <span className="step-number">1</span> Request Configuration
        </div>
        <div className="card-body">
          {/* Validator */}
          <div className="mb-3">
            <label className="form-label text-white">Validator Node</label>
            <select className="form-select bg-dark text-white border-secondary" value={validator.address} onChange={(e) => setValidator(VALIDATORS.find(v => v.address === e.target.value))}>
              {VALIDATORS.map(v => (
                <option key={v.address} value={v.address}>{v.name} ({v.address.substring(0, 6)}...{v.address.substring(38)})</option>
              ))}
            </select>
          </div>

          {/* URL */}
          <div className="mb-4">
            <label className="form-label text-white">Webhook URL</label>
            <input type="text" className="form-control bg-dark text-white border-secondary" placeholder="https://webhook.site/..." value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>

          {/* Headers Section */}
          <div className="config-section mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <label className="form-label fw-bold text-white m-0">Headers</label>
              <div className="btn-group btn-group-sm">
                <button className={`btn ${headerMode === 'builder' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setHeaderMode('builder')}>Builder</button>
                <button className={`btn ${headerMode === 'template' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setHeaderMode('template')}>Use Template</button>
              </div>
            </div>

            {headerMode === 'builder' ? (
              <>
                <span className="mode-label">Construct JSON Object</span>
                {headerRows.map(row => (
                  <KvRow
                    key={row.id}
                    id={row.id}
                    keyVal={row.key}
                    valVal={row.val}
                    encrypt={row.encrypt}
                    onKeyChange={(id, key) => updateRowKey(setHeaderRows, id, key)}
                    onValChange={(id, val) => updateRowVal(setHeaderRows, id, val)}
                    onEncryptChange={(id, enc) => updateRowEncrypt(setHeaderRows, id, enc)}
                    onRemove={(id) => removeRow(setHeaderRows, id)}
                  />
                ))}
                <button className="btn btn-outline-secondary btn-sm mt-2" onClick={() => addRow(setHeaderRows)}>+ Add Key/Value</button>
              </>
            ) : (
              <>
                <span className="mode-label">Select From Registry</span>
                <div className="input-group mb-3">
                  <select
                    className="form-select bg-dark text-white border-secondary"
                    value={headerTemplateName}
                    onChange={(e) => setHeaderTemplateName(e.target.value)}
                    disabled={!hasHeaderTemplates}
                  >
                    {hasHeaderTemplates ? (
                      headerTemplateKeys.map(key => (
                        <option key={key} value={key}>{key} – {templates.headers[key]}</option>
                      ))
                    ) : (
                      <option value="">None</option>
                    )}
                  </select>
                  <button className="btn btn-primary" onClick={() => fetchTemplate('header')} disabled={!hasHeaderTemplates || !headerTemplateName}>
                    Fetch Schema
                  </button>
                </div>

                {headerTemplateSource && (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="val-count-badge">{headerTemplateValues.length} value{headerTemplateValues.length !== 1 ? 's' : ''} required</span>
                      <button className="btn btn-link btn-sm text-muted-light p-0" onClick={() => setHeaderShowSource(!headerShowSource)}>
                        {headerShowSource ? 'Hide' : 'Show'} Source
                      </button>
                    </div>
                    {headerShowSource && (
                      <div className="template-source-box mb-3">{headerTemplateSource}</div>
                    )}
                    {headerTemplateValues.map((item, i) => (
                      <ValueRow
                        key={i}
                        index={i + 1}
                        valVal={item.val}
                        encrypt={item.encrypt}
                        onValChange={(idx, val) => updateTemplateVal(setHeaderTemplateValues, idx, val)}
                        onEncryptChange={(idx, enc) => updateTemplateEncrypt(setHeaderTemplateValues, idx, enc)}
                      />
                    ))}
                  </>
                )}
              </>
            )}
          </div>

          {/* Body Section */}
          <div className="config-section">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <label className="form-label fw-bold text-white m-0">Body</label>
              <div className="btn-group btn-group-sm">
                <button className={`btn ${bodyMode === 'builder' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setBodyMode('builder')}>Builder</button>
                <button className={`btn ${bodyMode === 'template' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setBodyMode('template')}>Use Template</button>
              </div>
            </div>

            {bodyMode === 'builder' ? (
              <>
                <span className="mode-label">Construct JSON Object</span>
                {bodyRows.map(row => (
                  <KvRow
                    key={row.id}
                    id={row.id}
                    keyVal={row.key}
                    valVal={row.val}
                    encrypt={row.encrypt}
                    onKeyChange={(id, key) => updateRowKey(setBodyRows, id, key)}
                    onValChange={(id, val) => updateRowVal(setBodyRows, id, val)}
                    onEncryptChange={(id, enc) => updateRowEncrypt(setBodyRows, id, enc)}
                    onRemove={(id) => removeRow(setBodyRows, id)}
                  />
                ))}
                <button className="btn btn-outline-secondary btn-sm mt-2" onClick={() => addRow(setBodyRows)}>+ Add Key/Value</button>
              </>
            ) : (
              <>
                <span className="mode-label">Select From Registry</span>
                <div className="input-group mb-3">
                  <select
                    className="form-select bg-dark text-white border-secondary"
                    value={bodyTemplateName}
                    onChange={(e) => setBodyTemplateName(e.target.value)}
                  >
                    {bodyTemplateKeys.map(key => (
                      <option key={key} value={key}>{key} – {templates.body[key]}</option>
                    ))}
                  </select>
                  <button className="btn btn-primary" onClick={() => fetchTemplate('body')} disabled={!bodyTemplateName}>
                    Fetch Schema
                  </button>
                </div>

                {bodyTemplateSource && (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="val-count-badge">{bodyTemplateValues.length} value{bodyTemplateValues.length !== 1 ? 's' : ''} required</span>
                      <button className="btn btn-link btn-sm text-muted-light p-0" onClick={() => setBodyShowSource(!bodyShowSource)}>
                        {bodyShowSource ? 'Hide' : 'Show'} Source
                      </button>
                    </div>
                    {bodyShowSource && (
                      <div className="template-source-box mb-3">{bodyTemplateSource}</div>
                    )}
                    {bodyTemplateValues.map((item, i) => (
                      <ValueRow
                        key={i}
                        index={i + 1}
                        valVal={item.val}
                        encrypt={item.encrypt}
                        onValChange={(idx, val) => updateTemplateVal(setBodyTemplateValues, idx, val)}
                        onEncryptChange={(idx, enc) => updateTemplateEncrypt(setBodyTemplateValues, idx, enc)}
                      />
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Step 2: Encryption & Submission */}
      <div className="card card-dark">
        <div className="card-header">
          <span className="step-number">2</span> Encryption & Submission
        </div>
        <div className="card-body">
          <button className="btn btn-success mb-3" onClick={generatePayload} disabled={isGenerating}>
            {isGenerating ? 'Encrypting...' : 'Generate Payload (Encrypt)'}
          </button>

          {payloadData && (
            <>
              <div className="code-preview mb-4">
                <pre>{JSON.stringify(payloadData, null, 2)}</pre>
              </div>
              <div className="text-center">
                <button className="btn btn-primary btn-lg px-5" onClick={sendTransaction} disabled={isSending || !isConnected}>
                  {isSending ? 'Sending...' : 'Send to Blockchain'}
                </button>
                {!isConnected && (
                  <p className="text-muted-light small mt-2">Connect your wallet using the button in the navbar to send.</p>
                )}
              </div>
            </>
          )}

          {txStatus && (
            <div className={`alert alert-${txStatus.type} mt-3`}>
              {txStatus.hash ? (
                <div className="text-center">
                  <h5>{txStatus.message}</h5>
                  <a href={`https://explorer.vitruveo.ai/tx/${txStatus.hash}`} target="_blank" rel="noopener noreferrer" className="text-vtru-green">
                    {txStatus.hash}
                  </a>
                </div>
              ) : (
                txStatus.message
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .step-number {
          background: #0d6efd;
          color: white;
          width: 24px;
          height: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 14px;
          margin-right: 8px;
        }
        .card-header {
          background-color: #1a1a1a;
          color: white;
          font-weight: 600;
          border-bottom: 1px solid #333;
        }
        .config-section {
          background: rgba(255, 255, 255, 0.03);
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #333;
        }
        .mode-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          color: #6c757d;
          font-weight: bold;
          letter-spacing: 1px;
          margin-bottom: 10px;
          display: block;
        }
        .val-count-badge {
          background-color: rgba(161, 255, 117, 0.2);
          color: #a1ff75;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .template-source-box {
          background: #111;
          padding: 10px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 0.8rem;
          word-break: break-all;
          color: #999;
          border: 1px solid #333;
        }
        .code-preview {
          background: #111;
          color: #d4d4d4;
          padding: 1rem;
          border-radius: 6px;
          font-family: monospace;
          font-size: 0.9rem;
          max-height: 200px;
          overflow-y: auto;
        }
        .code-preview pre {
          margin: 0;
          white-space: pre-wrap;
          word-break: break-all;
        }
      `}</style>
    </div>
  );
}
