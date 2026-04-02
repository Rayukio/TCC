const { Router } = require('express');
const { create, listByTechnician, getByAppointment } = require('../controllers/ratingController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');

const router = Router();

router.post('/', authMiddleware, requireRole('user'), create);
router.get('/technician/:technicianId', listByTechnician);
router.get('/appointment/:appointmentId', authMiddleware, getByAppointment);

module.exports = router;