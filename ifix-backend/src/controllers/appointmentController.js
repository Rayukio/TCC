const appointmentService = require('../services/appointmentService');

const create = async (req, res, next) => {
  try {
    const { technicianId, serviceId, scheduledAt, address, notes, paymentMethod } = req.body;
    if (!technicianId || !serviceId || !scheduledAt || !address) {
      return res.status(400).json({ error: 'technicianId, serviceId, scheduledAt e address são obrigatórios.' });
    }
    const appointment = await appointmentService.create({
      userId: req.user.id,
      technicianId,
      serviceId,
      scheduledAt,
      address,
      notes,
      paymentMethod,
    });
    res.status(201).json(appointment);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const appointment = await appointmentService.getById(req.params.id);
    // Ensure requester is involved in this appointment
    const { id, role } = req.user;
    if (role === 'user' && appointment.userId !== id) return res.status(403).json({ error: 'Acesso negado.' });
    if (role === 'technician' && appointment.technicianId !== id) return res.status(403).json({ error: 'Acesso negado.' });
    res.json(appointment);
  } catch (err) {
    next(err);
  }
};

const listMine = async (req, res, next) => {
  try {
    const { status } = req.query;
    const { id, role } = req.user;
    let appointments;
    if (role === 'user') {
      appointments = await appointmentService.listByUser(id, status);
    } else {
      appointments = await appointmentService.listByTechnician(id, status);
    }
    res.json(appointments);
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status, cancellationReason } = req.body;
    if (!status) return res.status(400).json({ error: 'status é obrigatório.' });
    const appointment = await appointmentService.updateStatus(
      req.params.id,
      status,
      req.user.id,
      req.user.role,
      { cancellationReason }
    );
    res.json(appointment);
  } catch (err) {
    next(err);
  }
};

const updateLocation = async (req, res, next) => {
  try {
    const { lat, lng } = req.body;
    if (lat == null || lng == null) return res.status(400).json({ error: 'lat e lng são obrigatórios.' });
    const result = await appointmentService.updateTechnicianLocation(
      req.params.id,
      req.user.id,
      { lat, lng }
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getById, listMine, updateStatus, updateLocation };