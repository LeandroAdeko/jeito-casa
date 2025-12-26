import React from 'react';
import {
  InputWrapper,
  Label,
  LabelRow,
  StyledTextArea,
  ErrorMessage,
  HelpText,
  CharCount,
} from './InputBase';

/**
 * TextArea - Textarea padronizada
 * 
 * @param {string} label - Label da textarea
 * @param {string} value - Valor da textarea
 * @param {function} onChange - Callback quando valor muda
 * @param {string} placeholder - Placeholder
 * @param {string} error - Mensagem de erro
 * @param {boolean} disabled - Se está desabilitado
 * @param {boolean} required - Se é obrigatório
 * @param {string} helpText - Texto de ajuda
 * @param {number} rows - Número de linhas
 * @param {number} maxLength - Máximo de caracteres
 * @param {boolean} showCharCount - Mostrar contador de caracteres
 */
export const TextArea = ({
  label,
  value,
  onChange,
  placeholder = '',
  error = '',
  disabled = false,
  required = false,
  helpText = '',
  rows = 4,
  maxLength,
  showCharCount = false,
  ...rest
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const charCount = value?.length || 0;
  const isNearLimit = maxLength && charCount > maxLength * 0.8;
  const isOverLimit = maxLength && charCount > maxLength;

  return (
    <InputWrapper>
      {(label || (showCharCount && maxLength)) && (
        <LabelRow>
          {label && (
            <Label $required={required}>
              {label}
            </Label>
          )}
          
          {showCharCount && maxLength && (
            <CharCount 
              $isNearLimit={isNearLimit} 
              $isOverLimit={isOverLimit}
            >
              {charCount} / {maxLength}
            </CharCount>
          )}
        </LabelRow>
      )}
      
      <StyledTextArea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        $error={!!error}
        {...rest}
      />

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!error && helpText && <HelpText>{helpText}</HelpText>}
    </InputWrapper>
  );
};
