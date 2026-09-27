import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/guards';
import { getContactMessages } from '@/lib/repositories/contact.repository';
import { MessagesManager } from '@/components/admin/MessagesManager';
import type { MessageStatus } from '@/types/db.types';

export const metadata: Metadata = {
  title: 'Inquiries & Messages | Admin',
};

interface PageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function AdminMessagesPage({ searchParams }: PageProps) {
  await requireAdmin();
  const params = await searchParams;
  const status = params.status as MessageStatus | undefined;

  const { messages, total } = await getContactMessages(1, 100, status).catch(() => ({
    messages: [],
    total: 0,
  }));

  return (
    <div className="max-w-7xl mx-auto pb-16">
      <MessagesManager initialMessages={messages} total={total} />
    </div>
  );
}
