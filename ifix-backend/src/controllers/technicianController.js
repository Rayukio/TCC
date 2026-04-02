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
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }
    const result = await technicianService.login({ email, password });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const technician = await technicianService.getById(req.user.id);
    res.json(technician);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const technician = await technicianService.getById(req.params.id);
    res.json(technician);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const technician = await technicianService.updateProfile(req.user.id, req.body);
    res.json(technician);
  } catch (err) {
    next(err);
  }
};

const search = async (req, res, next) => {
  try {
    const { category, city, available } = req.query;
    const technicians = await technicianService.search({ category, city, available });
    res.json(technicians);
  } catch (err) {
    next(err);
  }
};

const match = async (req, res, next) => {
  try {
    const { category, lat, lng, maxResults } = req.query;
    const results = await matchingService.findMatches({
      category,
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
      maxResults: maxResults ? parseInt(maxResults) : 10,
    });
    res.json(results);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getProfile, getById, updateProfile, search, match };