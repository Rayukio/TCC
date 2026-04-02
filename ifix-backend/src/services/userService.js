const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/token');
const { validateEmail, validatePassword } = require('../utils/validators');

const register = async ({ name, email, password, phone }) => {
  if (!validateEmail(email)) throw { status: 400, message: 'E-mail inválido.' };
  if (!validatePassword(password)) throw { status: 400, message: 'Senha deve ter ao menos 8 caracteres, com letras e números.' };

  const existing = await User.findOne({ where: { email } });
  if (existing) throw { status: 409, message: 'E-mail já cadastrado.' };

  const passwordHash = await hashPassword(password);
  const user = await User.create({ name, email, passwordHash, phone });

  const token = generateToken({ id: user.id, role: 'user' });
  return { user: sanitize(user), token };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email, isActive: true } });
  if (!user) throw { status: 401, message: 'Credenciais inválidas.' };

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) throw { status: 401, message: 'Credenciais inválidas.' };

  const token = generateToken({ id: user.id, role: 'user' });
  return { user: sanitize(user), token };
};

const getProfile = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw { status: 404, message: 'Usuário não encontrado.' };
  return sanitize(user);
};

const updateProfile = async (userId, data) => {
  const user = await User.findByPk(userId);
  if (!user) throw { status: 404, message: 'Usuário não encontrado.' };

  const allowed = ['name', 'phone', 'avatarUrl', 'address'];
  allowed.forEach((key) => { if (data[key] !== undefined) user[key] = data[key]; });
  await user.save();

  return sanitize(user);
};

const sanitize = (user) => {
  const { passwordHash, ...safe } = user.toJSON();
  return safe;
};

module.exports = { register, login, getProfile, updateProfile };