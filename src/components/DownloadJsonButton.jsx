import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const DownloadJsonButton = ({ data, fileName = 'data.json', label = '💾 Baixar Receita', className = '' }) => {
  const handleDownload = () => {
    if (!data) return;
    
    const jsonString = JSON.stringify(data, null, 4);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.endsWith('.json') ? fileName : `${fileName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <StyledButton onClick={handleDownload} className={className}>
      {label}
    </StyledButton>
  );
};

export default DownloadJsonButton;
