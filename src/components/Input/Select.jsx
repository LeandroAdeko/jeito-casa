import React from 'react';
import {
  InputWrapper,
  Label,
  StyledSelect,
  ErrorMessage,
  HelpText,
} from './InputBase';

/**
 * Select - Select padronizado
 * 
 * @param {string} label - Label do select
 * @param {string} value - Valor selecionado
 * @param {function} onChange - Callback quando valor muda
 * @param {Array} options - Array de opções [{value, label}]
 * @param {string} placeholder - Placeholder (primeira opção desabilitada)
 * @param {string} error - Mensagem de erro
 * @param {boolean} disabled - Se está desabilitado
 * @param {boolean} required - Se é obrigatório
 * @param {string} helpText - Texto de ajuda
 */
export const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Selecione...',
  error = '',
  disabled = false,
  required = false,
  helpText = '',
  ...rest
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <InputWrapper>
      {label && (
        <Label $required={required}>
          {label}
        </Label>
      )}
      
      <StyledSelect
        value={value}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        $error={!!error}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </StyledSelect>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!error && helpText && <HelpText>{helpText}</HelpText>}
    </InputWrapper>
  );
};
