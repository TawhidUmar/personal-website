import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/guards';
import { getAllSettings } from '@/lib/repositories/settings.repository';
import { SettingsManager } from '@/components/admin/SettingsManager';

export const metadata: Metadata = {
  title: 'Search Engine Optimization (SEO) | Admin',
};

export default async function AdminSeoPage() {
  await requireAdmin();
  const settings = await getAllSettings().catch(() => []);

  return (
    <div className="max-w-7xl mx-auto pb-16">
      <SettingsManager initialSettings={settings} />
    </div>
  );
}
