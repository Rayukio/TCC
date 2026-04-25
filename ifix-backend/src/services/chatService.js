const { Chat, Message } = require('../models');

const getOrCreateChat = async (appointmentId) => {
  const [chat] = await Chat.findOrCreate({ where: { appointmentId } });
  return chat;
};

const getMessages = async (appointmentId) => {
  const chat = await getOrCreateChat(appointmentId);
  return Message.findAll({
    where: { chatId: chat.id },
    order: [['createdAt', 'ASC']],
  });
};

const sendMessage = async ({ appointmentId, senderId, senderRole, content, imageUrl }) => {
  if (!content?.trim() && !imageUrl) {
    throw { status: 400, message: 'Mensagem não pode ser vazia.' };
  }

  const chat = await getOrCreateChat(appointmentId);

  const message = await Message.create({
    chatId:     chat.id,
    senderType: senderRole, // 'user' | 'technician'
    senderId,
    message:    content?.trim() || '',
    imageUrl:   imageUrl || null,
  });

  return message;
};

const markAsRead = async (appointmentId, readerRole) => {
  const chat = await Chat.findOne({ where: { appointmentId } });
  if (!chat) return { marked: 0 };

  const otherType = readerRole === 'user' ? 'technician' : 'user';

  const [count] = await Message.update(
    { read: true },
    { where: { chatId: chat.id, senderType: otherType, read: false } }
  );

  return { marked: count };
};

module.exports = { getMessages, sendMessage, markAsRead };