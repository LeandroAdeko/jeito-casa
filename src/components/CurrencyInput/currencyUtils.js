/**
 * Currency utility functions for parsing and formatting currency values
 */

/**
 * Parse a currency string to a number
 * @param {string} value - The currency string to parse
 * @param {string} decimalSeparator - The decimal separator (default: ',')
 * @param {string} thousandSeparator - The thousand separator (default: '.')
 * @returns {number} The parsed number or 0 if invalid
 */
export const parseCurrency = (value, decimalSeparator = ',', thousandSeparator = '.') => {
  if (typeof value === 'number') return value;
  if (!value || typeof value !== 'string') return 0;

  // Remove prefix/suffix (like R$, $, etc.)
  let cleaned = value.trim().replace(/[^\d.,\-]/g, '');

  // Replace thousand separator with empty string
  if (thousandSeparator) {
    cleaned = cleaned.split(thousandSeparator).join('');
  }

  // Replace decimal separator with dot for parsing
  if (decimalSeparator !== '.') {
    cleaned = cleaned.replace(decimalSeparator, '.');
  }

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Format a number to currency string
 * @param {number} value - The number to format
 * @param {string} decimalSeparator - The decimal separator (default: ',')
 * @param {string} thousandSeparator - The thousand separator (default: '.')
 * @param {number} decimalPlaces - Number of decimal places (default: 2)
 * @param {string} prefix - Prefix to add (default: '')
 * @returns {string} The formatted currency string
 */
export const formatCurrency = (
  value,
  decimalSeparator = ',',
  thousandSeparator = '.',
  decimalPlaces = 2,
  prefix = ''
) => {
  if (typeof value !== 'number' || isNaN(value)) return prefix + '0' + decimalSeparator + '00';

  // Fix decimal places
  const fixed = value.toFixed(decimalPlaces);
  const [integerPart, decimalPart] = fixed.split('.');

  // Add thousand separators
  let formattedInteger = integerPart;
  if (thousandSeparator) {
    formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  }

  // Combine parts
  const formatted = decimalPart
    ? `${formattedInteger}${decimalSeparator}${decimalPart}`
    : formattedInteger;

  return prefix + formatted;
};

/**
 * Parse a list of currency values from a string
 * @param {string} value - The string containing currency values
 * @param {string} listSeparator - The separator between values (default: ';')
 * @param {string} decimalSeparator - The decimal separator (default: ',')
 * @param {string} thousandSeparator - The thousand separator (default: '.')
 * @returns {number[]} Array of parsed numbers
 */
export const parseCurrencyList = (
  value,
  listSeparator = ';',
  decimalSeparator = ',',
  thousandSeparator = '.'
) => {
  if (!value || typeof value !== 'string') return [];

  // If no list separator, treat as single value
  if (!listSeparator) {
    const parsed = parseCurrency(value, decimalSeparator, thousandSeparator);
    return parsed !== 0 ? [parsed] : [];
  }

  // Split by list separator and parse each value
  const values = value
    .split(listSeparator)
    .map((v) => parseCurrency(v.trim(), decimalSeparator, thousandSeparator))
    .filter((n) => n !== 0 || value.includes('0')); // Keep zeros if explicitly written

  return values;
};

/**
 * Format an array of numbers to a currency list string
 * @param {number[]} values - Array of numbers to format
 * @param {string} listSeparator - The separator between values (default: ';')
 * @param {string} decimalSeparator - The decimal separator (default: ',')
 * @param {string} thousandSeparator - The thousand separator (default: '.')
 * @param {number} decimalPlaces - Number of decimal places (default: 2)
 * @returns {string} The formatted currency list string
 */
export const formatCurrencyList = (
  values,
  listSeparator = ';',
  decimalSeparator = ',',
  thousandSeparator = '.',
  decimalPlaces = 2
) => {
  if (!Array.isArray(values) || values.length === 0) return '';

  const formatted = values.map((v) =>
    formatCurrency(v, decimalSeparator, thousandSeparator, decimalPlaces, '')
  );

  return listSeparator ? formatted.join(listSeparator + ' ') : formatted[0] || '';
};

/**
 * Validate if a character is allowed in currency input
 * @param {string} char - The character to validate
 * @param {string} currentValue - The current input value
 * @param {string} decimalSeparator - The decimal separator
 * @param {string} listSeparator - The list separator (optional)
 * @returns {boolean} True if character is allowed
 */
export const isValidCurrencyChar = (char, currentValue, decimalSeparator, listSeparator = null) => {
  // Allow digits
  if (/\d/.test(char)) return true;

  // Allow decimal separator (only once)
  if (char === decimalSeparator) {
    // Check if we already have a decimal separator in the current number
    const lastSeparatorIndex = listSeparator ? currentValue.lastIndexOf(listSeparator) : -1;
    const currentNumber = currentValue.substring(lastSeparatorIndex + 1);
    return !currentNumber.includes(decimalSeparator);
  }

  // Allow list separator
  if (listSeparator && char === listSeparator) return true;

  // Allow backspace, delete, arrow keys, etc. (control characters)
  if (char.length !== 1) return true;

  return false;
};

/**
 * Calculate total from array of numbers
 * @param {number[]} values - Array of numbers
 * @returns {number} The sum of all values
 */
export const calculateTotal = (values) => {
  if (!Array.isArray(values)) return 0;
  return values.reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);
};
