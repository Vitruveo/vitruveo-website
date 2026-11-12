import { FileStorageHeader } from '@/vitruveo/components/file-storage/file-storage-header';
import { FileStorageExample } from '@/vitruveo/components/file-storage/file-storage-example';
import { FileStorageSample } from '@/vitruveo/components/file-storage/file-storage-sample';
import { FileStorageInfo } from '@/vitruveo/components/file-storage/file-storage-info';

export const metadata = {
  title: 'File Storage - Protocol Smart Contracts - Vitruveo',
  description: 'Store files up to 10 MB on chain at 2 gas per calldata byte, served over HTTP at /file/<sha256>.',
};

export default function FileStoragePage() {
  return (
    <div className="container py-4">
      <FileStorageHeader />
      <FileStorageExample />
      <FileStorageSample />
      <FileStorageInfo />
    </div>
  );
}
