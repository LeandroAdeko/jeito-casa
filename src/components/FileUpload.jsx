import React, { useRef } from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: var(--bg-color);
  border: 2px dashed var(--primary-color);
  border-radius: 8px;
  color: var(--primary-color);
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background-color: var(--hover-bg);
    transform: translateY(-1px);
  }
`;

const FileUpload = ({ accept, onChange, label, multiple = false, className = '', icon = '📂' }) => {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.click();
  };

  return (
    <>
      <StyledButton 
        onClick={handleClick} 
        className={className}
        type="button"
      >
        {icon} {label}
      </StyledButton>
      <input 
        ref={inputRef}
        type="file" 
        accept={accept} 
        multiple={multiple} 
        onChange={onChange} 
        hidden 
      />
    </>
  );
};

export default FileUpload;
