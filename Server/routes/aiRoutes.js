const express = require('express');
const router = express.Router();
const { processAIMessage, resetAIConversation } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/chat', protect, processAIMessage);
router.post('/reset', protect, resetAIConversation);

module.exports = router;