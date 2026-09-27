// ============================================================
// Database Row Types — matches MySQL schema exactly
// ============================================================

export interface DbUser {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  role_id: number;
  is_active: boolean;
  email_verified_at: Date | null;
  last_login_at: Date | null;
  password_changed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface DbRole {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface DbPermission {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
}

export interface DbProfile {
  id: number;
  user_id: number;
  name?: string | null;
  email?: string | null;
  headline: string | null;
  bio: string | null;
  bio_extended: string | null;
  avatar_url: string | null;
  resume_url: string | null;
  location: string | null;
  phone: string | null;
  website: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface DbSocialLink {
  id: number;
  user_id: number;
  platform: string;
  url: string;
  display_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export type ExperienceType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance' | 'volunteer';

export interface DbExperience {
  id: number;
  user_id: number;
  title: string;
  company: string;
  company_url: string | null;
  location: string | null;
  type: ExperienceType;
  description: string | null;
  technologies: string[] | null;
  start_date: Date;
  end_date: Date | null;
  is_current: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface DbEducation {
  id: number;
  user_id: number;
  institution: string;
  institution_url: string | null;
  degree: string;
  field_of_study: string | null;
  description: string | null;
  activities: string | null;
  gpa: number | null;
  gpa_scale: number | null;
  location: string | null;
  start_date: Date | null;
  end_date: Date | null;
  is_current: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export type AwardCategory = 'award' | 'certification';

export interface DbAward {
  id: number;
  user_id: number;
  title: string;
  issuer: string;
  issuer_url: string | null;
  category: AwardCategory;
  date: Date | null;
  description: string | null;
  badge_url: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface DbSkillCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface DbSkill {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  level: SkillLevel;
  years_of_experience: number | null;
  icon: string | null;
  description: string | null;
  display_order: number;
  is_featured: boolean;
  created_at: Date;
  updated_at: Date;
}

export type CategoryType = 'article' | 'project' | 'research';

export interface DbCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  type: CategoryType;
  color: string | null;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface DbTag {
  id: number;
  name: string;
  slug: string;
  color: string | null;
  created_at: Date;
  updated_at: Date;
}

export type ArticleStatus = 'draft' | 'review' | 'published' | 'archived';

export interface DbArticle {
  id: number;
  author_id: number;
  category_id: number | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  status: ArticleStatus;
  reading_time: number | null;
  is_featured: boolean;
  published_at: Date | null;
  scheduled_at: Date | null;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  view_count: number;
  created_at: Date;
  updated_at: Date;
}

export type ProjectStatus = 'draft' | 'published' | 'archived';

export interface DbProject {
  id: number;
  author_id: number;
  category_id: number | null;
  title: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  hero_image_url: string | null;
  project_url: string | null;
  github_url: string | null;
  client: string | null;
  role: string | null;
  problem: string | null;
  solution: string | null;
  features: string[] | null;
  architecture: string | null;
  challenges: string | null;
  results: string | null;
  status: ProjectStatus;
  is_featured: boolean;
  display_order: number;
  started_at: Date | null;
  ended_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface DbProjectTechnology {
  id: number;
  project_id: number;
  skill_id: number | null;
  name: string;
  display_order: number;
}

export interface DbProjectImage {
  id: number;
  project_id: number;
  url: string;
  alt: string | null;
  caption: string | null;
  display_order: number;
  created_at: Date;
}

export type ResearchStatus = 'ongoing' | 'completed' | 'published' | 'archived';
export type PublicationStatus = 'unpublished' | 'preprint' | 'under-review' | 'published';

export interface DbResearch {
  id: number;
  author_id: number;
  category_id: number | null;
  title: string;
  slug: string;
  abstract: string | null;
  methodology: string | null;
  technologies: string[] | null;
  dataset: string | null;
  status: ResearchStatus;
  publication_status: PublicationStatus;
  publication_url: string | null;
  doi: string | null;
  github_url: string | null;
  is_featured: boolean;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export type CommentStatus = 'pending' | 'approved' | 'spam' | 'rejected';

export interface DbComment {
  id: number;
  article_id: number;
  parent_id: number | null;
  author_name: string;
  author_email: string;
  content: string;
  status: CommentStatus;
  ip_address: string | null;
  user_agent: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface DbMedia {
  id: number;
  uploader_id: number;
  filename: string;
  original_filename: string;
  url: string;
  mime_type: string;
  size: number;
  width: number | null;
  height: number | null;
  alt: string | null;
  caption: string | null;
  folder: string;
  created_at: Date;
  updated_at: Date;
}

export type MessageStatus = 'unread' | 'read' | 'replied' | 'archived';

export interface DbContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  ip_address: string | null;
  user_agent: string | null;
  replied_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export type SettingType = 'string' | 'number' | 'boolean' | 'json';

export interface DbSetting {
  id: number;
  key: string;
  value: string | null;
  type: SettingType;
  group_name: string;
  description: string | null;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface DbAuditLog {
  id: number;
  user_id: number | null;
  action: string;
  entity_type: string | null;
  entity_id: number | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: Date;
}

export interface DbNotification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string | null;
  data: Record<string, unknown> | null;
  is_read: boolean;
  read_at: Date | null;
  created_at: Date;
}

// ============================================================
// Joined / enriched types (for queries with JOINs)
// ============================================================

export interface DbUserWithRole extends DbUser {
  role_name: string;
}

export interface DbArticleWithAuthor extends DbArticle {
  author_name: string;
  author_email: string;
  category_name: string | null;
  category_slug: string | null;
  tags: DbTag[];
}

export interface DbProjectWithDetails extends DbProject {
  category_name: string | null;
  technologies: string[];
  images: DbProjectImage[];
}

export interface DbSkillWithCategory extends DbSkill {
  category_name: string;
  category_slug: string;
}
