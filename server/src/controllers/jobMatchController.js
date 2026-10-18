const JobMatch = require('../models/JobMatch');
const Resume = require('../models/Resume');

// Helper to extract keywords from JD
const parseJobRequirements = (jdText) => {
  const text = (jdText || '').toLowerCase();
  
  // High-frequency technical and domain skills
  const KNOWN_SKILLS = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'golang', 'rust',
    'react', 'react native', 'angular', 'vue', 'next.js', 'node.js', 'express',
    'django', 'flask', 'fastapi', 'spring boot', 'html5', 'css3', 'tailwind css',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'git',
    'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'graphql', 'rest api',
    'microservices', 'agile', 'scrum', 'jira', 'system design', 'distributed systems',
    'unit testing', 'jest', 'cypress', 'machine learning', 'data science', 'tableau',
    'communication', 'leadership', 'cross-functional', 'problem solving'
  ];

  const matched = [];
  KNOWN_SKILLS.forEach(skill => {
    if (text.includes(skill)) {
      matched.push(skill);
    }
  });

  return matched;
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

    if (resumeId) {
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

    const jobMatch = await JobMatch.create({
      ownerId: req.user.id,
      resumeId: resumeId || null,
      resumeTitle,
      jobTitle,
      jobDescription,
      overallMatchScore: overallScore,
      categoryScores,
      matchedSkills,
      missingRequiredSkills: missingRequired,
      missingPreferredSkills: missingPreferred,
      experienceSummary: `Your resume matches ${matchedSkills.length} out of ${jdSkills.length} core technical requirements identified in this job posting.`,
      projectRecommendations,
      actionableTips
    });

    res.status(201).json({
      success: true,
      data: jobMatch
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
