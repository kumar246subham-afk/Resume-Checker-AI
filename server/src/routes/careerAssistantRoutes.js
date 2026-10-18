const express = require('express');
const router = express.Router();
const { chatWithAssistant } = require('../controllers/careerAssistantController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/chat', chatWithAssistant);

module.exports = router;
