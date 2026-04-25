const User = require('./User');
const Technician = require('./Technician');
const Service = require('./Service');
const TechnicianService = require('./TechnicianService');
const Appointment = require('./Appointment');
const Rating = require('./Rating');
const Chat = require('./Chat');
const Message = require('./Message');

// ─── User ────────────────────────────────────────────────
User.hasMany(Appointment, { foreignKey: 'userId', as: 'appointments' });
User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings' });

// ─── Technician ──────────────────────────────────────────
Technician.hasMany(Appointment, { foreignKey: 'technicianId', as: 'appointments' });
Technician.hasMany(Rating, { foreignKey: 'technicianId', as: 'ratings' });
Technician.belongsToMany(Service, {
  through: TechnicianService,
  foreignKey: 'technicianId',
  otherKey: 'serviceId',
  as: 'services',
});

// ─── Service ─────────────────────────────────────────────
Service.hasMany(Appointment, { foreignKey: 'serviceId', as: 'appointments' });
Service.belongsToMany(Technician, {
  through: TechnicianService,
  foreignKey: 'serviceId',
  otherKey: 'technicianId',
  as: 'technicians',
});

// ─── TechnicianService (pivot) ───────────────────────────
TechnicianService.belongsTo(Technician, { foreignKey: 'technicianId', as: 'technician' });
TechnicianService.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });

// ─── Appointment ─────────────────────────────────────────
Appointment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Appointment.belongsTo(Technician, { foreignKey: 'technicianId', as: 'technician' });
Appointment.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });
Appointment.hasOne(Rating, { foreignKey: 'appointmentId', as: 'rating' });
Appointment.hasOne(Chat, { foreignKey: 'appointmentId', as: 'chat' });

// ─── Rating ──────────────────────────────────────────────
Rating.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Rating.belongsTo(Technician, { foreignKey: 'technicianId', as: 'technician' });

// ─── Chat ────────────────────────────────────────────────
Chat.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });
Chat.hasMany(Message, { foreignKey: 'chatId', as: 'messages' });

// ─── Message ─────────────────────────────────────────────
Message.belongsTo(Chat, { foreignKey: 'chatId', as: 'chat' });

module.exports = { User, Technician, Service, TechnicianService, Appointment, Rating, Chat, Message };