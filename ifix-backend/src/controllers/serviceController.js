const serviceService = require('../services/serviceService');

const listAll = async (req, res, next) => {
  try {
    const { category } = req.query;
    const services = await serviceService.listAll(category);
    res.json(services);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const service = await serviceService.getById(req.params.id);
    res.json(service);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const service = await serviceService.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const service = await serviceService.update(req.params.id, req.body);
    res.json(service);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await serviceService.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { listAll, getById, create, update, remove };