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
import '../styles/global.css';

const PageContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
`;

const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 16px;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--primary-color);
    transform: translateX(4px);
  }

  &.checked {
    opacity: 0.5;
    background-color: var(--bg-hover);
    .item-text {
      text-decoration: line-through;
    }
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

  &::after {
    content: '✓';
    color: white;
    font-size: 16px;
    display: ${props => props.checked ? 'block' : 'none'};
  }
`;

const ItemText = styled.div`
  flex: 1;
  font-size: 1.1rem;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Badge = styled.span`
  background: var(--bg-hover);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--primary-color);
  font-weight: 600;
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

  const confirmFinishShopping = () => {
    setData(prev => ({
      ...prev,
      lists: prev.lists.map(l => l.id === listId 
        ? { ...l, items: l.items.filter(i => !i.checked) } 
        : l
      )
    }));
    setShowFinishModal(false);
    navigate('/lista-compras');
  };

  return (
    <PageContainer>
      <HeaderActions>
        <Button onClick={() => navigate('/lista-compras')} variant="secondary" leftIcon="⬅️">Sair</Button>
        <div style={{ flex: 1 }} />
        <SyncStatusIndicator status={syncStatus} />
        <Button onClick={() => navigate(`/lista-compras/edit/${listId}`)} variant="ghost" leftIcon="✏️">Editar</Button>
      </HeaderActions>

      <SectionCard 
        title={activeList.name} 
        actions={
          activeList.items.some(i => i.checked) && (
            <Button variant="danger" size="small" onClick={() => setShowFinishModal(true)}>Finalizar</Button>
          )
        }
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
          Toque nos itens para marcar como comprado.
        </p>

        <ItemsContainer>
          {activeList.items.map(item => (
            <ItemRow 
              key={item.id} 
              className={item.checked ? 'checked' : ''}
              onClick={() => toggleItem(item.id)}
            >
              <Checkbox checked={item.checked} />
              <ItemText className="item-text">
                <span>{item.name}</span>
                {item.amount && (
                  <Badge>{item.amount} {item.unit}</Badge>
                )}
              </ItemText>
            </ItemRow>
          ))}

          {activeList.items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              <h3>Tudo pronto!</h3>
              <p>Não há itens nesta lista.</p>
              <Button onClick={() => navigate(`/lista-compras/edit/${listId}`)} variant="outline" style={{ marginTop: '20px' }}>
                Adicionar Itens
              </Button>
            </div>
          )}
        </ItemsContainer>
      </SectionCard>

      <ConfirmModal 
        isOpen={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        onConfirm={confirmFinishShopping}
        title="Finalizar Compra"
        message="Deseja remover todos os itens já marcados da lista? Isso manterá apenas o que ainda falta comprar para a próxima vez."
        confirmLabel="Finalizar e Limpar"
        confirmVariant="primary"
        icon="🛒"
      />
    </PageContainer>
  );
};

export default ShoppingListUsage;
