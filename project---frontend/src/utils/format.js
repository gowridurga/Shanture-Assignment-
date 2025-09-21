export const formatCurrency = (amount = 0, currency = 'USD', locale = 'en-US') => {
  const safeAmount = isNaN(amount) ? 0 : Number(amount);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(safeAmount);
};

export const formatNumber = (number = 0, locale = 'en-US') => {
  const safeNumber = isNaN(number) ? 0 : Number(number);
  return new Intl.NumberFormat(locale).format(safeNumber);
};

export const formatDate = (date, options = {}, locale = 'en-US') => {
  if (!date) return '';
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return '';

  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
   
  };

  return parsedDate.toLocaleDateString(locale, defaultOptions);
};

export const formatPercentage = (value = 0, decimals = 1) => {
  if (isNaN(value)) return '0%';
  return `${(value * 100).toFixed(decimals)}%`;
};


export const truncateText = (text = '', maxLength = 50) => {
  const str = String(text);
  return str.length <= maxLength ? str : `${str.substring(0, maxLength)}...`;
};
