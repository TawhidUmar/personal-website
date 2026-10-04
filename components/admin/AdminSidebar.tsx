'use client';

import Link from 'next/link';
import NextImage from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tags,
  Briefcase,
  GraduationCap,
  FlaskConical,
  Image,
  User,
  Star,
  Share2,
  MessageSquare,
  MessageCircle,
  Users,
  Shield,
  Settings,
  Search,
  ScrollText,
  Code2,
  ChevronRight,
  Trophy,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    ],
  },
  {
    title: 'Content',
    items: [
      { href: '/admin/articles', label: 'Articles', icon: <FileText size={16} /> },
      { href: '/admin/categories', label: 'Categories', icon: <FolderOpen size={16} /> },
      { href: '/admin/tags', label: 'Tags', icon: <Tags size={16} /> },
      { href: '/admin/projects', label: 'Projects', icon: <Briefcase size={16} /> },
      { href: '/admin/research', label: 'Research', icon: <FlaskConical size={16} /> },
      { href: '/admin/experience', label: 'Experience', icon: <Star size={16} /> },
      { href: '/admin/education', label: 'Education', icon: <GraduationCap size={16} /> },
      { href: '/admin/awards', label: 'Awards & Certs', icon: <Trophy size={16} /> },
    ],
  },
  {
    title: 'Media',
    items: [
      { href: '/admin/media', label: 'Media Library', icon: <Image size={16} /> },
    ],
  },
  {
    title: 'Profile',
    items: [
      { href: '/admin/profile', label: 'Profile', icon: <User size={16} /> },
      { href: '/admin/skills', label: 'Skills', icon: <Code2 size={16} /> },
      { href: '/admin/social-links', label: 'Social Links', icon: <Share2 size={16} /> },
    ],
  },
  {
    title: 'Communication',
    items: [
      { href: '/admin/messages', label: 'Messages', icon: <MessageSquare size={16} /> },
      { href: '/admin/comments', label: 'Comments', icon: <MessageCircle size={16} /> },
    ],
  },
  {
    title: 'System',
    items: [
      { href: '/admin/users', label: 'Users', icon: <Users size={16} /> },
      { href: '/admin/roles', label: 'Roles', icon: <Shield size={16} /> },
      { href: '/admin/settings', label: 'Settings', icon: <Settings size={16} /> },
      { href: '/admin/seo', label: 'SEO', icon: <Search size={16} /> },
      { href: '/admin/audit-logs', label: 'Audit Logs', icon: <ScrollText size={16} /> },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  return (
    <aside className="flex h-full w-60 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]">
      {/* Brand */}
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-[var(--color-border)] px-4">
        <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md shadow-sm">
          <NextImage
            src="/icon.svg"
            alt="Logo"
            width={28}
            height={28}
            className="h-full w-full object-contain"
          />
        </div>
        <span className="font-mono text-sm font-semibold text-[var(--color-foreground)]">
          Admin<span className="text-[var(--color-accent)]">Panel</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4" aria-label="Admin navigation">
        <ul role="list" className="space-y-5 px-3">
          {sections.map((section) => (
            <li key={section.title}>
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-muted)]">
                {section.title}
              </p>
              <ul role="list" className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={[
                          'group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors duration-150',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
                          active
                            ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                            : 'text-[var(--color-muted)] hover:bg-[var(--color-background)] hover:text-[var(--color-foreground)]',
                        ].join(' ')}
                        aria-current={active ? 'page' : undefined}
                      >
                        <span className={active ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)] group-hover:text-[var(--color-foreground)]'}>
                          {item.icon}
                        </span>
                        {item.label}
                        {active && (
                          <ChevronRight size={12} className="ml-auto text-[var(--color-accent)]" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
