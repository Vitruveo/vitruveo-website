'use client';

import { PSC_ADDRESSES, NETWORK_CONFIG } from '../../lib/psc-constants';
import { PscCodeTabs } from '../psc-code-tabs';

export function ContentCredentialsExample() {
  const soliditySnippet = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// IContentCredentials.sol from contracts/c2pa in the Vitruveo protocol repo.
import {IContentCredentials} from "./IContentCredentials.sol";

contract VerifiedGallery {
    IContentCredentials constant C2PA = IContentCredentials(${PSC_ADDRESSES.CONTENT_CREDENTIALS});

    mapping(bytes32 => bool) public listed;

    /// List an artwork only if its Content Credentials were verified on chain
    /// and are still valid (no later revocation, anchor not removed).
    function list(bytes32 fileHash) external {
        (bool valid, , , string memory signerName, , , , ) = C2PA.provenance(fileHash);
        require(valid, "no valid provenance");
        require(bytes(signerName).length > 0, "unsigned");
        listed[fileHash] = true;
    }

    /// Signer fingerprints of each manifest in the verified store, oldest first.
    function history(bytes32 fileHash) external view returns (bytes32[] memory) {
        return C2PA.lineage(fileHash);
    }
}`;

  const clientSnippet = `// 1. Inspect the manifest store, 2. upload the file with its exclusions, 3. verify
import { createPublicClient, createWalletClient, custom, http, encodeFunctionData, parseAbi } from 'viem';

const C2PA = '${PSC_ADDRESSES.CONTENT_CREDENTIALS}';
const FILE_STORE = '${PSC_ADDRESSES.FILE_STORE}';
const abi = parseAbi([
  'function check(bytes manifestStore) view returns (bytes32 signer, bytes32 anchor, string signerName, string claimGenerator, uint256 manifests, bytes32 dataHash, uint256[] exclusionStart, uint256[] exclusionLength)',
  'function verify(bytes32 fileHash, bytes manifestStore) returns (bytes32 signer, bytes32 anchor, string signerName, string claimGenerator, uint256 manifests)',
  'function beginWithCredential(bytes32 sha256Hash, uint256 size, string contentType, uint256[] exclusionStart, uint256[] exclusionLength) returns (bool)',
]);

const publicClient = createPublicClient({ transport: http('${NETWORK_CONFIG.rpc}') });
const walletClient = createWalletClient({ transport: custom(window.ethereum) });
const [account] = await walletClient.getAddresses();

// manifestStore: the C2PA manifest store (JUMBF) embedded in the JPEG/PNG
const [, , signerName, claimGenerator, , dataHash, exclusionStart, exclusionLength] =
  await publicClient.readContract({ address: C2PA, abi, functionName: 'check', args: [manifestStore] });

// Upload with the embedded manifest store range excluded from the content hash.
// Wait for each receipt: the next step's gas estimate reverts until this one is mined.
const beginTx = await walletClient.sendTransaction({
  account, chain: null, to: FILE_STORE,
  data: encodeFunctionData({ abi, functionName: 'beginWithCredential',
    args: [fileHash, BigInt(fileBytes.length), 'image/jpeg', exclusionStart, exclusionLength] }),
});
await publicClient.waitForTransactionReceipt({ hash: beginTx });
// ... upload(fileHash, i, chunk) and finalize(fileHash) as on the File Storage page ...

// Direct transaction to the precompile: calldata costs 2 gas per byte
await walletClient.sendTransaction({
  account, chain: null, to: C2PA,
  data: encodeFunctionData({ abi, functionName: 'verify', args: [fileHash, manifestStore] }),
});`;

  return (
    <PscCodeTabs
      tabs={[
        { id: 'solidity', label: 'Smart Contract', language: 'solidity', code: soliditySnippet },
        { id: 'client', label: 'Client Code', language: 'javascript', code: clientSnippet },
      ]}
    />
  );
}
