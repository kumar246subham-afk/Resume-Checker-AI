const mongoose = require('mongoose');

const JobMatchSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      default: null
    },
    resumeTitle: {
      type: String,
      default: 'Resume'
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true
    },
    jobDescription: {
      type: String,
      required: true
    },
    overallMatchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    categoryScores: {
      skillsMatch: { type: Number, default: 0 },
      experienceMatch: { type: Number, default: 0 },
      keywordDensity: { type: Number, default: 0 },
      educationMatch: { type: Number, default: 0 }
    },
    matchedSkills: [{ type: String }],
    missingRequiredSkills: [{ type: String }],
    missingPreferredSkills: [{ type: String }],
    experienceSummary: { type: String, default: '' },
    projectRecommendations: [{ type: String }],
    actionableTips: [{ type: String }],
    tailoredResumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('JobMatch', JobMatchSchema);
