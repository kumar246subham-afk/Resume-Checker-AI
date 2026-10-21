const express = require('express');
const router = express.Router();
const {
  createJobMatch,
  getJobMatches,
  getJobMatchById,
  createTailoredResume,
  compareJobDescriptions
} = require('../controllers/jobMatchController');
const { protect, optionalProtect } = require('../middleware/auth');

// Public / Guest friendly matching & comparison routes (zero-storage if not authenticated)
router.post('/compare', optionalProtect, compareJobDescriptions);
router.post('/', optionalProtect, createJobMatch);

// Protected routes requiring registered user account
router.get('/', protect, getJobMatches);
router.get('/:id', protect, getJobMatchById);
router.post('/:id/tailor', protect, createTailoredResume);

module.exports = router;
