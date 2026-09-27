import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/guards';
import { getAuditLogs } from '@/lib/repositories/audit.repository';
import { AuditLogsViewer } from '@/components/admin/AuditLogsViewer';

export const metadata: Metadata = {
  title: 'Audit Logs & Security | Admin',
};

interface PageProps {
  searchParams: Promise<{
    action?: string;
  }>;
}

export default async function AdminAuditLogsPage({ searchParams }: PageProps) {
  await requireAdmin();
  const params = await searchParams;

  const { logs, total } = await getAuditLogs(1, 100, {
    action: params.action,
  }).catch(() => ({
    logs: [],
    total: 0,
  }));

  return (
    <div className="max-w-7xl mx-auto pb-16">
      <AuditLogsViewer initialLogs={logs} total={total} />
    </div>
  );
}
