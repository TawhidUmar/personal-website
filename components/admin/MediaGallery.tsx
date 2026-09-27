'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  createMediaAction,
  updateMediaAction,
  deleteMediaAction,
} from '@/actions/media.actions';
import {
  Plus,
  Copy,
  Check,
  Trash2,
  Edit2,
  Search,
  Folder,
  Image as ImageIcon,
  ExternalLink,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import type { DbMedia } from '@/types/db.types';

interface MediaGalleryProps {
  initialMedia: DbMedia[];
  total: number;
  availableFolders: string[];
}

export function MediaGallery({ initialMedia, total, availableFolders }: MediaGalleryProps) {
  const router = useRouter();
  const [mediaList] = useState<DbMedia[]>(initialMedia);
  const [search, setSearch] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DbMedia | null>(null);

  // Form states
  const [url, setUrl] = useState('');
  const [filename, setFilename] = useState('');
  const [alt, setAlt] = useState('');
  const [caption, setCaption] = useState('');
  const [folder, setFolder] = useState('general');

  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCopyUrl = (id: number, mediaUrl: string) => {
    navigator.clipboard.writeText(mediaUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setUrl('');
    setFilename('');
    setAlt('');
    setCaption('');
    setFolder('general');
    setStatusMsg(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (item: DbMedia) => {
    setEditingItem(item);
    setUrl(item.url);
    setFilename(item.filename);
    setAlt(item.alt ?? '');
    setCaption(item.caption ?? '');
    setFolder(item.folder ?? 'general');
    setStatusMsg(null);
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    const formData = new FormData();
    formData.append('url', url);
    formData.append('filename', filename);
    formData.append('alt', alt);
    formData.append('caption', caption);
    formData.append('folder', folder);

    startTransition(async () => {
      const res = editingItem
        ? await updateMediaAction(editingItem.id, { status: 'idle' }, formData)
        : await createMediaAction({ status: 'idle' }, formData);

      if (res.status === 'success') {
        setStatusMsg({ type: 'success', text: res.message });
        setTimeout(() => {
          setIsAddModalOpen(false);
          router.refresh();
        }, 800);
      } else if (res.status === 'error') {
        setStatusMsg({ type: 'error', text: res.error });
      }
    });
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name} from media library?`)) {
      startTransition(async () => {
        await deleteMediaAction(id);
        router.refresh();
      });
    }
  };

  const filteredMedia = mediaList.filter((item) => {
    const matchesFolder = selectedFolder === 'all' || item.folder === selectedFolder;
    const matchesSearch =
      search.trim() === '' ||
      item.filename.toLowerCase().includes(search.toLowerCase()) ||
      (item.alt && item.alt.toLowerCase().includes(search.toLowerCase()));
    return matchesFolder && matchesSearch;
  });

  const allFolders = Array.from(new Set(['all', ...availableFolders, 'general', 'covers', 'projects', 'research']));

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
            Media Library & Assets
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            {total} digital media assets, paper diagrams, architecture illustrations, and cover graphics.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          Catalog Asset
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {allFolders.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFolder(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono capitalize transition-all shrink-0 ${
                selectedFolder === f
                  ? 'bg-[var(--color-accent)] text-white font-bold shadow-sm'
                  : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-accent-border)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64 shrink-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            placeholder="Search filename or alt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] pl-9 pr-3 py-1.5 text-xs text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden hover:border-[var(--color-accent-border)] transition-all"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video w-full bg-[var(--color-surface-raised)] overflow-hidden">
              <Image
                src={item.url}
                alt={item.alt || item.filename}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized={item.url.startsWith('http')}
              />
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-black/60 text-white backdrop-blur-sm">
                {item.folder}
              </span>
            </div>

            {/* Info */}
            <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2">
              <div>
                <p className="font-mono text-xs font-semibold text-[var(--color-foreground)] truncate" title={item.filename}>
                  {item.filename}
                </p>
                <div className="flex items-center justify-between text-[11px] text-[var(--color-muted)] mt-1 font-mono">
                  <span>{item.mime_type.split('/')[1]?.toUpperCase() || 'IMG'}</span>
                  <span>{formatFileSize(item.size)}</span>
                </div>
                {item.alt && (
                  <p className="text-[11px] text-[var(--color-muted)] line-clamp-1 mt-1 italic">
                    &ldquo;{item.alt}&rdquo;
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)] text-xs">
                <button
                  onClick={() => handleCopyUrl(item.id, item.url)}
                  className="flex items-center gap-1 font-mono text-[11px] text-[var(--color-accent)] hover:underline"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check size={12} className="text-green-500" />
                      <span className="text-green-600 dark:text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1 rounded text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-raised)]"
                    title="Edit Metadata"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.filename)}
                    className="p-1 rounded text-red-500/70 hover:text-red-600 hover:bg-red-500/10"
                    title="Delete Asset"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredMedia.length === 0 && (
          <div className="col-span-full p-12 text-center rounded-2xl border border-dashed border-[var(--color-border)] text-xs text-[var(--color-muted)]">
            No media assets found in this folder or matching query. Click &quot;Catalog Asset&quot; to register image assets.
          </div>
        )}
      </div>

      {/* Catalog / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
              <h2 className="text-lg font-bold text-[var(--color-foreground)]">
                {editingItem ? 'Edit Media Metadata' : 'Catalog New Media Asset'}
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-raised)]"
              >
                <X size={18} />
              </button>
            </div>

            {statusMsg && (
              <div
                className={`flex items-center gap-2 rounded-xl border p-3.5 text-xs ${
                  statusMsg.type === 'success'
                    ? 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400'
                    : 'border-red-500/30 bg-red-500/10 text-red-600'
                }`}
              >
                {statusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{statusMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Image URL / Asset Path *
                </label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or /uploads/graphic.png"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>

              {url && (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-raised)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">
                    Filename *
                  </label>
                  <input
                    type="text"
                    required
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    placeholder="neural-architecture-v1.png"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">
                    Folder Category
                  </label>
                  <select
                    value={folder}
                    onChange={(e) => setFolder(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  >
                    <option value="general">General</option>
                    <option value="covers">Covers</option>
                    <option value="projects">Projects</option>
                    <option value="research">Research</option>
                    <option value="avatars">Avatars</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Alt Text (for accessibility & SEO)
                </label>
                <input
                  type="text"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Diagram showing transformer attention head mechanism"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Caption / Notes (optional)
                </label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Figure 2.1 in multi-head latent dynamics publication"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-3 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] transition-all disabled:opacity-50"
                >
                  {isPending && <Loader2 size={14} className="animate-spin" />}
                  {editingItem ? 'Update Asset' : 'Save Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
