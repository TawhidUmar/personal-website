import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/guards';
import { getAllCategories } from '@/lib/repositories/categories.repository';
import { ResearchForm } from '@/components/admin/ResearchForm';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Publish Research Manuscript | Admin',
};

export default async function NewResearchPage() {
  await requireAdmin();
  const categories = await getAllCategories('research').catch(() => []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="space-y-2">
        <Link
          href="/admin/research"
          className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Research Directory
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
          Publish Research Manuscript
        </h1>
        <p className="text-xs text-[var(--color-muted)]">
          Catalog an academic paper, preprint, conference poster, or AI/ML methodology.
        </p>
      </div>

      <ResearchForm categories={categories} />
    </div>
  );
}
