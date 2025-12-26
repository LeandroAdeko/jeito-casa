import React, { useState } from 'react';
import Button from './Button';

const CopyButton = ({ 
  text, 
  label = 'Copiar', 
  successLabel = 'Copiado! ✅', 
  className = '', 
  leftIcon, 
  rightIcon,
  variant = 'secondary'
}) => {
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
    <Button 
      onClick={handleCopy}
      className={className}
      variant={isSuccess ? 'success' : variant}
      leftIcon={isSuccess ? null : leftIcon}
      rightIcon={rightIcon}
      style={{ minWidth: '120px' }}
    >
      {status}
    </Button>
  );
};

export default CopyButton;
