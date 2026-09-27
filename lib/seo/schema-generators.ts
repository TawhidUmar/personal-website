import type { DbProfile, DbArticleWithAuthor, DbProjectWithDetails, DbResearch } from '@/types/db.types';

export function generateWebSiteSchema(siteUrl: string, siteName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    description: 'Personal portfolio, AI/ML research profile, and technical engineering blog.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/articles?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generatePersonSchema(
  profile: Partial<DbProfile> | null,
  siteUrl: string,
  socialUrls: string[] = []
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile?.headline ? profile.headline.split('·')[0].trim() : 'Alex Vance',
    jobTitle: profile?.headline ?? 'AI/ML Researcher & Software Architect',
    description: profile?.bio ?? 'Graduate researcher in AI/ML and distributed systems.',
    url: siteUrl,
    image: profile?.avatar_url ?? `${siteUrl}/avatar.png`,
    sameAs: socialUrls,
    knowsAbout: [
      'Artificial Intelligence',
      'Machine Learning',
      'Deep Learning',
      'Distributed Systems',
      'PyTorch',
      'System Architecture',
    ],
  };
}

export function generateArticleSchema(
  article: DbArticleWithAuthor,
  siteUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.excerpt ?? article.seo_description ?? article.title,
    image: article.cover_image_url ? [article.cover_image_url] : [`${siteUrl}/og-default.png`],
    datePublished: article.published_at ? new Date(article.published_at).toISOString() : new Date(article.created_at).toISOString(),
    dateModified: new Date(article.updated_at).toISOString(),
    author: {
      '@type': 'Person',
      name: article.author_name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Alex Vance Research Lab',
      url: siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/articles/${article.slug}`,
    },
    keywords: article.tags ? article.tags.map((t) => t.name).join(', ') : 'AI, Systems, Engineering',
  };
}

export function generateScholarlyArticleSchema(
  research: DbResearch,
  siteUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: research.title,
    abstract: research.abstract ?? undefined,
    url: `${siteUrl}/research/${research.slug}`,
    sameAs: research.publication_url ?? (research.doi ? `https://doi.org/${research.doi}` : undefined),
    datePublished: research.published_at ? new Date(research.published_at).toISOString() : undefined,
    author: {
      '@type': 'Person',
      name: 'Alex Vance',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ArXiv / Academic Press',
    },
    about: research.technologies ?? [],
  };
}

export function generateProjectSchema(
  project: DbProjectWithDetails,
  siteUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description ?? 'Software Engineering System Architecture',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Cloud / Linux / Web',
    url: `${siteUrl}/projects/${project.slug}`,
    softwareRequirements: project.technologies.join(', '),
    author: {
      '@type': 'Person',
      name: 'Alex Vance',
    },
  };
}
