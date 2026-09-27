import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/guards';
import { getAllTags } from '@/lib/repositories/tags.repository';
import { TagManager } from '@/components/admin/TagManager';

export const metadata: Metadata = {
  title: 'Manage Tags | Admin',
};

export default async function AdminTagsPage() {
  await requireAdmin();

  const tags = await getAllTags().catch(() => []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
          Content Taxonomies: Tags
        </h1>
        <p className="text-xs text-[var(--color-muted)] mt-1">
          Create and manage indexing tags applied across articles and publications.
        </p>
      </div>

      <TagManager initialTags={tags} />
    </div>
  );
}
