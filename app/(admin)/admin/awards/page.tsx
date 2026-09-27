import { getAllAwards } from '@/lib/repositories/awards.repository';
import { AwardsManager } from '@/components/admin/AwardsManager';

export const metadata = {
  title: 'Awards & Certifications | Admin',
};

export default async function AdminAwardsPage() {
  const awards = await getAllAwards();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <AwardsManager initialAwards={awards} />
    </div>
  );
}
