'use client';

import { useState } from 'react';
import { HOST_REGISTRY_ADDRESS, PSC_ADDRESSES } from '../../lib/psc-constants';

export function HostExample() {
  const [webhookUrl, setWebhookUrl] = useState('https://api.example.com/webhook');
  const [payload, setPayload] = useState('{"action":"fulfill","orderId":"123"}');
  const [validatorAddress, setValidatorAddress] = useState('0x54Db0a8A3078C16cB4Ca6E289a68c23Ef3b127d0');
  const [activeTab, setActiveTab] = useState('solidity');

  const solidityCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IHostRegistry {
    function addRequest(
        address validator,
        string calldata url,
        string calldata headerInput,   // raw JSON template or registered template name
        string[] calldata headerValues,
        string calldata bodyInput,     // raw JSON template or registered template name
        string[] calldata bodyValues
    ) external returns (uint256 requestId);
}

// This contract must be whitelisted for the validator (authorizeContract)
contract MyContract {
    IHostRegistry constant REGISTRY = IHostRegistry(${HOST_REGISTRY_ADDRESS});
    address constant HOST = ${PSC_ADDRESSES.HOST};

    function triggerWebhook() external returns (uint256 requestId) {
        string[] memory headerValues = new string[](1);
        headerValues[0] = "application/json";

        requestId = REGISTRY.addRequest(
            ${validatorAddress},
            "${webhookUrl}",
            '{"Content-Type":"$1"}',
            headerValues,
            '${payload}',
            new string[](0)
        );

        // Fire it: the HOST precompile needs at least 125,000 gas
        (bool ok, ) = HOST.call{gas: 130000}(abi.encode(requestId));
        require(ok, "HOST call failed");
    }
}`;

  const javascriptCode = `// Using ethers.js v6: call your whitelisted contract
const myContract = new ethers.Contract(
  "0xYourContract",
  ["function triggerWebhook() returns (uint256)"],
  signer
);

const tx = await myContract.triggerWebhook();
const receipt = await tx.wait();

// RequestAdded is emitted by the HOST Registry
const registry = new ethers.Interface([
  "event RequestAdded(uint256 indexed requestId, address indexed requester)"
]);
const log = receipt.logs.find(
  (l) => l.address.toLowerCase() === "${HOST_REGISTRY_ADDRESS.toLowerCase()}"
);
console.log("Request ID:", registry.parseLog(log).args.requestId);`;

  return (
    <div className="mb-5">
      <div className="card card-dark p-4 rounded-3 mb-4">
        <div className="mb-3">
          <label className="form-label text-white">Validator Address</label>
          <input
            type="text"
            className="form-control bg-dark text-white border-secondary"
            value={validatorAddress}
            onChange={(e) => setValidatorAddress(e.target.value)}
            placeholder="0x..."
          />
          <small className="text-muted">The validator that will execute this request</small>
        </div>

        <div className="mb-3">
          <label className="form-label text-white">Webhook URL</label>
          <input
            type="text"
            className="form-control bg-dark text-white border-secondary"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://your-api.com/webhook"
          />
          <small className="text-muted">Your endpoint that receives the POST request</small>
        </div>

        <div className="mb-0">
          <label className="form-label text-white">JSON Payload</label>
          <textarea
            className="form-control bg-dark text-white border-secondary"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            rows={3}
            placeholder='{"key": "value"}'
          />
          <small className="text-muted">Data sent to your webhook (use | prefix to encrypt sensitive values)</small>
        </div>
      </div>

      <div className="mb-4">
        <ul className="nav nav-tabs border-secondary">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'solidity' ? 'active bg-dark text-vtru-green border-secondary' : 'text-muted'}`}
              onClick={() => setActiveTab('solidity')}
            >
              Solidity
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'javascript' ? 'active bg-dark text-vtru-green border-secondary' : 'text-muted'}`}
              onClick={() => setActiveTab('javascript')}
            >
              JavaScript
            </button>
          </li>
        </ul>
        <div className="code-block rounded-top-0">
          <pre>{activeTab === 'solidity' ? solidityCode : javascriptCode}</pre>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card card-dark p-4 rounded-3 h-100">
            <h5 className="text-vtru-green mb-3">What Happens</h5>
            <ol className="text-muted-light small ps-3 mb-0">
              <li className="mb-2">Your contract calls <code className="text-vtru-green">addRequest()</code> on the HOST Registry, then calls the HOST precompile with the request ID</li>
              <li className="mb-2">The request stores the validator address, URL, header and body templates, and their values</li>
              <li className="mb-2">During block execution, the selected validator fires an HTTP POST to your URL</li>
              <li className="mb-2">Your webhook receives the request with <code className="text-vtru-green">X-HOST-Request-ID</code> header</li>
              <li className="mb-0">Process the request and respond (standard webhook flow)</li>
            </ol>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card card-dark p-4 rounded-3 h-100">
            <h5 className="text-vtru-green mb-3">Built-in Encryption</h5>
            <p className="text-muted-light small mb-0">
              HOST supports <strong className="text-white">ECDH + AES-256-GCM encryption</strong> for sensitive values.
              Prefix encrypted values with <code className="text-vtru-green">|</code> and only the designated
              validator can decrypt them when executing the webhook.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
