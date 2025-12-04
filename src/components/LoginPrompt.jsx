import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Banner = styled.div`
  background: linear-gradient(135deg, var(--primary-color) 0%, #5a6fd8 100%);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  box-shadow: 0 4px 12px rgba(100, 108, 255, 0.2);
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const BannerContent = styled.div`
  flex: 1;
`;

const BannerTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 6px;
  font-weight: 600;
`;

const BannerText = styled.p`
  font-size: 0.95rem;
  opacity: 0.95;
  line-height: 1.4;
`;

const BannerButton = styled(Link)`
  padding: 10px 24px;
  background: white;
  color: var(--primary-color);
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: inline-block;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
  }
`;

const LoginPrompt = () => {
  const { currentUser } = useAuth();

  // Don't show if user is already logged in
  if (currentUser) {
    return null;
  }

  return (
    <Banner>
      <BannerContent>
        <BannerTitle>💡 Dica: Faça login para salvar seus dados!</BannerTitle>
        <BannerText>
          Crie uma conta gratuita para manter registro de suas atividades e acessar a base de conhecimento.
        </BannerText>
      </BannerContent>
      <BannerButton to="/register">
        Criar Conta Grátis
      </BannerButton>
    </Banner>
  );
};

export default LoginPrompt;
