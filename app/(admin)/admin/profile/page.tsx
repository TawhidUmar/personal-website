import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/guards';
import { findProfileByUserId } from '@/lib/repositories/profiles.repository';
import { ProfileForm } from '@/components/admin/ProfileForm';

export const metadata: Metadata = {
  title: 'Edit Profile & Bio | Admin',
};

export default async function AdminProfilePage() {
  const admin = await requireAdmin();
  const rawProfile = await findProfileByUserId(admin.id).catch(() => null);
  const profile = rawProfile
    ? { ...rawProfile, name: rawProfile.name || admin.name }
    : {
        id: 0,
        user_id: admin.id,
        name: admin.name,
        email: admin.email,
        headline: null,
        bio: null,
        bio_extended: null,
        avatar_url: null,
        resume_url: null,
        location: null,
        phone: null,
        website: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

  return (
    <div className="max-w-7xl mx-auto pb-16 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
          Profile & Biography CMS
        </h1>
        <p className="text-xs text-[var(--color-muted)] mt-1">
          Update your public researcher bio, contact coordinates, avatar, and downloadable CV.
        </p>
      </div>

      <ProfileForm initialProfile={profile} />
    </div>
  );
}
