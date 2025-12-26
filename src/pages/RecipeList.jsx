import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useRecipes } from '../hooks/useRecipes';
import LoginPrompt from '../components/LoginPrompt';
import { Button } from '../components/Button';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--text-color);
  margin: 0;
`;


const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
`;

const RecipeCard = styled.div`
  background: var(--card-bg);
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--shadow);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    border-color: var(--primary-color);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  }
`;

const RecipeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const RecipeTitle = styled.h2`
  font-size: 1.4rem;
  color: var(--text-color);
  margin: 0;
  flex: 1;
  cursor: pointer;

  &:hover {
    color: var(--primary-color);
  }
`;

const RecipeDescription = styled.p`
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`;

const RecipeFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
`;

const RecipeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoItem = styled.span`
  font-size: 0.85rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;


const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: var(--text-secondary);

  h2 {
    font-size: 2rem;
    margin-bottom: 16px;
    color: var(--text-color);
  }

  p {
    font-size: 1.1rem;
    margin-bottom: 24px;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: var(--text-secondary);
  font-size: 1.2rem;
`;

const RecipeList = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { recipes, deleteRecipe, loading } = useRecipes(currentUser);

  const handleCreate = () => {
    navigate('/recipe-form');
  };

  const handleEdit = (recipeId) => {
    navigate(`/recipe-form/${recipeId}`);
  };

  const handleDelete = async (recipe) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${recipe.title}"?\n\nEsta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await deleteRecipe(recipe.id);
    } catch (error) {
      alert('Erro ao excluir receita: ' + error.message);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  if (!currentUser) {
    return <LoginPrompt />;
  }

  return (
    <Container>
      <Header>
        <Title>📚 Minhas Receitas</Title>
        <Button onClick={handleCreate} leftIcon="➕" size="large">
          Nova Receita
        </Button>
      </Header>

      {loading ? (
        <LoadingState>Carregando receitas...</LoadingState>
      ) : recipes.length === 0 ? (
        <EmptyState>
          <h2>📖 Nenhuma receita ainda</h2>
          <p>Comece criando sua primeira receita!</p>
        </EmptyState>
      ) : (
        <RecipeGrid>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id}>
              <RecipeHeader>
                <RecipeTitle onClick={() => handleEdit(recipe.id)}>
                  {recipe.title}
                </RecipeTitle>
              </RecipeHeader>

              <RecipeDescription>
                {recipe.description || 'Sem descrição'}
              </RecipeDescription>

              <RecipeFooter>
                <RecipeInfo>
                  <InfoItem>
                    🍽️ {recipe.portions || 'N/A'} porções
                  </InfoItem>
                  <InfoItem>
                    📅 {formatDate(recipe.createdAt)}
                  </InfoItem>
                </RecipeInfo>

                <Actions>
                  <Button 
                    variant="primary"
                    onClick={() => handleEdit(recipe.id)}
                    title="Editar receita"
                    leftIcon="✏️"
                    size="small"
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="danger"
                    onClick={() => handleDelete(recipe)}
                    title="Excluir receita"
                    size="small"
                  >
                    🗑️
                  </Button>
                </Actions>
              </RecipeFooter>
            </RecipeCard>
          ))}
        </RecipeGrid>
      )}
    </Container>
  );
};

export default RecipeList;
