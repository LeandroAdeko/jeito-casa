import React from 'react';
import {
  InputWrapper,
  Label,
  InputContainer,
  StyledInput,
  IconWrapper,
  ErrorMessage,
  HelpText,
} from './InputBase';

/**
 * TextInput - Input de texto padronizado
 * 
 * @param {string} label - Label do input
 * @param {string} value - Valor do input
 * @param {function} onChange - Callback quando valor muda
 * @param {string} placeholder - Placeholder
 * @param {string} error - Mensagem de erro
 * @param {boolean} disabled - Se está desabilitado
 * @param {boolean} required - Se é obrigatório
 * @param {ReactNode} icon - Ícone à esquerda
 * @param {string} helpText - Texto de ajuda
 * @param {string} type - Tipo do input (text, email, password, etc)
 */
export const TextInput = ({
  label,
  value,
  onChange,
  placeholder = '',
  error = '',
  disabled = false,
  required = false,
  icon = null,
  helpText = '',
  type = 'text',
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
      
      <InputContainer>
        {icon && <IconWrapper>{icon}</IconWrapper>}
        
        <StyledInput
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          $hasIcon={!!icon}
          $error={!!error}
          {...rest}
        />
      </InputContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!error && helpText && <HelpText>{helpText}</HelpText>}
    </InputWrapper>
  );
};
