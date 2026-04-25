const { Appointment, User, Technician, Service, TechnicianService } = require('../models');
const { isValidFutureDate } = require('../utils/dateUtils');

const VALID_TRANSITIONS = {
  pending:     ['accepted', 'rejected', 'cancelled'],
  accepted:    ['on_the_way', 'cancelled'],
  on_the_way:  ['arrived'],
  arrived:     ['in_progress'],
  in_progress: ['completed'],
  completed:   [],
  rejected:    [],
  cancelled:   [],
};

const create = async ({ userId, technicianId, serviceId, scheduledAt, address, notes, paymentMethod }) => {
  if (!isValidFutureDate(scheduledAt)) {
    throw { status: 400, message: 'Data de agendamento inválida ou no passado.' };
  }

  const [technician, service] = await Promise.all([
    Technician.findByPk(technicianId),
    Service.findByPk(serviceId),
  ]);

  if (!technician || !technician.isActive) throw { status: 404, message: 'Técnico não encontrado.' };
  if (!service || !service.isActive) throw { status: 404, message: 'Serviço não encontrado.' };

  // Preço: busca o preço real do técnico para o serviço, senão usa basePrice do catálogo
  const techService = await TechnicianService.findOne({
    where: { technicianId, serviceId, isActive: true },
  });
  const totalPrice = techService?.price || service.basePrice || technician.pricePerHour;

  const appointment = await Appointment.create({
    userId, technicianId, serviceId, scheduledAt, address, notes, paymentMethod, totalPrice,
  });

  return getById(appointment.id);
};

const getById = async (id) => {
  const appointment = await Appointment.findByPk(id, {
    include: [
      { model: User,       as: 'user',       attributes: ['id', 'name', 'avatarUrl', 'phone'] },
      { model: Technician, as: 'technician', attributes: ['id', 'name', 'avatarUrl', 'phone', 'ratingAvg'] },
      { model: Service,    as: 'service' },
    ],
  });
  if (!appointment) throw { status: 404, message: 'Agendamento não encontrado.' };
  return appointment;
};

const listByUser = async (userId, status) => {
  const where = { userId };
  if (status) where.status = status;
  return Appointment.findAll({
    where,
    include: [
      { model: Technician, as: 'technician', attributes: ['id', 'name', 'avatarUrl', 'ratingAvg'] },
      { model: Service,    as: 'service' },
    ],
    order: [['scheduledAt', 'DESC']],
  });
};

const listByTechnician = async (technicianId, status) => {
  const where = { technicianId };
  if (status) where.status = status;
  return Appointment.findAll({
    where,
    include: [
      { model: User,    as: 'user',    attributes: ['id', 'name', 'avatarUrl', 'phone'] },
      { model: Service, as: 'service' },
    ],
    order: [['scheduledAt', 'ASC']],
  });
};

const updateStatus = async (appointmentId, newStatus, actorId, role, extra = {}) => {
  const appointment = await Appointment.findByPk(appointmentId);
  if (!appointment) throw { status: 404, message: 'Agendamento não encontrado.' };

  if (role === 'user'       && appointment.userId       !== actorId) throw { status: 403, message: 'Acesso negado.' };
  if (role === 'technician' && appointment.technicianId !== actorId) throw { status: 403, message: 'Acesso negado.' };

  const allowed = VALID_TRANSITIONS[appointment.status] || [];
  if (!allowed.includes(newStatus)) {
    throw { status: 400, message: `Transição de "${appointment.status}" para "${newStatus}" não permitida.` };
  }

  appointment.status = newStatus;
  if (newStatus === 'in_progress') appointment.startedAt = new Date();
  if (newStatus === 'completed') {
    appointment.completedAt = new Date();
    await Technician.increment('completedJobs', { where: { id: appointment.technicianId } });
  }
  if (extra.cancellationReason) appointment.cancellationReason = extra.cancellationReason;
  if (extra.technicianLocation) appointment.technicianLocation = extra.technicianLocation;

  await appointment.save();
  return getById(appointment.id);
};

const updateTechnicianLocation = async (appointmentId, technicianId, location) => {
  const appointment = await Appointment.findByPk(appointmentId);
  if (!appointment) throw { status: 404, message: 'Agendamento não encontrado.' };
  if (appointment.technicianId !== technicianId) throw { status: 403, message: 'Acesso negado.' };

  appointment.technicianLocation = location;
  await appointment.save();
  return { technicianLocation: appointment.technicianLocation };
};

module.exports = { create, getById, listByUser, listByTechnician, updateStatus, updateTechnicianLocation };