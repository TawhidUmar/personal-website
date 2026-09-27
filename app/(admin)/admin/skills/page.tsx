import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/guards';
import {
  getAllSkillsWithCategory,
  getAllSkillCategories,
} from '@/lib/repositories/skills.repository';
import { SkillsManager } from '@/components/admin/SkillsManager';

export const metadata: Metadata = {
  title: 'Manage Skills & Domains | Admin',
};

export default async function AdminSkillsPage() {
  await requireAdmin();

  const [skills, categories] = await Promise.all([
    getAllSkillsWithCategory().catch(() => []),
    getAllSkillCategories().catch(() => []),
  ]);

  return (
    <div className="max-w-7xl mx-auto pb-16">
      <SkillsManager initialSkills={skills} categories={categories} />
    </div>
  );
}
