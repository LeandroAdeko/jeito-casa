import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SectionCard from '../components/SectionCard';
import { CopyButton, FileUpload } from '../components/Button';
import MarkdownPreview from '../components/MarkdownPreview';
import LoginPrompt from '../components/LoginPrompt';
import DayCard from '../components/DayCard';
import RecipeModal from '../components/RecipeModal';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from '../contexts/AuthContext';
import { useRecipes } from '../hooks/useRecipes';
import '../styles/global.css';

const PageContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--text-color);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
`;

const PeopleCounter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  label { font-weight: 500; color: var(--text-color); }
  input { 
    width: 60px; 
    padding: 8px; 
    border-radius: 6px; 
    border: 1px solid var(--border-color);
    background: var(--bg-color);
    color: var(--text-color);
    text-align: center;
    font-weight: bold;
    &:focus { outline: none; border-color: var(--primary-color); }
  }
`;

const DaysContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  flex-wrap: wrap;
`;

const AddDayButton = styled.button`
  width: 100%;
  padding: 15px;
  background: transparent;
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;

  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    background: var(--bg-hover);
  }
`;

const PortionSuggestionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const SuggestionGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
`;

const SuggestionCard = styled.div`
  background-color: var(--bg-color);
  border: 1px solid var(--primary-color);
  border-radius: 8px;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: var(--shadow-sm);

  .icon { fontSize: 1.2rem; }
  .info {
    .title { font-weight: bold; color: var(--primary-color); }
    .subtitle { font-size: 0.8rem; color: var(--text-secondary); }
  }
`;

const EmptyState = styled.div`
  padding: 20px;
  color: var(--text-secondary);
  text-align: center;
`;

