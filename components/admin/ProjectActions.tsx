'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteProjectAction } from '@/actions/project.actions';
import { MoreHorizontal, Edit, Eye, Trash2, Loader2 } from 'lucide-react';

interface ProjectActionsProps {
  projectId: number;
  slug: string;
}

export function ProjectActions({ projectId, slug }: ProjectActionsProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setIsOpen(false);
      startTransition(async () => {
        await deleteProjectAction(projectId);
        router.refresh();
      });
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] transition-colors disabled:opacity-50"
      >
        {isPending ? <Loader2 size={14} className="animate-spin" /> : <MoreHorizontal size={14} />}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-50 mt-1 w-44 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 shadow-xl text-xs font-medium space-y-0.5">
            <Link
              href={`/projects/${slug}`}
              target="_blank"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[var(--color-foreground)] hover:bg-[var(--color-surface-raised)] transition-colors"
            >
              <Eye size={13} />
              View Case Study
            </Link>

            <Link
              href={`/admin/projects/${projectId}/edit`}
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[var(--color-foreground)] hover:bg-[var(--color-surface-raised)] transition-colors"
            >
              <Edit size={13} />
              Edit Project
            </Link>

            <div className="my-1 border-t border-[var(--color-border)]" />

            <button
              onClick={handleDelete}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-red-600 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={13} />
              Delete Project
            </button>
          </div>
        </>
      )}
    </div>
  );
}
