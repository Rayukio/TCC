const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  appointmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    comment: 'Cada agendamento possui exatamente um chat',
  },
}, {
  tableName: 'chats',
  timestamps: true,
});

module.exports = Chat;