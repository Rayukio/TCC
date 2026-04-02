const { Router } = require('express');
const { register, login, getProfile, updateProfile } = require('../controllers/userController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, requireRole('user'), getProfile);
router.put('/me', authMiddleware, requireRole('user'), updateProfile);

module.exports = router;