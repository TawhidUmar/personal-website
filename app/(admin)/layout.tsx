import { requireAdmin } from '@/lib/auth/guards';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-background)]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopbar user={user} />
        <main
          id="admin-main"
          className="flex-1 overflow-y-auto bg-[var(--color-background)] p-6"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
