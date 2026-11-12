/**
 * Protocol Smart Contract Constants
 * Canonical addresses and gas costs for all Vitruveo PSCs
 * Addresses must stay EIP-55 checksummed: solc and viem reject other mixed-case forms.
 */

export const PSC_ADDRESSES = {
  HOST: '0x0000000000000000000000000000000000000099',
  PASSKEY: '0x00000000000000000000000000000000000000AA',
  SHUFFLE: '0x00000000000000000000000000000000000000AB',
  BATCH_BALANCE: '0x00000000000000000000000000000000000000bb',
  BATCH_BALANCE_NATIVE: '0x00000000000000000000000000000000000000Bc',
  COMPOUND_INTEREST: '0x00000000000000000000000000000000000000cc',
  MERKLE_PROOF: '0x00000000000000000000000000000000000000dd',
  RNG: '0x00000000000000000000000000000000000000ff',
  TREND: '0x00000000000000000000000000000000000000dc',
  PROTOBUF: '0x00000000000000000000000000000000000000B0',
  MULTISIG: '0x00000000000000000000000000000000000000AC',
  FILE_STORE: '0x00000000000000000000000000000000000000f1',
  CONTENT_CREDENTIALS: '0x00000000000000000000000000000000000000ca',
};

export const PSC_GAS = {
  HOST: { base: 125000, description: 'HOST request (25,000 + 100,000 registry lookup)' },
  PASSKEY: { base: 3450, description: 'P-256 signature verification' },
  SHUFFLE: { base: 5000, description: 'Fisher-Yates 52-card shuffle' },
  BATCH_BALANCE: { base: 100, perToken: 30000, description: 'ERC20 balance queries' },
  BATCH_BALANCE_NATIVE: { base: 100, perToken: 30000, description: 'Native + ERC20 balance queries' },
  COMPOUND_INTEREST: { base: 500, perBit: 60, perMul: 40, description: 'Compound interest calculation' },
  MERKLE_PROOF: { base: 1000, perHash: 50, description: 'Merkle proof verification' },
  RNG: { base: 500, description: 'Random number generation' },
  TREND: { perByte: 20, description: 'OLS regression + volatility analysis' },
  PROTOBUF: {
    base: 200,
    perByte: 1,
    perItem: 10,
    load: 2600,
    store: 5000,
    storeByte: 1,
    description: 'Protobuf codec + on-chain message storage',
  },
  MULTISIG: {
    base: 500,
    perByte: 1,
    create: 10000,
    perOwner: 2000,
    scan: 100,
    write: 2000,
    execute: 2000,
    ecdsa: 3000,
    passkey: 3500,
    description: 'Native multisig wallets',
  },
  FILE_STORE: {
    base: 500,
    calldataByte: 2,
    begin: 20000,
    upload: 20000,
    finalize: 20000,
    read: 2600,
    description: 'On-chain file storage (calldata)',
  },
  CONTENT_CREDENTIALS: {
    base: 2000,
    perByte: 1,
    hash: 1,
    signature: 5000,
    write: 5000,
    read: 2600,
    description: 'C2PA manifest verification',
  },
};

// Nodes serve finalized File Storage files at <rpc>/file/<sha256 hex>[.ext]
export const FILE_GATEWAY_URL = 'https://rpc.vitruveo.ai/file';

export const HOST_REGISTRY_ADDRESS = '0xbdc8a59Ec92065848D0a6591F1a67Ce09D5E5FA7';

export const NETWORK_CONFIG = {
  chainId: 1490,
  name: 'Vitruveo',
  rpc: 'https://rpc.vitruveo.ai',
  explorer: 'https://explorer.vitruveo.ai',
  blockTime: 5,
  gasPrice: 4,
};
