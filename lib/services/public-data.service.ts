import { getAllExperiences } from '@/lib/repositories/experiences.repository';
import { getAllEducation } from '@/lib/repositories/education.repository';
import { getSkillCategoriesWithSkills, SkillCategoryWithSkills } from '@/lib/repositories/skills.repository';
import { getFeaturedProjects } from '@/lib/repositories/projects.repository';
import { getFeaturedResearch, ResearchWithCategory } from '@/lib/repositories/research.repository';
import { getFeaturedArticles } from '@/lib/repositories/articles.repository';
import { findProfileByUserId, findSocialLinksByUserId } from '@/lib/repositories/profiles.repository';
import { getFeaturedAwards } from '@/lib/repositories/awards.repository';
import type { DbExperience, DbEducation, DbProjectWithDetails, DbArticleWithAuthor, DbProfile, DbSocialLink, DbAward } from '@/types/db.types';

// ============================================================================
// Fallback / Initial Seed Profile Data (Matches Full Spec Persona)
// Developer, Graduate AI/ML Researcher, Designer, Graduate Student, Technical Writer
// ============================================================================

export const fallbackProfile: DbProfile & { social_links: DbSocialLink[] } = {
  id: 1,
  user_id: 1,
  name: 'Md Tawhidul Islam',
  email: 'contact@tawhidulislam.me',
  headline: 'AI/ML Researcher · Full-Stack Architect · Systems Designer',
  bio: 'Graduate researcher in Deep Learning and Neuro-symbolic AI. I engineer scalable distributed systems, design intuitive research interfaces, and write technical dispatches on modern machine intelligence.',
  bio_extended: `I bridge the divide between theoretical AI/ML research and production-grade software engineering. As a graduate student and researcher, my primary interests center on foundation models, geometric deep learning, and efficient inference architectures for low-resource environments.

Outside the laboratory, I design and build production-grade full-stack systems, craft technical publications read by thousands of engineers, and mentor aspiring computer science and engineering students. My work is defined by mathematical rigor, architectural clarity, and obsessive attention to user experience.`,
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
  resume_url: '/resume.pdf',
  location: 'Cambridge, MA / Remote',
  phone: '+1 (555) 019-2834',
  website: 'https://tawhidulislam.me',
  created_at: new Date('2024-01-01'),
  updated_at: new Date('2024-01-01'),
  social_links: [
    { id: 1, user_id: 1, platform: 'GitHub', url: 'https://github.com/TawhidUmar', display_order: 1, is_active: true, created_at: new Date(), updated_at: new Date() },
    { id: 2, user_id: 1, platform: 'Google Scholar', url: 'https://scholar.google.com', display_order: 2, is_active: true, created_at: new Date(), updated_at: new Date() },
    { id: 3, user_id: 1, platform: 'arXiv', url: 'https://arxiv.org', display_order: 3, is_active: true, created_at: new Date(), updated_at: new Date() },
    { id: 4, user_id: 1, platform: 'X / Twitter', url: 'https://x.com', display_order: 4, is_active: true, created_at: new Date(), updated_at: new Date() },
    { id: 5, user_id: 1, platform: 'LinkedIn', url: 'https://linkedin.com', display_order: 5, is_active: true, created_at: new Date(), updated_at: new Date() },
  ],
};

