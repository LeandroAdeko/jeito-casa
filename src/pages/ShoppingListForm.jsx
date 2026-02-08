import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFirebaseSync } from '../hooks/useFirebaseSync';
import { useRecipes } from '../hooks/useRecipes';
import SectionCard from '../components/SectionCard';
import { Button } from '../components/Button';
import { TextInput, Select } from '../components/Input';
import LoginPrompt from '../components/LoginPrompt';
import SyncStatusIndicator from '../components/SyncStatusIndicator';
import ImportModal from '../components/ImportModal';
import unitsData from '../data/units.json';
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

const HeaderActionsArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
`;

const TopActions = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
`;

// Removed legacy HeaderActions

const QuickAddRow = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  align-items: flex-end;
  flex-wrap: wrap;

  .item-name { flex: 2; min-width: 150px; }
  .item-amount { width: 80px; }
  .item-unit { width: 120px; }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    .item-amount, .item-unit { width: 100%; }
  }
`;

const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--primary-color);
    box-shadow: var(--shadow-sm);
  }
`;

const ItemTextContent = styled.div`
  flex: 1;
  font-weight: 500;
  display: flex;
  gap: 8px;
  align-items: baseline;
  color: var(--text-color);
`;

const AmountLabel = styled.span`
  color: var(--primary-color);
  font-weight: 600;
  font-size: 0.95rem;
`;

const UnitLabel = styled.span`
  color: var(--text-secondary);
  font-size: 0.85rem;
`;

const SectionTitle = styled.h3`
  margin: 30px 0 15px 0;
  border-top: 1px solid var(--border-color);
  padding-top: 20px;
  font-size: 1.1rem;
  color: var(--text-color);
`;

const ImportSection = styled.div`
  margin-top: 20px;

  p {
    color: var(--text-secondary);
    margin-bottom: 15px;
    font-size: 0.95rem;
  }
`;

const ImportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 30px;
  color: var(--text-secondary);
  border: 1px dashed var(--border-color);
  border-radius: 12px;
  background: var(--bg-hover);
