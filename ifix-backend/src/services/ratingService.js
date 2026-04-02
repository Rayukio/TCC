const Rating = require('../models/Rating');
const Appointment = require('../models/Appointment');
const Technician = require('../models/Technician');
const { validateScore } = require('../utils/validators');

const create = async ({ appointmentId, userId, score, comment, tags }) => {
  if (!validateScore(score)) throw { status: 400, message: 'Nota deve ser entre 1 e 5.' };

  const appointment = await Appointment.findByPk(appointmentId);
  if (!appointment) throw { status: 404, message: 'Agendamento não encontrado.' };
  if (appointment.userId !== userId) throw { status: 403, message: 'Acesso negado.' };
  if (appointment.status !== 'completed') throw { status: 400, message: 'Só é possível avaliar agendamentos concluídos.' };

  const existing = await Rating.findOne({ where: { appointmentId } });
  if (existing) throw { status: 409, message: 'Este agendamento já foi avaliado.' };

  const rating = await Rating.create({
    appointmentId,
    userId,
    technicianId: appointment.technicianId,
    score,
    comment,
    tags: tags || [],
  });

  // Recalculate technician average
  await recalculateTechnicianRating(appointment.technicianId);

  return rating;
};

const recalculateTechnicianRating = async (technicianId) => {
  const ratings = await Rating.findAll({ where: { technicianId } });
  const count = ratings.length;
  const avg = count ? ratings.reduce((sum, r) => sum + r.score, 0) / count : 0;

  await Technician.update(
    { ratingAvg: parseFloat(avg.toFixed(2)), ratingCount: count },
    { where: { id: technicianId } }
  );
};

const listByTechnician = async (technicianId) => {
  return Rating.findAll({
    where: { technicianId },
    order: [['createdAt', 'DESC']],
  });
};

const getByAppointment = async (appointmentId) => {
  return Rating.findOne({ where: { appointmentId } });
};

module.exports = { create, listByTechnician, getByAppointment };