import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/guards';
import { getResearchById } from '@/lib/repositories/research.repository';
import { getAllCategories } from '@/lib/repositories/categories.repository';
import { ResearchForm } from '@/components/admin/ResearchForm';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Edit Research Manuscript | Admin',
};

export default async function EditResearchPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const researchId = Number(id);

  if (isNaN(researchId)) {
    notFound();
  }

  const [research, categories] = await Promise.all([
    getResearchById(researchId),
    getAllCategories('research').catch(() => []),
  ]);

  if (!research) {
    notFound();
  }

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
          Edit Manuscript: {research.title}
        </h1>
        <p className="text-xs text-[var(--color-muted)]">
          Update abstract, methodology, dataset, DOI, or publication status.
        </p>
      </div>

      <ResearchForm categories={categories} initialResearch={research} />
    </div>
  );
}
