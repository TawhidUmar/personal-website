export interface PublicHeadlines {
  // Homepage Hero
  hero_badge: string;
  hero_title_prefix: string;
  hero_title_highlight: string;
  hero_title_suffix: string;
  hero_subtitle: string;
  hero_card_role_badge: string;

  // Homepage Sections
  home_research_badge: string;
  home_research_title: string;
  home_research_description: string;
  home_projects_badge: string;
  home_projects_title: string;
  home_projects_description: string;
  home_articles_badge: string;
  home_articles_title: string;
  home_articles_description: string;
  home_articles_button_text: string;
  home_experience_badge: string;
  home_experience_title: string;
  home_experience_description: string;
  home_skills_badge: string;
  home_skills_title: string;
  home_skills_description: string;
  home_education_badge: string;
  home_education_title: string;
  home_education_description: string;
  home_awards_badge: string;
  home_awards_title: string;
  home_awards_description: string;

  // About Page
  about_badge: string;
  about_title: string;
  about_description: string;
  about_bio_badge: string;
  about_bio_title: string;
  about_edu_badge: string;
  about_edu_title: string;
  about_edu_description: string;
  about_awards_badge: string;
  about_awards_title: string;
  about_awards_description: string;

  // Research Page
  research_badge: string;
  research_title: string;
  research_description: string;

  // Projects Page
  projects_badge: string;
  projects_title: string;
  projects_description: string;

  // Articles Page
  articles_badge: string;
  articles_title: string;
  articles_description: string;

  // Experience Page
  experience_badge: string;
  experience_title: string;
  experience_description: string;

  // Education Page
  education_badge: string;
  education_title: string;
  education_description: string;

  // Skills Page
  skills_badge: string;
  skills_title: string;
  skills_description: string;

  // Contact Page
  contact_badge: string;
  contact_title: string;
  contact_description: string;
  contact_direct_title: string;
  contact_email_label: string;
  contact_location_label: string;
  contact_response_time: string;
  contact_response_time_label: string;
  contact_security_note: string;
  contact_social_title: string;
  contact_form_title: string;
  contact_form_description: string;
}

export const defaultHeadlines: PublicHeadlines = {
  hero_badge: 'Open to AI Research Collaborations & Strategic Roles',
  hero_title_prefix: 'Architecting',
  hero_title_highlight: 'Intelligent Systems',
  hero_title_suffix: 'with Mathematical Precision',
  hero_subtitle: 'Developer · Graduate AI/ML Researcher · Designer · Technical Writer',
  hero_card_role_badge: 'Principal // AI & Systems',

  home_research_badge: 'Scientific Inquiries & Papers',
  home_research_title: 'Featured Research',
  home_research_description: 'Peer-reviewed publications, preprints, and active investigations in deep learning and AI systems.',
  home_projects_badge: 'Production Systems & Open Source',
  home_projects_title: 'Featured Projects',
  home_projects_description: 'Production applications, distributed systems, and open-source contributions.',
  home_articles_badge: 'Technical Dispatches & Insights',
  home_articles_title: 'Latest Writing',
  home_articles_description: 'Technical deep-dives, architectural essays, and research commentary.',
  home_articles_button_text: 'Visit Technical Article Platform',
  home_experience_badge: 'Career & Fellowships',
  home_experience_title: 'Experience & Background',
  home_experience_description: 'Research appointments, engineering roles, and academic foundation.',
  home_skills_badge: 'Core Competencies',
  home_skills_title: 'Technical Skills & Expertise',
  home_skills_description: 'A snapshot of machine learning frameworks, full-stack architectures, and design systems.',
  home_education_badge: 'Academic Credentials',
  home_education_title: 'Education & Training',
  home_education_description: 'Formal degrees and scholarly training from premier research institutions.',
  home_awards_badge: 'Recognition & Credentials',
  home_awards_title: 'Awards & Certifications',
  home_awards_description: 'Professional recognitions, academic honors, and industry-validated certifications.',

  about_badge: 'Professional & Academic Profile',
  about_title: 'Bridging Theoretical AI & Production Systems',
  about_description: 'A multi-disciplinary trajectory spanning foundational machine learning research, full-stack software architecture, and scientific writing.',
  about_bio_badge: 'Academic Narrative',
  about_bio_title: 'Research Focus & Academic Narrative',
  about_edu_badge: 'Academic Pedigree',
  about_edu_title: 'Academic Credentials & Education',
  about_edu_description: 'Formal degrees, graduate fellowships, and academic qualifications from premier institutions.',
  about_awards_badge: 'Honors & Credentials',
  about_awards_title: 'Awards, Honors & Certifications',
  about_awards_description: 'Academic honors, professional recognitions, and industry-validated certifications earned throughout the research and engineering career.',

  research_badge: 'Scientific Manuscripts & Preprints',
  research_title: 'Artificial Intelligence & Machine Learning Research',
  research_description: 'Investigating foundational deep learning architectures, structured state-space sequences, and interpretability bounds.',

  projects_badge: 'Engineering & Systems Portfolio',
  projects_title: 'Production Architectures & Open Source',
  projects_description: 'High-performance runtimes, distributed web platforms, and design systems engineered for scale and speed.',

  articles_badge: 'Technical Writing Platform',
  articles_title: 'Essays, Dispatches & Technical Guides',
  articles_description: 'Rigorous tutorials and theoretical analyses at the intersection of deep learning, systems engineering, and developer experience.',

  experience_badge: 'Career Trajectory',
  experience_title: 'Professional & Research Experience',
  experience_description: 'A chronological record of engineering leadership, deep learning research fellow appointments, and systems architecture roles.',

  education_badge: 'Academic Pedigree',
  education_title: 'Education & Scholarly Training',
  education_description: 'Formal academic grounding in Computer Science, Applied Mathematics, and Machine Intelligence from premier research institutions.',

  skills_badge: 'Core Competencies',
  skills_title: 'Technical Skills & Architecture Stack',
  skills_description: 'A categorized breakdown of machine learning frameworks, full-stack systems, design token tooling, and research environments.',

  contact_badge: 'Direct Inquiries & Transmissions',
  contact_title: 'Initiate a Technical Discussion',
  contact_description: 'Have a question regarding state-space sequence modeling, distributed web architectures, or consulting? Send a transmission below.',
  contact_direct_title: 'Direct Coordinates',
  contact_email_label: 'Electronic Mail',
  contact_location_label: 'Physical Location',
  contact_response_time: 'Within 24 to 48 hours',
  contact_response_time_label: 'Typical Response Time',
  contact_security_note: 'All form transmissions are persisted securely in MySQL and protected by server-side rate limiters.',
  contact_social_title: 'Public Networks & Academic Indices',
  contact_form_title: 'Send an Encrypted Message',
  contact_form_description: 'Inquiries regarding research fellowships, distributed systems consulting, speaking, or writing.',
};
