const chatService = require('../services/chatService');
const appointmentService = require('../services/appointmentService');

// Ensure requester belongs to the appointment before accessing chat
const assertAccess = async (appointmentId, userId, role) => {
  const appointment = await appointmentService.getById(appointmentId);
  if (role === 'user' && appointment.userId !== userId) throw { status: 403, message: 'Acesso negado.' };
  if (role === 'technician' && appointment.technicianId !== userId) throw { status: 403, message: 'Acesso negado.' };
  return appointment;
};

const getMessages = async (req, res, next) => {
  try {
    await assertAccess(req.params.appointmentId, req.user.id, req.user.role);
    const messages = await chatService.getMessages(req.params.appointmentId);
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    await assertAccess(req.params.appointmentId, req.user.id, req.user.role);
    const message = await chatService.sendMessage({
      appointmentId: req.params.appointmentId,
      senderId: req.user.id,
      senderRole: req.user.role,
      content,
    });
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    await assertAccess(req.params.appointmentId, req.user.id, req.user.role);
    const result = await chatService.markAsRead(req.params.appointmentId, req.user.role);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { getMessages, sendMessage, markAsRead };