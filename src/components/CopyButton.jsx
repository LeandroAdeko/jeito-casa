import React, { useState } from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: ${props => props.$success ? '#4caf50' : 'var(--card-bg)'};
  color: ${props => props.$success ? 'white' : 'var(--text-color)'};
  border-color: ${props => props.$success ? '#4caf50' : 'var(--border-color)'};
  cursor: pointer;
  transition: all 0.3s;
  min-width: 100px;
  font-size: 0.9rem;

  &:hover {
    background-color: ${props => props.$success ? '#45a049' : 'var(--hover-bg)'};
  }
`;

const CopyButton = ({ text, label = 'Copiar', successLabel = 'Copiado! ✅', className = '' }) => {
  const [status, setStatus] = useState(label);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCopy = async () => {
    try {
      const content = typeof text === 'function' ? text() : text;
      await navigator.clipboard.writeText(content);
      setStatus(successLabel);
      setIsSuccess(true);
      setTimeout(() => {
        setStatus(label);
        setIsSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setStatus('Erro ao copiar');
      setTimeout(() => setStatus(label), 2000);
    }
  };

  return (
    <StyledButton 
      onClick={handleCopy}
      className={className}
      $success={isSuccess}
    >
      {status}
    </StyledButton>
  );
};

export default CopyButton;
