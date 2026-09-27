import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/guards';
import { getAllCategories } from '@/lib/repositories/categories.repository';
import { CategoryManager } from '@/components/admin/CategoryManager';

export const metadata: Metadata = {
  title: 'Manage Categories | Admin',
};

export default async function AdminCategoriesPage() {
  await requireAdmin();

  const categories = await getAllCategories().catch(() => []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
          Content Taxonomies: Categories
        </h1>
        <p className="text-xs text-[var(--color-muted)] mt-1">
          Manage unified classification categories for articles, projects, and research items.
        </p>
      </div>

      <CategoryManager initialCategories={categories} />
    </div>
  );
}
