const { Router } = require('express');
const { create, getById, listMine, updateStatus, updateLocation } = require('../controllers/appointmentController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = Router();

router.use(authMiddleware);

router.post('/', create);
router.get('/', listMine);
router.get('/:id', getById);
router.patch('/:id/status', updateStatus);
router.patch('/:id/location', updateLocation);

module.exports = router;