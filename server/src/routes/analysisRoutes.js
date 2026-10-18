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
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/upload', upload.single('resumeFile'), uploadAndAnalyze);
router.post('/resume/:resumeId', analyzeExistingResume);
router.get('/', getUserAnalyses);
router.get('/:id', getAnalysisById);
router.post('/improve', improveBulletOrSummary);
router.delete('/:id', deleteAnalysis);

module.exports = router;
