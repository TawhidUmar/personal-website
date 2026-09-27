'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateSettingsAction } from '@/actions/settings.actions';
import { defaultHeadlines } from '@/types/headlines.types';
import {
  Settings,
  Globe,
  Search,
  Sliders,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Type,
  Layout,
  BookOpen,
  Briefcase,
  GraduationCap,
  Sparkles,
  Mail,
  FileText,
} from 'lucide-react';
import type { DbSetting } from '@/types/db.types';

interface SettingsManagerProps {
  initialSettings: DbSetting[];
}

export function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'general' | 'headlines' | 'seo' | 'features'>('general');

  // Convert array to key-value map
  const settingsMap = new Map<string, string>();
  initialSettings.forEach((s) => {
    settingsMap.set(s.key, s.value ?? '');
  });

  // General tab states
  const [siteName, setSiteName] = useState(settingsMap.get('site_name') ?? 'Portfolio');
  const [siteLogoText, setSiteLogoText] = useState(
    settingsMap.get('site_logo_text') ?? 'portfolio.dev'
  );
  const [siteLogoUrl, setSiteLogoUrl] = useState(settingsMap.get('site_logo_url') ?? '');
  const [siteTagline, setSiteTagline] = useState(
    settingsMap.get('site_tagline') ?? 'AI Researcher & Distributed Systems Architect'
  );
  const [contactEmail, setContactEmail] = useState(
    settingsMap.get('contact_email') ?? 'contact@alexvance.ai'
  );
  const [availabilityStatus, setAvailabilityStatus] = useState(
    settingsMap.get('availability_status') ?? 'Open to research collaborations & select advising'
  );
  const [analyticsId, setAnalyticsId] = useState(settingsMap.get('analytics_id') ?? '');

  // Headlines tab states
  // Homepage Hero
  const [heroBadge, setHeroBadge] = useState(settingsMap.get('hero_badge') ?? defaultHeadlines.hero_badge);
  const [heroTitlePrefix, setHeroTitlePrefix] = useState(settingsMap.get('hero_title_prefix') ?? defaultHeadlines.hero_title_prefix);
  const [heroTitleHighlight, setHeroTitleHighlight] = useState(settingsMap.get('hero_title_highlight') ?? defaultHeadlines.hero_title_highlight);
  const [heroTitleSuffix, setHeroTitleSuffix] = useState(settingsMap.get('hero_title_suffix') ?? defaultHeadlines.hero_title_suffix);
  const [heroSubtitle, setHeroSubtitle] = useState(settingsMap.get('hero_subtitle') ?? defaultHeadlines.hero_subtitle);
  const [heroCardRoleBadge, setHeroCardRoleBadge] = useState(settingsMap.get('hero_card_role_badge') ?? defaultHeadlines.hero_card_role_badge);

  // Homepage Sections
  const [homeResearchBadge, setHomeResearchBadge] = useState(settingsMap.get('home_research_badge') ?? defaultHeadlines.home_research_badge);
  const [homeResearchTitle, setHomeResearchTitle] = useState(settingsMap.get('home_research_title') ?? defaultHeadlines.home_research_title);
  const [homeResearchDesc, setHomeResearchDesc] = useState(settingsMap.get('home_research_description') ?? defaultHeadlines.home_research_description);

  const [homeProjectsBadge, setHomeProjectsBadge] = useState(settingsMap.get('home_projects_badge') ?? defaultHeadlines.home_projects_badge);
  const [homeProjectsTitle, setHomeProjectsTitle] = useState(settingsMap.get('home_projects_title') ?? defaultHeadlines.home_projects_title);
  const [homeProjectsDesc, setHomeProjectsDesc] = useState(settingsMap.get('home_projects_description') ?? defaultHeadlines.home_projects_description);

  const [homeArticlesBadge, setHomeArticlesBadge] = useState(settingsMap.get('home_articles_badge') ?? defaultHeadlines.home_articles_badge);
  const [homeArticlesTitle, setHomeArticlesTitle] = useState(settingsMap.get('home_articles_title') ?? defaultHeadlines.home_articles_title);
  const [homeArticlesDesc, setHomeArticlesDesc] = useState(settingsMap.get('home_articles_description') ?? defaultHeadlines.home_articles_description);
  const [homeArticlesBtnText, setHomeArticlesBtnText] = useState(settingsMap.get('home_articles_button_text') ?? defaultHeadlines.home_articles_button_text);

  const [homeExperienceBadge, setHomeExperienceBadge] = useState(settingsMap.get('home_experience_badge') ?? defaultHeadlines.home_experience_badge);
  const [homeExperienceTitle, setHomeExperienceTitle] = useState(settingsMap.get('home_experience_title') ?? defaultHeadlines.home_experience_title);
  const [homeExperienceDesc, setHomeExperienceDesc] = useState(settingsMap.get('home_experience_description') ?? defaultHeadlines.home_experience_description);

  const [homeSkillsBadge, setHomeSkillsBadge] = useState(settingsMap.get('home_skills_badge') ?? defaultHeadlines.home_skills_badge);
  const [homeSkillsTitle, setHomeSkillsTitle] = useState(settingsMap.get('home_skills_title') ?? defaultHeadlines.home_skills_title);
  const [homeSkillsDesc, setHomeSkillsDesc] = useState(settingsMap.get('home_skills_description') ?? defaultHeadlines.home_skills_description);

  const [homeEducationBadge, setHomeEducationBadge] = useState(settingsMap.get('home_education_badge') ?? defaultHeadlines.home_education_badge);
  const [homeEducationTitle, setHomeEducationTitle] = useState(settingsMap.get('home_education_title') ?? defaultHeadlines.home_education_title);
  const [homeEducationDesc, setHomeEducationDesc] = useState(settingsMap.get('home_education_description') ?? defaultHeadlines.home_education_description);

  const [homeAwardsBadge, setHomeAwardsBadge] = useState(settingsMap.get('home_awards_badge') ?? defaultHeadlines.home_awards_badge);
  const [homeAwardsTitle, setHomeAwardsTitle] = useState(settingsMap.get('home_awards_title') ?? defaultHeadlines.home_awards_title);
  const [homeAwardsDesc, setHomeAwardsDesc] = useState(settingsMap.get('home_awards_description') ?? defaultHeadlines.home_awards_description);

  // About Page
  const [aboutBadge, setAboutBadge] = useState(settingsMap.get('about_badge') ?? defaultHeadlines.about_badge);
  const [aboutTitle, setAboutTitle] = useState(settingsMap.get('about_title') ?? defaultHeadlines.about_title);
  const [aboutDesc, setAboutDesc] = useState(settingsMap.get('about_description') ?? defaultHeadlines.about_description);
  const [aboutBioBadge, setAboutBioBadge] = useState(settingsMap.get('about_bio_badge') ?? defaultHeadlines.about_bio_badge);
  const [aboutBioTitle, setAboutBioTitle] = useState(settingsMap.get('about_bio_title') ?? defaultHeadlines.about_bio_title);
  const [aboutEduBadge, setAboutEduBadge] = useState(settingsMap.get('about_edu_badge') ?? defaultHeadlines.about_edu_badge);
  const [aboutEduTitle, setAboutEduTitle] = useState(settingsMap.get('about_edu_title') ?? defaultHeadlines.about_edu_title);
  const [aboutEduDesc, setAboutEduDesc] = useState(settingsMap.get('about_edu_description') ?? defaultHeadlines.about_edu_description);

  const [aboutAwardsBadge, setAboutAwardsBadge] = useState(settingsMap.get('about_awards_badge') ?? defaultHeadlines.about_awards_badge);
  const [aboutAwardsTitle, setAboutAwardsTitle] = useState(settingsMap.get('about_awards_title') ?? defaultHeadlines.about_awards_title);
  const [aboutAwardsDesc, setAboutAwardsDesc] = useState(settingsMap.get('about_awards_description') ?? defaultHeadlines.about_awards_description);

  // Research Page
  const [researchBadge, setResearchBadge] = useState(settingsMap.get('research_badge') ?? defaultHeadlines.research_badge);
  const [researchTitle, setResearchTitle] = useState(settingsMap.get('research_title') ?? defaultHeadlines.research_title);
  const [researchDesc, setResearchDesc] = useState(settingsMap.get('research_description') ?? defaultHeadlines.research_description);

  // Projects Page
  const [projectsBadge, setProjectsBadge] = useState(settingsMap.get('projects_badge') ?? defaultHeadlines.projects_badge);
  const [projectsTitle, setProjectsTitle] = useState(settingsMap.get('projects_title') ?? defaultHeadlines.projects_title);
  const [projectsDesc, setProjectsDesc] = useState(settingsMap.get('projects_description') ?? defaultHeadlines.projects_description);

  // Articles Page
  const [articlesBadge, setArticlesBadge] = useState(settingsMap.get('articles_badge') ?? defaultHeadlines.articles_badge);
  const [articlesTitle, setArticlesTitle] = useState(settingsMap.get('articles_title') ?? defaultHeadlines.articles_title);
  const [articlesDesc, setArticlesDesc] = useState(settingsMap.get('articles_description') ?? defaultHeadlines.articles_description);

  // Experience Page
  const [experienceBadge, setExperienceBadge] = useState(settingsMap.get('experience_badge') ?? defaultHeadlines.experience_badge);
  const [experienceTitle, setExperienceTitle] = useState(settingsMap.get('experience_title') ?? defaultHeadlines.experience_title);
  const [experienceDesc, setExperienceDesc] = useState(settingsMap.get('experience_description') ?? defaultHeadlines.experience_description);

  // Education Page
  const [educationBadge, setEducationBadge] = useState(settingsMap.get('education_badge') ?? defaultHeadlines.education_badge);
  const [educationTitle, setEducationTitle] = useState(settingsMap.get('education_title') ?? defaultHeadlines.education_title);
  const [educationDesc, setEducationDesc] = useState(settingsMap.get('education_description') ?? defaultHeadlines.education_description);

  // Skills Page
  const [skillsBadge, setSkillsBadge] = useState(settingsMap.get('skills_badge') ?? defaultHeadlines.skills_badge);
  const [skillsTitle, setSkillsTitle] = useState(settingsMap.get('skills_title') ?? defaultHeadlines.skills_title);
  const [skillsDesc, setSkillsDesc] = useState(settingsMap.get('skills_description') ?? defaultHeadlines.skills_description);

  // Contact Page
  const [contactBadge, setContactBadge] = useState(settingsMap.get('contact_badge') ?? defaultHeadlines.contact_badge);
  const [contactTitle, setContactTitle] = useState(settingsMap.get('contact_title') ?? defaultHeadlines.contact_title);
  const [contactDesc, setContactDesc] = useState(settingsMap.get('contact_description') ?? defaultHeadlines.contact_description);
  const [contactDirectTitle, setContactDirectTitle] = useState(settingsMap.get('contact_direct_title') ?? defaultHeadlines.contact_direct_title);
  const [contactEmailLabel, setContactEmailLabel] = useState(settingsMap.get('contact_email_label') ?? defaultHeadlines.contact_email_label);
  const [contactLocationLabel, setContactLocationLabel] = useState(settingsMap.get('contact_location_label') ?? defaultHeadlines.contact_location_label);
  const [contactResponseTime, setContactResponseTime] = useState(settingsMap.get('contact_response_time') ?? defaultHeadlines.contact_response_time);
  const [contactResponseTimeLabel, setContactResponseTimeLabel] = useState(settingsMap.get('contact_response_time_label') ?? defaultHeadlines.contact_response_time_label);
  const [contactSecurityNote, setContactSecurityNote] = useState(settingsMap.get('contact_security_note') ?? defaultHeadlines.contact_security_note);
  const [contactSocialTitle, setContactSocialTitle] = useState(settingsMap.get('contact_social_title') ?? defaultHeadlines.contact_social_title);
  const [contactFormTitle, setContactFormTitle] = useState(settingsMap.get('contact_form_title') ?? defaultHeadlines.contact_form_title);
  const [contactFormDesc, setContactFormDesc] = useState(settingsMap.get('contact_form_description') ?? defaultHeadlines.contact_form_description);

  // SEO tab states
  const [defaultTitle, setDefaultTitle] = useState(
    settingsMap.get('default_meta_title') ?? 'Alex Vance | AI Researcher & Software Architect'
  );
  const [defaultDesc, setDefaultDesc] = useState(
    settingsMap.get('default_meta_description') ??
      'Personal portfolio, peer-reviewed research papers, and technical systems writing by Alex Vance.'
  );
  const [ogImageUrl, setOgImageUrl] = useState(settingsMap.get('og_image_default') ?? '');
  const [twitterHandle, setTwitterHandle] = useState(settingsMap.get('twitter_handle') ?? '@alexvance_ai');

  // Features tab states
  const [enableComments, setEnableComments] = useState(
    settingsMap.get('enable_comments') !== 'false'
  );
  const [enableSearch, setEnableSearch] = useState(
    settingsMap.get('enable_search') !== 'false'
  );
  const [maintenanceMode, setMaintenanceMode] = useState(
    settingsMap.get('maintenance_mode') === 'true'
  );

  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    const formData = new FormData();
    // General
    formData.append('setting__general__string__site_name', siteName);
    formData.append('setting__general__string__site_logo_text', siteLogoText);
    formData.append('setting__general__string__site_logo_url', siteLogoUrl);
    formData.append('setting__general__string__site_tagline', siteTagline);
    formData.append('setting__general__string__contact_email', contactEmail);
    formData.append('setting__general__string__availability_status', availabilityStatus);
    formData.append('setting__general__string__analytics_id', analyticsId);

    // Headlines: Homepage Hero
    formData.append('setting__headlines__string__hero_badge', heroBadge);
    formData.append('setting__headlines__string__hero_title_prefix', heroTitlePrefix);
    formData.append('setting__headlines__string__hero_title_highlight', heroTitleHighlight);
    formData.append('setting__headlines__string__hero_title_suffix', heroTitleSuffix);
    formData.append('setting__headlines__string__hero_subtitle', heroSubtitle);
    formData.append('setting__headlines__string__hero_card_role_badge', heroCardRoleBadge);

    // Headlines: Homepage Sections
    formData.append('setting__headlines__string__home_research_badge', homeResearchBadge);
    formData.append('setting__headlines__string__home_research_title', homeResearchTitle);
    formData.append('setting__headlines__string__home_research_description', homeResearchDesc);

    formData.append('setting__headlines__string__home_projects_badge', homeProjectsBadge);
    formData.append('setting__headlines__string__home_projects_title', homeProjectsTitle);
    formData.append('setting__headlines__string__home_projects_description', homeProjectsDesc);

    formData.append('setting__headlines__string__home_articles_badge', homeArticlesBadge);
    formData.append('setting__headlines__string__home_articles_title', homeArticlesTitle);
    formData.append('setting__headlines__string__home_articles_description', homeArticlesDesc);
    formData.append('setting__headlines__string__home_articles_button_text', homeArticlesBtnText);

    formData.append('setting__headlines__string__home_experience_badge', homeExperienceBadge);
    formData.append('setting__headlines__string__home_experience_title', homeExperienceTitle);
    formData.append('setting__headlines__string__home_experience_description', homeExperienceDesc);

    formData.append('setting__headlines__string__home_skills_badge', homeSkillsBadge);
    formData.append('setting__headlines__string__home_skills_title', homeSkillsTitle);
    formData.append('setting__headlines__string__home_skills_description', homeSkillsDesc);

    formData.append('setting__headlines__string__home_education_badge', homeEducationBadge);
    formData.append('setting__headlines__string__home_education_title', homeEducationTitle);
    formData.append('setting__headlines__string__home_education_description', homeEducationDesc);

    formData.append('setting__headlines__string__home_awards_badge', homeAwardsBadge);
    formData.append('setting__headlines__string__home_awards_title', homeAwardsTitle);
    formData.append('setting__headlines__string__home_awards_description', homeAwardsDesc);

    // Headlines: About Page
    formData.append('setting__headlines__string__about_badge', aboutBadge);
    formData.append('setting__headlines__string__about_title', aboutTitle);
    formData.append('setting__headlines__string__about_description', aboutDesc);
    formData.append('setting__headlines__string__about_bio_badge', aboutBioBadge);
    formData.append('setting__headlines__string__about_bio_title', aboutBioTitle);
    formData.append('setting__headlines__string__about_edu_badge', aboutEduBadge);
    formData.append('setting__headlines__string__about_edu_title', aboutEduTitle);
    formData.append('setting__headlines__string__about_edu_description', aboutEduDesc);

    formData.append('setting__headlines__string__about_awards_badge', aboutAwardsBadge);
    formData.append('setting__headlines__string__about_awards_title', aboutAwardsTitle);
    formData.append('setting__headlines__string__about_awards_description', aboutAwardsDesc);

    // Headlines: Research Page
    formData.append('setting__headlines__string__research_badge', researchBadge);
    formData.append('setting__headlines__string__research_title', researchTitle);
    formData.append('setting__headlines__string__research_description', researchDesc);

    // Headlines: Projects Page
    formData.append('setting__headlines__string__projects_badge', projectsBadge);
    formData.append('setting__headlines__string__projects_title', projectsTitle);
    formData.append('setting__headlines__string__projects_description', projectsDesc);

    // Headlines: Articles Page
    formData.append('setting__headlines__string__articles_badge', articlesBadge);
    formData.append('setting__headlines__string__articles_title', articlesTitle);
    formData.append('setting__headlines__string__articles_description', articlesDesc);

    // Headlines: Experience Page
    formData.append('setting__headlines__string__experience_badge', experienceBadge);
    formData.append('setting__headlines__string__experience_title', experienceTitle);
    formData.append('setting__headlines__string__experience_description', experienceDesc);

    // Headlines: Education Page
    formData.append('setting__headlines__string__education_badge', educationBadge);
    formData.append('setting__headlines__string__education_title', educationTitle);
    formData.append('setting__headlines__string__education_description', educationDesc);

    // Headlines: Skills Page
    formData.append('setting__headlines__string__skills_badge', skillsBadge);
    formData.append('setting__headlines__string__skills_title', skillsTitle);
    formData.append('setting__headlines__string__skills_description', skillsDesc);

    // Headlines: Contact Page
    formData.append('setting__headlines__string__contact_badge', contactBadge);
    formData.append('setting__headlines__string__contact_title', contactTitle);
    formData.append('setting__headlines__string__contact_description', contactDesc);
    formData.append('setting__headlines__string__contact_direct_title', contactDirectTitle);
    formData.append('setting__headlines__string__contact_email_label', contactEmailLabel);
    formData.append('setting__headlines__string__contact_location_label', contactLocationLabel);
    formData.append('setting__headlines__string__contact_response_time', contactResponseTime);
    formData.append('setting__headlines__string__contact_response_time_label', contactResponseTimeLabel);
    formData.append('setting__headlines__string__contact_security_note', contactSecurityNote);
    formData.append('setting__headlines__string__contact_social_title', contactSocialTitle);
    formData.append('setting__headlines__string__contact_form_title', contactFormTitle);
    formData.append('setting__headlines__string__contact_form_description', contactFormDesc);

    // SEO
    formData.append('setting__seo__string__default_meta_title', defaultTitle);
    formData.append('setting__seo__string__default_meta_description', defaultDesc);
    formData.append('setting__seo__string__og_image_default', ogImageUrl);
    formData.append('setting__seo__string__twitter_handle', twitterHandle);

    // Features
    formData.append('setting__features__boolean__enable_comments', String(enableComments));
    formData.append('setting__features__boolean__enable_search', String(enableSearch));
    formData.append('setting__features__boolean__maintenance_mode', String(maintenanceMode));

    startTransition(async () => {
      const res = await updateSettingsAction({ status: 'idle' }, formData);
      if (res.status === 'success') {
        setStatusMsg({ type: 'success', text: res.message });
        router.refresh();
      } else if (res.status === 'error') {
        setStatusMsg({ type: 'error', text: res.error });
      }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
          System Settings & Platform Configuration
        </h1>
        <p className="text-xs text-[var(--color-muted)] mt-1">
          Configure site identity, default search engine optimization tags, and platform features.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`flex items-center gap-2 rounded-xl border p-4 text-xs font-medium ${
            statusMsg.type === 'success'
              ? 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400'
              : 'border-red-500/30 bg-red-500/10 text-red-600'
          }`}
        >
          {statusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-2 text-xs">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all ${
            activeTab === 'general'
              ? 'bg-[var(--color-surface-raised)] text-[var(--color-foreground)] border border-[var(--color-border)] font-semibold'
              : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
          }`}
        >
          <Settings size={15} className="text-[var(--color-accent)]" />
          General & Identity
        </button>

        <button
          onClick={() => setActiveTab('headlines')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all ${
            activeTab === 'headlines'
              ? 'bg-[var(--color-surface-raised)] text-[var(--color-foreground)] border border-[var(--color-border)] font-semibold'
              : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
          }`}
        >
          <Type size={15} className="text-[var(--color-accent)]" />
          Headlines & Descriptions
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all ${
            activeTab === 'seo'
              ? 'bg-[var(--color-surface-raised)] text-[var(--color-foreground)] border border-[var(--color-border)] font-semibold'
              : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
          }`}
        >
          <Globe size={15} className="text-[var(--color-accent)]" />
          SEO & Social Graph
        </button>

        <button
          onClick={() => setActiveTab('features')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all ${
            activeTab === 'features'
              ? 'bg-[var(--color-surface-raised)] text-[var(--color-foreground)] border border-[var(--color-border)] font-semibold'
              : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
          }`}
        >
          <Sliders size={15} className="text-[var(--color-accent)]" />
          Feature Flags
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4 shadow-sm text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Site Name / Author Display Name
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="e.g. Md Tawhidul Islam"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Navbar & Footer Brand Text (Logo)
                </label>
                <input
                  type="text"
                  value={siteLogoText}
                  onChange={(e) => setSiteLogoText(e.target.value)}
                  placeholder="e.g. portfolio.dev or tawhidul.dev"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Custom Logo Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={siteLogoUrl}
                  onChange={(e) => setSiteLogoUrl(e.target.value)}
                  placeholder="e.g. /logo.svg or https://... (leaves empty for default icon)"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Professional Tagline
                </label>
                <input
                  type="text"
                  value={siteTagline}
                  onChange={(e) => setSiteTagline(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Primary Contact Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Analytics Identifier (optional)
                </label>
                <input
                  type="text"
                  value={analyticsId}
                  onChange={(e) => setAnalyticsId(e.target.value)}
                  placeholder="G-XXXXXX or Plausible domain"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[var(--color-foreground)]">
                Availability Badge / Career Status
              </label>
              <input
                type="text"
                value={availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value)}
                placeholder="e.g. Open to research collaborations & select advising"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
            </div>
          </div>
        )}

        {/* Headlines & Descriptions Tab */}
        {activeTab === 'headlines' && (
          <div className="space-y-6 text-xs">
            {/* 1. Homepage Hero */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]">
                <Layout size={16} className="text-[var(--color-accent)]" />
                <h3 className="font-bold text-sm text-[var(--color-foreground)]">
                  Homepage — Hero Showcase
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">
                    Hero Availability Badge
                  </label>
                  <input
                    type="text"
                    value={heroBadge}
                    onChange={(e) => setHeroBadge(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">
                    Hero Image Floating Card Badge
                  </label>
                  <input
                    type="text"
                    value={heroCardRoleBadge}
                    onChange={(e) => setHeroCardRoleBadge(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Hero Main Headline (Prefix · Highlight · Suffix)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={heroTitlePrefix}
                    onChange={(e) => setHeroTitlePrefix(e.target.value)}
                    placeholder="Prefix (e.g. Architecting)"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  />
                  <input
                    type="text"
                    value={heroTitleHighlight}
                    onChange={(e) => setHeroTitleHighlight(e.target.value)}
                    placeholder="Gradient Highlight (e.g. Intelligent Systems)"
                    className="w-full rounded-xl border border-[var(--color-accent-border)] bg-[var(--color-accent-subtle)] px-3 py-2 text-[var(--color-accent)] font-semibold focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  />
                  <input
                    type="text"
                    value={heroTitleSuffix}
                    onChange={(e) => setHeroTitleSuffix(e.target.value)}
                    placeholder="Suffix (e.g. with Mathematical Precision)"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Hero Subtitle / Narrative
                </label>
                <textarea
                  rows={2}
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>
            </div>

            {/* 2. Homepage Section Headers */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-5 shadow-sm">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]">
                <Layout size={16} className="text-[var(--color-accent)]" />
                <h3 className="font-bold text-sm text-[var(--color-foreground)]">
                  Homepage — Section Headers
                </h3>
              </div>

              {/* Research Section */}
              <div className="space-y-2 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]/40">
                <p className="font-semibold text-[var(--color-foreground)]">Featured Research Section</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={homeResearchBadge}
                    onChange={(e) => setHomeResearchBadge(e.target.value)}
                    placeholder="Badge"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                  <input
                    type="text"
                    value={homeResearchTitle}
                    onChange={(e) => setHomeResearchTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                </div>
                <input
                  type="text"
                  value={homeResearchDesc}
                  onChange={(e) => setHomeResearchDesc(e.target.value)}
                  placeholder="Description"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-foreground)]"
                />
              </div>

              {/* Projects Section */}
              <div className="space-y-2 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]/40">
                <p className="font-semibold text-[var(--color-foreground)]">Featured Projects Section</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={homeProjectsBadge}
                    onChange={(e) => setHomeProjectsBadge(e.target.value)}
                    placeholder="Badge"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                  <input
                    type="text"
                    value={homeProjectsTitle}
                    onChange={(e) => setHomeProjectsTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                </div>
                <input
                  type="text"
                  value={homeProjectsDesc}
                  onChange={(e) => setHomeProjectsDesc(e.target.value)}
                  placeholder="Description"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-foreground)]"
                />
              </div>

              {/* Articles Section */}
              <div className="space-y-2 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]/40">
                <p className="font-semibold text-[var(--color-foreground)]">Articles & Writing Section</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={homeArticlesBadge}
                    onChange={(e) => setHomeArticlesBadge(e.target.value)}
                    placeholder="Badge"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                  <input
                    type="text"
                    value={homeArticlesTitle}
                    onChange={(e) => setHomeArticlesTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                </div>
                <input
                  type="text"
                  value={homeArticlesDesc}
                  onChange={(e) => setHomeArticlesDesc(e.target.value)}
                  placeholder="Description"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-foreground)]"
                />
                <input
                  type="text"
                  value={homeArticlesBtnText}
                  onChange={(e) => setHomeArticlesBtnText(e.target.value)}
                  placeholder="Button / Link Text (e.g. Visit Technical Article Platform)"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-foreground)]"
                />
              </div>

              {/* Skills Infographic Section */}
              <div className="space-y-2 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]/40">
                <p className="font-semibold text-[var(--color-foreground)]">Skills Infographic Section</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={homeSkillsBadge}
                    onChange={(e) => setHomeSkillsBadge(e.target.value)}
                    placeholder="Badge"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                  <input
                    type="text"
                    value={homeSkillsTitle}
                    onChange={(e) => setHomeSkillsTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                </div>
                <input
                  type="text"
                  value={homeSkillsDesc}
                  onChange={(e) => setHomeSkillsDesc(e.target.value)}
                  placeholder="Description"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-foreground)]"
                />
              </div>

              {/* Education Infographic Section */}
              <div className="space-y-2 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]/40">
                <p className="font-semibold text-[var(--color-foreground)]">Education Infographic Section</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={homeEducationBadge}
                    onChange={(e) => setHomeEducationBadge(e.target.value)}
                    placeholder="Badge"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                  <input
                    type="text"
                    value={homeEducationTitle}
                    onChange={(e) => setHomeEducationTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                </div>
                <input
                  type="text"
                  value={homeEducationDesc}
                  onChange={(e) => setHomeEducationDesc(e.target.value)}
                  placeholder="Description"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-foreground)]"
                />
              </div>

              {/* Awards Infographic Section */}
              <div className="space-y-2 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]/40">
                <p className="font-semibold text-[var(--color-foreground)]">Awards &amp; Certifications Section</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={homeAwardsBadge}
                    onChange={(e) => setHomeAwardsBadge(e.target.value)}
                    placeholder="Badge"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                  <input
                    type="text"
                    value={homeAwardsTitle}
                    onChange={(e) => setHomeAwardsTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                </div>
                <input
                  type="text"
                  value={homeAwardsDesc}
                  onChange={(e) => setHomeAwardsDesc(e.target.value)}
                  placeholder="Description"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-foreground)]"
                />
              </div>
            </div>

            {/* 3. About Page */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]">
                <BookOpen size={16} className="text-[var(--color-accent)]" />
                <h3 className="font-bold text-sm text-[var(--color-foreground)]">
                  About Page Headlines
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">Header Badge</label>
                  <input
                    type="text"
                    value={aboutBadge}
                    onChange={(e) => setAboutBadge(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">Header Title</label>
                  <input
                    type="text"
                    value={aboutTitle}
                    onChange={(e) => setAboutTitle(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">Header Description</label>
                <input
                  type="text"
                  value={aboutDesc}
                  onChange={(e) => setAboutDesc(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">Biography Title</label>
                  <input
                    type="text"
                    value={aboutBioTitle}
                    onChange={(e) => setAboutBioTitle(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">Education Section Title</label>
                  <input
                    type="text"
                    value={aboutEduTitle}
                    onChange={(e) => setAboutEduTitle(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">Awards Section Badge</label>
                  <input
                    type="text"
                    value={aboutAwardsBadge}
                    onChange={(e) => setAboutAwardsBadge(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">Awards Section Title</label>
                  <input
                    type="text"
                    value={aboutAwardsTitle}
                    onChange={(e) => setAboutAwardsTitle(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)]"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">Awards Section Description</label>
                <input
                  type="text"
                  value={aboutAwardsDesc}
                  onChange={(e) => setAboutAwardsDesc(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)]"
                />
              </div>
            </div>

            {/* 4. Research & Projects Pages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Research Page */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]">
                  <BookOpen size={16} className="text-[var(--color-accent)]" />
                  <h3 className="font-bold text-sm text-[var(--color-foreground)]">Research Page</h3>
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">Badge</label>
                  <input
                    type="text"
                    value={researchBadge}
                    onChange={(e) => setResearchBadge(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">Title</label>
                  <input
                    type="text"
                    value={researchTitle}
                    onChange={(e) => setResearchTitle(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">Description</label>
                  <textarea
                    rows={2}
                    value={researchDesc}
                    onChange={(e) => setResearchDesc(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                </div>
              </div>

              {/* Projects Page */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]">
                  <Layout size={16} className="text-[var(--color-accent)]" />
                  <h3 className="font-bold text-sm text-[var(--color-foreground)]">Projects Page</h3>
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">Badge</label>
                  <input
                    type="text"
                    value={projectsBadge}
                    onChange={(e) => setProjectsBadge(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">Title</label>
                  <input
                    type="text"
                    value={projectsTitle}
                    onChange={(e) => setProjectsTitle(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">Description</label>
                  <textarea
                    rows={2}
                    value={projectsDesc}
                    onChange={(e) => setProjectsDesc(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                </div>
              </div>
            </div>

            {/* 5. Articles & Experience Pages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Articles Page */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]">
                  <FileText size={16} className="text-[var(--color-accent)]" />
                  <h3 className="font-bold text-sm text-[var(--color-foreground)]">Articles Page</h3>
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">Badge</label>
                  <input
                    type="text"
                    value={articlesBadge}
                    onChange={(e) => setArticlesBadge(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">Title</label>
                  <input
                    type="text"
                    value={articlesTitle}
                    onChange={(e) => setArticlesTitle(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">Description</label>
                  <textarea
                    rows={2}
                    value={articlesDesc}
                    onChange={(e) => setArticlesDesc(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                </div>
              </div>

              {/* Experience Page */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]">
                  <Briefcase size={16} className="text-[var(--color-accent)]" />
                  <h3 className="font-bold text-sm text-[var(--color-foreground)]">Experience Page</h3>
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">Badge</label>
                  <input
                    type="text"
                    value={experienceBadge}
                    onChange={(e) => setExperienceBadge(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">Title</label>
                  <input
                    type="text"
                    value={experienceTitle}
                    onChange={(e) => setExperienceTitle(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">Description</label>
                  <textarea
                    rows={2}
                    value={experienceDesc}
                    onChange={(e) => setExperienceDesc(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                </div>
              </div>
            </div>

            {/* 6. Education & Skills Pages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Education Page */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]">
                  <GraduationCap size={15} className="text-[var(--color-accent)]" />
                  <h3 className="font-bold text-xs text-[var(--color-foreground)]">Education Page</h3>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[11px] text-[var(--color-foreground)]">Badge</label>
                  <input
                    type="text"
                    value={educationBadge}
                    onChange={(e) => setEducationBadge(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2.5 py-1 text-[var(--color-foreground)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[11px] text-[var(--color-foreground)]">Title</label>
                  <input
                    type="text"
                    value={educationTitle}
                    onChange={(e) => setEducationTitle(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2.5 py-1 text-[var(--color-foreground)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[11px] text-[var(--color-foreground)]">Description</label>
                  <textarea
                    rows={2}
                    value={educationDesc}
                    onChange={(e) => setEducationDesc(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2.5 py-1 text-[var(--color-foreground)]"
                  />
                </div>
              </div>

              {/* Skills Page */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]">
                  <Sparkles size={15} className="text-[var(--color-accent)]" />
                  <h3 className="font-bold text-xs text-[var(--color-foreground)]">Skills Page</h3>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[11px] text-[var(--color-foreground)]">Badge</label>
                  <input
                    type="text"
                    value={skillsBadge}
                    onChange={(e) => setSkillsBadge(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2.5 py-1 text-[var(--color-foreground)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[11px] text-[var(--color-foreground)]">Title</label>
                  <input
                    type="text"
                    value={skillsTitle}
                    onChange={(e) => setSkillsTitle(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2.5 py-1 text-[var(--color-foreground)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[11px] text-[var(--color-foreground)]">Description</label>
                  <textarea
                    rows={2}
                    value={skillsDesc}
                    onChange={(e) => setSkillsDesc(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2.5 py-1 text-[var(--color-foreground)]"
                  />
                </div>
              </div>
            </div>

            {/* 7. Comprehensive Contact Page & Communications Details */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-[var(--color-accent)]" />
                  <h3 className="font-bold text-sm text-[var(--color-foreground)]">
                    Contact Page & Direct Communications Configuration
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-[var(--color-accent)] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border border-[var(--color-accent-border)] bg-[var(--color-accent-subtle)]">
                  Live Dynamic
                </span>
              </div>

              {/* Contact Page Header */}
              <div className="space-y-3">
                <h4 className="font-semibold text-xs text-[var(--color-foreground)] uppercase tracking-wider text-[var(--color-muted)] font-mono">
                  1. Page Header & Introduction
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[var(--color-foreground)]">Header Badge</label>
                    <input
                      type="text"
                      value={contactBadge}
                      onChange={(e) => setContactBadge(e.target.value)}
                      placeholder="e.g. Direct Inquiries & Transmissions"
                      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--color-foreground)]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[var(--color-foreground)]">Header Title</label>
                    <input
                      type="text"
                      value={contactTitle}
                      onChange={(e) => setContactTitle(e.target.value)}
                      placeholder="e.g. Initiate a Technical Discussion"
                      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--color-foreground)]"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">Header Description</label>
                  <textarea
                    rows={2}
                    value={contactDesc}
                    onChange={(e) => setContactDesc(e.target.value)}
                    placeholder="Brief description underneath page title"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                </div>
              </div>

              {/* Direct Coordinates Card Details */}
              <div className="pt-4 border-t border-[var(--color-border)] space-y-4">
                <h4 className="font-semibold text-xs text-[var(--color-foreground)] uppercase tracking-wider text-[var(--color-muted)] font-mono">
                  2. Direct Coordinates Card
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[var(--color-foreground)]">Card Title</label>
                    <input
                      type="text"
                      value={contactDirectTitle}
                      onChange={(e) => setContactDirectTitle(e.target.value)}
                      placeholder="Direct Coordinates"
                      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--color-foreground)]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[var(--color-foreground)]">Email Channel Label</label>
                    <input
                      type="text"
                      value={contactEmailLabel}
                      onChange={(e) => setContactEmailLabel(e.target.value)}
                      placeholder="Electronic Mail"
                      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--color-foreground)]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[var(--color-foreground)]">Location Label</label>
                    <input
                      type="text"
                      value={contactLocationLabel}
                      onChange={(e) => setContactLocationLabel(e.target.value)}
                      placeholder="Physical Location"
                      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--color-foreground)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[var(--color-foreground)]">Response Time Label</label>
                    <input
                      type="text"
                      value={contactResponseTimeLabel}
                      onChange={(e) => setContactResponseTimeLabel(e.target.value)}
                      placeholder="Typical Response Time"
                      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--color-foreground)]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[var(--color-foreground)]">Typical Response Duration</label>
                    <input
                      type="text"
                      value={contactResponseTime}
                      onChange={(e) => setContactResponseTime(e.target.value)}
                      placeholder="e.g. Within 24 to 48 hours"
                      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--color-foreground)]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">Security & Rate Limiting Notice</label>
                  <textarea
                    rows={2}
                    value={contactSecurityNote}
                    onChange={(e) => setContactSecurityNote(e.target.value)}
                    placeholder="Notice displayed in the security badge at bottom of coordinates card"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                </div>
              </div>

              {/* Social Networks Ribbon Header */}
              <div className="pt-4 border-t border-[var(--color-border)] space-y-3">
                <h4 className="font-semibold text-xs text-[var(--color-foreground)] uppercase tracking-wider text-[var(--color-muted)] font-mono">
                  3. Networks & Academic Indices Card
                </h4>
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">Ribbon Header</label>
                  <input
                    type="text"
                    value={contactSocialTitle}
                    onChange={(e) => setContactSocialTitle(e.target.value)}
                    placeholder="Public Networks & Academic Indices"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                </div>
              </div>

              {/* Interactive Contact Form Texts */}
              <div className="pt-4 border-t border-[var(--color-border)] space-y-3">
                <h4 className="font-semibold text-xs text-[var(--color-foreground)] uppercase tracking-wider text-[var(--color-muted)] font-mono">
                  4. Interactive Contact Form
                </h4>
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">Form Title</label>
                  <input
                    type="text"
                    value={contactFormTitle}
                    onChange={(e) => setContactFormTitle(e.target.value)}
                    placeholder="Send an Encrypted Message"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--color-foreground)]">Form Subtitle / Instructions</label>
                  <textarea
                    rows={2}
                    value={contactFormDesc}
                    onChange={(e) => setContactFormDesc(e.target.value)}
                    placeholder="Inquiries regarding research fellowships, distributed systems consulting, speaking, or writing."
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--color-foreground)]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4 shadow-sm text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-[var(--color-foreground)]">
                Default Meta Title
              </label>
              <input
                type="text"
                value={defaultTitle}
                onChange={(e) => setDefaultTitle(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[var(--color-foreground)]">
                Default Meta Description
              </label>
              <textarea
                rows={3}
                value={defaultDesc}
                onChange={(e) => setDefaultDesc(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-3 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Default Open Graph (OG) Image URL
                </label>
                <input
                  type="text"
                  value={ogImageUrl}
                  onChange={(e) => setOgImageUrl(e.target.value)}
                  placeholder="https://yourname.dev/og-default.png"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--color-foreground)]">
                  Twitter / X Creator Handle
                </label>
                <input
                  type="text"
                  value={twitterHandle}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                  placeholder="@yourhandle"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4 shadow-sm text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]">
              <div>
                <p className="font-semibold text-[var(--color-foreground)]">Article Comments</p>
                <p className="text-[11px] text-[var(--color-muted)] mt-0.5">
                  Allow readers to submit comments and discuss articles.
                </p>
              </div>
              <input
                type="checkbox"
                checked={enableComments}
                onChange={(e) => setEnableComments(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]">
              <div>
                <p className="font-semibold text-[var(--color-foreground)]">Global Search & Command Palette</p>
                <p className="text-[11px] text-[var(--color-muted)] mt-0.5">
                  Enable shortcut modal for searching across articles, research, and projects.
                </p>
              </div>
              <input
                type="checkbox"
                checked={enableSearch}
                onChange={(e) => setEnableSearch(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-red-500/20 bg-red-500/5">
              <div>
                <p className="font-semibold text-red-600 dark:text-red-400">Maintenance Mode</p>
                <p className="text-[11px] text-[var(--color-muted)] mt-0.5">
                  Display a maintenance notice to public visitors while preserving admin access.
                </p>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="h-4 w-4 rounded border-red-500/30 text-red-600 focus:ring-red-500"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] transition-all disabled:opacity-50"
          >
            {isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
