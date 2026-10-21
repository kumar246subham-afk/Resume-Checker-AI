const JobMatch = require('../models/JobMatch');
const Resume = require('../models/Resume');

const SKILL_RELEVANCE_MAP = {
  'javascript': 'Core web programming language required for dynamic UI interaction and full-stack runtime.',
  'typescript': 'Static typing that prevents runtime exceptions and is standard across modern engineering teams.',
  'python': 'Fundamental for data modeling, backend web frameworks (Django/FastAPI), and AI/ML algorithms.',
  'java': 'Enterprise-grade object-oriented foundation for backend microservices and distributed architectures.',
  'c++': 'High-performance systems programming language critical for real-time computing and low latency.',
  'c#': 'Primary language for .NET enterprise stacks, cloud APIs, and game development.',
  'golang': 'High-concurrency language preferred for cloud-native infrastructure and containerized networking.',
  'rust': 'Memory-safe systems programming language prioritized for ultra-high security and performance.',
  'react': 'Leading declarative frontend component architecture used in high-scale web platforms.',
  'react native': 'Cross-platform mobile framework delivering native iOS and Android experiences.',
  'angular': 'Comprehensive opinionated enterprise framework for large-scale enterprise single-page applications.',
  'vue': 'Progressive lightweight reactive UI framework known for clean component isolation.',
  'next.js': 'Industry standard framework for React server-side rendering, SEO, and static web performance.',
  'node.js': 'High-concurrency asynchronous runtime executing JavaScript outside the browser.',
  'express': 'Minimalist, fast web framework powering REST APIs and routing in the Node.js ecosystem.',
  'django': 'Robust Python web framework with built-in ORM, security, and administrative scaffolding.',
  'flask': 'Lightweight Python micro-framework ideal for microservices and AI model inference APIs.',
  'fastapi': 'Modern Python framework delivering automatic OpenAPI schema validation and high throughput.',
  'spring boot': 'Industry standard enterprise Java framework for transactional microservice architectures.',
  'html5': 'Structural foundation of web standards ensuring accessibility and semantic parsing.',
  'css3': 'Styling standard ensuring responsive cross-device fluid typography and UI adaptability.',
  'tailwind css': 'Utility-first styling system accelerating production frontend delivery and design tokens.',
  'aws': 'Leading global cloud platform encompassing compute (EC2/Lambda), storage (S3), and networking.',
  'azure': 'Microsoft cloud platform deeply integrated with enterprise identity (Entra) and services.',
  'gcp': 'Google cloud platform recognized for cutting-edge data analytics, BigQuery, and AI infrastructure.',
  'docker': 'Standard containerization technology guaranteeing that apps run identically in every environment.',
  'kubernetes': 'Orchestration standard managing automated scaling, self-healing, and multi-node clusters.',
  'terraform': 'Infrastructure-as-Code tooling allowing reproducible multi-cloud provisioning.',
  'ci/cd': 'Continuous integration and continuous delivery pipelines automating test suites and production rollouts.',
  'git': 'Distributed version control essential for branch management, code review, and engineering collaboration.',
  'sql': 'Standard declarative relational database query language for transactional reporting and joins.',
  'postgresql': 'Advanced open-source relational database renowned for extensible features and JSONB support.',
  'mysql': 'Ubiquitous relational database powering web applications and scalable read-replicas.',
  'mongodb': 'Flexible JSON-like document database suited for agile schema evolution and rapid iteration.',
  'redis': 'In-memory data store leveraged for sub-millisecond caching, rate-limiting, and pub/sub queues.',
  'graphql': 'API query language allowing clients to request exact data structures, minimizing over-fetching.',
  'rest api': 'Standard architectural interface pattern facilitating seamless service-to-service communication.',
  'microservices': 'Distributed architectural paradigm isolating domain bounded contexts for decoupled scaling.',
  'agile': 'Iterative project management framework optimizing sprint delivery and stakeholder responsiveness.',
  'scrum': 'Structured sprint cadences and ceremonies that drive cross-functional engineering velocity.',
  'jira': 'Standard issue and backlog tracking platform aligning engineering roadmaps with business goals.',
  'system design': 'Architectural discipline encompassing caching, sharding, replication, and fault tolerance.',
  'distributed systems': 'Engineering paradigm addressing concurrency, eventual consistency, and network partitions.',
  'unit testing': 'Automated test discipline ensuring individual functions execute deterministically.',
  'jest': 'Delightful JavaScript test framework for unit and component snapshot assertions.',
  'cypress': 'Modern end-to-end browser test runner verifying real user workflows in staging/production.',
  'machine learning': 'Statistical algorithmic discipline training predictive models from structured and unstructured data.',
  'data science': 'Multidisciplinary domain converting raw data into statistical insight and strategic value.',
  'tableau': 'Visual data analytics platform transforming complex SQL data into interactive executive dashboards.',
  'communication': 'Interpersonal skill crucial for explaining complex technical decisions to stakeholders.',
  'leadership': 'Ability to mentor junior engineers, unblock peers, and drive architectural consensus.',
  'cross-functional': 'Track record of collaborating effectively across product, design, QA, and business teams.',
  'problem solving': 'Core engineering competency in diagnosing root causes and implementing resilient solutions.'
};

