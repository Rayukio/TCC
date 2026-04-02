const Service = require('../models/Service');

const listAll = async (category) => {
  const where = { isActive: true };
  if (category) where.category = category;
  return Service.findAll({ where, order: [['name', 'ASC']] });
};

const getById = async (id) => {
  const service = await Service.findByPk(id);
  if (!service || !service.isActive) throw { status: 404, message: 'Serviço não encontrado.' };
  return service;
};

const create = async (data) => {
  const { name, category, description, iconUrl, estimatedDurationMin, basePrice } = data;
  if (!name || !category) throw { status: 400, message: 'Nome e categoria são obrigatórios.' };
  return Service.create({ name, category, description, iconUrl, estimatedDurationMin, basePrice });
};

const update = async (id, data) => {
  const service = await Service.findByPk(id);
  if (!service) throw { status: 404, message: 'Serviço não encontrado.' };
  const allowed = ['name', 'category', 'description', 'iconUrl', 'estimatedDurationMin', 'basePrice', 'isActive'];
  allowed.forEach((k) => { if (data[k] !== undefined) service[k] = data[k]; });
  await service.save();
  return service;
};

const remove = async (id) => {
  const service = await Service.findByPk(id);
  if (!service) throw { status: 404, message: 'Serviço não encontrado.' };
  service.isActive = false;
  await service.save();
};

module.exports = { listAll, getById, create, update, remove };