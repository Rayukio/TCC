const Technician = require('../models/Technician');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/token');
const { validateEmail, validatePassword } = require('../utils/validators');
const { Op } = require('sequelize');

const register = async ({ name, email, password, phone, specialties, bio }) => {
  if (!validateEmail(email)) throw { status: 400, message: 'E-mail inválido.' };
  if (!validatePassword(password)) throw { status: 400, message: 'Senha deve ter ao menos 8 caracteres, com letras e números.' };

  const existing = await Technician.findOne({ where: { email } });
  if (existing) throw { status: 409, message: 'E-mail já cadastrado.' };

  const passwordHash = await hashPassword(password);
  const technician = await Technician.create({ name, email, passwordHash, phone, specialties, bio });

  const token = generateToken({ id: technician.id, role: 'technician' });
  return { technician: sanitize(technician), token };
};

const login = async ({ email, password }) => {
  const technician = await Technician.findOne({ where: { email, isActive: true } });
  if (!technician) throw { status: 401, message: 'Credenciais inválidas.' };

  const valid = await comparePassword(password, technician.passwordHash);
  if (!valid) throw { status: 401, message: 'Credenciais inválidas.' };

  const token = generateToken({ id: technician.id, role: 'technician' });
  return { technician: sanitize(technician), token };
};

const getById = async (id) => {
  const technician = await Technician.findByPk(id);
  if (!technician || !technician.isActive) throw { status: 404, message: 'Técnico não encontrado.' };
  return sanitize(technician);
};

const updateProfile = async (technicianId, data) => {
  const technician = await Technician.findByPk(technicianId);
  if (!technician) throw { status: 404, message: 'Técnico não encontrado.' };

  const allowed = ['name', 'phone', 'avatarUrl', 'bio', 'specialties', 'location', 'radiusKm', 'isAvailable', 'pricePerHour'];
  allowed.forEach((key) => { if (data[key] !== undefined) technician[key] = data[key]; });
  await technician.save();

  return sanitize(technician);
};

const search = async ({ category, city, available }) => {
  const where = { isActive: true };
  if (available !== undefined) where.isAvailable = available === 'true' || available === true;
  if (category) where.specialties = { [Op.like]: `%${category}%` };

  const technicians = await Technician.findAll({ where, order: [['ratingAvg', 'DESC']] });

  const filtered = city
    ? technicians.filter((t) => t.location?.city?.toLowerCase().includes(city.toLowerCase()))
    : technicians;

  return filtered.map(sanitize);
};

const sanitize = (tech) => {
  const { passwordHash, ...safe } = tech.toJSON();
  return safe;
};

module.exports = { register, login, getById, updateProfile, search };