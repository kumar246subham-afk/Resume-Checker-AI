const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');

// Default initial resume structure for new resumes
const DEFAULT_RESUME_SECTIONS = {
  personalInfo: {
    fullName: 'Alex Morgan',
    title: 'Senior Full Stack Software Engineer',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA (Open to Remote)',
    linkedin: 'linkedin.com/in/alexmorgan-dev',
    github: 'github.com/alexmorgan-code',
    portfolio: 'alexmorgan.dev'
  },
  summary: 'Results-driven Full Stack Engineer with 5+ years of experience architecting scalable distributed systems and responsive web applications. Proven track record of improving system throughput by 35% and mentoring junior developers in modern cloud-native practices.',
  experience: [
    {
      id: 'exp-1',
      role: 'Senior Software Engineer',
      company: 'TechCorp Cloud Solutions',
      location: 'San Francisco, CA',
      startDate: '2022-03',
      endDate: 'Present',
      current: true,
      bullets: [
        'Architected high-throughput microservices using Node.js, TypeScript, and MongoDB, scaling daily active throughput to 450,000+ requests.',
        'Spearheaded automated CI/CD pipeline modernization with Docker and GitHub Actions, slashing deployment cycle duration by 40%.',
        'Led cross-functional team of 6 engineers across sprint planning, technical design reviews, and code quality audits.'
      ]
    },
    {
      id: 'exp-2',
      role: 'Full Stack Developer',
      company: 'NextGen Digital Labs',
      location: 'Austin, TX',
      startDate: '2020-01',
      endDate: '2022-02',
      current: false,
      bullets: [
        'Engineered responsive React web interfaces with Tailwind CSS and Redux, improving client onboarding conversion rates by 22%.',
        'Implemented secure RESTful and GraphQL APIs with OAuth2 token validation, handling sensitive customer transaction records.',
        'Optimized PostgreSQL database queries and indexing strategies, decreasing average response latency from 450ms to 95ms.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Science in Computer Science',
      fieldOfStudy: 'Software Engineering',
      institution: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      graduationDate: '2019-05',
      gpa: '3.82',
      highlights: ['Dean’s Honor List', 'Lead Teaching Assistant for Data Structures & Algorithms']
    }
  ],
  skills: {
    technical: ['JavaScript (ES6+)', 'TypeScript', 'React.js', 'Node.js', 'Express', 'Python', 'Docker', 'AWS (S3, EC2, Lambda)', 'MongoDB', 'PostgreSQL', 'GraphQL', 'REST APIs', 'Git'],
    soft: ['Technical Leadership', 'Cross-Functional Collaboration', 'Agile/Scrum', 'System Architecture', 'Problem Solving'],
    tools: ['VS Code', 'Postman', 'Figma', 'Jira', 'GitHub Actions', 'Datadog']
  },
  projects: [
    {
      id: 'proj-1',
      name: 'Distributed Task Queue System',
      description: 'An open-source distributed job orchestrator designed for real-time background processing.',
      role: 'Lead Architect',
      technologies: ['Node.js', 'Redis', 'Docker', 'TypeScript'],
      link: 'https://github.com/example/task-queue',
      bullets: [
        'Engineered an event-driven worker pool handling up to 12,000 tasks/second with automatic exponential backoff retry logic.',
        'Designed an interactive real-time monitoring dashboard with WebSocket progress feeds.'
      ]
    },
    {
      id: 'proj-2',
      name: 'AI Document Summarizer',
      description: 'Web application leveraging LLMs to generate structured research summaries from uploaded technical papers.',
      role: 'Full Stack Creator',
      technologies: ['React', 'Python', 'FastAPI', 'Tailwind CSS'],
      link: 'https://github.com/example/ai-summarizer',
      bullets: [
        'Implemented client-side PDF text extraction and streaming AI completions, serving 3,500+ active users monthly.'
      ]
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      issueDate: '2023-08',
      expiryDate: '2026-08',
      credentialId: 'AWS-CSA-98234',
      credentialUrl: 'https://aws.amazon.com/verification'
    }
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'Company Innovation Hackathon Winner (1st Place)',
      description: 'Built an AI-assisted customer ticket routing engine that decreased triage time by 60%.',
      date: '2023'
    }
  ],
  languages: [
    { language: 'English', proficiency: 'Native / Bilingual' },
    { language: 'Spanish', proficiency: 'Professional Working' }
  ],
  customSections: []
};

// @desc    Get all resumes for logged in user
// @route   GET /api/resumes
exports.getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ ownerId: req.user.id }).sort({ updatedAt: -1 });
    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new resume
// @route   POST /api/resumes
exports.createResume = async (req, res, next) => {
  try {
    const { title, templateId, jobTarget, sections, styling } = req.body;

    const resume = await Resume.create({
      ownerId: req.user.id,
      title: title || 'My Professional Resume',
      templateId: templateId || 'ats-classic',
      jobTarget: jobTarget || 'Software Engineer',
      sections: sections || DEFAULT_RESUME_SECTIONS,
      styling: styling || { font: 'Inter', fontSize: 'medium', lineSpacing: 'normal', primaryColor: '#6D5EF7' }
    });

    res.status(201).json({
      success: true,
      data: resume
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single resume by id
// @route   GET /api/resumes/:id
exports.getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, ownerId: req.user.id });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found or you do not have permission to view it'
      });
    }

    res.status(200).json({
      success: true,
      data: resume
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update existing resume
// @route   PUT /api/resumes/:id
exports.updateResume = async (req, res, next) => {
  try {
    let resume = await Resume.findOne({ _id: req.params.id, ownerId: req.user.id });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found or you do not have permission to edit it'
      });
    }

    const { title, templateId, jobTarget, sections, styling } = req.body;

    if (title !== undefined) resume.title = title;
    if (templateId !== undefined) resume.templateId = templateId;
    if (jobTarget !== undefined) resume.jobTarget = jobTarget;
    if (sections !== undefined) resume.sections = sections;
    if (styling !== undefined) resume.styling = styling;

    await resume.save();

    res.status(200).json({
      success: true,
      data: resume
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
exports.deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, ownerId: req.user.id });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found or you do not have permission to delete it'
      });
    }

    // Also clean up any associated analyses
    await Analysis.deleteMany({ resumeId: req.params.id, ownerId: req.user.id });

    res.status(200).json({
      success: true,
      message: 'Resume and associated analyses deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Duplicate resume
// @route   POST /api/resumes/:id/duplicate
exports.duplicateResume = async (req, res, next) => {
  try {
    const original = await Resume.findOne({ _id: req.params.id, ownerId: req.user.id });

    if (!original) {
      return res.status(404).json({
        success: false,
        message: 'Original resume not found'
      });
    }

    const duplicate = await Resume.create({
      ownerId: req.user.id,
      title: `${original.title} (Copy)`,
      templateId: original.templateId,
      jobTarget: original.jobTarget,
      version: (original.version || 1) + 1,
      sections: original.sections,
      styling: original.styling
    });

    res.status(201).json({
      success: true,
      data: duplicate,
      message: 'Resume duplicated successfully'
    });
  } catch (err) {
    next(err);
  }
};
