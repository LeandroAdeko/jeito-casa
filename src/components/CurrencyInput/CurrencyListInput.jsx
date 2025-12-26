import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { formatCurrency, calculateTotal } from './currencyUtils';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
`;

const StyledInput = styled.input`
  font-family: inherit;
  font-size: 1rem;
  padding: 0.5rem;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
  background: var(--bg-color);
  color: var(--text-color);
  resize: vertical;
  min-height: 2.5rem;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.1);
  }

  &:disabled {
    background-color: var(--hover-bg);
    cursor: not-allowed;
    opacity: 0.6;
  }

  &::placeholder {
    color: var(--text-secondary);
    font-style: italic;
  }
`;

const TotalLabel = styled.small`
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.25rem;
  display: block;
`;

/**
 * CurrencyListInput - A calculator-style currency list input component
 * Each value is entered with calculator-style digit entry (right to left, divided by 100)
 * @param {Object} props - Component props
 * @param {number[]} props.values - Array of numeric values
 * @param {Function} props.onChange - Callback when values change (receives array of numbers)
 * @param {string} props.decimalSeparator - Decimal separator (default: ',')
 * @param {string} props.thousandSeparator - Thousand separator (default: '.')
 * @param {string|null} props.listSeparator - List separator (default: ';', null for single value)
 * @param {number} props.decimalPlaces - Number of decimal places (default: 2)
 * @param {boolean} props.showTotal - Whether to show total below input (default: false)
 * @param {boolean} props.allowMultiple - Whether to allow multiple values (default: true)
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Whether input is disabled
 */
const CurrencyListInput = ({
  values = [],
  onChange,
  decimalSeparator = ',',
  thousandSeparator = '.',
  listSeparator = ';',
  decimalPlaces = 2,
  showTotal = false,
  allowMultiple = true,
  placeholder = '',
  className = '',
  disabled = false,
  ...rest
}) => {
  // Store array of digit strings, one for each value
  const [digitsList, setDigitsList] = useState(['0']);
  const [isFocused, setIsFocused] = useState(false);

  // Determine effective list separator
  const effectiveSeparator = allowMultiple ? listSeparator : null;

  // Update digits when external values change (only when not focused)
  useEffect(() => {
    if (!isFocused && values && values.length > 0) {
      const newDigitsList = values.map(value => {
        const cents = Math.round(value * Math.pow(10, decimalPlaces));
        return cents.toString();
      });
      setDigitsList(newDigitsList);
    } else if (!isFocused && (!values || values.length === 0)) {
      setDigitsList(['0']);
    }
  }, [values, decimalPlaces, isFocused]);

  // Convert digits to numeric value
  const digitsToValue = useCallback((digitString) => {
    const num = parseInt(digitString || '0', 10);
    return num / Math.pow(10, decimalPlaces);
  }, [decimalPlaces]);

  // Format a single digit string for display
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

  // Convert digitsList to values array and notify parent
  const updateValues = useCallback((newDigitsList) => {
    const newValues = newDigitsList
      .map(digits => digitsToValue(digits))
      .filter((val, idx) => val !== 0 || idx === newDigitsList.length - 1); // Keep zeros except trailing
    onChange(newValues.length > 0 ? newValues : []);
  }, [digitsToValue, onChange]);

  const handleKeyDown = useCallback(
    (e) => {
      // Handle digit keys (0-9)
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        const currentDigits = digitsList[digitsList.length - 1];
        const newDigits = (currentDigits === '0' ? '' : currentDigits) + e.key;
        const newDigitsList = [...digitsList.slice(0, -1), newDigits];
        setDigitsList(newDigitsList);
        updateValues(newDigitsList);
      }
      // Handle list separator (move to next value)
      else if (effectiveSeparator && e.key === effectiveSeparator) {
        e.preventDefault();
        const newDigitsList = [...digitsList, '0'];
        setDigitsList(newDigitsList);
        // Don't update values yet, wait for user to enter digits
      }
      // Handle backspace
      else if (e.key === 'Backspace') {
        e.preventDefault();
        const currentDigits = digitsList[digitsList.length - 1];
        
        if (currentDigits.length > 1) {
          // Remove last digit from current value
          const newDigits = currentDigits.slice(0, -1);
          const newDigitsList = [...digitsList.slice(0, -1), newDigits];
          setDigitsList(newDigitsList);
          updateValues(newDigitsList);
        } else if (digitsList.length > 1) {
          // Remove current value and go back to previous
          const newDigitsList = digitsList.slice(0, -1);
          setDigitsList(newDigitsList);
          updateValues(newDigitsList);
        } else {
          // Last value, just set to 0
          setDigitsList(['0']);
          updateValues(['0']);
        }
      }
      // Handle delete (clear current value)
      else if (e.key === 'Delete') {
        e.preventDefault();
        if (digitsList.length > 1) {
          // Remove current value
          const newDigitsList = digitsList.slice(0, -1);
          setDigitsList(newDigitsList);
          updateValues(newDigitsList);
        } else {
          // Last value, set to 0
          setDigitsList(['0']);
          updateValues(['0']);
        }
      }
      // Block all other keys except tab, arrow keys, etc.
      else if (!['Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
      }
    },
    [digitsList, effectiveSeparator, updateValues]
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

  // Format display value
  const displayValue = digitsList.map(formatDigits).join(effectiveSeparator ? ` ${effectiveSeparator} ` : '');
  
  const total = calculateTotal(values);

  return (
    <Wrapper>
      <StyledInput
        type="text"
        className={className}
        value={displayValue}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onPaste={handlePaste}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={false}
        {...rest}
      />
      {showTotal && (
        <TotalLabel>
          Total: {formatCurrency(total, decimalSeparator, thousandSeparator, decimalPlaces, '')}
        </TotalLabel>
      )}
    </Wrapper>
  );
};

export default CurrencyListInput;
