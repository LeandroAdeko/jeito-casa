import styled from 'styled-components';

// Container principal do input
export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

// Container flex para label e contador
export const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// Label do input
export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;

  ${props => props.$required && `
    &::after {
      content: '*';
      color: #ff3b30;
      margin-left: 2px;
    }
  `}
`;

// Container do input + ícone
export const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

// Estilos base para inputs
export const baseInputStyles = `
  width: 100%;
  padding: 10px 12px;
  font-family: inherit;
  font-size: 1rem;
  color: var(--text-color);
  background: var(--bg-color);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  transition: all 0.2s ease;

  &::placeholder {
    color: var(--text-secondary);
    opacity: 0.7;
  }

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(100, 108, 255, 0.1);
  }

  &:disabled {
    background: var(--hover-bg);
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

// Input estilizado base
export const StyledInput = styled.input`
  ${baseInputStyles}

  ${props => props.$hasIcon && `
    padding-left: 40px;
  `}

  ${props => props.$error && `
    border-color: #ff3b30;
    
    &:focus {
      border-color: #ff3b30;
      box-shadow: 0 0 0 3px rgba(255, 59, 48, 0.1);
    }
  `}
`;

// Textarea estilizada
export const StyledTextArea = styled.textarea`
  ${baseInputStyles}
  resize: vertical;
  min-height: 100px;
  line-height: 1.5;

  ${props => props.$error && `
    border-color: #ff3b30;
    
    &:focus {
      border-color: #ff3b30;
      box-shadow: 0 0 0 3px rgba(255, 59, 48, 0.1);
    }
  `}
`;

// Select estilizado
export const StyledSelect = styled.select`
  ${baseInputStyles}
  cursor: pointer;
  appearance: none;
  padding-right: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;

  ${props => props.$error && `
    border-color: #ff3b30;
    
    &:focus {
      border-color: #ff3b30;
      box-shadow: 0 0 0 3px rgba(255, 59, 48, 0.1);
    }
  `}

  option {
    background: var(--bg-color);
    color: var(--text-color);
  }
`;

// Ícone do input
export const IconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  pointer-events: none;
`;

// Mensagem de erro
export const ErrorMessage = styled.span`
  font-size: 0.85rem;
  color: #ff3b30;
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: '⚠';
  }
`;

// Texto de ajuda
export const HelpText = styled.span`
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

// Contador de caracteres
export const CharCount = styled.span`
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-align: right;

  ${props => props.$isNearLimit && `
    color: #ff9500;
  `}

  ${props => props.$isOverLimit && `
    color: #ff3b30;
    font-weight: 600;
  `}
`;
