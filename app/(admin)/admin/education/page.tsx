import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/guards';
import { getAllEducation } from '@/lib/repositories/education.repository';
import { EducationManager } from '@/components/admin/EducationManager';

export const metadata: Metadata = {
  title: 'Manage Education & Credentials | Admin',
};

export default async function AdminEducationPage() {
  await requireAdmin();
  const education = await getAllEducation().catch(() => []);

  return (
    <div className="max-w-7xl mx-auto pb-16">
      <EducationManager initialEducation={education} />
    </div>
  );
}
