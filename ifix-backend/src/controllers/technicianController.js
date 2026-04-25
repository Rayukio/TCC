const technicianService = require('../services/technicianService');
const matchingService = require('../services/matching.service');

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, specialties, bio } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
    }
    const result = await technicianService.register({ name, email, password, phone, specialties, bio });
    res.status(201).json(result);
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    const result = await technicianService.login({ email, password });
    res.json(result);
  } catch (err) { next(err); }
};

const getProfile = async (req, res, next) => {
  try {
    res.json(await technicianService.getById(req.user.id));
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    res.json(await technicianService.getById(req.params.id));
  } catch (err) { next(err); }
};

const updateProfile = async (req, res, next) => {
  try {
    res.json(await technicianService.updateProfile(req.user.id, req.body));
  } catch (err) { next(err); }
};

const search = async (req, res, next) => {
  try {
    const { serviceId, category, city, available } = req.query;
    res.json(await technicianService.search({ serviceId, category, city, available }));
  } catch (err) { next(err); }
};

const match = async (req, res, next) => {
  try {
    const { serviceId, category, lat, lng, maxResults } = req.query;
    res.json(await matchingService.findMatches({
      serviceId,
      category,
      lat:        lat        ? parseFloat(lat)        : null,
      lng:        lng        ? parseFloat(lng)        : null,
      maxResults: maxResults ? parseInt(maxResults)   : 10,
    }));
  } catch (err) { next(err); }
};

// Gerenciamento dos serviços do técnico
const addService = async (req, res, next) => {
  try {
    const { serviceId, price } = req.body;
    if (!serviceId) return res.status(400).json({ error: 'serviceId é obrigatório.' });
    const record = await technicianService.addService(req.user.id, { serviceId, price });
    res.status(201).json(record);
  } catch (err) { next(err); }
};

const removeService = async (req, res, next) => {
  try {
    await technicianService.removeService(req.user.id, req.params.serviceId);
    res.status(204).send();
  } catch (err) { next(err); }
};

const listMyServices = async (req, res, next) => {
  try {
    res.json(await technicianService.listMyServices(req.user.id));
  } catch (err) { next(err); }
};

module.exports = { register, login, getProfile, getById, updateProfile, search, match, addService, removeService, listMyServices };