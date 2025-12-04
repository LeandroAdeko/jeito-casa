import React, { useState, useEffect } from 'react';
import CopyButton from '../components/CopyButton';
import SectionCard from '../components/SectionCard';
import FileUpload from '../components/FileUpload';
import LoginPrompt from '../components/LoginPrompt';
import DayCard from '../components/DayCard';
import '../styles/global.css';
import '../styles/meal-organizer.css';

const MealOrganizer = () => {
  const [availableRecipes, setAvailableRecipes] = useState([]);
  const [peopleCount, setPeopleCount] = useState(1);
  
  // Dynamic days state: array of objects { id, name, meals: [] }
  const [days, setDays] = useState([
    { id: 'day-1', name: 'Dia 1', meals: [] }
  ]);

  const [shoppingList, setShoppingList] = useState([]);
  const [portionSuggestions, setPortionSuggestions] = useState({});

  const handleLoadRecipes = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          setAvailableRecipes(prev => {
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

  const toggleItem = (index) => {
    setShoppingList(prev => {
      const newList = [...prev];
      newList[index].checked = !newList[index].checked;
      return newList;
    });
  };

  const getShoppingListText = () => {
    return shoppingList.map(item => 
      `- [${item.checked ? 'x' : ' '}] ${item.amount > 0 ? parseFloat(item.amount.toFixed(2)) : ''} ${item.unit} ${item.name}`
    ).join('\n');
  };

  return (
    <div className="meal-organizer">
      <SectionCard 
        title="Organizador de Refeições" 
        titleLevel={1}
        className="organizer-header"
        actions={
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div className="people-counter" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label htmlFor="people-count" style={{ fontWeight: 500 }}>Pessoas:</label>
              <input 
                id="people-count"
                type="number" 
                min="1" 
                value={peopleCount} 
                onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)}
                style={{ width: '60px', padding: '5px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
              />
            </div>
            <FileUpload 
              accept=".json" 
              multiple={true}
              onChange={handleLoadRecipes} 
              label="Carregar Receitas"
            />
          </div>
        }
      />

      <LoginPrompt />

      <SectionCard title="Planejamento de Dias">
        <div className="days-container">
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
            />
          ))}
          
          <button onClick={addDay} className="btn-add-day">
            + Adicionar Dia
          </button>
        </div>
      </SectionCard>

      <SectionCard title="💡 Sugestões de Porções Extras">
        <div className="portion-suggestions">
          {Object.keys(portionSuggestions).length > 0 ? (
            <>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
                Baseado no número de pessoas, algumas receitas gerarão porções extras. Você pode aproveitá-las em outros dias!
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {Object.entries(portionSuggestions).map(([recipe, amount], idx) => (
                  <div key={idx} style={{ 
                    backgroundColor: 'var(--bg-color)', 
                    border: '1px solid var(--primary-color)', 
                    borderRadius: '8px', 
                    padding: '10px 15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>🥡</span>
                    <div>
                      <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{amount}x {recipe}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Porções extras</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>
              ✅ Distribuição perfeita! Não haverá sobras de porções.
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard 
        title="Lista de Compras" 
        className="shopping-list-section"
        actions={
          shoppingList.length > 0 && (
            <CopyButton 
              text={getShoppingListText} 
              label="📋 Copiar Markdown" 
              className="btn-secondary"
            />
          )
        }
      >
        <div className="shopping-list-markdown">
          {shoppingList.length === 0 ? (
            <div className="empty-state">
              Adicione dias e receitas para gerar sua lista de compras.
            </div>
          ) : (
            shoppingList.map((item, index) => (
              <div 
                key={index} 
                className={`markdown-line ${item.checked ? 'checked' : ''}`}
                onClick={() => toggleItem(index)}
              >
                <span className="md-checkbox">[{item.checked ? 'x' : ' '}]</span>
                <span className="md-content">
                  {item.amount > 0 ? parseFloat(item.amount.toFixed(2)) : ''} {item.unit} {item.name}
                </span>
              </div>
            ))
          )}
        </div>
      </SectionCard>
    </div>
  );
};

export default MealOrganizer;