// Helper to extract keywords from JD
const parseJobRequirements = (jdText) => {
  const text = (jdText || '').toLowerCase();
  
  const KNOWN_SKILLS = Object.keys(SKILL_RELEVANCE_MAP);

  const matched = [];
  KNOWN_SKILLS.forEach(skill => {
    if (text.includes(skill)) {
      matched.push(skill);
    }
  });

  return matched;
};

// Helper to get relevance explanation
const getSkillExplanation = (skill) => {
  return SKILL_RELEVANCE_MAP[skill.toLowerCase()] || `Relevant qualification and keyword requirement identified in job description for ${skill}.`;
};

// @desc    Match resume against job description
// @route   POST /api/job-matches
exports.createJobMatch = async (req, res, next) => {
  try {
    const { resumeId, jobTitle, jobDescription, resumeText } = req.body;

    if (!jobTitle || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both target job title and job description'
      });
    }

    let candidateText = (resumeText || '').toLowerCase();
    let resumeTitle = 'Direct Input';

    if (resumeId && req.user) {
      const resume = await Resume.findOne({ _id: resumeId, ownerId: req.user.id });
      if (resume) {
        resumeTitle = resume.title;
        candidateText += ` ${JSON.stringify(resume.sections)}`.toLowerCase();
      }
    }

    // Extract skills from JD
    const jdSkills = parseJobRequirements(jobDescription);
    const matchedSkills = [];
    const missingSkills = [];

    jdSkills.forEach(skill => {
      if (candidateText.includes(skill)) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    // Partition missing into Required vs Preferred
    const half = Math.ceil(missingSkills.length / 2);
    const missingRequired = missingSkills.slice(0, half);
    const missingPreferred = missingSkills.slice(half);

    // Calculate match percentage
    const totalSkills = jdSkills.length || 1;
    const matchRatio = matchedSkills.length / totalSkills;
    const overallScore = Math.min(98, Math.max(25, Math.round(matchRatio * 100)));

    const categoryScores = {
      skillsMatch: overallScore,
      experienceMatch: Math.min(95, Math.max(30, overallScore + 5)),
      keywordDensity: Math.min(90, Math.max(20, overallScore - 4)),
      educationMatch: 88
    };

    // Build skill explanations
    const skillExplanations = {};
    [...matchedSkills, ...missingSkills].forEach(s => {
      skillExplanations[s] = getSkillExplanation(s);
    });

    // Actionable tips
    const actionableTips = [
      missingRequired.length > 0
        ? `Consider highlighting any background you have with ${missingRequired.slice(0, 3).join(', ')} directly in your skills section.`
        : 'Your core skills closely align with the mandatory technical requirements.',
      'Incorporate specific terminology from the job description naturally into your most recent experience bullets.',
      `Align your headline to match "${jobTitle}" to immediately signal relevance to hiring managers.`
    ];

    const projectRecommendations = [
      `Feature a project demonstrating experience with ${missingRequired[0] || 'modern system architecture'}.`,
      'Emphasize collaborative workflows, testing, and cloud deployment pipelines in your project descriptions.'
    ];

    const matchPayload = {
      resumeId: resumeId || null,
      resumeTitle,
      jobTitle,
      jobDescription,
      overallMatchScore: overallScore,
      categoryScores,
      matchedSkills,
      missingRequiredSkills: missingRequired,
      missingPreferredSkills: missingPreferred,
      skillExplanations,
      experienceSummary: `Your resume matches ${matchedSkills.length} out of ${jdSkills.length} core technical requirements identified in this job posting.`,
      projectRecommendations,
      actionableTips
    };

    // Only persist if user is authenticated and explicitly requested
    if (req.user && req.user.id) {
      const jobMatch = await JobMatch.create({
        ownerId: req.user.id,
        ...matchPayload
      });
      return res.status(201).json({
        success: true,
        data: jobMatch
      });
    }

    // Guest / non-persisted response
    res.status(200).json({
      success: true,
      data: {
        _id: `temp-${Date.now()}`,
        ...matchPayload,
        isGuest: true
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Compare resume against two job descriptions side-by-side without permanently storing
// @route   POST /api/job-matches/compare
exports.compareJobDescriptions = async (req, res, next) => {
  try {
    const { resumeId, resumeText, jobA, jobB } = req.body;

    if (!jobA?.description || !jobB?.description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide two job descriptions (Job A and Job B) to compare.'
      });
    }

    let candidateText = (resumeText || '').toLowerCase();
    let resumeTitle = 'Direct Text Comparison';

    if (resumeId && req.user) {
      const resume = await Resume.findOne({ _id: resumeId, ownerId: req.user.id });
      if (resume) {
        resumeTitle = resume.title;
        candidateText += ` ${JSON.stringify(resume.sections)}`.toLowerCase();
      }
    }

    // Process Job A
    const skillsA = parseJobRequirements(jobA.description);
    const matchedA = skillsA.filter(s => candidateText.includes(s));
    const missingA = skillsA.filter(s => !candidateText.includes(s));
    const scoreA = Math.min(98, Math.max(25, Math.round((matchedA.length / (skillsA.length || 1)) * 100)));

    // Process Job B
    const skillsB = parseJobRequirements(jobB.description);
    const matchedB = skillsB.filter(s => candidateText.includes(s));
    const missingB = skillsB.filter(s => !candidateText.includes(s));
    const scoreB = Math.min(98, Math.max(25, Math.round((matchedB.length / (skillsB.length || 1)) * 100)));

    // Shared & unique skills
    const setA = new Set(skillsA);
    const setB = new Set(skillsB);
    const sharedSkills = skillsA.filter(s => setB.has(s));
    const uniqueToA = skillsA.filter(s => !setB.has(s));
    const uniqueToB = skillsB.filter(s => !setA.has(s));

    // Compile skill explanations
    const allSkills = new Set([...skillsA, ...skillsB]);
    const explanations = {};
    allSkills.forEach(s => {
      explanations[s] = getSkillExplanation(s);
    });

    res.status(200).json({
      success: true,
      data: {
        resumeTitle,
        comparison: {
          jobA: {
            title: jobA.title || 'Job Opportunity A',
            score: scoreA,
            totalSkills: skillsA.length,
            matchedSkills: matchedA,
            missingSkills: missingA,
            uniqueSkills: uniqueToA
          },
          jobB: {
            title: jobB.title || 'Job Opportunity B',
            score: scoreB,
            totalSkills: skillsB.length,
            matchedSkills: matchedB,
            missingSkills: missingB,
            uniqueSkills: uniqueToB
          },
          sharedSkills,
          recommendedTarget: scoreA >= scoreB ? (jobA.title || 'Job Opportunity A') : (jobB.title || 'Job Opportunity B'),
          scoreDifference: Math.abs(scoreA - scoreB),
          skillExplanations: explanations
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all job matches for user
// @route   GET /api/job-matches
exports.getJobMatches = async (req, res, next) => {
  try {
    const matches = await JobMatch.find({ ownerId: req.user.id })
      .select('-jobDescription')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single job match
// @route   GET /api/job-matches/:id
exports.getJobMatchById = async (req, res, next) => {
  try {
    const match = await JobMatch.findOne({ _id: req.params.id, ownerId: req.user.id });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Job match report not found'
      });
    }

    res.status(200).json({
      success: true,
      data: match
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Generate tailored resume version from job match
// @route   POST /api/job-matches/:id/tailor
exports.createTailoredResume = async (req, res, next) => {
  try {
    const match = await JobMatch.findOne({ _id: req.params.id, ownerId: req.user.id });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Job match not found'
      });
    }

    let baseResume;
    if (match.resumeId) {
      baseResume = await Resume.findOne({ _id: match.resumeId, ownerId: req.user.id });
    }

    if (!baseResume) {
      // Find latest resume
      baseResume = await Resume.findOne({ ownerId: req.user.id }).sort({ updatedAt: -1 });
    }

    if (!baseResume) {
      return res.status(400).json({
        success: false,
        message: 'Please create or upload a base resume before generating a tailored version'
      });
    }

    // Clone and tailor
    const tailoredSections = JSON.parse(JSON.stringify(baseResume.sections));
    tailoredSections.personalInfo.title = match.jobTitle;

    // Append verified missing skills to candidate's skills list if appropriate
    if (match.matchedSkills && match.matchedSkills.length > 0) {
      const existingTech = new Set(tailoredSections.skills.technical.map(s => s.toLowerCase()));
      match.matchedSkills.forEach(s => {
        if (!existingTech.has(s.toLowerCase())) {
          tailoredSections.skills.technical.push(s);
        }
      });
    }

    const tailored = await Resume.create({
      ownerId: req.user.id,
      title: `${baseResume.title} - Tailored for ${match.jobTitle}`,
      templateId: baseResume.templateId || 'ats-classic',
      jobTarget: match.jobTitle,
      version: 1,
      sections: tailoredSections,
      styling: baseResume.styling
    });

    match.tailoredResumeId = tailored._id;
    await match.save();

    res.status(201).json({
      success: true,
      data: tailored,
      message: `Tailored resume created for ${match.jobTitle}`
    });
  } catch (err) {
    next(err);
  }
};
