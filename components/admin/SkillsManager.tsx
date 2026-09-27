'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  createSkillAction,
  updateSkillAction,
  deleteSkillAction,
  createSkillCategoryAction,
  deleteSkillCategoryAction,
} from '@/actions/skill.actions';
import { slugify } from '@/lib/utils/slugify';
import {
  Plus,
  Code2,
  FolderPlus,
  Trash2,
  Edit2,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Star,
  Layers,
} from 'lucide-react';
import type { DbSkillCategory, DbSkillWithCategory, SkillLevel } from '@/types/db.types';
import { DynamicIcon } from '@/components/common/DynamicIcon';

const POPULAR_ICONS = [
  'Terminal',
  'Code2',
  'Cpu',
  'BrainCircuit',
  'Database',
  'Globe',
  'Layers',
  'Palette',
  'PenTool',
  'Video',
  'LineChart',
  'Binary',
  'Shield',
  'Sparkles',
  'Boxes',
  'FileCode',
  'Layout',
  'Zap',
];

interface SkillsManagerProps {
  initialSkills: DbSkillWithCategory[];
  categories: DbSkillCategory[];
}

export function SkillsManager({ initialSkills, categories }: SkillsManagerProps) {
  const router = useRouter();
  const [skills] = useState<DbSkillWithCategory[]>(initialSkills);
  const [activeTab, setActiveTab] = useState<number | 'all'>('all');

  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<DbSkillWithCategory | null>(null);

  // Skill form state
  const [skillName, setSkillName] = useState('');
  const [skillSlug, setSkillSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [categoryId, setCategoryId] = useState<string>('');
  const [level, setLevel] = useState<SkillLevel>('advanced');
  const [years, setYears] = useState('');
  const [icon, setIcon] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [isFeatured, setIsFeatured] = useState(false);

  // Category form state
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');

  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleNameChange = (val: string) => {
    setSkillName(val);
    if (autoSlug) {
      setSkillSlug(slugify(val));
    }
  };

  const openAddSkill = () => {
    setEditingSkill(null);
    setSkillName('');
    setSkillSlug('');
    setAutoSlug(true);
    setCategoryId(categories[0] ? String(categories[0].id) : '');
    setLevel('advanced');
    setYears('');
    setIcon('');
    setDescription('');
    setDisplayOrder('0');
    setIsFeatured(false);
    setStatusMsg(null);
    setIsSkillModalOpen(true);
  };

  const openEditSkill = (skill: DbSkillWithCategory) => {
    setEditingSkill(skill);
    setSkillName(skill.name);
    setSkillSlug(skill.slug);
    setAutoSlug(false);
    setCategoryId(String(skill.category_id));
    setLevel(skill.level);
    setYears(skill.years_of_experience ? String(skill.years_of_experience) : '');
    setIcon(skill.icon ?? '');
    setDescription(skill.description ?? '');
    setDisplayOrder(String(skill.display_order ?? 0));
    setIsFeatured(skill.is_featured);
    setStatusMsg(null);
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    const formData = new FormData();
    formData.append('name', skillName);
    formData.append('slug', skillSlug);
    formData.append('categoryId', categoryId);
    formData.append('level', level);
    if (years) formData.append('yearsOfExperience', years);
    formData.append('icon', icon);
    formData.append('description', description);
    formData.append('displayOrder', displayOrder);
    if (isFeatured) formData.append('isFeatured', 'true');

    startTransition(async () => {
      const res = editingSkill
        ? await updateSkillAction(editingSkill.id, { status: 'idle' }, formData)
        : await createSkillAction({ status: 'idle' }, formData);

      if (res.status === 'success') {
        setStatusMsg({ type: 'success', text: res.message });
        setTimeout(() => {
          setIsSkillModalOpen(false);
          router.refresh();
        }, 800);
      } else if (res.status === 'error') {
        setStatusMsg({ type: 'error', text: res.error });
      }
    });
  };

  const handleDeleteSkill = (id: number, name: string) => {
    if (window.confirm(`Delete skill "${name}"?`)) {
      startTransition(async () => {
        await deleteSkillAction(id);
        router.refresh();
      });
    }
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    const formData = new FormData();
    formData.append('name', catName);
    formData.append('slug', catSlug || slugify(catName));
    formData.append('description', catDesc);

    startTransition(async () => {
      const res = await createSkillCategoryAction({ status: 'idle' }, formData);
      if (res.status === 'success') {
        setStatusMsg({ type: 'success', text: res.message });
        setTimeout(() => {
          setIsCategoryModalOpen(false);
          router.refresh();
        }, 800);
      } else if (res.status === 'error') {
        setStatusMsg({ type: 'error', text: res.error });
      }
    });
  };

  const handleDeleteCategory = (id: number, name: string) => {
    if (window.confirm(`Delete domain category "${name}"? Skills under this category will need reassignment.`)) {
      startTransition(async () => {
        const res = await deleteSkillCategoryAction(id);
        if (res.status === 'error') {
          alert(res.error);
        } else {
          router.refresh();
        }
      });
    }
  };

  const filteredSkills = skills.filter((s) => {
    if (activeTab === 'all') return true;
    return s.category_id === activeTab;
  });

  const levelColor: Record<SkillLevel, string> = {
    expert: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    advanced: 'bg-green-500/10 text-green-600 border-green-500/20',
    intermediate: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    beginner: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
            Technical Competencies & Skills
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Manage {skills.length} technical skills across {categories.length} core knowledge domains.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCatName('');
              setCatSlug('');
              setCatDesc('');
              setStatusMsg(null);
              setIsCategoryModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 text-xs font-semibold text-[var(--color-foreground)] hover:border-[var(--color-accent-border)] transition-all"
          >
            <FolderPlus size={15} />
            Add Domain Category
          </button>

          <button
            onClick={openAddSkill}
            className="flex items-center gap-1.5 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] transition-all"
          >
            <Plus size={15} />
            Add Skill
          </button>
        </div>
      </div>

      {/* Domain Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all shrink-0 ${
            activeTab === 'all'
              ? 'bg-[var(--color-accent)] text-white font-bold'
              : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
          }`}
        >
          All Domains ({skills.length})
        </button>

        {categories.map((c) => {
          const count = skills.filter((s) => s.category_id === c.id).length;
          return (
            <div key={c.id} className="relative group shrink-0 flex items-center">
              <button
                onClick={() => setActiveTab(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  activeTab === c.id
                    ? 'bg-[var(--color-accent)] text-white font-bold'
                    : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
                }`}
              >
                {c.name} ({count})
              </button>
              <button
                onClick={() => handleDeleteCategory(c.id, c.name)}
                className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition-opacity ml-1"
                title="Delete Domain Category"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="flex flex-col justify-between p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent-border)] transition-all space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent-border)]">
                    <DynamicIcon name={skill.icon} fallbackKeyword={skill.name} size={16} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-[var(--color-foreground)]">
                      {skill.name}
                    </span>
                    {skill.is_featured && (
                      <span title="Featured Skill">
                        <Star size={13} className="text-amber-500 fill-amber-500" />
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                    levelColor[skill.level]
                  }`}
                >
                  {skill.level}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1.5 text-xs text-[var(--color-muted)] font-mono">
                <span>{skill.category_name}</span>
                {skill.years_of_experience && (
                  <>
                    <span>•</span>
                    <span>{skill.years_of_experience} yrs exp</span>
                  </>
                )}
              </div>

              {skill.description && (
                <p className="text-xs text-[var(--color-muted)] mt-2 line-clamp-2">
                  {skill.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)] text-xs">
              <span className="font-mono text-[10px] text-[var(--color-muted)]">
                Order #{skill.display_order}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditSkill(skill)}
                  className="p-1 rounded text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-raised)]"
                  title="Edit Skill"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => handleDeleteSkill(skill.id, skill.name)}
                  className="p-1 rounded text-red-500/70 hover:text-red-600 hover:bg-red-500/10"
                  title="Delete Skill"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredSkills.length === 0 && (
          <div className="col-span-full p-12 text-center rounded-2xl border border-dashed border-[var(--color-border)] text-xs text-[var(--color-muted)]">
            No technical skills found in this domain. Click &quot;Add Skill&quot; to begin cataloging competencies.
          </div>
        )}
      </div>

      {/* Add / Edit Skill Modal */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <h2 className="text-base font-bold text-[var(--color-foreground)]">
                {editingSkill ? 'Edit Technical Skill' : 'Add Technical Skill'}
              </h2>
              <button
                onClick={() => setIsSkillModalOpen(false)}
                className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-raised)]"
              >
                <X size={16} />
              </button>
            </div>

            {statusMsg && (
              <div
                className={`flex items-center gap-2 rounded-xl border p-3 text-xs ${
                  statusMsg.type === 'success'
                    ? 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400'
                    : 'border-red-500/30 bg-red-500/10 text-red-600'
                }`}
              >
                {statusMsg.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                <span>{statusMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveSkill} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">
                    Skill Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={skillName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. PyTorch / CUDA"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={skillSlug}
                    onChange={(e) => {
                      setAutoSlug(false);
                      setSkillSlug(e.target.value);
                    }}
                    placeholder="pytorch"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">
                    Domain Category *
                  </label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">
                    Proficiency Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as SkillLevel)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  >
                    <option value="expert">Expert</option>
                    <option value="advanced">Advanced</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="beginner">Beginner</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    placeholder="4.5"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] font-mono"
                  />
                </div>
              </div>

              {/* Dynamic Icon Picker & Preview */}
              <div className="space-y-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-3">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-[var(--color-foreground)]">
                    Skill Icon / Symbol
                  </label>
                  <span className="font-mono text-[10px] text-[var(--color-muted)]">
                    Lucide name or Image URL
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-accent-border)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] shadow-sm">
                    <DynamicIcon name={icon} fallbackKeyword={skillName} size={20} />
                  </div>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="e.g. Terminal, Cpu, Database, Palette, Video..."
                    className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] font-mono text-xs"
                  />
                  {icon && (
                    <button
                      type="button"
                      onClick={() => setIcon('')}
                      className="px-2 py-1 text-[11px] rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="pt-2 border-t border-[var(--color-border)]/60">
                  <span className="text-[10px] font-mono text-[var(--color-muted)] block mb-1.5">
                    Quick Preset Icons:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {POPULAR_ICONS.map((pIcon) => {
                      const isSelected = icon?.toLowerCase() === pIcon.toLowerCase();
                      return (
                        <button
                          key={pIcon}
                          type="button"
                          onClick={() => setIcon(pIcon)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono border transition-all ${
                            isSelected
                              ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-xs'
                              : 'bg-[var(--color-surface)] text-[var(--color-foreground)] border-[var(--color-border)] hover:border-[var(--color-accent-border)]'
                          }`}
                        >
                          <DynamicIcon name={pIcon} size={12} />
                          <span>{pIcon}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredSkill"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                />
                <label
                  htmlFor="featuredSkill"
                  className="text-xs font-medium text-[var(--color-foreground)] cursor-pointer"
                >
                  Feature in homepage competencies highlight
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Description / Specific Highlights
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Custom CUDA autograd kernels, FlashAttention-2 integrations, tensor parallel training..."
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-3 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] transition-all disabled:opacity-50"
                >
                  {isPending && <Loader2 size={13} className="animate-spin" />}
                  {editingSkill ? 'Update Skill' : 'Save Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Domain Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <h2 className="text-base font-bold text-[var(--color-foreground)]">
                Add Knowledge Domain Category
              </h2>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-raised)]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value);
                    setCatSlug(slugify(e.target.value));
                  }}
                  placeholder="e.g. Reinforcement Learning & Robotics"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Category Slug *
                </label>
                <input
                  type="text"
                  required
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  placeholder="reinforcement-learning"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Policy gradient methods, sim-to-real transfer, and reward modeling"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-3 text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] transition-all disabled:opacity-50"
                >
                  {isPending && <Loader2 size={13} className="animate-spin" />}
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
