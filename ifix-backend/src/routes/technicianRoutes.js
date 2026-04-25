const { Router } = require('express');
const {
  register, login, getProfile, getById, updateProfile,
  search, match, addService, removeService, listMyServices,
} = require('../controllers/technicianController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');

const router = Router();

// Públicas
router.post('/register', register);
router.post('/login',    login);
router.get('/search',    search);
router.get('/match',     match);
router.get('/:id',       getById);

// Autenticadas (técnico)
router.get('/me',                        authMiddleware, requireRole('technician'), getProfile);
router.put('/me',                        authMiddleware, requireRole('technician'), updateProfile);
router.get('/me/services',               authMiddleware, requireRole('technician'), listMyServices);
router.post('/me/services',              authMiddleware, requireRole('technician'), addService);
router.delete('/me/services/:serviceId', authMiddleware, requireRole('technician'), removeService);

module.exports = router;