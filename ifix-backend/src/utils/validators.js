const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validatePhone = (phone) => {
  const re = /^\+?[\d\s\-().]{8,20}$/;
  return re.test(phone);
};

const validatePassword = (password) => {
  // At least 8 chars, 1 letter, 1 number
  return typeof password === 'string' && password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
};

const validateScore = (score) => {
  const n = Number(score);
  return Number.isInteger(n) && n >= 1 && n <= 5;
};

const validateRequired = (fields, body) => {
  const missing = fields.filter((f) => body[f] === undefined || body[f] === null || body[f] === '');
  return missing;
};

module.exports = { validateEmail, validatePhone, validatePassword, validateScore, validateRequired };