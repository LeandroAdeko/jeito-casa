import { useState, useCallback, useEffect } from 'react';
import { formatCurrency } from './currencyUtils';

/**
 * Custom hook for managing calculator-style currency input formatting
 * Digits are entered from right to left and divided by 100
 * @param {Object} options - Configuration options
 * @param {number} options.value - The numeric value
 * @param {Function} options.onChange - Callback when value changes
 * @param {string} options.decimalSeparator - Decimal separator (default: ',')
 * @param {string} options.thousandSeparator - Thousand separator (default: '.')
 * @param {number} options.decimalPlaces - Number of decimal places (default: 2)
 * @param {string} options.prefix - Prefix to display (default: '')
 * @returns {Object} Hook state and handlers
 */
export const useCurrencyFormat = ({
  value,
  onChange,
  decimalSeparator = ',',
  thousandSeparator = '.',
  decimalPlaces = 2,
  prefix = '',
}) => {
  // Store digits as a string (without decimal point)
  const [digits, setDigits] = useState('0');
  const [isFocused, setIsFocused] = useState(false);

  // Update digits when external value changes (only when not focused)
  useEffect(() => {
    if (!isFocused && value !== undefined && value !== null) {
      // Convert value to cents (multiply by 100 to get integer)
      const cents = Math.round(value * Math.pow(10, decimalPlaces));
      setDigits(cents.toString());
    }
  }, [value, decimalPlaces, isFocused]);

  // Convert digits to numeric value
  const digitsToValue = useCallback((digitString) => {
    const num = parseInt(digitString || '0', 10);
    return num / Math.pow(10, decimalPlaces);
  }, [decimalPlaces]);

  // Format digits for display
  const formatDigits = useCallback((digitString) => {
    const numericValue = digitsToValue(digitString);
    return formatCurrency(
      numericValue,
      decimalSeparator,
      thousandSeparator,
      decimalPlaces,
      ''
    );
  }, [digitsToValue, decimalSeparator, thousandSeparator, decimalPlaces]);

  const handleKeyDown = useCallback(
    (e) => {
      // Handle digit keys (0-9)
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        const newDigits = (digits === '0' ? '' : digits) + e.key;
        setDigits(newDigits);
        const newValue = digitsToValue(newDigits);
        onChange(newValue);
      }
      // Handle backspace
      else if (e.key === 'Backspace') {
        e.preventDefault();
        const newDigits = digits.length > 1 ? digits.slice(0, -1) : '0';
        setDigits(newDigits);
        const newValue = digitsToValue(newDigits);
        onChange(newValue);
      }
      // Handle delete (clear all)
      else if (e.key === 'Delete') {
        e.preventDefault();
        setDigits('0');
        onChange(0);
      }
      // Block all other keys except tab, arrow keys, etc.
      else if (!['Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
      }
    },
    [digits, digitsToValue, onChange]
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Prevent paste
  const handlePaste = useCallback((e) => {
    e.preventDefault();
  }, []);

  return {
    inputValue: prefix + formatDigits(digits),
    handleKeyDown,
    handleFocus,
    handleBlur,
    handlePaste,
    isFocused,
  };
};
