const Analysis = require('../models/Analysis');
const Resume = require('../models/Resume');
const User = require('../models/User');
const DocumentParserService = require('../services/documentParserService');
const ATSScoringService = require('../services/atsScoringService');
const AIService = require('../services/aiService');

// Helper to convert structured resume object into clean text for ATS engine
const serializeResumeToText = (resume) => {
  const sections = resume.sections || {};
  let lines = [];

  // Personal Info
  if (sections.personalInfo) {
    const p = sections.personalInfo;
    lines.push(p.fullName || '');
    lines.push([p.title, p.email, p.phone, p.location].filter(Boolean).join(' | '));
    lines.push([p.linkedin, p.github, p.portfolio].filter(Boolean).join(' | '));
    lines.push('');
  }

  // Summary
  if (sections.summary) {
    lines.push('PROFESSIONAL SUMMARY');
    lines.push(sections.summary);
    lines.push('');
  }

  // Experience
  if (sections.experience && sections.experience.length > 0) {
    lines.push('WORK EXPERIENCE');
    sections.experience.forEach(exp => {
      lines.push(`${exp.role} at ${exp.company} (${exp.location || ''})`);
      lines.push(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`);
      (exp.bullets || []).forEach(b => lines.push(`• ${b}`));
      lines.push('');
    });
  }

  // Education
  if (sections.education && sections.education.length > 0) {
    lines.push('EDUCATION');
    sections.education.forEach(edu => {
      lines.push(`${edu.degree} in ${edu.fieldOfStudy} - ${edu.institution}`);
      lines.push(`Graduated: ${edu.graduationDate}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`);
      (edu.highlights || []).forEach(h => lines.push(`• ${h}`));
      lines.push('');
    });
  }

  // Skills
  if (sections.skills) {
    lines.push('TECHNICAL SKILLS & COMPETENCIES');
    if (sections.skills.technical && sections.skills.technical.length > 0) {
      lines.push(`Technical: ${sections.skills.technical.join(', ')}`);
    }
    if (sections.skills.tools && sections.skills.tools.length > 0) {
      lines.push(`Tools & Platforms: ${sections.skills.tools.join(', ')}`);
    }
    if (sections.skills.soft && sections.skills.soft.length > 0) {
      lines.push(`Professional: ${sections.skills.soft.join(', ')}`);
    }
    lines.push('');
  }

  // Projects
  if (sections.projects && sections.projects.length > 0) {
    lines.push('PROJECTS');
    sections.projects.forEach(proj => {
      lines.push(`${proj.name} | Role: ${proj.role || 'Creator'}`);
      if (proj.technologies && proj.technologies.length > 0) {
        lines.push(`Technologies: ${proj.technologies.join(', ')}`);
      }
      if (proj.description) lines.push(proj.description);
      (proj.bullets || []).forEach(b => lines.push(`• ${b}`));
      lines.push('');
    });
  }

  return lines.join('\n');
};

// @desc    Upload file & perform ATS Analysis (Universal endpoint for dashboard and landing page)
// @route   POST /api/analysis/upload
exports.uploadAndAnalyze = async (req, res, next) => {
  let extractedText = '';
  let originalName = 'Uploaded Document';
  let extractionMeta = {
    method: 'direct-text',
    numPages: 1,
    isScanned: false,
    ocrConfidence: null
  };

  try {
    const { targetJobTitle, jobDescription, careerMode, fresherTrack } = req.body;

    if (req.file) {
      originalName = req.file.originalname;
      const parseResult = await DocumentParserService.extractText(req.file);
      extractedText = parseResult.text;
      extractionMeta = {
        method: parseResult.method,
        numPages: parseResult.numPages,
        isScanned: parseResult.isScanned,
        ocrConfidence: parseResult.ocrConfidence || null
      };
    } else if (req.body.resumeText) {
      extractedText = req.body.resumeText;
      originalName = req.body.resumeTitle || 'Pasted Resume Text';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF, DOCX, PNG, or JPEG file, or paste your resume text.'
      });
    }

    const alphaCount = (extractedText.match(/[a-zA-Z0-9]/g) || []).length;
    if (!extractedText || alphaCount < 15) {
      return res.status(400).json({
        success: false,
        message: 'No readable text could be recognized in the document. Please verify that the file is not blank, corrupted, or an illegible image.'
      });
    }

    // Run transparent ATS scoring engine
    const evalResult = ATSScoringService.evaluate(extractedText, {
      targetJobTitle: targetJobTitle || 'General Assessment',
      jobDescription: jobDescription || '',
      careerMode: careerMode || 'standard',
      fresherTrack: fresherTrack || null,
      method: extractionMeta.method,
      isScanned: extractionMeta.isScanned
    });

    console.log(`[Analysis] Successfully evaluated document "${originalName}" using ${extractionMeta.method} (Score: ${evalResult.scores.overall}/100)`);

    // Privacy-preserving response: If user is logged in, save report (omitting raw extracted text)
    if (req.user && req.user.id) {
      const analysis = await Analysis.create({
        ownerId: req.user.id,
        resumeTitle: originalName,
        targetJobTitle: targetJobTitle || 'General Assessment',
        jobDescription: jobDescription || '',
        // PRIVACY: extractedText is intentionally omitted from permanent storage
        scores: evalResult.scores,
        issues: evalResult.issues,
        matchedKeywords: evalResult.matchedKeywords,
        missingKeywords: evalResult.missingKeywords,
        weakBullets: evalResult.weakBullets,
        strengths: evalResult.strengths,
        summary: evalResult.summary,
        contactDetection: evalResult.contactDetection,
        detectedCareerLevel: evalResult.detectedCareerLevel,
        extractionMetadata: extractionMeta,
        hasJobDescription: evalResult.hasJobDescription,
        disclaimer: evalResult.disclaimer
      });

      // Increment user usage counter
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { 'subscription.analysesUsed': 1 }
      });

      return res.status(201).json({
        success: true,
        data: analysis
      });
    }

    // Guest mode (e.g. from Landing Page upload): Return analysis directly without DB storage
    return res.status(200).json({
      success: true,
      data: {
        _id: 'guest-' + Date.now(),
        resumeTitle: originalName,
        targetJobTitle: targetJobTitle || 'General Assessment',
        jobDescription: jobDescription || '',
        scores: evalResult.scores,
        issues: evalResult.issues,
        matchedKeywords: evalResult.matchedKeywords,
        missingKeywords: evalResult.missingKeywords,
        weakBullets: evalResult.weakBullets,
        strengths: evalResult.strengths,
        summary: evalResult.summary,
        contactDetection: evalResult.contactDetection,
        detectedCareerLevel: evalResult.detectedCareerLevel,
        extractionMetadata: extractionMeta,
        hasJobDescription: evalResult.hasJobDescription,
        disclaimer: evalResult.disclaimer,
        createdAt: new Date().toISOString(),
        isGuest: true
      }
    });
  } catch (err) {
    next(err);
  } finally {
    // Memory cleanup: Release uploaded buffer immediately
    if (req.file) {
      req.file.buffer = null;
    }
  }
};

// @desc    Analyze a saved resume in the database
// @route   POST /api/analysis/resume/:resumeId
exports.analyzeExistingResume = async (req, res, next) => {
  try {
    const { targetJobTitle, jobDescription } = req.body;
    const resume = await Resume.findOne({ _id: req.params.resumeId, ownerId: req.user.id });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    const serializedText = serializeResumeToText(resume);
    const evalResult = ATSScoringService.evaluate(serializedText, {
      targetJobTitle: targetJobTitle || resume.jobTarget || 'Software Engineer',
      jobDescription: jobDescription || '',
      structuredSections: resume.sections
    });

    const analysis = await Analysis.create({
      ownerId: req.user.id,
      resumeId: resume._id,
      resumeTitle: resume.title,
      targetJobTitle: targetJobTitle || resume.jobTarget,
      jobDescription: jobDescription || '',
      scores: evalResult.scores,
      issues: evalResult.issues,
      matchedKeywords: evalResult.matchedKeywords,
      missingKeywords: evalResult.missingKeywords,
      weakBullets: evalResult.weakBullets,
      strengths: evalResult.strengths,
      summary: evalResult.summary,
      contactDetection: evalResult.contactDetection,
      detectedCareerLevel: evalResult.detectedCareerLevel,
      extractionMetadata: { method: 'saved-structured-resume', numPages: 1, isScanned: false },
      hasJobDescription: evalResult.hasJobDescription,
      disclaimer: evalResult.disclaimer
    });

    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'subscription.analysesUsed': 1 }
    });

    res.status(201).json({
      success: true,
      data: analysis
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single analysis by id
// @route   GET /api/analysis/:id
exports.getAnalysisById = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, ownerId: req.user.id });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis report not found'
      });
    }

    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all analyses for user
// @route   GET /api/analysis
exports.getUserAnalyses = async (req, res, next) => {
  try {
    const analyses = await Analysis.find({ ownerId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: analyses.length,
      data: analyses
    });
  } catch (err) {
    next(err);
  }
};

// @desc    AI Improve a section / bullet
// @route   POST /api/analysis/improve
exports.improveBulletOrSummary = async (req, res, next) => {
  try {
    const { type, text, context } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Please provide text to improve'
      });
    }

    if (type === 'summary') {
      const result = await AIService.generateSummary(context || {});
      return res.status(200).json({ success: true, data: result });
    }

    const result = await AIService.improveBullet(text, context || {});
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete analysis
// @route   DELETE /api/analysis/:id
exports.deleteAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOneAndDelete({ _id: req.params.id, ownerId: req.user.id });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Analysis report deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
