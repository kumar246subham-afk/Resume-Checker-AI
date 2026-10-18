const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  title: { type: String, required: true },
  severity: { type: String, enum: ['critical', 'warning', 'suggestion'], required: true },
  category: { type: String, required: true },
  explanation: { type: String, required: true },
  resumeText: { type: String, default: '' },
  recommendation: { type: String, required: true },
  fixType: { type: String, default: 'rewrite' },
  aiFix: { type: String, default: '' },
  applied: { type: Boolean, default: false }
}, { _id: false });

const AnalysisSchema = new mongoose.Schema(
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
      default: 'Uploaded Resume'
    },
    targetJobTitle: {
      type: String,
      default: 'General Assessment'
    },
    jobDescription: {
      type: String,
      default: ''
    },
    extractedText: {
      type: String,
      default: ''
    },
    scores: {
      overall: { type: Number, required: true, min: 0, max: 100 },
      atsReadability: { type: Number, required: true, min: 0, max: 100 },
      keywordAlignment: { type: Number, required: true, min: 0, max: 100 },
      skillsExperience: { type: Number, required: true, min: 0, max: 100 },
      projectsAchievements: { type: Number, required: true, min: 0, max: 100 },
      grammarClarity: { type: Number, required: true, min: 0, max: 100 }
    },
    issues: [IssueSchema],
    matchedKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    weakBullets: [
      {
        original: { type: String },
        reason: { type: String },
        improvedSuggestion: { type: String }
      }
    ],
    strengths: [{ type: String }],
    summary: {
      type: String,
      default: ''
    },
    isDemo: {
      type: Boolean,
      default: false
    },
    hasJobDescription: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Analysis', AnalysisSchema);
