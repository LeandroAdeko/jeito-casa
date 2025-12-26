import React from 'react';
import styled from 'styled-components';
import {
  InputWrapper,
  Label,
  InputContainer,
  StyledInput,
  ErrorMessage,
  HelpText,
} from './InputBase';

const NumberInputContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: stretch;
`;

const StyledNumberInput = styled(StyledInput)`
  text-align: center;
  
  /* Remove setas padrão do navegador */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  -moz-appearance: textfield;
`;

const NumberButton = styled.button`
  min-width: 40px;
  padding: 0 12px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(100, 108, 255, 0.3);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/**
 * NumberInput - Input numérico padronizado
 * 
 * @param {string} label - Label do input
 * @param {number} value - Valor do input
 * @param {function} onChange - Callback quando valor muda
 * @param {string} placeholder - Placeholder
 * @param {string} error - Mensagem de erro
 * @param {boolean} disabled - Se está desabilitado
 * @param {boolean} required - Se é obrigatório
 * @param {string} helpText - Texto de ajuda
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @param {number} step - Incremento
 * @param {boolean} showButtons - Mostrar botões +/-
 */
export const NumberInput = ({
  label,
  value,
  onChange,
  placeholder = '',
  error = '',
  disabled = false,
  required = false,
  helpText = '',
  min,
  max,
  step = 1,
  showButtons = false,
  ...rest
}) => {
  const handleChange = (e) => {
    const newValue = e.target.value;
    
    // Permitir campo vazio
    if (newValue === '') {
      onChange('');
      return;
    }

    // Converter para número
    const numValue = parseFloat(newValue);
    
    // Validar se é número
    if (isNaN(numValue)) return;
    
    // Validar min/max
    if (min !== undefined && numValue < min) return;
    if (max !== undefined && numValue > max) return;
    
    onChange(numValue);
  };

  const increment = () => {
    const currentValue = value === '' ? 0 : parseFloat(value);
    const newValue = currentValue + step;
    
    if (max !== undefined && newValue > max) return;
    
    onChange(newValue);
  };

  const decrement = () => {
    const currentValue = value === '' ? 0 : parseFloat(value);
    const newValue = currentValue - step;
    
    if (min !== undefined && newValue < min) return;
    
    onChange(newValue);
  };

  const canDecrement = min === undefined || (parseFloat(value || 0) > min);
  const canIncrement = max === undefined || (parseFloat(value || 0) < max);

  const inputElement = (
    <StyledNumberInput
      type="number"
      value={value || 0}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      min={min}
      max={max}
      step={step}
      $error={!!error}
      {...rest}
    />
  );

  return (
    <InputWrapper>
      {label && (
        <Label $required={required}>
          {label}
        </Label>
      )}
      
      {showButtons ? (
        <NumberInputContainer>
          <NumberButton
            type="button"
            onClick={decrement}
            disabled={!canDecrement}
            aria-label="Diminuir"
          >
            −
          </NumberButton>
          
          {inputElement}
          
          <NumberButton
            type="button"
            onClick={increment}
            disabled={!canIncrement}
            aria-label="Aumentar"
          >
            +
          </NumberButton>
        </NumberInputContainer>
      ) : (
        inputElement
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!error && helpText && <HelpText>{helpText}</HelpText>}
    </InputWrapper>
  );
};
