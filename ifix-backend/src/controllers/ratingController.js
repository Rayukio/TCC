const ratingService = require('../services/ratingService');

const create = async (req, res, next) => {
  try {
    const { appointmentId, score, comment, tags } = req.body;
    if (!appointmentId || score == null) {
      return res.status(400).json({ error: 'appointmentId e score são obrigatórios.' });
    }
    const rating = await ratingService.create({
      appointmentId,
      userId: req.user.id,
      score,
      comment,
      tags,
    });
    res.status(201).json(rating);
  } catch (err) {
    next(err);
  }
};

const listByTechnician = async (req, res, next) => {
  try {
    const ratings = await ratingService.listByTechnician(req.params.technicianId);
    res.json(ratings);
  } catch (err) {
    next(err);
  }
};

const getByAppointment = async (req, res, next) => {
  try {
    const rating = await ratingService.getByAppointment(req.params.appointmentId);
    if (!rating) return res.status(404).json({ error: 'Avaliação não encontrada.' });
    res.json(rating);
  } catch (err) {
    next(err);
  }
};

module.exports = { create, listByTechnician, getByAppointment };