import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/guards';
import { getAllMedia } from '@/lib/repositories/media.repository';
import { MediaGallery } from '@/components/admin/MediaGallery';

export const metadata: Metadata = {
  title: 'Media Library & Assets | Admin',
};

interface PageProps {
  searchParams: Promise<{
    folder?: string;
    search?: string;
  }>;
}

export default async function AdminMediaPage({ searchParams }: PageProps) {
  await requireAdmin();
  const params = await searchParams;

  const { media, total, folders } = await getAllMedia({
    folder: params.folder,
    search: params.search,
  }).catch(() => ({
    media: [],
    total: 0,
    folders: ['general', 'covers', 'projects', 'research'],
  }));

  return (
    <div className="max-w-7xl mx-auto pb-16">
      <MediaGallery
        initialMedia={media}
        total={total}
        availableFolders={folders}
      />
    </div>
  );
}
