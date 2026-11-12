'use client';

import { PSC_ADDRESSES, NETWORK_CONFIG } from '../../lib/psc-constants';
import { PscCodeTabs } from '../psc-code-tabs';

export function MultisigExample() {
  const soliditySnippet = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// IMultisig.sol from contracts/multisig in the Vitruveo protocol repo.
import {IMultisig} from "./IMultisig.sol";

contract TreasuryFactory {
    IMultisig constant MULTISIG = IMultisig(${PSC_ADDRESSES.MULTISIG});

    /// Create a 2-of-3 wallet owned by three addresses (no passkeys).
    /// The wallet address is walletAddress(address(this), salt).
    function createTreasury(address a, address b, address c, bytes32 salt) external returns (address wallet) {
        address[] memory owners = new address[](3);
        (owners[0], owners[1], owners[2]) = (a, b, c);
        wallet = MULTISIG.create(owners, new uint256[](0), new uint256[](0), 2, salt);
    }
}

contract OwnerContract {
    IMultisig constant MULTISIG = IMultisig(${PSC_ADDRESSES.MULTISIG});

    /// A contract owner approves on chain (it cannot sign).
    function approveOp(address wallet, bytes32 opHash) external {
        MULTISIG.approve(wallet, opHash);
    }
}`;

  const clientSnippet = `// Sign an operation off chain (EIP-712) and execute it with the signatures
import { createPublicClient, createWalletClient, custom, http, parseAbi, parseEther } from 'viem';

const MULTISIG = '${PSC_ADDRESSES.MULTISIG}';
const abi = parseAbi([
  'function info(address wallet) view returns (address[] owners, uint256[] passkeyX, uint256[] passkeyY, uint256 threshold, uint256 nonce)',
  'function execute(address wallet, address[] to, uint256[] value, bytes[] data, bytes[] signatures) returns (bytes[] results)',
]);

const publicClient = createPublicClient({ transport: http('${NETWORK_CONFIG.rpc}') });
const walletClient = createWalletClient({ transport: custom(window.ethereum) });
const [account] = await walletClient.getAddresses();

const wallet = '0xYourMultisigWallet';
const calls = [{ to: '0xRecipient', value: parseEther('1'), data: '0x' }];
const [, , , , nonce] = await publicClient.readContract({ address: MULTISIG, abi, functionName: 'info', args: [wallet] });

// Each EOA owner signs the operation (eth_signTypedData_v4)
const signature = await walletClient.signTypedData({
  account,
  domain: { name: 'Vitruveo Multisig', version: '1', chainId: ${NETWORK_CONFIG.chainId}, verifyingContract: wallet },
  types: {
    Execute: [{ name: 'calls', type: 'Call[]' }, { name: 'nonce', type: 'uint256' }],
    Call: [{ name: 'to', type: 'address' }, { name: 'value', type: 'uint256' }, { name: 'data', type: 'bytes' }],
  },
  primaryType: 'Execute',
  message: { calls, nonce },
});

// EOA signature format: 0x01 | r | s | v
const eoaSig = '0x01' + signature.slice(2);

// Anyone can submit; msg.sender also counts as an approval if it is an owner
await walletClient.writeContract({
  account, chain: null, address: MULTISIG, abi, functionName: 'execute',
  args: [wallet, calls.map(c => c.to), calls.map(c => c.value), calls.map(c => c.data), [eoaSig /*, more signatures */]],
});`;

  return (
    <PscCodeTabs
      tabs={[
        { id: 'client', label: 'Client Code', language: 'javascript', code: clientSnippet },
        { id: 'solidity', label: 'Smart Contract', language: 'solidity', code: soliditySnippet },
      ]}
    />
  );
}