const MealOrganizer = () => {
  // Autenticação
  const { currentUser } = useAuth();
  
  // Usa localStorage para persistir dados automaticamente
  const [localRecipes, setLocalRecipes] = useLocalStorage('mealOrganizer_recipes', []);
  const [peopleCount, setPeopleCount] = useLocalStorage('mealOrganizer_peopleCount', 1);
  
  // Receitas do Firestore (usuário + públicas)
  const { recipes: firestoreRecipes, loading: recipesLoading } = useRecipes(currentUser, { includePublic: true });

  // Combina receitas locais (JSON) com receitas do Firestore
  const availableRecipes = React.useMemo(() => {
    const combined = [...firestoreRecipes];
    
    // Adiciona receitas locais que não estão no Firestore (pelo título)
    localRecipes.forEach(local => {
      if (!combined.some(f => f.title === local.title)) {
        combined.push(local);
      }
    });
    
    return combined;
  }, [firestoreRecipes, localRecipes]);
  
  // Dynamic days state: array of objects { id, name, meals: [] }
  const [days, setDays] = useLocalStorage('mealOrganizer_days', [
    { id: 'day-1', name: 'Dia 1', meals: [] }
  ]);

  const [shoppingList, setShoppingList] = useState([]);
  const [portionSuggestions, setPortionSuggestions] = useState({});
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const closeRecipeModal = () => {
    setSelectedRecipe(null);
  };

  const handleLoadRecipes = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          setLocalRecipes(prev => {
            if (prev.some(r => r.title === json.title)) return prev;
            return [...prev, json];
          });
        } catch (error) {
          console.error('Erro ao ler arquivo JSON', error);
        }
      };
      reader.readAsText(file);
    });
  };

  const addDay = () => {
    const newId = `day-${days.length + 1}`;
    setDays([...days, { id: newId, name: `Dia ${days.length + 1}`, meals: [] }]);
  };

  const removeDay = (index) => {
    const newDays = days.filter((_, i) => i !== index);
    setDays(newDays);
  };

  const updateDayName = (index, newName) => {
    const newDays = [...days];
    newDays[index].name = newName;
    setDays(newDays);
  };

  const addRecipeToDay = (dayIndex, recipeTitle) => {
    if (!recipeTitle) return;
    const recipe = availableRecipes.find(r => r.title === recipeTitle);
    if (!recipe) return;

    const newDays = [...days];
    newDays[dayIndex].meals.push(recipe);
    setDays(newDays);
  };

  const removeRecipeFromDay = (dayIndex, mealIndex) => {
    const newDays = [...days];
    newDays[dayIndex].meals.splice(mealIndex, 1);
    setDays(newDays);
  };

  useEffect(() => {
    generateShoppingList();
  }, [days, peopleCount]);

  const generateShoppingList = () => {
    const recipeCounts = {};
    
    // 1. Count occurrences of each recipe across all days
    days.forEach(day => {
      day.meals.forEach(recipe => {
        const title = recipe.title;
        if (!recipeCounts[title]) {
          recipeCounts[title] = { count: 0, recipe: recipe };
        }
        recipeCounts[title].count += 1;
      });
    });

    const ingredientsMap = {};
    const newPortionSuggestions = {};

    // 2. Calculate ingredients based on batches
    Object.values(recipeCounts).forEach(({ count, recipe }) => {
      const portions = parseInt(recipe.portions) || 1;
      const totalPortionsNeeded = count * peopleCount;
      const batches = Math.ceil(totalPortionsNeeded / portions);
      const totalCooked = batches * portions;
      const leftoverPortions = totalCooked - totalPortionsNeeded;

      if (leftoverPortions > 0) {
        newPortionSuggestions[recipe.title] = leftoverPortions;
      }

      recipe.ingredients.forEach(ing => {
        const key = `${ing.name.toLowerCase().trim()}-${ing.unit.toLowerCase().trim()}`;
        
        if (!ingredientsMap[key]) {
          ingredientsMap[key] = {
            name: ing.name,
            unit: ing.unit,
            amount: 0,
            checked: false
          };
        }
        
        const baseAmount = parseFloat(ing.amount) || 0;
        ingredientsMap[key].amount += baseAmount * batches;
      });
    });

    setPortionSuggestions(newPortionSuggestions);

    // 3. Update Shopping List State
    setShoppingList(prevList => {
      const newList = Object.values(ingredientsMap).sort((a, b) => a.name.localeCompare(b.name));
      return newList.map(newItem => {
        const existingItem = prevList.find(oldItem => 
          oldItem.name === newItem.name && oldItem.unit === newItem.unit
        );
        return existingItem ? { ...newItem, checked: existingItem.checked } : newItem;
      });
    });
  };

  const getShoppingListText = () => {
    return shoppingList.map(item => 
      `- [${item.checked ? 'x' : ' '}] ${item.amount > 0 ? parseFloat(item.amount.toFixed(2)) : ''} ${item.unit} ${item.name}`
    ).join('\n');
  };

  if (!currentUser) {
    return <LoginPrompt />;
  }

  return (
    <PageContainer>
      <Header>
        <Title>📅 Organizador de Refeições</Title>
        <HeaderActions>
          <PeopleCounter>
            <label htmlFor="people-count">Pessoas:</label>
            <input 
              id="people-count"
              type="number" 
              min="1" 
              value={peopleCount} 
              onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)}
            />
          </PeopleCounter>
        </HeaderActions>
      </Header>

      <SectionCard title="Planejamento de Dias">
        <DaysContainer>
          {days.map((day, dayIndex) => (
            <DayCard
              key={day.id}
              day={day}
              dayIndex={dayIndex}
              availableRecipes={availableRecipes}
              onUpdateName={updateDayName}
              onRemove={removeDay}
              onAddRecipe={addRecipeToDay}
              onRemoveRecipe={removeRecipeFromDay}
              onRecipeClick={handleRecipeClick}
            />
          ))}
          
          <AddDayButton onClick={addDay}>
            + Adicionar Dia
          </AddDayButton>
        </DaysContainer>
      </SectionCard>

      <SectionCard title="💡 Sugestões de Porções Extras">
        <PortionSuggestionsWrapper>
          {Object.keys(portionSuggestions).length > 0 ? (
            <>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
                Baseado no número de pessoas, algumas receitas gerarão porções extras. Você pode aproveitá-las em outros dias!
              </p>
              <SuggestionGrid>
                {Object.entries(portionSuggestions).map(([recipe, amount], idx) => (
                  <SuggestionCard key={idx}>
                    <span className="icon">🥡</span>
                    <div className="info">
                      <div className="title">{amount}x {recipe}</div>
                      <div className="subtitle">Porções extras</div>
                    </div>
                  </SuggestionCard>
                ))}
              </SuggestionGrid>
            </>
          ) : (
            <EmptyState>
              ✅ Distribuição perfeita! Não haverá sobras de porções.
            </EmptyState>
          )}
        </PortionSuggestionsWrapper>
      </SectionCard>

      <SectionCard 
        title="Lista de Compras" 
        actions={
          shoppingList.length > 0 && (
            <CopyButton 
              text={getShoppingListText()} 
              label="Copiar Markdown" 
              leftIcon="📋"
              variant="secondary"
            />
          )
        }
      >
        {shoppingList.length === 0 ? (
          <EmptyState>
            Adicione dias e receitas para gerar sua lista de compras.
          </EmptyState>
        ) : (
          <MarkdownPreview content={getShoppingListText()} />
        )}
      </SectionCard>

      <RecipeModal 
        isOpen={!!selectedRecipe} 
        onClose={closeRecipeModal} 
        recipe={selectedRecipe} 
      />
    </PageContainer>
  );
};

export default MealOrganizer;
