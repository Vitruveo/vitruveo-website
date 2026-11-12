import { MultisigHeader } from '@/vitruveo/components/multisig/multisig-header';
import { MultisigExample } from '@/vitruveo/components/multisig/multisig-example';
import { MultisigInfo } from '@/vitruveo/components/multisig/multisig-info';

export const metadata = {
  title: 'Multisig - Protocol Smart Contracts - Vitruveo',
  description: 'Native multisig wallets with EOA and passkey owners and batched contract execution.',
};

export default function MultisigPage() {
  return (
    <div className="container py-4">
      <MultisigHeader />
      <MultisigExample />
      <MultisigInfo />
    </div>
  );
}
