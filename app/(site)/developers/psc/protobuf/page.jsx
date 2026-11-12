import { ProtobufHeader } from '@/vitruveo/components/protobuf/protobuf-header';
import { ProtobufExample } from '@/vitruveo/components/protobuf/protobuf-example';
import { ProtobufInfo } from '@/vitruveo/components/protobuf/protobuf-info';

export const metadata = {
  title: 'Protobuf - Protocol Smart Contracts - Vitruveo',
  description: 'Protobuf wire codec and on-chain message storage at 1 gas per byte.',
};

export default function ProtobufPage() {
  return (
    <div className="container py-4">
      <ProtobufHeader />
      <ProtobufExample />
      <ProtobufInfo />
    </div>
  );
}
