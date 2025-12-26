import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { TOOLS } from '../config/tools';
import { useAuth } from '../contexts/AuthContext';
import { TextArea } from '../components/Input';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, var(--primary-color) 0%, #4a5568 100%);
  border-radius: 20px;
  color: white;
  margin-bottom: 60px;
  box-shadow: var(--shadow);

  h1 {
    font-size: 3rem;
    margin-bottom: 20px;
    font-weight: 700;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.3rem;
    opacity: 0.95;

    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }
`;

const UserGreeting = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 15px 25px;
  border-radius: 12px;
  font-size: 1.2rem;
  display: inline-block;
  margin-top: 15px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 30px;
  text-align: center;
  color: var(--text-color);
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
`;

const ToolCard = styled.div`
  background: var(--card-bg);
  border-radius: 16px;
  padding: 30px;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    border-color: var(--primary-color);
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: var(--text-color);
  }

  p {
    color: var(--text-secondary);
    margin-bottom: 20px;
    line-height: 1.6;
  }
`;

const ToolIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
`;

const ToolButton = styled(Link)`
  display: inline-block;
  padding: 10px 24px;
  background: var(--primary-color);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(100, 108, 255, 0.3);
  }
`;

const RecommendationSection = styled.div`
  background: var(--card-bg);
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 40px;
  box-shadow: var(--shadow);

  p {
    margin-bottom: 20px;
    color: var(--text-secondary);
    font-size: 1.1rem;
  }
`;

const RecommendationForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SubmitButton = styled.button`
  align-self: flex-start;
  padding: 12px 30px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(100, 108, 255, 0.3);
  }
`;

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [suggestion, setSuggestion] = React.useState('');
  
  const handleRecommendationSubmit = (e) => {
    e.preventDefault();
    alert('Obrigado pela sugestão! Vamos analisar com carinho. 💡');
    setSuggestion('');
  };

  return (
    <DashboardContainer>
      <HeroSection>
        <h1>Bem-vindo ao Jeito de Casa</h1>
        <p>Penando para organizar sua casa? A gente dá um jeito!</p>
        {currentUser && (
          <UserGreeting>
            Olá, {currentUser.displayName || currentUser.email}! 👋
          </UserGreeting>
        )}
      </HeroSection>

      <SectionTitle>Nossas Ferramentas</SectionTitle>
      <ToolsGrid>
        {TOOLS.map((tool) => (
          <ToolCard key={tool.path}>
            <ToolIcon>{tool.icon}</ToolIcon>
            <h3>{tool.title}</h3>
            <p>{tool.description}</p>
            <ToolButton to={tool.path}>
              Acessar Ferramenta
            </ToolButton>
          </ToolCard>
        ))}
      </ToolsGrid>

      <SectionTitle>Tem uma ideia?</SectionTitle>
      <RecommendationSection>
        <p>
          Sentiu falta de alguma ferramenta? Conte para nós o que ajudaria na organização da sua casa!
        </p>
        <RecommendationForm onSubmit={handleRecommendationSubmit}>
          <TextArea
            value={suggestion}
            onChange={setSuggestion}
            placeholder="Ex: Gostaria de um cronograma de limpeza semanal..."
            rows={5}
            maxLength={500}
            showCharCount
            required
          />
          <SubmitButton type="submit">Enviar Sugestão</SubmitButton>
        </RecommendationForm>
      </RecommendationSection>
    </DashboardContainer>
  );
};

export default Dashboard;
