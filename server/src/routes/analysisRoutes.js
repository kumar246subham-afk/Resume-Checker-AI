const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  uploadAndAnalyze,
  analyzeExistingResume,
  getAnalysisById,
  getUserAnalyses,
  improveBulletOrSummary,
  deleteAnalysis
} = require('../controllers/analysisController');
const { protect, optionalProtect } = require('../middleware/auth');

// Universal upload & analysis endpoint (supports both authenticated dashboard and landing page preview)
router.post('/upload', optionalProtect, upload.single('resumeFile'), uploadAndAnalyze);

// Authenticated endpoints
router.post('/resume/:resumeId', protect, analyzeExistingResume);
router.get('/', protect, getUserAnalyses);
router.get('/:id', protect, getAnalysisById);
router.post('/improve', protect, improveBulletOrSummary);
router.delete('/:id', protect, deleteAnalysis);

module.exports = router;
