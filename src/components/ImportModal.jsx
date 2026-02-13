import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import Modal from './Modal';
import { Button } from './Button';

const ItemList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px 5px;
  
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 10px; }
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: ${props => props.selected ? 'rgba(74, 144, 226, 0.05)' : 'var(--card-bg)'};
  border-radius: 12px;
  border: 1px solid ${props => props.selected ? 'var(--primary-color)' : 'var(--border-color)'};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: var(--primary-color);
  }
`;

const Checkbox = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 2px solid ${props => props.checked ? 'var(--primary-color)' : 'var(--border-color)'};
  background-color: ${props => props.checked ? 'var(--primary-color)' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &::after {
    content: '✓';
    color: white;
    font-size: 14px;
    display: ${props => props.checked ? 'block' : 'none'};
  }
`;

const RecipeBadgeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
  padding: 10px;
  background: var(--bg-hover);
  border-radius: 12px;
`;

const RecipeBadge = styled.span`
  background: white;
  border: 1px solid var(--border-color);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--text-color);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before { content: '🍳'; font-size: 0.8rem; }
`;

const RecipeSelectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
`;

const RecipeSelector = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 10px;
`;

const Counter = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-hover);
  padding: 4px;
  border-radius: 8px;
`;

const CountBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: white;
  color: var(--primary-color);
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ImportModal = ({ 
  isOpen, 
  onClose, 
  type = 'planning', // 'planning' | 'recipe' | 'preferred'
  recipes = [],      // Usado para seleção no tipo 'recipe'
  planningMetadata = [], // [{ title, count }] para o cabeçalho do tipo 'planning'
  items = [],        // Os ingredientes (usado diretamente para planning e preferred)
  onConfirm 
}) => {
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [recipeCounts, setRecipeCounts] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (type === 'planning' || type === 'preferred') {
        setSelectedIndices(items.map((_, i) => i));
      } else {
        setSelectedIndices([]);
        setRecipeCounts({});
      }
    }
  }, [isOpen, items, type]);

  const updateRecipeCount = (id, delta) => {
    setRecipeCounts(prev => {
      const current = prev[id] || 0;
      const newVal = Math.max(0, current + delta);
      return { ...prev, [id]: newVal };
    });
  };

  const aggregatedRecipeItems = useMemo(() => {
    if (type !== 'recipe') return [];
    
    const ingredientsMap = {};
    Object.entries(recipeCounts).forEach(([id, count]) => {
      if (count <= 0) return;
      const recipe = recipes.find(r => r.id === id);
      if (!recipe) return;

      recipe.ingredients.forEach(ing => {
        const key = `${ing.name.toLowerCase().trim()}-${ing.unit.toLowerCase().trim()}`;
        if (!ingredientsMap[key]) {
          ingredientsMap[key] = { name: ing.name, unit: ing.unit, amount: 0 };
        }
        ingredientsMap[key].amount += (parseFloat(ing.amount) || 0) * count;
      });
    });

    return Object.values(ingredientsMap);
  }, [type, recipeCounts, recipes]);

  // Sempre seleciona todos os ingredientes agregados por padrão
  useEffect(() => {
    if (type === 'recipe') {
      setSelectedIndices(aggregatedRecipeItems.map((_, i) => i));
    }
  }, [aggregatedRecipeItems, type]);

  const currentItems = (type === 'planning' || type === 'preferred') ? items : aggregatedRecipeItems;

  const toggleItem = (index) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter(i => i !== index));
    } else {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === 'planning' ? "Importar Planejamento" : type === 'recipe' ? "Importar Receitas" : "Produtos Preferidos"}
      width="700px"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button 
            variant="primary" 
            onClick={() => onConfirm(currentItems.filter((_, i) => selectedIndices.includes(i)))}
            disabled={selectedIndices.length === 0}
          >
            Adicionar {selectedIndices.length} itens
          </Button>
        </>
      }
    >
      {type === 'planning' && planningMetadata.length > 0 && (
        <>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>Receitas incluídas no planejamento:</p>
          <RecipeBadgeList>
            {planningMetadata.map((m, i) => (
              <RecipeBadge key={i}>{m.count}x {m.title}</RecipeBadge>
            ))}
          </RecipeBadgeList>
        </>
      )}

      {type === 'recipe' && (
        <>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>Selecione as receitas e quantidades:</p>
          <RecipeSelectionList>
            {recipes.map(recipe => (
              <RecipeSelector key={recipe.id}>
                <span style={{ fontWeight: 500 }}>{recipe.title}</span>
                <Counter>
                  <CountBtn onClick={() => updateRecipeCount(recipe.id, -1)} disabled={!recipeCounts[recipe.id]}>-</CountBtn>
                  <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{recipeCounts[recipe.id] || 0}</span>
                  <CountBtn onClick={() => updateRecipeCount(recipe.id, 1)}>+</CountBtn>
                </Counter>
              </RecipeSelector>
            ))}
          </RecipeSelectionList>
        </>
      )}

      {currentItems.length > 0 && (
        <>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            {type === 'recipe' ? 'Ingredientes combinados:' : type === 'preferred' ? 'Selecione os produtos para importar:' : 'Ingredientes do planejamento:'}
          </p>
          <ItemList>
            {currentItems.map((item, index) => (
              <ItemRow key={index} onClick={() => toggleItem(index)} selected={selectedIndices.includes(index)}>
                <Checkbox checked={selectedIndices.includes(index)} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.amount} {item.unit}</div>
                </div>
              </ItemRow>
            ))}
          </ItemList>
        </>
      )}

      {type === 'recipe' && currentItems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          <span style={{ fontSize: '2rem' }}>🍳</span>
          <p>Adicione receitas acima para ver os ingredientes.</p>
        </div>
      )}
    </Modal>
  );
};

export default ImportModal;
