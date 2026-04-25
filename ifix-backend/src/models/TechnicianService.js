const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TechnicianService = sequelize.define('TechnicianService', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  technicianId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  serviceId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Preço cobrado por este técnico para este serviço específico',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'technician_services',
  timestamps: true,
  indexes: [
    { fields: ['technicianId'] },
    { fields: ['serviceId'] },
    { unique: true, fields: ['technicianId', 'serviceId'] },
  ],
});

module.exports = TechnicianService;