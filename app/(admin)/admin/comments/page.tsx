import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/guards';
import { getAdminComments } from '@/lib/repositories/comments.repository';
import { CommentsManager } from '@/components/admin/CommentsManager';
import type { CommentStatus } from '@/types/db.types';

export const metadata: Metadata = {
  title: 'Comments Moderation | Admin',
};

interface PageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function AdminCommentsPage({ searchParams }: PageProps) {
  await requireAdmin();
  const params = await searchParams;
  const status = params.status as CommentStatus | undefined;

  const { comments, total } = await getAdminComments(1, 100, status).catch(() => ({
    comments: [],
    total: 0,
  }));

  return (
    <div className="max-w-7xl mx-auto pb-16">
      <CommentsManager initialComments={comments} total={total} />
    </div>
  );
}
