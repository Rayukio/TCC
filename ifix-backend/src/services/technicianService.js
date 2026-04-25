const { Technician, Service, TechnicianService } = require('../models');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/token');
const { validateEmail, validatePassword } = require('../utils/validators');

const register = async ({ name, email, password, phone, specialties, bio }) => {
  if (!validateEmail(email))    throw { status: 400, message: 'E-mail inválido.' };
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
  const technician = await Technician.findByPk(id, {
    include: [{
      model: Service,
      as: 'services',
      through: { attributes: ['price', 'isActive'] },
      where: {},
      required: false,
    }],
  });
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

const search = async ({ serviceId, category, city, available }) => {
  const where = { isActive: true };
  if (available !== undefined) where.isAvailable = available === 'true' || available === true;

  const include = [{
    model: Service,
    as: 'services',
    through: { model: TechnicianService, where: { isActive: true }, attributes: ['price'] },
    required: !!(serviceId || category),
  }];

  if (serviceId) include[0].where = { id: serviceId };
  else if (category) include[0].where = { category };

  const technicians = await Technician.findAll({ where, include, order: [['ratingAvg', 'DESC']] });

  const filtered = city
    ? technicians.filter((t) => t.location?.city?.toLowerCase().includes(city.toLowerCase()))
    : technicians;

  return filtered.map(sanitize);
};

// Gerencia os serviços oferecidos pelo técnico
const addService = async (technicianId, { serviceId, price }) => {
  const service = await Service.findByPk(serviceId);
  if (!service || !service.isActive) throw { status: 404, message: 'Serviço não encontrado.' };

  const [record, created] = await TechnicianService.findOrCreate({
    where: { technicianId, serviceId },
    defaults: { price, isActive: true },
  });

  if (!created) {
    record.price = price ?? record.price;
    record.isActive = true;
    await record.save();
  }

  return record;
};

const removeService = async (technicianId, serviceId) => {
  const record = await TechnicianService.findOne({ where: { technicianId, serviceId } });
  if (!record) throw { status: 404, message: 'Serviço não vinculado a este técnico.' };
  record.isActive = false;
  await record.save();
};

const listMyServices = async (technicianId) => {
  return TechnicianService.findAll({
    where: { technicianId, isActive: true },
    include: [{ model: Service, as: 'service' }],
  });
};

const sanitize = (tech) => {
  const obj = tech.toJSON ? tech.toJSON() : tech;
  const { passwordHash, ...safe } = obj;
  return safe;
};

module.exports = { register, login, getById, updateProfile, search, addService, removeService, listMyServices };