/**
 * Premium Resume Templates Registry
 * 10 distinct, production-engineered resume templates with comprehensive metadata
 */

export const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'All Templates', count: 10 },
  { id: 'ats', label: 'ATS-Friendly', count: 2 },
  { id: 'professional', label: 'Professional', count: 3 },
  { id: 'technology', label: 'Technology & AI', count: 2 },
  { id: 'analytics', label: 'Data & Analytics', count: 1 },
  { id: 'creative', label: 'Creative & Design', count: 1 },
  { id: 'fresher', label: 'Fresher & Student', count: 1 }
];

export const RESUME_TEMPLATES = [
  {
    id: 'ats-classic',
    name: 'ATS Classic',
    badge: 'Maximum Compatibility',
    category: 'ats',
    categoryLabel: 'ATS-Friendly',
    accentColor: '#111827',
    atsScoreEstimate: '99%',
    desc: 'The gold standard for passing automated applicant tracking systems (Workday, Greenhouse, Lever). Single-column, standard serif typography, clean section breaks.',
    features: [
      '100% Single-Column Layout',
      'Zero Parsing Failures in Enterprise ATS',
      'Optimal for High-Volume Corporate Applications',
      'Classic Georgia/Times New Roman Serifs'
    ],
    recommendedRoles: ['Corporate Roles', 'Finance & Banking', 'Legal & Compliance', 'Government']
  },
  {
    id: 'modern-pro',
    name: 'Modern Professional',
    badge: 'Tech & High-Growth SaaS',
    category: 'professional',
    categoryLabel: 'Professional',
    accentColor: '#6D5EF7',
    atsScoreEstimate: '97%',
    desc: 'Contemporary presentation with a prominent violet accent bar, structured skill badges, clean spacing between roles, and clear visual hierarchy.',
    features: [
      'Signature Violet Accent Header Bar',
      'Sleek Competency Badges & Dot Accents',
      'Modern Sans-Serif (Inter/Manrope) Typography',
      'Timeline Left-Border on Experience Items'
    ],
    recommendedRoles: ['Product Managers', 'Full-Stack Developers', 'Consultants', 'Marketing Directors']
  },
  {
    id: 'minimal-elegant',
    name: 'Minimal Elegant',
    badge: 'Executive & Editorial',
    category: 'creative',
    categoryLabel: 'Creative',
    accentColor: '#475569',
    atsScoreEstimate: '96%',
    desc: 'Spacious, refined typography with generous breathing room and delicate hairline rules. Conveys quiet confidence and design sophistication.',
    features: [
      'Generous Whitespace & Asymmetrical Margins',
      'Ultra-Clean Hairline Section Dividers',
      'Tracking-Widest Uppercase Section Headers',
      'Distinctive Minimalist Aesthetic'
    ],
    recommendedRoles: ['Product Designers', 'Brand Strategists', 'Architects', 'Creative Directors']
  },
  {
    id: 'tech-resume',
    name: 'Technical Resume',
    badge: 'Software & DevOps',
    category: 'technology',
    categoryLabel: 'Technology & AI',
    accentColor: '#0EA5E9',
    atsScoreEstimate: '98%',
    desc: 'Engineered specifically for engineering leads and DevOps practitioners. Features code-style tech stack grids, system architecture metrics, and clear impact bullets.',
    features: [
      'Dedicated Tech Stack Grid with Category Tags',
      'Monospace Accent Elements & Clean Dividers',
      'Emphasizes High-Scale Architecture & KPIs',
      'Compact Two-Column Skill Classification'
    ],
    recommendedRoles: ['Backend Engineers', 'DevOps & SRE', 'Cloud Architects', 'Systems Programmers']
  },
  {
    id: 'executive-profile',
    name: 'Executive Profile',
    badge: 'Leadership & Board Roles',
    category: 'professional',
    categoryLabel: 'Professional',
    accentColor: '#1E293B',
    atsScoreEstimate: '95%',
    desc: 'Tailored for senior directors, VPs, and C-suite leaders. Emphasizes strategic vision, executive summary callouts, and quantifiable business milestones.',
    features: [
      'Prominent Executive Summary Callout Box',
      'Core Competencies 3-Column Matrix',
      'Strategic Revenue & Operational Milestones',
      'Authoritative Charcoal & Deep Slate Palette'
    ],
    recommendedRoles: ['Chief Technology Officer', 'VP of Engineering', 'Director of Product', 'Managing Director']
  },
  {
    id: 'executive-elite',
    name: 'Executive Elite',
    badge: 'Premium C-Suite & VP',
    category: 'professional',
    categoryLabel: 'Professional',
    accentColor: '#D97706',
    atsScoreEstimate: '96%',
    desc: 'A commanding executive resume featuring deep midnight navy, charcoal typography, and subtle metallic champagne/gold accents. Conveys top-tier leadership stature.',
    features: [
      'Midnight Navy Header with Subtle Gold Accents',
      'Refined Double-Divider Line Styling',
      'Leadership Scope & P&L Impact Highlights',
      'Strictly ATS-Compliant Layout Hierarchy'
    ],
    recommendedRoles: ['Senior Executives', 'General Managers', 'Heads of Operations', 'Board Members']
  },
  {
    id: 'tech-innovator',
    name: 'Tech Innovator',
    badge: 'Modern Software & AI',
    category: 'technology',
    categoryLabel: 'Technology & AI',
    accentColor: '#6366F1',
    atsScoreEstimate: '98%',
    desc: 'Designed for modern full-stack software engineers, AI researchers, and cloud developers. Features electric indigo/blue accents, pill tech tags, and project impact highlights.',
    features: [
      'Interactive Pill Badges for Tech Stacks',
      'Structured Project Cards with Live/Repo Indicators',
      'Compact Professional Spacing & Modern Inter Font',
      'Selectable Clean Text with 100% ATS Compatibility'
    ],
    recommendedRoles: ['AI/ML Engineers', 'Full Stack Developers', 'Frontend Specialists', 'Mobile App Engineers']
  },
  {
    id: 'data-science-pro',
    name: 'Data Science Pro',
    badge: 'Analytics & Machine Learning',
    category: 'analytics',
    categoryLabel: 'Data & Analytics',
    accentColor: '#0D9488',
    atsScoreEstimate: '97%',
    desc: 'Engineered for data scientists, ML engineers, and BI analysts. Features a professional deep navy and teal palette, categorized analytical skills, and dataset impact bullets.',
    features: [
      'Teal & Navy Palette with Analytical Focus',
      'Categorized Skills: Languages, ML/DL, Cloud & BI',
      'Quantifiable Model Metric & Dataset Highlights',
      'High Contrast Accessible Visual Hierarchy'
    ],
    recommendedRoles: ['Data Scientist', 'Machine Learning Engineer', 'Data Analyst', 'BI Specialist']
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    badge: 'Design & Product Innovation',
    category: 'creative',
    categoryLabel: 'Creative & Design',
    accentColor: '#8B5CF6',
    atsScoreEstimate: '95%',
    desc: 'An elevated, asymmetrical design tailored for UI/UX designers, creative directors, and product creators. Features dedicated portfolio link badges and refined typography.',
    features: [
      'Asymmetrical Header with Portfolio Link Badges',
      'Distinctive Violet & Plum Accent Details',
      'Dedicated Design Tools & Methodologies Section',
      'Clean Parsing Structure without Table Obstacles'
    ],
    recommendedRoles: ['UI/UX Designers', 'Product Designers', 'Creative Technologists', 'Content Strategists']
  },
  {
    id: 'fresh-graduate-pro',
    name: 'Fresh Graduate Pro',
    badge: 'Students & Early Career',
    category: 'fresher',
    categoryLabel: 'Fresher & Student',
    accentColor: '#14B8A6',
    atsScoreEstimate: '98%',
    desc: 'Specifically structured for college students, B.Tech graduates, and career switchers. Prioritizes education, academic projects, technical coursework, and certifications.',
    features: [
      'Prioritizes Education, Projects & Certifications',
      'Dual-Accent Violet & Teal Design Elements',
      'Dedicated Campus Leadership & Extracurriculars Block',
      'Professional Layout Even with Limited Work History'
    ],
    recommendedRoles: ['Graduate Trainees', 'Internship Applicants', 'Entry-Level Software Engineers', 'Junior Analysts']
  }
];

