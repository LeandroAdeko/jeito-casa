import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

const PreviewContainer = styled.div`
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  min-height: 200px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  overflow-y: auto;
  transition: all 0.3s ease;

  /* Estilo terminal/code que se adapta ao tema */
  &.terminal-style {
    font-family: 'Courier New', Courier, monospace;
    background-color: var(--hover-bg); /* Usa cor de hover para contraste sutil */
    border-color: var(--border-color);
    
    h1, h2, h3 {
      color: var(--primary-color);
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 8px;
      margin-top: 20px;
    }

    ul, ol {
      padding-left: 25px;
    }

    li {
      margin-bottom: 8px;
    }

    code {
      background-color: var(--card-bg);
      padding: 2px 4px;
      border-radius: 4px;
      border: 1px solid var(--border-color);
    }
  }

  h1, h2, h3 {
    margin-top: 0;
    color: var(--primary-color);
  }

  p {
    margin-bottom: 16px;
  }

  ul, ol {
    margin-bottom: 16px;
  }
`;

const MarkdownPreview = ({ content, variant = 'terminal', className = '' }) => {
  return (
    <PreviewContainer className={`${variant === 'terminal' ? 'terminal-style' : ''} ${className}`}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </PreviewContainer>
  );
};

export default MarkdownPreview;
