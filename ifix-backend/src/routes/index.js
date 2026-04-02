const { Router } = require('express');
const userRoutes = require('./userRoutes');
const technicianRoutes = require('./technicianRoutes');
const serviceRoutes = require('./serviceRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const ratingRoutes = require('./ratingRoutes');
const chatRoutes = require('./chatRoutes');

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

router.use('/users', userRoutes);
router.use('/technicians', technicianRoutes);
router.use('/services', serviceRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/ratings', ratingRoutes);
router.use('/chat', chatRoutes);

module.exports = router;