export const fallbackExperiences: DbExperience[] = [
  {
    id: 1,
    user_id: 1,
    title: 'Lead AI Systems Engineer & Graduate Fellow',
    company: 'Neural Synthesis Labs',
    company_url: 'https://example.com',
    location: 'Cambridge, MA',
    type: 'full-time',
    description: 'Spearheading the engineering of distributed tensor pipelines and hardware-accelerated inference engines. Architected custom quantization and distillation pipelines cutting latency by 42% on commodity edge hardware.',
    technologies: ['PyTorch', 'CUDA', 'Next.js', 'TypeScript', 'Rust', 'Triton', 'Docker'],
    start_date: new Date('2023-06-01'),
    end_date: null,
    is_current: true,
    display_order: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    user_id: 1,
    title: 'Graduate AI Researcher & Teaching Associate',
    company: 'Computational Cognition Group',
    company_url: 'https://example.com',
    location: 'Boston, MA',
    type: 'part-time',
    description: 'Investigating state-space sequence models and mechanistic interpretability of transformer representations. Authored 2 peer-reviewed workshop papers and led laboratory sessions for 140+ graduate machine learning students.',
    technologies: ['Python', 'JAX', 'Flax', 'WandB', 'Hugging Face', 'LaTeX'],
    start_date: new Date('2022-09-01'),
    end_date: null,
    is_current: true,
    display_order: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    user_id: 1,
    title: 'Senior Full-Stack Software Engineer',
    company: 'Aetheria Systems',
    company_url: 'https://example.com',
    location: 'New York, NY (Remote)',
    type: 'full-time',
    description: 'Designed real-time telemetry dashboards and resilient microservices handling 250k daily active sessions. Pioneered the internal design system used by 4 product engineering squads.',
    technologies: ['React', 'Next.js', 'Node.js', 'Go', 'PostgreSQL', 'Tailwind CSS', 'Redis'],
    start_date: new Date('2021-01-01'),
    end_date: new Date('2022-08-15'),
    is_current: false,
    display_order: 3,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 4,
    user_id: 1,
    title: 'Machine Learning Engineering Intern',
    company: 'Vanguard DeepTech Research',
    company_url: 'https://example.com',
    location: 'San Francisco, CA',
    type: 'internship',
    description: 'Developed automated evaluation harnesses for multimodal vision-language models. Reduced hallucination rates across synthetic benchmarks by 18% via contrastive decoding.',
    technologies: ['PyTorch', 'Transformers', 'FastAPI', 'MLflow', 'Kubernetes'],
    start_date: new Date('2020-05-01'),
    end_date: new Date('2020-08-31'),
    is_current: false,
    display_order: 4,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export const fallbackEducation: DbEducation[] = [
  {
    id: 1,
    user_id: 1,
    institution: 'Massachusetts Institute of Technology / Harvard Affiliated Consortium',
    institution_url: 'https://mit.edu',
    degree: 'Master of Science in Computer Science & Artificial Intelligence',
    field_of_study: 'Machine Learning & Computational Systems',
    description: 'Focusing on efficient foundation model architectures, geometric representations, and scalable inference. Thesis: "Sparse Attentive Projections in Deep State-Space Models".',
    activities: 'President, AI Graduate Reading Guild · Head Teaching Assistant for Advanced Deep Learning · Recipient of Outstanding Research Fellowship',
    gpa: 3.96,
    gpa_scale: 4.00,
    location: 'Cambridge, MA',
    start_date: new Date('2022-09-01'),
    end_date: new Date('2024-06-01'),
    is_current: false,
    display_order: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    user_id: 1,
    institution: 'University of California, Berkeley',
    institution_url: 'https://berkeley.edu',
    degree: 'Bachelor of Science with High Honors',
    field_of_study: 'Computer Science & Applied Mathematics',
    description: 'Graduated Magna Cum Laude. Focused on discrete algorithms, linear algebra, distributed systems, and human-computer interaction.',
    activities: 'Lead Editor, Berkeley Science Review · Founder, Undergraduate Systems & Graphics Guild · Dean’s Honor List (All Semesters)',
    gpa: 3.92,
    gpa_scale: 4.00,
    location: 'Berkeley, CA',
    start_date: new Date('2017-08-15'),
    end_date: new Date('2021-05-20'),
    is_current: false,
    display_order: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export const fallbackSkillCategories: SkillCategoryWithSkills[] = [
  {
    id: 1,
    name: 'AI, Machine Learning & Research',
    slug: 'ai-ml',
    description: 'Deep neural networks, mathematical formulation, inference acceleration, and model interpretability.',
    display_order: 1,
    created_at: new Date(),
    updated_at: new Date(),
    skills: [
      { id: 1, category_id: 1, name: 'PyTorch & TorchScript', slug: 'pytorch', level: 'expert', years_of_experience: 5, icon: 'BrainCircuit', description: 'Custom autograd, distributed training, pipeline parallelism', display_order: 1, is_featured: true, created_at: new Date(), updated_at: new Date() },
      { id: 2, category_id: 1, name: 'JAX & Flax', slug: 'jax', level: 'advanced', years_of_experience: 3, icon: 'Zap', description: 'Functional autodiff, XLA compilation, vmap/pmap pipelines', display_order: 2, is_featured: true, created_at: new Date(), updated_at: new Date() },
      { id: 3, category_id: 1, name: 'CUDA & Triton Kernels', slug: 'cuda', level: 'advanced', years_of_experience: 2, icon: 'Cpu', description: 'Memory hierarchy optimization, flash attention implementations', display_order: 3, is_featured: true, created_at: new Date(), updated_at: new Date() },
      { id: 4, category_id: 1, name: 'Hugging Face Ecosystem', slug: 'huggingface', level: 'expert', years_of_experience: 4, icon: 'Layers', description: 'PEFT, LoRA, quantization (bitsandbytes, AWQ, GGUF)', display_order: 4, is_featured: false, created_at: new Date(), updated_at: new Date() },
      { id: 5, category_id: 1, name: 'Model Evaluation & Alignment', slug: 'eval-alignment', level: 'advanced', years_of_experience: 3, icon: 'Target', description: 'RLHF, DPO, benchmark harness development, safety auditing', display_order: 5, is_featured: false, created_at: new Date(), updated_at: new Date() },
    ],
  },
  {
    id: 2,
    name: 'Full-Stack & Systems Architecture',
    slug: 'systems-fullstack',
    description: 'Production-ready web platforms, high-throughput APIs, and reactive frontend architectures.',
    display_order: 2,
    created_at: new Date(),
    updated_at: new Date(),
    skills: [
      { id: 6, category_id: 2, name: 'TypeScript & JavaScript', slug: 'typescript', level: 'expert', years_of_experience: 6, icon: 'FileCode', description: 'Strict typing, AST manipulation, library authoring', display_order: 1, is_featured: true, created_at: new Date(), updated_at: new Date() },
      { id: 7, category_id: 2, name: 'Next.js & React 19', slug: 'nextjs', level: 'expert', years_of_experience: 5, icon: 'Globe', description: 'App Router, Server Components, Streaming, SSR optimization', display_order: 2, is_featured: true, created_at: new Date(), updated_at: new Date() },
      { id: 8, category_id: 2, name: 'Python & FastAPI', slug: 'python', level: 'expert', years_of_experience: 6, icon: 'Terminal', description: 'Async event loops, Pydantic, scientific computing ecosystem', display_order: 3, is_featured: true, created_at: new Date(), updated_at: new Date() },
      { id: 9, category_id: 2, name: 'Rust', slug: 'rust', level: 'intermediate', years_of_experience: 2, icon: 'Shield', description: 'Memory safety, Tokio concurrency, WASM modules', display_order: 4, is_featured: false, created_at: new Date(), updated_at: new Date() },
      { id: 10, category_id: 2, name: 'MySQL & PostgreSQL', slug: 'sql', level: 'expert', years_of_experience: 5, icon: 'Database', description: 'Schema normalization, query indexing, transactions, EXPLAIN plans', display_order: 5, is_featured: true, created_at: new Date(), updated_at: new Date() },
    ],
  },
  {
    id: 3,
    name: 'UI/UX Design & Creative Motion',
    slug: 'design-motion',
    description: 'Hi-tech technical aesthetic, design systems, editorial typography, and physics-driven micro-interactions.',
    display_order: 3,
    created_at: new Date(),
    updated_at: new Date(),
    skills: [
      { id: 11, category_id: 3, name: 'Tailwind CSS & Design Tokens', slug: 'tailwind', level: 'expert', years_of_experience: 5, icon: 'Palette', description: 'Custom CSS property architectures, responsive layouts, Tailwind v4', display_order: 1, is_featured: true, created_at: new Date(), updated_at: new Date() },
      { id: 12, category_id: 3, name: 'Framer Motion & Motion', slug: 'motion', level: 'advanced', years_of_experience: 4, icon: 'Sparkles', description: 'Shared layout animations, spring physics, accessible transitions', display_order: 2, is_featured: true, created_at: new Date(), updated_at: new Date() },
      { id: 13, category_id: 3, name: 'Figma & Design Systems', slug: 'figma', level: 'advanced', years_of_experience: 5, icon: 'Layout', description: 'Component libraries, token synchronization, interactive prototypes', display_order: 3, is_featured: false, created_at: new Date(), updated_at: new Date() },
      { id: 14, category_id: 3, name: 'Accessibility & WAI-ARIA', slug: 'a11y', level: 'advanced', years_of_experience: 4, icon: 'Eye', description: 'Keyboard navigation, screen reader ergonomics, WCAG 2.1 AAA contrast', display_order: 4, is_featured: false, created_at: new Date(), updated_at: new Date() },
    ],
  },
  {
    id: 4,
    name: 'Technical Writing & Scientific Publishing',
    slug: 'writing-publishing',
    description: 'Peer-reviewed scientific manuscripts, technical architectural whitepapers, and engineering blog posts.',
    display_order: 4,
    created_at: new Date(),
    updated_at: new Date(),
    skills: [
      { id: 15, category_id: 4, name: 'LaTeX & Scientific Typesetting', slug: 'latex', level: 'expert', years_of_experience: 6, icon: 'BookOpen', description: 'NeurIPS / ICML template mastering, TikZ vector diagrams', display_order: 1, is_featured: true, created_at: new Date(), updated_at: new Date() },
      { id: 16, category_id: 4, name: 'Technical Journalism & Documentation', slug: 'tech-writing', level: 'expert', years_of_experience: 5, icon: 'Edit3', description: 'Deep-dive code breakdowns, architecture decision records (ADRs)', display_order: 2, is_featured: true, created_at: new Date(), updated_at: new Date() },
      { id: 17, category_id: 4, name: 'Data Visualization (D3 / Observable)', slug: 'dataviz', level: 'advanced', years_of_experience: 3, icon: 'BarChart2', description: 'High-dimensional embedding projections, attention heatmaps', display_order: 3, is_featured: false, created_at: new Date(), updated_at: new Date() },
    ],
  },
];

export const fallbackProjects: DbProjectWithDetails[] = [
  {
    id: 1,
    author_id: 1,
    category_id: 1,
    title: 'SynapseEngine: Low-Latency Neural Runtime',
    slug: 'synapse-engine',
    description: 'Hardware-adaptive deep learning execution runtime delivering sub-3ms token latencies with dynamic quantization.',
    long_description: 'An open-source runtime engine designed for hosting 7B-70B parameter models on mixed consumer GPU architectures with memory-bound optimization and fused Triton attention kernels.',
    hero_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    project_url: 'https://github.com/example/synapse-engine',
    github_url: 'https://github.com/example/synapse-engine',
    client: 'Open Source / Research',
    role: 'Lead Architect & Maintainer',
    problem: 'Standard Hugging Face inference introduces 30-40% unnecessary overhead on consumer workstation hardware.',
    solution: 'Engineered custom paging mechanisms, KV-cache quantization, and Triton kernels to saturate compute bandwidth.',
    features: ['Sub-3ms first-token latency', 'Dynamic 4-bit / 8-bit weight activation', 'Cross-platform Linux & CUDA support'],
    architecture: 'Rust core engine with C++ FFI bindings, Triton GPU compute kernels, and Python runtime client.',
    challenges: 'Preventing memory fragmentation during variable-length sequence decoding.',
    results: 'Adopted by 1,400+ researchers; 4.2x speedup over vanilla PyTorch inference.',
    status: 'published',
    is_featured: true,
    display_order: 1,
    started_at: new Date('2023-04-01'),
    ended_at: null,
    created_at: new Date(),
    updated_at: new Date(),
    category_name: 'AI & Machine Learning',
    technologies: ['Rust', 'CUDA', 'Python', 'Triton', 'Docker'],
    images: [],
  },
  {
    id: 2,
    author_id: 1,
    category_id: 2,
    title: 'Axiom: Research Knowledge Graph & Vector Engine',
    slug: 'axiom-research-graph',
    description: 'Semantic scientific exploration platform parsing 2M+ arXiv papers into an interactive hypergraph.',
    long_description: 'A platform combining dense vector search, citation hypergraph navigation, and automated hypothesis extraction across computer science preprints.',
    hero_image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
    project_url: 'https://axiom-demo.dev',
    github_url: 'https://github.com/example/axiom',
    client: 'Graduate Research Consortium',
    role: 'Full-Stack Lead & ML Architect',
    problem: 'Literature review in fast-moving AI disciplines is hindered by keyword-based search fragmentation.',
    solution: 'Constructed an automated citation hypergraph that clusters papers based on methodology embeddings rather than surface keywords.',
    features: ['Dense semantic search', 'Citation graph visualization in WebGL', 'Automated methodology comparison tables'],
    architecture: 'Next.js 15 frontend, FastAPI microservice, Qdrant vector database, and PostgreSQL graph backend.',
    challenges: 'Maintaining 60fps graph layout rendering with >50,000 active nodes in the browser canvas.',
    results: 'Used actively by 12 academic labs; reduced literature survey time from days to hours.',
    status: 'published',
    is_featured: true,
    display_order: 2,
    started_at: new Date('2022-10-01'),
    ended_at: new Date('2023-08-01'),
    created_at: new Date(),
    updated_at: new Date(),
    category_name: 'Systems & Web',
    technologies: ['Next.js', 'TypeScript', 'FastAPI', 'Qdrant', 'Tailwind CSS', 'WebGL'],
    images: [],
  },
  {
    id: 3,
    author_id: 1,
    category_id: 3,
    title: 'Lumina: Editorial Design System & Component Studio',
    slug: 'lumina-design-system',
    description: 'Minimalist, futuristic design system and accessible component library built for research and technical publications.',
    long_description: 'An enterprise-grade component architecture providing accessible primitives, physics-based springs, and dark-first high-contrast editorial styling.',
    hero_image_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1200',
    project_url: 'https://lumina-ui.dev',
    github_url: 'https://github.com/example/lumina',
    client: 'Self-Directed / Community',
    role: 'Creator & UI Designer',
    problem: 'Existing UI kits are overwhelmingly commercial SaaS-oriented and lack scientific, editorial sophistication.',
    solution: 'Crafted 40+ unstyled accessible primitives with fine technical grids, subtle borders, and monospace accents.',
    features: ['100% WCAG AAA compliant', 'Zero runtime CSS token system', 'Built-in code syntax highlighting themes'],
    architecture: 'React, Tailwind CSS, Radix UI primitives, Storybook, and automated axe accessibility testing.',
    challenges: 'Preserving sub-10ms interaction latency while rendering complex math notation (KaTeX).',
    results: '5,000+ GitHub stars; featured on Designer News and GitHub Trending.',
    status: 'published',
    is_featured: true,
    display_order: 3,
    started_at: new Date('2022-01-15'),
    ended_at: new Date('2022-09-30'),
    created_at: new Date(),
    updated_at: new Date(),
    category_name: 'Design & Tooling',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Radix UI'],
    images: [],
  },
];

export const fallbackResearch: ResearchWithCategory[] = [
  {
    id: 1,
    author_id: 1,
    category_id: 1,
    title: 'Sparse Attentive State-Space Models for Long-Sequence Reasoning',
    slug: 'sparse-attentive-state-space-models',
    abstract: 'We introduce Sparse Attentive State-Space Models (SASSM), an architectural hybrid unifying linear recurrent inductive biases with selective cross-chunk attention. Across Long Range Arena (LRA) benchmarks, SASSM achieves a 3.8x memory reduction while outperforming standard transformers on 64k token contexts.',
    methodology: 'Combining Structured State Space (S4/Mamba) recurrences with dynamic top-k sparse attention heads conditioned on recurrent state entropy.',
    technologies: ['PyTorch', 'Triton', 'JAX', 'CUDA'],
    dataset: 'Long Range Arena (LRA), PG19 Language Modeling, Custom Genomic Sequences',
    status: 'published',
    publication_status: 'published',
    publication_url: 'https://arxiv.org/abs/example-sassm',
    doi: '10.48550/arXiv.2401.00000',
    github_url: 'https://github.com/example/sassm-research',
    is_featured: true,
    published_at: new Date('2024-02-15'),
    created_at: new Date(),
    updated_at: new Date(),
    category_name: 'Deep Learning Theory',
  },
  {
    id: 2,
    author_id: 1,
    category_id: 1,
    title: 'Mechanistic Disentanglement of Latent Representations in Vision-Language Models',
    slug: 'mechanistic-disentanglement-vlm',
    abstract: 'Investigating how multimodal transformers internally partition sensory input into invariant conceptual graphs. We present causal activation patching experiments demonstrating that cross-modal binding occurs within three specialized mid-layer attention heads.',
    methodology: 'Linear probe diagnostics, causal interchange intervention, and path attribution across 12-layer and 32-layer multimodal backbones.',
    technologies: ['PyTorch', 'TransformerLens', 'Hugging Face', 'Matplotlib'],
    dataset: 'COCO Captions, VQA v2, Controlled Perturbation Synthetic Benchmark',
    status: 'completed',
    publication_status: 'preprint',
    publication_url: 'https://arxiv.org/abs/example-vlm-mech',
    doi: null,
    github_url: 'https://github.com/example/vlm-interpretability',
    is_featured: true,
    published_at: new Date('2023-11-20'),
    created_at: new Date(),
    updated_at: new Date(),
    category_name: 'Interpretability & Safety',
  },
];

export const fallbackArticles: DbArticleWithAuthor[] = [
  {
    id: 1,
    author_id: 1,
    category_id: 1,
    title: 'Demystifying State-Space Models: From SSM Fundamentals to Mamba',
    slug: 'demystifying-state-space-models-mamba',
    excerpt: 'An intuitive, mathematical and code-driven dissection of State-Space Models, continuous-to-discrete bilinear transforms, and why selective scan algorithms challenge the Transformer hegemony.',
    content: `<p>Modern sequence modeling stands at a profound juncture. For over half a decade, the Transformer architecture and its multi-head attention mechanism have formed the foundation of large language models. However, the quadratic computational complexity O(N²) with respect to context window length N imposes extreme memory demands on inference hardware.</p><h2>The Continuous State-Space Formulation</h2><p>State-Space Models (SSMs) map a 1-dimensional continuous sequence through a hidden latent representation before projecting to an output governed by linear differential equations. When discretized via zero-order hold (ZOH) or bilinear transformation, the system can be computed either as an efficient linear recurrence during generation O(1) or as a parallel associative scan during training O(N log N).</p><h2>Hardware-Aware Selective Scans</h2><p>Modern selective architectures (Mamba) make parameters input-dependent, giving the model the expressiveness of attention while maintaining linear memory efficiency. By fusing the scan operation directly into GPU SRAM using Triton kernels, we avoid materializing intermediate states in high-bandwidth DRAM, accelerating inference by up to 4.2x.</p>`,
    cover_image_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200',
    status: 'published',
    reading_time: 14,
    is_featured: true,
    published_at: new Date('2024-03-01'),
    scheduled_at: null,
    seo_title: 'Demystifying State-Space Models: Complete Guide',
    seo_description: 'Learn the mathematics and practical architecture behind SSMs and Mamba models with PyTorch code implementations.',
    canonical_url: 'https://tawhidulislam.me/articles/demystifying-state-space-models-mamba',
    view_count: 8420,
    created_at: new Date(),
    updated_at: new Date(),
    author_name: 'Md Tawhidul Islam',
    author_email: 'alex@example.com',
    category_name: 'AI & Machine Learning',
    category_slug: 'ai-ml',
    tags: [
      { id: 1, name: 'Machine Learning', slug: 'machine-learning', color: '#6366f1', created_at: new Date(), updated_at: new Date() },
      { id: 2, name: 'State-Space Models', slug: 'ssm', color: '#10b981', created_at: new Date(), updated_at: new Date() },
      { id: 3, name: 'PyTorch', slug: 'pytorch', color: '#f59e0b', created_at: new Date(), updated_at: new Date() },
    ],
  },
  {
    id: 2,
    author_id: 1,
    category_id: 2,
    title: 'Engineering Zero-Overhead Type-Safe Database Repositories in Next.js 15',
    slug: 'type-safe-database-repositories-nextjs-15',
    excerpt: 'Why we bypassed ORMs for raw parameterized mysql2 pools: achieving sub-millisecond database queries, clean domain layering, and zero build-step code generation.',
    content: `<p>Object-Relational Mapping (ORM) libraries often promise developer ergonomics, but frequently incur latency spikes, hidden N+1 queries, and heavyweight runtime bundles. In high-performance data architectures, directly interacting with database connection pools offers distinct advantages.</p><h2>The Direct Parameterized Repository Pattern</h2><p>By defining strict domain interfaces and wrapping prepared statements in thin TypeScript helper functions, we obtain complete type safety without the overhead of schema-compilation steps. Every query execution plan is transparent and predictable.</p><h2>Connection Pooling and Concurrency</h2><p>Leveraging connection pool limits tuned to server core topologies prevents pool starvation during traffic spikes, ensuring predictable sub-5ms API response times even under heavy concurrent loads.</p>`,
    cover_image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200',
    status: 'published',
    reading_time: 9,
    is_featured: true,
    published_at: new Date('2024-02-10'),
    scheduled_at: null,
    seo_title: 'Building Type-Safe Database Repositories in Next.js',
    seo_description: 'A practical architectural guide to writing clean, maintainable SQL repositories in Next.js with zero ORM overhead.',
    canonical_url: 'https://tawhidulislam.me/articles/type-safe-database-repositories-nextjs-15',
    view_count: 5120,
    created_at: new Date(),
    updated_at: new Date(),
    author_name: 'Md Tawhidul Islam',
    author_email: 'alex@example.com',
    category_name: 'Software Architecture',
    category_slug: 'architecture',
    tags: [
      { id: 4, name: 'Next.js', slug: 'nextjs', color: '#06b6d4', created_at: new Date(), updated_at: new Date() },
      { id: 5, name: 'MySQL', slug: 'mysql', color: '#3b82f6', created_at: new Date(), updated_at: new Date() },
      { id: 6, name: 'TypeScript', slug: 'typescript', color: '#8b5cf6', created_at: new Date(), updated_at: new Date() },
    ],
  },
  {
    id: 3,
    author_id: 1,
    category_id: 3,
    title: 'The Aesthetic of Precision: Designing for Scientific & Technical Audiences',
    slug: 'aesthetic-of-precision-technical-design',
    excerpt: 'How fine technical grids, high-contrast monospace typography, and restrained micro-motion create an environment that fosters intellectual clarity.',
    content: `<p>Design for technical minds is not about decorative flourishes; it is about information hierarchy, cognitive flow, and architectural legibility. When building tools for researchers and engineers, every pixel should serve a purpose.</p><h2>The Power of Monospace and Grid Architecture</h2><p>Subtle 1px borders, monospace telemetry annotations, and CAD-inspired corner crosses ground the user in a tactile, focused digital workspace. Typography should emphasize high contrast and effortless scanning.</p><h2>Micro-Interactions That Respect Focus</h2><p>Animations must be purposeful: spring-based transitions that provide physical feedback without distracting from deep work. When interface motion mirrors physical inertia, the software feels responsive and grounded.</p>`,
    cover_image_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1200',
    status: 'published',
    reading_time: 7,
    is_featured: true,
    published_at: new Date('2024-01-18'),
    scheduled_at: null,
    seo_title: 'The Aesthetic of Precision: Technical Design Principles',
    seo_description: 'Exploring design philosophy for developers, researchers, and scientific applications.',
    canonical_url: 'https://tawhidulislam.me/articles/aesthetic-of-precision-technical-design',
    view_count: 3890,
    created_at: new Date(),
    updated_at: new Date(),
    author_name: 'Md Tawhidul Islam',
    author_email: 'alex@example.com',
    category_name: 'Design & Philosophy',
    category_slug: 'design',
    tags: [
      { id: 7, name: 'UI/UX Design', slug: 'ui-ux', color: '#ec4899', created_at: new Date(), updated_at: new Date() },
      { id: 8, name: 'Typography', slug: 'typography', color: '#64748b', created_at: new Date(), updated_at: new Date() },
    ],
  },
];

// ============================================================================
// Service Functions with Graceful Database Fallbacks
// ============================================================================

export async function getPublicProfile(): Promise<DbProfile & { social_links: DbSocialLink[] }> {
  try {
    const profile = await findProfileByUserId(1);
    if (profile) {
      const socialLinks = await findSocialLinksByUserId(1);
      return {
        ...profile,
        name: profile.name || fallbackProfile.name,
        location: profile.location || fallbackProfile.location,
        headline: profile.headline || fallbackProfile.headline,
        email: profile.email || fallbackProfile.email,
        phone: profile.phone || fallbackProfile.phone,
        social_links: socialLinks.length > 0 ? socialLinks : fallbackProfile.social_links,
      };
    }
  } catch {
    // Graceful fallback to static seed data
  }
  return fallbackProfile;
}

export async function getPublicExperiences(): Promise<DbExperience[]> {
  try {
    const data = await getAllExperiences();
    return data;
  } catch {
    // Graceful fallback
  }
  return fallbackExperiences;
}

export async function getPublicEducation(): Promise<DbEducation[]> {
  try {
    const data = await getAllEducation();
    return data;
  } catch {
    // Graceful fallback
  }
  return fallbackEducation;
}

export async function getPublicSkills(): Promise<SkillCategoryWithSkills[]> {
  try {
    const data = await getSkillCategoriesWithSkills();
    if (data && data.length > 0 && data.some((c) => c.skills.length > 0)) return data;
  } catch {
    // Graceful fallback
  }
  return fallbackSkillCategories;
}

export async function getPublicFeaturedProjects(): Promise<DbProjectWithDetails[]> {
  try {
    const data = await getFeaturedProjects();
    return data;
  } catch {
    // Graceful fallback
  }
  return fallbackProjects;
}

export async function getPublicFeaturedResearch(): Promise<ResearchWithCategory[]> {
  try {
    const data = await getFeaturedResearch();
    return data;
  } catch {
    // Graceful fallback
  }
  return fallbackResearch;
}

export async function getPublicFeaturedArticles(): Promise<DbArticleWithAuthor[]> {
  try {
    const data = await getFeaturedArticles();
    if (data && data.length > 0) return data;
  } catch (err) {
    console.error('getPublicFeaturedArticles error:', err);
  }
  return fallbackArticles;
}

export async function getPublicAllProjects(): Promise<DbProjectWithDetails[]> {
  try {
    const { getAllPublishedProjects } = await import('@/lib/repositories/projects.repository');
    const data = await getAllPublishedProjects();
    if (data && data.length > 0) return data;
  } catch (err) {
    console.error('getPublicAllProjects error:', err);
  }
  return fallbackProjects;
}

export async function getPublicProjectBySlug(slug: string): Promise<DbProjectWithDetails | null> {
  try {
    const { getProjectBySlug } = await import('@/lib/repositories/projects.repository');
    const data = await getProjectBySlug(slug);
    if (data) return data;
  } catch (err) {
    console.error('getPublicProjectBySlug error:', err);
  }
  return fallbackProjects.find((p) => p.slug === slug) ?? null;
}

export async function getPublicAllResearch(): Promise<ResearchWithCategory[]> {
  try {
    const { getAllResearch } = await import('@/lib/repositories/research.repository');
    const data = await getAllResearch();
    if (data && data.length > 0) return data;
  } catch (err) {
    console.error('getPublicAllResearch error:', err);
  }
  return fallbackResearch;
}

export async function getPublicResearchBySlug(slug: string): Promise<ResearchWithCategory | null> {
  try {
    const { getResearchBySlug } = await import('@/lib/repositories/research.repository');
    const data = await getResearchBySlug(slug);
    if (data) return data;
  } catch (err) {
    console.error('getPublicResearchBySlug error:', err);
  }
  return fallbackResearch.find((r) => r.slug === slug) ?? null;
}

export async function getPublicAllArticles(): Promise<DbArticleWithAuthor[]> {
  try {
    const { getRecentArticles } = await import('@/lib/repositories/articles.repository');
    const data = await getRecentArticles(50);
    if (data && data.length > 0) return data;
  } catch (err) {
    console.error('getPublicAllArticles error:', err);
  }
  return fallbackArticles;
}

export async function getPublicArticleBySlug(slug: string): Promise<DbArticleWithAuthor | null> {
  try {
    const { getArticleBySlug } = await import('@/lib/repositories/articles.repository');
    const data = await getArticleBySlug(slug);
    if (data) return data;
  } catch (err) {
    console.error('getPublicArticleBySlug error:', err);
  }
  return fallbackArticles.find((a) => a.slug === slug) ?? null;
}

export async function getPublicCommentsForArticle(articleId: number) {
  try {
    const { getApprovedCommentsByArticleId } = await import('@/lib/repositories/comments.repository');
    return await getApprovedCommentsByArticleId(articleId);
  } catch {
    return [];
  }
}

export interface SiteBranding {
  siteName: string;
  logoText: string;
  logoUrl?: string | null;
  tagline?: string | null;
}

import { PublicHeadlines, defaultHeadlines } from '@/types/headlines.types';
export type { PublicHeadlines };
export { defaultHeadlines };

export async function getPublicHeadlines(): Promise<PublicHeadlines> {
  try {
    const { getSettingsMap } = await import('@/lib/repositories/settings.repository');
    const settings = await getSettingsMap('headlines');
    const all = await getSettingsMap();
    const merged: Record<string, string> = { ...all, ...settings };

    return {
      hero_badge: merged['hero_badge'] || defaultHeadlines.hero_badge,
      hero_title_prefix: merged['hero_title_prefix'] || defaultHeadlines.hero_title_prefix,
      hero_title_highlight: merged['hero_title_highlight'] || defaultHeadlines.hero_title_highlight,
      hero_title_suffix: merged['hero_title_suffix'] || defaultHeadlines.hero_title_suffix,
      hero_subtitle: merged['hero_subtitle'] || defaultHeadlines.hero_subtitle,
      hero_card_role_badge: merged['hero_card_role_badge'] || defaultHeadlines.hero_card_role_badge,

      home_research_badge: merged['home_research_badge'] || defaultHeadlines.home_research_badge,
      home_research_title: merged['home_research_title'] || defaultHeadlines.home_research_title,
      home_research_description: merged['home_research_description'] || defaultHeadlines.home_research_description,

      home_projects_badge: merged['home_projects_badge'] || defaultHeadlines.home_projects_badge,
      home_projects_title: merged['home_projects_title'] || defaultHeadlines.home_projects_title,
      home_projects_description: merged['home_projects_description'] || defaultHeadlines.home_projects_description,

      home_articles_badge: merged['home_articles_badge'] || defaultHeadlines.home_articles_badge,
      home_articles_title: merged['home_articles_title'] || defaultHeadlines.home_articles_title,
      home_articles_description: merged['home_articles_description'] || defaultHeadlines.home_articles_description,
      home_articles_button_text: merged['home_articles_button_text'] || defaultHeadlines.home_articles_button_text,

      home_experience_badge: merged['home_experience_badge'] || defaultHeadlines.home_experience_badge,
      home_experience_title: merged['home_experience_title'] || defaultHeadlines.home_experience_title,
      home_experience_description: merged['home_experience_description'] || defaultHeadlines.home_experience_description,

      home_skills_badge: merged['home_skills_badge'] || defaultHeadlines.home_skills_badge,
      home_skills_title: merged['home_skills_title'] || defaultHeadlines.home_skills_title,
      home_skills_description: merged['home_skills_description'] || defaultHeadlines.home_skills_description,

      home_education_badge: merged['home_education_badge'] || defaultHeadlines.home_education_badge,
      home_education_title: merged['home_education_title'] || defaultHeadlines.home_education_title,
      home_education_description: merged['home_education_description'] || defaultHeadlines.home_education_description,

      home_awards_badge: merged['home_awards_badge'] || defaultHeadlines.home_awards_badge,
      home_awards_title: merged['home_awards_title'] || defaultHeadlines.home_awards_title,
      home_awards_description: merged['home_awards_description'] || defaultHeadlines.home_awards_description,

      about_badge: merged['about_badge'] || defaultHeadlines.about_badge,
      about_title: merged['about_title'] || defaultHeadlines.about_title,
      about_description: merged['about_description'] || defaultHeadlines.about_description,
      about_bio_badge: merged['about_bio_badge'] || defaultHeadlines.about_bio_badge,
      about_bio_title: merged['about_bio_title'] || defaultHeadlines.about_bio_title,
      about_edu_badge: merged['about_edu_badge'] || defaultHeadlines.about_edu_badge,
      about_edu_title: merged['about_edu_title'] || defaultHeadlines.about_edu_title,
      about_edu_description: merged['about_edu_description'] || defaultHeadlines.about_edu_description,
      about_awards_badge: merged['about_awards_badge'] || defaultHeadlines.about_awards_badge,
      about_awards_title: merged['about_awards_title'] || defaultHeadlines.about_awards_title,
      about_awards_description: merged['about_awards_description'] || defaultHeadlines.about_awards_description,

      research_badge: merged['research_badge'] || defaultHeadlines.research_badge,
      research_title: merged['research_title'] || defaultHeadlines.research_title,
      research_description: merged['research_description'] || defaultHeadlines.research_description,

      projects_badge: merged['projects_badge'] || defaultHeadlines.projects_badge,
      projects_title: merged['projects_title'] || defaultHeadlines.projects_title,
      projects_description: merged['projects_description'] || defaultHeadlines.projects_description,

      articles_badge: merged['articles_badge'] || defaultHeadlines.articles_badge,
      articles_title: merged['articles_title'] || defaultHeadlines.articles_title,
      articles_description: merged['articles_description'] || defaultHeadlines.articles_description,

      experience_badge: merged['experience_badge'] || defaultHeadlines.experience_badge,
      experience_title: merged['experience_title'] || defaultHeadlines.experience_title,
      experience_description: merged['experience_description'] || defaultHeadlines.experience_description,

      education_badge: merged['education_badge'] || defaultHeadlines.education_badge,
      education_title: merged['education_title'] || defaultHeadlines.education_title,
      education_description: merged['education_description'] || defaultHeadlines.education_description,

      skills_badge: merged['skills_badge'] || defaultHeadlines.skills_badge,
      skills_title: merged['skills_title'] || defaultHeadlines.skills_title,
      skills_description: merged['skills_description'] || defaultHeadlines.skills_description,

      contact_badge: merged['contact_badge'] || defaultHeadlines.contact_badge,
      contact_title: merged['contact_title'] || defaultHeadlines.contact_title,
      contact_description: merged['contact_description'] || defaultHeadlines.contact_description,
      contact_direct_title: merged['contact_direct_title'] || defaultHeadlines.contact_direct_title,
      contact_email_label: merged['contact_email_label'] || defaultHeadlines.contact_email_label,
      contact_location_label: merged['contact_location_label'] || defaultHeadlines.contact_location_label,
      contact_response_time: merged['contact_response_time'] || defaultHeadlines.contact_response_time,
      contact_response_time_label: merged['contact_response_time_label'] || defaultHeadlines.contact_response_time_label,
      contact_security_note: merged['contact_security_note'] || defaultHeadlines.contact_security_note,
      contact_social_title: merged['contact_social_title'] || defaultHeadlines.contact_social_title,
      contact_form_title: merged['contact_form_title'] || defaultHeadlines.contact_form_title,
      contact_form_description: merged['contact_form_description'] || defaultHeadlines.contact_form_description,
    };
  } catch {
    return defaultHeadlines;
  }
}

export async function getPublicBranding(): Promise<SiteBranding> {
  try {
    const { getSettingValue } = await import('@/lib/repositories/settings.repository');
    const [siteName, logoText, logoUrl, tagline] = await Promise.all([
      getSettingValue('site_name'),
      getSettingValue('site_logo_text'),
      getSettingValue('site_logo_url'),
      getSettingValue('site_tagline'),
    ]);

    const finalSiteName = siteName || process.env.NEXT_PUBLIC_SITE_NAME || 'Portfolio';
    return {
      siteName: finalSiteName,
      logoText: logoText || finalSiteName || 'portfolio.dev',
      logoUrl: logoUrl || null,
      tagline: tagline || null,
    };
  } catch {
    const defaultName = process.env.NEXT_PUBLIC_SITE_NAME || 'Portfolio';
    return {
      siteName: defaultName,
      logoText: defaultName || 'portfolio.dev',
      logoUrl: null,
      tagline: null,
    };
  }
}

export interface PublicContactDetails {
  profile: DbProfile & { social_links: DbSocialLink[] };
  headlines: PublicHeadlines;
  email: string;
  availabilityStatus: string;
}

export async function getPublicContactDetails(): Promise<PublicContactDetails> {
  const [profile, headlines] = await Promise.all([
    getPublicProfile(),
    getPublicHeadlines(),
  ]);

  let contactEmailSetting = '';
  let availabilityStatus = 'Open to research collaborations & select advising';

  try {
    const { getSettingValue } = await import('@/lib/repositories/settings.repository');
    const [e, a] = await Promise.all([
      getSettingValue('contact_email'),
      getSettingValue('availability_status'),
    ]);
    if (e) contactEmailSetting = e;
    if (a) availabilityStatus = a;
  } catch {
    // fallback
  }

  const email = contactEmailSetting || profile.email || 'alex@chen-research.dev';

  return {
    profile,
    headlines,
    email,
    availabilityStatus,
  };
}

// ============================================================================
// Fallback Awards Data
// ============================================================================

export const fallbackAwards: DbAward[] = [
  {
    id: 1,
    user_id: 1,
    title: 'Best Graduate Research Paper',
    issuer: 'NeurIPS Workshop on Efficient AI',
    issuer_url: 'https://neurips.cc',
    category: 'award',
    date: new Date('2023-12-01'),
    description: 'Awarded for outstanding work on hardware-efficient state-space models for long-range sequence modeling.',
    badge_url: null,
    is_featured: true,
    display_order: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    user_id: 1,
    title: 'AWS Certified Machine Learning – Specialty',
    issuer: 'Amazon Web Services',
    issuer_url: 'https://aws.amazon.com/certification',
    category: 'certification',
    date: new Date('2023-06-15'),
    description: 'Professional-level certification validating expertise in designing, implementing, and deploying ML solutions on AWS.',
    badge_url: null,
    is_featured: true,
    display_order: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    user_id: 1,
    title: 'Dean\'s List – Academic Excellence',
    issuer: 'MIT School of Engineering',
    issuer_url: 'https://mit.edu',
    category: 'award',
    date: new Date('2022-05-01'),
    description: 'Recognized for exceptional academic performance in the Graduate Computer Science program.',
    badge_url: null,
    is_featured: true,
    display_order: 3,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export async function getPublicAwards(): Promise<DbAward[]> {
  try {
    const awards = await getFeaturedAwards();
    return awards;
  } catch {
    return fallbackAwards;
  }
}

