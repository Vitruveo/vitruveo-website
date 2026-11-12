'use client';

import { PSC_GAS } from '../../lib/psc-constants';

export function ProtobufInfo() {
  const g = PSC_GAS.PROTOBUF;
  return (
    <div className="mb-5">
      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Why It Matters</h3>
        <p className="text-muted-light">
          Contracts can decode, build and edit schema-less protobuf messages without a Solidity
          decoder, and store whole messages on chain for {g.store.toLocaleString()} gas per write
          plus {g.storeByte} gas per byte, instead of paying SSTORE for every 32-byte slot.
          Individual fields of a stored message can be read or replaced by path.
        </p>
      </section>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">How It Works</h3>
        <ul className="text-muted-light">
          <li>
            Paths are field numbers from the outer message inward. Every element but the last must
            be an embedded message. The last occurrence of a field is the one read or replaced.
          </li>
          <li>
            Values: varint/fixed fields are 32-byte big-endian words; bytes, strings and embedded
            messages are raw bytes. Wire types: 0 varint, 1 fixed64, 2 length-delimited, 5 fixed32.
            Groups are rejected.
          </li>
          <li>
            Storage is namespaced by <code>msg.sender</code>: a contract can only write its own
            messages, and anyone can read any message. Writes revert inside STATICCALL.
          </li>
          <li>Stored messages are limited to 1 MiB; paths to 64 levels.</li>
          <li>
            Call it through the <code>Protobuf</code> library (low-level calls). Calling the
            interface directly fails for functions without return values, because Solidity checks
            that the target has code and the precompile has none.
          </li>
        </ul>
      </section>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Gas</h3>
        <div className="code-block"><pre>{`Every call               ${g.base}
Per byte of input/scan   ${g.perByte}
Per field scanned/built  ${g.perItem}
Stored message read      ${g.load}
Stored write or removal  ${g.store}
Per byte written         ${g.storeByte}`}</pre></div>
      </section>

      <section className="mb-5">
        <h3 className="text-vtru-green mb-3">Interface</h3>
        <div className="code-block"><pre>{`interface IProtobuf {
    // Codec
    function decode(bytes calldata data)
        external view returns (uint256[] memory fieldNumbers, uint256[] memory wireTypes, bytes[] memory values);
    function encode(uint256[] calldata fieldNumbers, uint256[] calldata wireTypes, bytes[] calldata values)
        external view returns (bytes memory data);
    function decodePacked(bytes calldata data, uint256 wireType) external view returns (uint256[] memory values);
    function encodePacked(uint256[] calldata values, uint256 wireType) external view returns (bytes memory data);

    // Field access on a message in memory
    function read(bytes calldata data, uint256[] calldata path)
        external view returns (bool found, uint256 wireType, bytes memory value);
    function readAll(bytes calldata data, uint256[] calldata path)
        external view returns (uint256[] memory wireTypes, bytes[] memory values);
    function write(bytes calldata data, uint256[] calldata path, uint256 wireType, bytes calldata value)
        external view returns (bytes memory);
    function append(bytes calldata data, uint256[] calldata path, uint256 wireType, bytes calldata value)
        external view returns (bytes memory);
    function clear(bytes calldata data, uint256[] calldata path) external view returns (bytes memory);

    // Storage
    function store(bytes32 key, bytes calldata data) external;
    function load(address owner, bytes32 key) external view returns (bytes memory data);
    function remove(bytes32 key) external;
    function loadField(address owner, bytes32 key, uint256[] calldata path)
        external view returns (bool found, uint256 wireType, bytes memory value);
    function loadAll(address owner, bytes32 key, uint256[] calldata path)
        external view returns (uint256[] memory wireTypes, bytes[] memory values);
    function storeField(bytes32 key, uint256[] calldata path, uint256 wireType, bytes calldata value) external;
    function appendField(bytes32 key, uint256[] calldata path, uint256 wireType, bytes calldata value) external;
    function clearField(bytes32 key, uint256[] calldata path) external;
}`}</pre></div>
        <p className="text-muted-light small mt-2">
          Source: <code>contracts/protobuf/IProtobuf.sol</code> and the typed helper library{' '}
          <code>contracts/protobuf/Protobuf.sol</code> in the Vitruveo protocol repository.
        </p>
      </section>
    </div>
  );
}
