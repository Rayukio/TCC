const { Router } = require('express');
const { getMessages, sendMessage, markAsRead } = require('../controllers/chatController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = Router();

router.use(authMiddleware);

router.get('/:appointmentId/messages', getMessages);
router.post('/:appointmentId/messages', sendMessage);
router.patch('/:appointmentId/read', markAsRead);

module.exports = router;