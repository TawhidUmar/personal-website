import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/guards';
import { findSocialLinksByUserId } from '@/lib/repositories/profiles.repository';
import { SocialLinksManager } from '@/components/admin/SocialLinksManager';

export const metadata: Metadata = {
  title: 'Social Links & Profiles | Admin',
};

export default async function AdminSocialLinksPage() {
  const admin = await requireAdmin();
  const links = await findSocialLinksByUserId(admin.id).catch(() => []);

  return (
    <div className="max-w-7xl mx-auto pb-16">
      <SocialLinksManager initialLinks={links} />
    </div>
  );
}
