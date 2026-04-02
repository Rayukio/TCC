const { parseISO, isValid, isFuture, format, addMinutes } = require('date-fns');

const parseDate = (dateString) => {
  const d = parseISO(dateString);
  return isValid(d) ? d : null;
};

const isValidFutureDate = (dateString) => {
  const d = parseDate(dateString);
  return d && isFuture(d);
};

const formatDate = (date, pattern = 'dd/MM/yyyy HH:mm') => {
  return format(new Date(date), pattern);
};

const addMinutesToDate = (date, minutes) => {
  return addMinutes(new Date(date), minutes);
};

const toISOString = (date) => new Date(date).toISOString();

module.exports = { parseDate, isValidFutureDate, formatDate, addMinutesToDate, toISOString };