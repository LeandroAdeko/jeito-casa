import React from 'react';
import Button from './Button';

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
    <Button onClick={handleDownload} className={className} variant="primary">
      {label}
    </Button>
  );
};

export default DownloadJsonButton;
