const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  technicianId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'technicians', key: 'id' },
  },
  serviceId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'services', key: 'id' },
  },
  status: {
    type: DataTypes.ENUM(
      'pending',
      'accepted',
      'in_progress',
      'on_the_way',
      'arrived',
      'completed',
      'cancelled',
      'rejected'
    ),
    defaultValue: 'pending',
  },
  scheduledAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  address: {
    type: DataTypes.JSON,
    allowNull: false,
    // { street, city, state, zip, lat, lng }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'refunded'),
    defaultValue: 'pending',
  },
  cancellationReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  technicianLocation: {
    type: DataTypes.JSON,
    allowNull: true,
    // Real-time { lat, lng } updated during on_the_way
  },
}, {
  tableName: 'appointments',
  timestamps: true,
});

module.exports = Appointment;