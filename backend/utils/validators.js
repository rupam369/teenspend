const ALLOWED_CATEGORIES = [
  'Food',
  'Transport',
  'Education',
  'Entertainment',
  'Shopping',
  'Bills',
  'Health',
  'Travel',
  'Other',
];

const ALLOWED_PAYMENT_METHODS = [
  'Cash',
  'UPI',
  'Card',
  'Bank',
  'Other',
];

const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

const isValidCategory = (category) => {
  return ALLOWED_CATEGORIES.some((c) => c.toLowerCase() === (category || '').toLowerCase());
};

const isValidPaymentMethod = (method) => {
  return ALLOWED_PAYMENT_METHODS.some((m) => m.toLowerCase() === (method || '').toLowerCase());
};

const isValidAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && isFinite(num) && num > 0;
};

const isValidDate = (dateStr) => {
  if (!dateStr) return false;
  const timestamp = Date.parse(dateStr);
  return !isNaN(timestamp);
};

module.exports = {
  ALLOWED_CATEGORIES,
  ALLOWED_PAYMENT_METHODS,
  isValidEmail,
  isValidPassword,
  isValidCategory,
  isValidPaymentMethod,
  isValidAmount,
  isValidDate,
};
