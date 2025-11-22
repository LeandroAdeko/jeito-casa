import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: var(--card-bg);
  border-top: 1px solid var(--border-color);
  padding: 15px 20px;
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-secondary);
  height: 51px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FooterLink = styled.a`
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      Criado por&nbsp;
      <FooterLink 
        href="https://www.linkedin.com/in/leandrovlsilva/" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        Leandro Silva
      </FooterLink>
      &nbsp;+ Antigravity
    </FooterContainer>
  );
};

export default Footer;
