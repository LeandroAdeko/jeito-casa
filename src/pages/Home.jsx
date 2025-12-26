import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { Button } from '../components/Button';
import { TOOLS } from '../config/tools';

const HomeContainer = styled.div`
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
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  margin-bottom: 30px;
  opacity: 0.95;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
`;


const UserGreeting = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 15px 25px;
  border-radius: 12px;
  font-size: 1.2rem;
  display: inline-block;
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

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    border-color: var(--primary-color);
  }
`;

const ToolIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
`;

const ToolTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: var(--text-color);
`;

const ToolDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: 20px;
  line-height: 1.6;
`;


const BenefitsSection = styled.div`
  background: var(--card-bg);
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 60px;
  box-shadow: var(--shadow);
`;

const BenefitsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  margin-top: 30px;
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
`;

const BenefitIcon = styled.div`
  font-size: 2rem;
  flex-shrink: 0;
`;

const BenefitText = styled.div`
  h4 {
    color: var(--text-color);
    margin-bottom: 5px;
    font-size: 1.1rem;
  }

  p {
    color: var(--text-secondary);
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

const CTASection = styled.div`
  text-align: center;
  padding: 40px;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  border-radius: 16px;
  margin-bottom: 40px;

  [data-theme='dark'] & {
    background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  }
`;

const CTATitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: var(--text-color);
`;

const CTAText = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 25px;
`;

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <HomeContainer>
      <HeroSection>
        <HeroTitle>🏠 Jeito de Casa</HeroTitle>
        <HeroSubtitle>Penando para organizar sua casa? A gente dá um jeito!</HeroSubtitle>
        
        {currentUser ? (
          <UserGreeting>
            Olá, {currentUser.displayName || currentUser.email}! 👋
          </UserGreeting>
        ) : (
          <AuthButtons>
            <Button as={Link} to="/login" style={{ background: 'white', color: 'var(--primary-color)' }} size="large">Entrar</Button>
            <Button as={Link} to="/register" variant="outline" style={{ borderColor: 'white', color: 'white' }} size="large">Criar Conta</Button>
          </AuthButtons>
        )}
      </HeroSection>

      <SectionTitle>🛠️ Ferramentas Disponíveis</SectionTitle>
      <ToolsGrid>
        {TOOLS.map((tool) => (
          <ToolCard key={tool.path}>
            <ToolIcon>{tool.icon}</ToolIcon>
            <ToolTitle>{tool.title}</ToolTitle>
            <ToolDescription>{tool.description}</ToolDescription>
            <Button as={Link} to={tool.path} rightIcon="→">
              Acessar Ferramenta
            </Button>
          </ToolCard>
        ))}
      </ToolsGrid>

      {!currentUser && (
        <>
          <BenefitsSection>
            <SectionTitle>✨ Por que criar uma conta?</SectionTitle>
            <BenefitsList>
              <BenefitItem>
                <BenefitIcon>💾</BenefitIcon>
                <BenefitText>
                  <h4>Salve suas atividades</h4>
                  <p>Mantenha registro de suas listas, receitas e planejamentos</p>
                </BenefitText>
              </BenefitItem>
              
              <BenefitItem>
                <BenefitIcon>📚</BenefitIcon>
                <BenefitText>
                  <h4>Base de Conhecimento</h4>
                  <p>Acesse receitas, planos alimentares e dicas exclusivas</p>
                </BenefitText>
              </BenefitItem>
              
              <BenefitItem>
                <BenefitIcon>☁️</BenefitIcon>
                <BenefitText>
                  <h4>Sincronização em nuvem</h4>
                  <p>Acesse seus dados de qualquer dispositivo</p>
                </BenefitText>
              </BenefitItem>
              
            </BenefitsList>
          </BenefitsSection>

          <CTASection>
            <CTATitle>Pronto para começar?</CTATitle>
            <CTAText>Crie sua conta gratuitamente e aproveite todos os benefícios!</CTAText>
            <AuthButtons>
              <Button as={Link} to="/register" size="large" fullWidth>
                Criar Conta Grátis
              </Button>
            </AuthButtons>
          </CTASection>
        </>
      )}
    </HomeContainer>
  );
};

export default Home;
