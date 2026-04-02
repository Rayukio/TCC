const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    // e.g. 'electrical', 'plumbing', 'appliance', 'hvac', 'it', 'cleaning'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  iconUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  estimatedDurationMin: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Estimated duration in minutes',
  },
  basePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'services',
  timestamps: true,
});

module.exports = Service;