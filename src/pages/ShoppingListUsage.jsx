import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFirebaseSync } from '../hooks/useFirebaseSync';
import SectionCard from '../components/SectionCard';
import { Button } from '../components/Button';
import LoginPrompt from '../components/LoginPrompt';
import SyncStatusIndicator from '../components/SyncStatusIndicator';
import ConfirmModal from '../components/ConfirmModal';
import FinishShoppingModal from '../components/FinishShoppingModal';
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

const ItemsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 16px;
  background-color: ${props => props.checked ? 'var(--bg-hover)' : 'var(--card-bg)'};
  border: 1px solid ${props => props.checked ? 'transparent' : 'var(--border-color)'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  opacity: ${props => props.checked ? 0.6 : 1};
  
  &:hover {
    border-color: var(--primary-color);
    transform: translateX(4px);
    box-shadow: var(--shadow-sm);
  }
`;

const Checkbox = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 8px;
  border: 2px solid ${props => props.checked ? 'var(--primary-color)' : 'var(--border-color)'};
  background-color: ${props => props.checked ? 'var(--primary-color)' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;

  &::after {
    content: '✓';
    color: white;
    font-size: 16px;
    display: ${props => props.checked ? 'block' : 'none'};
  }
`;

const ItemTextContent = styled.div`
  flex: 1;
  font-size: 1.1rem;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-color);
  text-decoration: ${props => props.checked ? 'line-through' : 'none'};
`;

const BadgeLabel = styled.span`
  background: var(--bg-hover);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--primary-color);
  font-weight: 600;
  border: 1px solid var(--border-color);
`;

const SectionInfo = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);

  h3 { margin-bottom: 10px; color: var(--text-color); }
  p { margin-bottom: 20px; }
`;

const ShoppingListUsage = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const initialData = {
    activeListId: 'default',
    lists: [{ id: 'default', name: 'Minha Lista', items: [] }]
  };
  
  const [data, setData, syncStatus] = useFirebaseSync('shopping_lists', 'shopping_lists_data', initialData, currentUser);

  const activeList = useMemo(() => {
    return data.lists.find(l => l.id === listId);
  }, [data, listId]);

  if (!currentUser) return <LoginPrompt />;
  if (!activeList) return <PageContainer>Lista não encontrada...</PageContainer>;

  const [showFinishModal, setShowFinishModal] = React.useState(false);

  const toggleItem = (itemId) => {
    setData(prev => ({
      ...prev,
      lists: prev.lists.map(l => l.id === listId 
        ? { ...l, items: l.items.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i) } 
        : l
      )
    }));
  };

  const confirmFinishShopping = (option) => {
    setData(prev => ({
      ...prev,
      lists: prev.lists.map(l => l.id === listId 
        ? { 
            ...l, 
            items: option === 'delete_all' 
              ? [] 
              : option === 'uncheck_all'
                ? l.items.map(i => ({ ...i, checked: false }))
                : l.items.filter(i => !i.checked) // default: delete_checked
          } 
        : l
      )
    }));
    setShowFinishModal(false);
    navigate('/lista-compras');
  };

  return (
    <PageContainer>
      <Header>
        <Title>🛒 {activeList.name}</Title>
        <HeaderActions>
          <Button onClick={() => navigate('/lista-compras')} variant="secondary" leftIcon="⬅️">Sair</Button>
          <SyncStatusIndicator status={syncStatus} />
          <Button onClick={() => navigate(`/lista-compras/edit/${listId}`)} variant="ghost" leftIcon="✏️">Editar</Button>
          {activeList.items.length > 0 && (
            <Button variant="danger" size="small" onClick={() => setShowFinishModal(true)}>Finalizar</Button>
          )}
        </HeaderActions>
      </Header>

      <SectionCard>
        <SectionInfo>
          Toque nos itens para marcar como comprado.
        </SectionInfo>

        <ItemsContainer>
          {activeList.items.map(item => (
            <ItemRow 
              key={item.id} 
              checked={item.checked}
              onClick={() => toggleItem(item.id)}
            >
              <Checkbox checked={item.checked} />
              <ItemTextContent checked={item.checked}>
                <span>{item.name}</span>
                {item.amount && (
                  <BadgeLabel>{item.amount} {item.unit}</BadgeLabel>
                )}
              </ItemTextContent>
            </ItemRow>
          ))}

          {activeList.items.length === 0 && (
            <EmptyState>
              <h3>Tudo pronto!</h3>
              <p>Não há itens nesta lista.</p>
              <Button onClick={() => navigate(`/lista-compras/edit/${listId}`)} variant="outline">
                Adicionar Itens
              </Button>
            </EmptyState>
          )}
        </ItemsContainer>
      </SectionCard>

      <FinishShoppingModal 
        isOpen={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        onFinish={confirmFinishShopping}
      />
    </PageContainer>
  );
};

export default ShoppingListUsage;
