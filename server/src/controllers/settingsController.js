const User = require('../models/User');
const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');
const JobMatch = require('../models/JobMatch');

// @desc    Get user settings & preferences
// @route   GET /api/settings
exports.getSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const resumeCount = await Resume.countDocuments({ ownerId: req.user.id });
    const analysisCount = await Analysis.countDocuments({ ownerId: req.user.id });
    const matchCount = await JobMatch.countDocuments({ ownerId: req.user.id });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          preferences: user.preferences,
          subscription: user.subscription,
          createdAt: user.createdAt
        },
        stats: {
          savedResumes: resumeCount,
          totalAnalyses: analysisCount,
          jobMatches: matchCount
        },
        retentionPolicy: {
          policy: 'User documents and uploaded resumes are stored securely and encrypted at rest. Users maintain full ownership and can permanently purge individual resumes or their entire account at any time.',
          dataPurgeAvailable: true
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user preferences & profile
// @route   PUT /api/settings
exports.updateSettings = async (req, res, next) => {
  try {
    const { name, preferences } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (preferences) {
      user.preferences = {
        ...user.preferences.toObject(),
        ...preferences
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete account and purge all data
// @route   DELETE /api/account
exports.deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Cascade delete all user documents
    await Resume.deleteMany({ ownerId: userId });
    await Analysis.deleteMany({ ownerId: userId });
    await JobMatch.deleteMany({ ownerId: userId });
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Account and all associated documents permanently purged'
    });
  } catch (err) {
    next(err);
  }
};
