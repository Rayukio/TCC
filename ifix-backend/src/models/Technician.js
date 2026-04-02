const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Technician = sequelize.define('Technician', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  avatarUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  specialties: {
    type: DataTypes.JSON,
    defaultValue: [],
    // Array of service category strings
  },
  location: {
    type: DataTypes.JSON,
    allowNull: true,
    // { lat, lng, city, state, address }
  },
  radiusKm: {
    type: DataTypes.FLOAT,
    defaultValue: 20,
  },
  ratingAvg: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  ratingCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  completedJobs: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  badges: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  pricePerHour: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
}, {
  tableName: 'technicians',
  timestamps: true,
});

module.exports = Technician;