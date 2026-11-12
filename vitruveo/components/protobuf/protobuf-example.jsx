'use client';

import { PSC_ADDRESSES, NETWORK_CONFIG } from '../../lib/psc-constants';
import { PscCodeTabs } from '../psc-code-tabs';

export function ProtobufExample() {
  const soliditySnippet = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Protobuf.sol from contracts/protobuf in the Vitruveo protocol repo.
// It wraps the precompile at ${PSC_ADDRESSES.PROTOBUF} with low-level calls.
import {Protobuf} from "./Protobuf.sol";

contract ArtworkMetadata {
    using Protobuf for bytes32;

    // Stored messages are namespaced by this contract's address.
    function setMetadata(uint256 tokenId, string calldata name, uint256 width) external {
        bytes32 key = keccak256(abi.encode(tokenId));
        key.setString(Protobuf.path(1), name);        // name = 1
        key.setUint(Protobuf.path(2, 1), width);      // dims.width = 2.1
        key.addString(Protobuf.path(3), "landscape"); // repeated tags = 3
    }

    // Anyone can read any stored message.
    function nameOf(uint256 tokenId) external view returns (string memory) {
        bytes32 key = keccak256(abi.encode(tokenId));
        return Protobuf.getString(address(this), key, Protobuf.path(1));
    }

    // Messages in memory (no storage). Start from new bytes(0).
    function buildInMemory() external view returns (bytes memory m, uint256 w) {
        m = Protobuf.setString(new bytes(0), Protobuf.path(1), "Sunset");
        m = Protobuf.setUint(m, Protobuf.path(2, 1), 1920);
        w = Protobuf.getUint(m, Protobuf.path(2, 1));
    }
}`;

  const clientSnippet = `// Read a message stored by a contract and decode its top-level fields
import { createPublicClient, http, parseAbi, keccak256, encodeAbiParameters } from 'viem';

const client = createPublicClient({ transport: http('${NETWORK_CONFIG.rpc}') });
const PROTOBUF = '${PSC_ADDRESSES.PROTOBUF}';

const abi = parseAbi([
  'function load(address owner, bytes32 key) view returns (bytes data)',
  'function decode(bytes data) view returns (uint256[] fieldNumbers, uint256[] wireTypes, bytes[] values)',
]);

const owner = '0xYourContract';
const key = keccak256(encodeAbiParameters([{ type: 'uint256' }], [1n])); // keccak256(abi.encode(tokenId))

const message = await client.readContract({ address: PROTOBUF, abi, functionName: 'load', args: [owner, key] });
const [fieldNumbers, wireTypes, values] = await client.readContract({
  address: PROTOBUF, abi, functionName: 'decode', args: [message],
});
// wireTypes: 0 varint, 1 fixed64, 2 length-delimited, 5 fixed32`;

  return (
    <PscCodeTabs
      tabs={[
        { id: 'solidity', label: 'Smart Contract', language: 'solidity', code: soliditySnippet },
        { id: 'client', label: 'Client Code', language: 'javascript', code: clientSnippet },
      ]}
    />
  );
}
