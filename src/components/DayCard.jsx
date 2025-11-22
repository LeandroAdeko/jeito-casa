import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 15px;
  min-width: 280px;
  max-width: 350px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

const NameInput = styled.input`
  font-weight: bold;
  font-size: 1.1rem;
  border: none;
  background: transparent;
  color: var(--text-color);
  width: 100%;

  &:focus {
    outline: none;
    border-bottom: 2px solid var(--primary-color);
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const MealsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SelectedRecipe = styled.div`
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
`;

const RemoveMealButton = styled.button`
  background: none;
  border: none;
  color: #d32f2f;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0 5px;
  line-height: 1;
`;

const AddMealSelect = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px dashed var(--border-color);
  border-radius: 6px;
  background-color: var(--card-bg);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }
`;

const DayCard = ({ day, dayIndex, availableRecipes, onUpdateName, onRemove, onAddRecipe, onRemoveRecipe }) => {
  return (
    <Card>
      <HeaderRow>
        <NameInput 
          type="text" 
          value={day.name}
          onChange={(e) => onUpdateName(dayIndex, e.target.value)}
        />
        <RemoveButton onClick={() => onRemove(dayIndex)} title="Remover dia">🗑️</RemoveButton>
      </HeaderRow>
      
      <MealsContainer>
        {day.meals.map((recipe, mealIndex) => (
          <SelectedRecipe key={mealIndex}>
            <span>{recipe.title}</span>
            <RemoveMealButton onClick={() => onRemoveRecipe(dayIndex, mealIndex)}>
              ×
            </RemoveMealButton>
          </SelectedRecipe>
        ))}
        
        <AddMealSelect 
          onChange={(e) => {
            onAddRecipe(dayIndex, e.target.value);
            e.target.value = ""; 
          }}
        >
          <option value="">+ Adicionar Refeição</option>
          {availableRecipes.map((r, idx) => (
            <option key={idx} value={r.title}>{r.title}</option>
          ))}
        </AddMealSelect>
      </MealsContainer>
    </Card>
  );
};

export default DayCard;
