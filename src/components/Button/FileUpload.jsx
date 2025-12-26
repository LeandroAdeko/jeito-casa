import React, { useRef } from 'react';
import Button from './Button';

const FileUpload = ({ accept, onChange, label, multiple = false, className = '', icon = '📂' }) => {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.click();
  };

  return (
    <>
      <Button 
        onClick={handleClick} 
        className={className}
        type="button"
        variant="secondary"
        style={{ borderStyle: 'dashed', borderWidth: '2px', borderColor: 'var(--primary-color)' }}
        leftIcon={icon}
      >
        {label}
      </Button>
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
