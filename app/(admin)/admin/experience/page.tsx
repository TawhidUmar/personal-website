import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/guards';
import { getAllExperiences } from '@/lib/repositories/experiences.repository';
import { ExperienceManager } from '@/components/admin/ExperienceManager';

export const metadata: Metadata = {
  title: 'Manage Experience | Admin',
};

export default async function AdminExperiencePage() {
  await requireAdmin();
  const experiences = await getAllExperiences().catch(() => []);

  return (
    <div className="max-w-7xl mx-auto pb-16">
      <ExperienceManager initialExperiences={experiences} />
    </div>
  );
}
