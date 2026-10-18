const express = require('express');
const router = express.Router();
const {
  createJobMatch,
  getJobMatches,
  getJobMatchById,
  createTailoredResume
} = require('../controllers/jobMatchController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .post(createJobMatch)
  .get(getJobMatches);

router.route('/:id')
  .get(getJobMatchById);

router.post('/:id/tailor', createTailoredResume);

module.exports = router;