`;

const ShoppingListForm = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const initialData = {
    activeListId: 'default',
    lists: [{ id: 'default', name: 'Minha Lista', items: [] }]
  };
  
  const [data, setData, syncStatus] = useFirebaseSync('shopping_lists', 'shopping_lists_data', initialData, currentUser);
  const { recipes } = useRecipes(currentUser, { includePublic: true });

  const [newItem, setNewItem] = useState({ name: '', amount: '', unit: '' });
  const [listName, setListName] = useState('');
  const [importSource, setImportSource] = useState(null);
  const [importItems, setImportItems] = useState([]);
  const [importMetadata, setImportMetadata] = useState([]);

  const activeList = useMemo(() => {
    return data.lists.find(l => l.id === listId);
  }, [data, listId]);

  useEffect(() => {
    if (activeList) {
      setListName(activeList.name);
    }
  }, [activeList]);

  if (!currentUser) return <LoginPrompt />;
  if (!activeList) return <PageContainer>Carregando ou lista não encontrada...</PageContainer>;

  const handleRename = (val) => {
    setListName(val);
    setData(prev => ({
      ...prev,
      lists: prev.lists.map(l => l.id === listId ? { ...l, name: val } : l)
    }));
  };

  const addItem = (e) => {
    if (e) e.preventDefault();
    if (!newItem.name.trim()) return;

    const item = {
      id: `item-${Date.now()}`,
      name: newItem.name.trim(),
      amount: newItem.amount,
      unit: newItem.unit,
      checked: false
    };

    setData(prev => ({
      ...prev,
      lists: prev.lists.map(l => l.id === listId 
        ? { ...l, items: [item, ...l.items] } 
        : l
      )
    }));
    setNewItem({ name: '', amount: '', unit: '' });
  };

  const removeItem = (itemId) => {
    setData(prev => ({
      ...prev,
      lists: prev.lists.map(l => l.id === listId 
        ? { ...l, items: l.items.filter(i => i.id !== itemId) } 
        : l
      )
    }));
  };

  const handlePullFromOrganizer = () => {
    const savedDays = localStorage.getItem('mealOrganizer_days');
    const peopleCount = parseInt(localStorage.getItem('mealOrganizer_peopleCount')) || 1;
    
    if (!savedDays) {
      alert("Nenhum planejamento encontrado no Organizador Alimentar.");
      return;
    }

    try {
      const days = JSON.parse(savedDays);
      const recipeCounts = {};
      
      days.forEach(day => {
        day.meals.forEach(recipe => {
          const title = recipe.title;
          if (!recipeCounts[title]) recipeCounts[title] = { count: 0, recipe: recipe };
          recipeCounts[title].count += 1;
        });
      });

      const ingredientsMap = {};
      Object.values(recipeCounts).forEach(({ count, recipe }) => {
        const portions = parseInt(recipe.portions) || 1;
        const totalPortionsNeeded = count * peopleCount;
        const batches = Math.ceil(totalPortionsNeeded / portions);
        
        recipe.ingredients.forEach(ing => {
          const key = `${ing.name.toLowerCase().trim()}-${ing.unit.toLowerCase().trim()}`;
          const amount = (parseFloat(ing.amount) || 0) * batches;
          
          if (!ingredientsMap[key]) {
            ingredientsMap[key] = { name: ing.name, unit: ing.unit, amount: 0 };
          }
          ingredientsMap[key].amount += amount;
        });
      });

      const itemsToImport = Object.values(ingredientsMap);
      if (itemsToImport.length === 0) {
        alert("Nenhum ingrediente encontrado no seu planejamento atual.");
        return;
      }

      setImportMetadata(Object.entries(recipeCounts).map(([title, { count }]) => ({ title, count })));
      setImportItems(itemsToImport);
      setImportSource('planning');
    } catch (err) {
      console.error(err);
      alert("Erro ao ler dados do organizador.");
    }
  };

  const confirmImport = (items) => {
    setData(prev => {
      const currentListIndex = prev.lists.findIndex(l => l.id === listId);
      if (currentListIndex === -1) return prev;

      const updatedItems = [...prev.lists[currentListIndex].items];

      items.forEach(newItem => {
        const existingIndex = updatedItems.findIndex(i => 
          i.name.toLowerCase() === newItem.name.toLowerCase() && 
          i.unit.toLowerCase() === newItem.unit.toLowerCase() &&
          !i.checked
        );

        if (existingIndex > -1) {
          const existing = updatedItems[existingIndex];
          const newAmount = (parseFloat(existing.amount) || 0) + (parseFloat(newItem.amount) || 0);
          updatedItems[existingIndex] = { ...existing, amount: newAmount };
        } else {
          updatedItems.unshift({
            id: `import-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: newItem.name,
            amount: newItem.amount,
            unit: newItem.unit,
            checked: false
          });
        }
      });

      const newLists = [...prev.lists];
      newLists[currentListIndex] = { ...newLists[currentListIndex], items: updatedItems };
      return { ...prev, lists: newLists };
    });
    setImportSource(null);
  };

  return (
    <PageContainer>
      <Header>
        <Title>📝 Editar Lista</Title>
        <HeaderActionsArea>
          <TopActions>
            <Button onClick={() => navigate('/lista-compras')} variant="secondary" leftIcon="⬅️">Voltar</Button>
            <SyncStatusIndicator status={syncStatus} />
          </TopActions>
          <TextInput 
            label="Nome da Lista" 
            value={listName} 
            onChange={handleRename} 
            placeholder="Ex: Rancho do Mês"
          />
        </HeaderActionsArea>
      </Header>

      <SectionCard>
        <SectionTitle style={{ marginTop: 0, border: 'none', paddingTop: 0 }}>Itens da Lista</SectionTitle>

        <QuickAddRow onSubmit={addItem}>
          <div className="item-name">
            <TextInput 
              placeholder="Adicionar item..."
              value={newItem.name}
              onChange={val => setNewItem({ ...newItem, name: val })}
            />
          </div>
          <div className="item-amount">
            <TextInput 
              placeholder="Qtd"
              value={newItem.amount}
              onChange={val => setNewItem({ ...newItem, amount: val })}
            />
          </div>
          <div className="item-unit">
            <Select 
              placeholder="Unidade"
              value={newItem.unit}
              onChange={val => setNewItem({ ...newItem, unit: val })}
              options={unitsData.map(u => ({ value: u.nome, label: u.sigla }))}
            />
          </div>
          <Button type="submit" variant="primary">Adicionar</Button>
        </QuickAddRow>

        <ItemsContainer>
          {activeList.items.map(item => (
            <ItemRow key={item.id}>
              <ItemTextContent>
                <span style={{ flex: 1 }}>{item.name}</span>
                {item.amount && (
                  <AmountLabel>
                    {item.amount}
                    <UnitLabel style={{ marginLeft: '4px' }}>{item.unit}</UnitLabel>
                  </AmountLabel>
                )}
              </ItemTextContent>
              <Button 
                variant="ghost" 
                size="small" 
                onClick={() => removeItem(item.id)}
                style={{ color: 'var(--text-secondary)' }}
              >
                ✕
              </Button>
            </ItemRow>
          ))}
          {activeList.items.length === 0 && (
            <EmptyStateContainer>
              Nenhum item adicionado ainda.
            </EmptyStateContainer>
          )}
        </ItemsContainer>
      </SectionCard>

      <SectionCard title="Importar">
        <ImportSection>
          <p>
            Adicione rapidamente itens à sua lista baseando-se no que você planejou comer ou em suas receitas salvas.
          </p>
          
          <ImportGrid>
            <Button variant="outline" fullWidth onClick={handlePullFromOrganizer} leftIcon="📅">
              Importar planejamento
            </Button>

            <Button variant="outline" fullWidth onClick={() => setImportSource('recipe')} leftIcon="🍳">
              Importar receita
            </Button>
          </ImportGrid>
        </ImportSection>
      </SectionCard>

      <ImportModal 
        isOpen={!!importSource}
        onClose={() => setImportSource(null)}
        type={importSource}
        recipes={recipes}
        planningMetadata={importMetadata}
        items={importItems}
        onConfirm={confirmImport}
      />
    </PageContainer>
  );
};

export default ShoppingListForm;
