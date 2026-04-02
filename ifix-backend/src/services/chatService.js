// In-memory chat store (replace with DB/Redis in production)
const chats = new Map(); // key: `${userId}_${technicianId}_${appointmentId}`

const getChatKey = (appointmentId) => `chat_${appointmentId}`;

const getMessages = async (appointmentId) => {
  const key = getChatKey(appointmentId);
  return chats.get(key) || [];
};

const sendMessage = async ({ appointmentId, senderId, senderRole, content }) => {
  if (!content || !content.trim()) throw { status: 400, message: 'Mensagem não pode ser vazia.' };

  const key = getChatKey(appointmentId);
  const messages = chats.get(key) || [];

  const message = {
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    appointmentId,
    senderId,
    senderRole, // 'user' | 'technician'
    content: content.trim(),
    createdAt: new Date().toISOString(),
    read: false,
  };

  messages.push(message);
  chats.set(key, messages);

  return message;
};

const markAsRead = async (appointmentId, readerRole) => {
  const key = getChatKey(appointmentId);
  const messages = chats.get(key) || [];
  const otherRole = readerRole === 'user' ? 'technician' : 'user';

  const updated = messages.map((m) =>
    m.senderRole === otherRole ? { ...m, read: true } : m
  );

  chats.set(key, updated);
  return { marked: updated.filter((m) => m.senderRole === otherRole).length };
};

module.exports = { getMessages, sendMessage, markAsRead };