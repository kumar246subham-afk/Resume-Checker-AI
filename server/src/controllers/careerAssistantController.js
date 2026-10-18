const AIService = require('../services/aiService');
const Resume = require('../models/Resume');

// @desc    Interact with AI Career Assistant
// @route   POST /api/career-assistant/chat
exports.chatWithAssistant = async (req, res, next) => {
  try {
    const { message, resumeId, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message or prompt'
      });
    }

    let resumeContext = {};
    if (resumeId) {
      const resume = await Resume.findOne({ _id: resumeId, ownerId: req.user.id });
      if (resume) {
        resumeContext = {
          resumeTitle: resume.title,
          jobTarget: resume.jobTarget,
          skills: resume.sections?.skills?.technical || [],
          summary: resume.sections?.summary || '',
          recentExperience: (resume.sections?.experience || []).slice(0, 2)
        };
      }
    }

    const aiResponse = await AIService.chatCareerAssistant(message, resumeContext, history || []);

    res.status(200).json({
      success: true,
      data: aiResponse
    });
  } catch (err) {
    next(err);
  }
};
