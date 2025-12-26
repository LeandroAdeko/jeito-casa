import React from 'react';
import styled from 'styled-components';
import { useCurrencyFormat } from './useCurrencyFormat';

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

/**
 * CurrencyInput - A calculator-style currency input component
 * Digits are entered from right to left and divided by 100
 * @param {Object} props - Component props
 * @param {number} props.value - The numeric value
 * @param {Function} props.onChange - Callback when value changes (receives number)
 * @param {string} props.decimalSeparator - Decimal separator (default: ',')
 * @param {string} props.thousandSeparator - Thousand separator (default: '.')
 * @param {number} props.decimalPlaces - Number of decimal places (default: 2)
 * @param {string} props.prefix - Prefix to display (default: '')
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Whether input is disabled
 */
const CurrencyInput = ({
  value = 0,
  onChange,
  decimalSeparator = ',',
  thousandSeparator = '.',
  decimalPlaces = 2,
  prefix = '',
  placeholder = '',
  className = '',
  disabled = false,
  ...rest
}) => {
  const {
    inputValue,
    handleKeyDown,
    handleFocus,
    handleBlur,
    handlePaste,
  } = useCurrencyFormat({
    value,
    onChange,
    decimalSeparator,
    thousandSeparator,
    decimalPlaces,
    prefix,
  });

  return (
    <StyledInput
      type="text"
      className={className}
      value={inputValue}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onPaste={handlePaste}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={false}
      {...rest}
    />
  );
};

export default CurrencyInput;
