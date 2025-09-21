export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

export const isValidNumber = (value) => {
  if (value === null || value === undefined || value === '') return false;
  return !isNaN(Number(value)) && isFinite(value);
};

export const isPositiveNumber = (value) => {
  return isValidNumber(value) && Number(value) > 0;
};

export const isValidDate = (date) => {
  if (!date) return false;
  const parsedDate = date instanceof Date ? date : new Date(date);
  return !isNaN(parsedDate.getTime());
};

export const validateForm = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];

    for (let rule of fieldRules) {
      if (rule.required && !isRequired(value)) {
        errors[field] = rule.message || `${field} is required`;
        break;
      }
      if (rule.email && value && !isValidEmail(value)) {
        errors[field] = rule.message || 'Invalid email format';
        break;
      }
      if (rule.number && value && !isValidNumber(value)) {
        errors[field] = rule.message || 'Must be a valid number';
        break;
      }
      if (rule.positive && value && !isPositiveNumber(value)) {
        errors[field] = rule.message || 'Must be a positive number';
        break;
      }
      if (rule.date && value && !isValidDate(value)) {
        errors[field] = rule.message || 'Invalid date';
        break;
      }
    }
  });

  return errors;
};
