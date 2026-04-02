const { Router } = require('express');
const {
  register, login, getProfile, getById, updateProfile, search, match,
} = require('../controllers/technicianController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/search', search);
router.get('/match', match);
router.get('/me', authMiddleware, requireRole('technician'), getProfile);
router.put('/me', authMiddleware, requireRole('technician'), updateProfile);
router.get('/:id', getById);

module.exports = router;