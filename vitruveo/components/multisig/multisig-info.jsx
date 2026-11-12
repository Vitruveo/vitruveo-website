'use client';

import { PSC_GAS } from '../../lib/psc-constants';

export function MultisigInfo() {
  const g = PSC_GAS.MULTISIG;
  return (
    <div className="mb-5">
      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Why It Matters</h3>
        <p className="text-muted-light">
          A multisig without deploying a wallet contract. Wallets are keyless addresses derived from
          the creator and a salt, controlled by a threshold of owners. Owners can be addresses (EOAs
          or contracts) or P-256 passkeys. A wallet holds VTRU, tokens and NFTs like any address and
          executes batches of calls all-or-nothing, including calls into other contracts.
        </p>
      </section>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">How It Works</h3>
        <ul className="text-muted-light">
          <li>
            <code>create(owners, passkeyX, passkeyY, threshold, salt)</code> creates the wallet at{' '}
            <code>walletAddress(msg.sender, salt)</code>. Up to 32 owners in total.
          </li>
          <li>
            <code>execute(wallet, to[], value[], data[], signatures[])</code> runs up to 64 calls as
            the wallet. Approvals are counted from distinct owners:
            <ul>
              <li>EOA signature: <code>0x01 | r | s | v</code> over the operation hash (EIP-712)</li>
              <li>
                Passkey signature: <code>0x02 | abi.encode(x, y, authenticatorData, clientDataJSON, r, s)</code>,
                where the WebAuthn challenge is the operation hash (base64url)
              </li>
              <li>Prior on-chain <code>approve(wallet, opHash)</code> calls by address owners (works for contract owners)</li>
              <li><code>msg.sender</code> of <code>execute()</code>, if it is an address owner</li>
            </ul>
          </li>
          <li>
            EIP-712 (<code>eth_signTypedData_v4</code>): domain{' '}
            <code>{'{ name: "Vitruveo Multisig", version: "1", chainId, verifyingContract: wallet }'}</code>,
            types <code>Execute(Call[] calls,uint256 nonce)</code> and{' '}
            <code>Call(address to,uint256 value,bytes data)</code>. <code>operationHash()</code> returns it.
          </li>
          <li>
            Owner and threshold changes (<code>addOwner</code>, <code>addPasskey</code>,{' '}
            <code>removeOwner</code>, <code>setThreshold</code>) are calls from the wallet to this
            precompile inside <code>execute()</code>, so they need the same approvals.
          </li>
          <li>
            Owner ids: address owner = <code>bytes32(uint256(uint160(owner)))</code>; passkey ={' '}
            <code>keccak256(abi.encode(x, y))</code>.
          </li>
          <li>Send VTRU to the wallet address directly, not with a call to this precompile.</li>
          <li>State-changing functions revert inside STATICCALL.</li>
        </ul>
      </section>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Gas</h3>
        <div className="code-block"><pre>{`Every call              ${g.base} + ${g.perByte}/byte of input
Create wallet           ${g.create} + ${g.perOwner}/owner
Owner read              ${g.scan}/owner
approve / admin update  ${g.write}
Execute                 ${g.execute} + forwarded call gas
EOA signature           ${g.ecdsa}
Passkey signature       ${g.passkey}`}</pre></div>
      </section>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Interface</h3>
        <div className="code-block"><pre>{`interface IMultisig {
    event WalletCreated(address indexed wallet, address indexed creator);
    event Approved(address indexed wallet, bytes32 indexed opHash, bytes32 ownerId);
    event Executed(address indexed wallet, bytes32 indexed opHash, uint256 nonce);
    event OwnerAdded(address indexed wallet, bytes32 indexed ownerId);
    event OwnerRemoved(address indexed wallet, bytes32 indexed ownerId);
    event ThresholdChanged(address indexed wallet, uint256 indexed threshold);

    function walletAddress(address creator, bytes32 salt) external view returns (address wallet);
    function create(address[] calldata owners, uint256[] calldata passkeyX, uint256[] calldata passkeyY,
                    uint256 threshold, bytes32 salt) external returns (address wallet);
    function operationHash(address wallet, address[] calldata to, uint256[] calldata value,
                           bytes[] calldata data, uint256 nonce) external view returns (bytes32);
    function execute(address wallet, address[] calldata to, uint256[] calldata value,
                     bytes[] calldata data, bytes[] calldata signatures) external returns (bytes[] memory results);
    function approve(address wallet, bytes32 opHash) external returns (bool);
    function info(address wallet) external view returns (address[] memory owners, uint256[] memory passkeyX,
                                                         uint256[] memory passkeyY, uint256 threshold, uint256 nonce);
    function approvedBy(address wallet, bytes32 opHash) external view returns (bytes32[] memory ownerIds);

    // Callable only by the wallet itself (as a call inside execute)
    function addOwner(address owner) external returns (bool);
    function addPasskey(uint256 x, uint256 y) external returns (bool);
    function removeOwner(bytes32 ownerId) external returns (bool);
    function setThreshold(uint256 threshold) external returns (bool);
}`}</pre></div>
        <p className="text-muted-light small mt-2">
          Source: <code>contracts/multisig/IMultisig.sol</code> in the Vitruveo protocol repository.
        </p>
      </section>
    </div>
  );
}
