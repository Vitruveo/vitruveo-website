import { ContentCredentialsHeader } from '@/vitruveo/components/content-credentials/content-credentials-header';
import { ContentCredentialsExample } from '@/vitruveo/components/content-credentials/content-credentials-example';
import { ContentCredentialsInfo } from '@/vitruveo/components/content-credentials/content-credentials-info';

export const metadata = {
  title: 'Content Credentials - Protocol Smart Contracts - Vitruveo',
  description: 'Verify C2PA Content Credentials on chain against a multisig-controlled trust list.',
};

export default function ContentCredentialsPage() {
  return (
    <div className="container py-4">
      <ContentCredentialsHeader />
      <ContentCredentialsExample />
      <ContentCredentialsInfo />
    </div>
  );
}
