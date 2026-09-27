'use server';

import {
  getPublicAllArticles,
  getPublicAllProjects,
  getPublicAllResearch,
} from '@/lib/services/public-data.service';

export interface SearchResultItem {
  id: string;
  type: 'article' | 'project' | 'research' | 'page';
  title: string;
  description: string;
  url: string;
  badge?: string;
}

export async function searchPublicContentAction(
  query: string
): Promise<SearchResultItem[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const [articles, projects, research] = await Promise.all([
    getPublicAllArticles().catch(() => []),
    getPublicAllProjects().catch(() => []),
    getPublicAllResearch().catch(() => []),
  ]);

  const results: SearchResultItem[] = [];

  // 1. Articles
  articles.forEach((a) => {
    if (
      a.title.toLowerCase().includes(q) ||
      (a.excerpt && a.excerpt.toLowerCase().includes(q)) ||
      (a.category_name && a.category_name.toLowerCase().includes(q))
    ) {
      results.push({
        id: `article-${a.id}`,
        type: 'article',
        title: a.title,
        description: a.excerpt ?? a.category_name ?? 'Technical Article',
        url: `/articles/${a.slug}`,
        badge: a.category_name ?? 'Article',
      });
    }
  });

  // 2. Projects
  projects.forEach((p) => {
    if (
      p.title.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      p.technologies.some((t) => t.toLowerCase().includes(q))
    ) {
      results.push({
        id: `project-${p.id}`,
        type: 'project',
        title: p.title,
        description: p.description ?? 'Engineering Architecture',
        url: `/projects/${p.slug}`,
        badge: p.category_name ?? 'Project',
      });
    }
  });

  // 3. Research
  research.forEach((r) => {
    if (
      r.title.toLowerCase().includes(q) ||
      (r.abstract && r.abstract.toLowerCase().includes(q)) ||
      (r.methodology && r.methodology.toLowerCase().includes(q))
    ) {
      results.push({
        id: `research-${r.id}`,
        type: 'research',
        title: r.title,
        description: r.abstract?.slice(0, 100) ?? 'Research Manuscript',
        url: `/research/${r.slug}`,
        badge: r.publication_status.replace('-', ' '),
      });
    }
  });

  // 4. Quick Page Navigation
  const pages = [
    { title: 'Home', description: 'Hero overview and highlights', url: '/' },
    { title: 'About', description: 'Academic biography and philosophy', url: '/about' },
    { title: 'Experience', description: 'Industry and research timeline', url: '/experience' },
    { title: 'Education', description: 'Degrees, coursework, and credentials', url: '/education' },
    { title: 'Skills', description: 'Technical competency matrix', url: '/skills' },
    { title: 'Projects', description: 'Software and systems portfolio', url: '/projects' },
    { title: 'Research', description: 'Academic papers and preprints', url: '/research' },
    { title: 'Articles', description: 'Technical writing and blog dispatches', url: '/articles' },
    { title: 'Contact', description: 'Direct communications and inquiries', url: '/contact' },
  ];

  pages.forEach((p) => {
    if (p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) {
      results.push({
        id: `page-${p.title.toLowerCase()}`,
        type: 'page',
        title: p.title,
        description: p.description,
        url: p.url,
        badge: 'Page',
      });
    }
  });

  return results.slice(0, 15);
}
