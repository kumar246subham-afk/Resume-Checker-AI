const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  deleteAccount
} = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getSettings)
  .put(updateSettings);

router.delete('/account', deleteAccount);

module.exports = router;