/**
 * Realistic demonstration resume data for previews and initial templates inspection
 */
export const DEMO_RESUME_DATA = {
  title: 'Senior Software Engineer Resume',
  templateId: 'ats-classic',
  sections: {
    personalInfo: {
      fullName: 'Alex Morgan',
      title: 'Senior Software & AI Engineer',
      email: 'alex.morgan@domain.com',
      phone: '+1 (555) 432-8765',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/alexmorgan',
      github: 'github.com/alexmorgan',
      website: 'alexmorgan.dev'
    },
    summary: 'Results-driven Senior Engineer with 6+ years of experience architecting distributed cloud systems and AI-powered web applications. Spearheaded backend re-architecture reducing latency by 42% across 2M daily active users.',
    experience: [
      {
        id: 'demo-exp-1',
        role: 'Senior Software Engineer',
        company: 'Apex Cloud Systems',
        location: 'San Francisco, CA',
        startDate: '2022-03',
        endDate: 'Present',
        current: true,
        bullets: [
          'Architected high-throughput microservices using Node.js and Go, handling 15,000 requests/sec with 99.99% uptime.',
          'Integrated LLM-assisted document parsing pipelines, cutting document review time by 65% for 45,000 monthly enterprise users.',
          'Mentored 7 junior and mid-level engineers through code reviews and bi-weekly architecture design sessions.'
        ]
      },
      {
        id: 'demo-exp-2',
        role: 'Software Engineer',
        company: 'Vanguard Data Labs',
        location: 'San Jose, CA',
        startDate: '2019-06',
        endDate: '2022-02',
        current: false,
        bullets: [
          'Engineered reactive frontend dashboards with React, TypeScript, and Tailwind CSS, increasing user engagement by 28%.',
          'Automated CI/CD deployment pipelines on AWS using GitHub Actions and Terraform, reducing release cycles from 4 days to 45 minutes.'
        ]
      }
    ],
    education: [
      {
        id: 'demo-edu-1',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science & Engineering',
        institution: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        graduationDate: '2019',
        gpa: '3.85 / 4.0'
      }
    ],
    skills: {
      technical: ['TypeScript', 'React.js', 'Node.js', 'Python', 'AWS', 'Docker', 'GraphQL', 'PostgreSQL', 'Redis', 'Kubernetes'],
      soft: ['System Architecture', 'Agile Leadership', 'Technical Mentorship', 'Cross-Functional Collaboration']
    },
    projects: [
      {
        id: 'demo-proj-1',
        title: 'NeuralSearch Engine',
        role: 'Creator & Lead Architect',
        description: 'Semantic vector search engine indexing 500k+ technical articles with sub-50ms query response.',
        bullets: [
          'Implemented embedding pipelines using Python and Pinecone vector database with hybrid keyword matching.',
          'Deployed serverless API endpoints on AWS Lambda with automated staging and canary rollouts.'
        ]
      }
    ],
    certifications: [
      {
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        date: '2023'
      }
    ],
    achievements: [
      {
        title: '1st Place Winner – National Cloud Hackathon',
        description: 'Awarded top honors among 300+ teams for best real-time data streaming solution.'
      }
    ]
  }
};
