import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFirebaseSync } from '../hooks/useFirebaseSync';
import SectionCard from '../components/SectionCard';
import { Button } from '../components/Button';
import LoginPrompt from '../components/LoginPrompt';
import SyncStatusIndicator from '../components/SyncStatusIndicator';
import ConfirmModal from '../components/ConfirmModal';
import Modal from '../components/Modal';
import '../styles/global.css';

const DashboardContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const ListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 30px;
`;

const ListCard = styled.div`
  background: var(--card-bg);
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--shadow);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &:hover {
    transform: translateY(-5px);
    border-color: var(--primary-color);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ListTitle = styled.h2`
  font-size: 1.4rem;
  color: var(--text-color);
  margin: 0;
  flex: 1;
`;

const ListStats = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CardActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
`;

const ShoppingList = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const initialData = {
    activeListId: 'default',
    lists: [{ id: 'default', name: 'Minha Lista', items: [] }]
  };

  const [data, setData, syncStatus] = useFirebaseSync('shopping_lists', 'shopping_lists_data', initialData, currentUser);

  const [deleteModal, setDeleteModal] = React.useState({ open: false, id: null, name: '' });
  const [alertModal, setAlertModal] = React.useState({ open: false, message: '' });

  const createNewList = () => {
    const id = `list-${Date.now()}`;
    const newName = `Nova Lista ${data.lists.length + 1}`;
    setData(prev => ({
      ...prev,
      lists: [...prev.lists, { id, name: newName, items: [] }]
    }));
    navigate(`/lista-compras/edit/${id}`);
  };

  const handleDeleteClick = (e, id, name) => {
    e.stopPropagation();
    if (data.lists.length <= 1) {
      setAlertModal({ open: true, message: "Você deve manter pelo menos uma lista." });
      return;
    }
    setDeleteModal({ open: true, id, name });
  };

  const confirmDeleteList = () => {
    setData(prev => ({
      ...prev,
      lists: prev.lists.filter(l => l.id !== deleteModal.id)
    }));
    setDeleteModal({ open: false, id: null, name: '' });
  };

  if (!currentUser) return <LoginPrompt />;

  return (
    <DashboardContainer>
      <SectionCard 
        title="Minhas Listas de Compras" 
        titleLevel={1}
        actions={
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <SyncStatusIndicator status={syncStatus} />
            <Button onClick={createNewList} leftIcon="➕" variant="primary">
              Nova Lista
            </Button>
          </div>
        }
      />

      <ListGrid>
        {data.lists.map((list) => (
          <ListCard key={list.id}>
            <CardHeader>
              <ListTitle>{list.name}</ListTitle>
              <Button 
                variant="ghost" 
                size="small" 
                onClick={(e) => handleDeleteClick(e, list.id, list.name)}
                style={{ color: 'var(--text-secondary)' }}
              >
                🗑️
              </Button>
            </CardHeader>
            
            <ListStats>
              <span>🛒 {list.items.length} itens no total</span>
              <span>✅ {list.items.filter(i => i.checked).length} itens marcados</span>
            </ListStats>

            <CardActions>
              <Button 
                fullWidth 
                variant="primary" 
                leftIcon="🛍️"
                onClick={() => navigate(`/lista-compras/view/${list.id}`)}
              >
                Usar
              </Button>
              <Button 
                fullWidth 
                variant="secondary" 
                leftIcon="✏️"
                onClick={() => navigate(`/lista-compras/edit/${list.id}`)}
              >
                Editar
              </Button>
            </CardActions>
          </ListCard>
        ))}
      </ListGrid>

      {data.lists.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '60px', color: 'var(--text-secondary)' }}>
          <h2>Nenhuma lista encontrada</h2>
          <p>Clique em "Nova Lista" para começar!</p>
        </div>
      )}

      <ConfirmModal 
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, name: '' })}
        onConfirm={confirmDeleteList}
        title="Excluir Lista"
        message={`Tem certeza que deseja excluir a lista "${deleteModal.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
      />

      <Modal
        isOpen={alertModal.open}
        onClose={() => setAlertModal({ open: false, message: '' })}
        title="Aviso"
        footer={<Button variant="primary" onClick={() => setAlertModal({ open: false, message: '' })}>Ok</Button>}
      >
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <p style={{ fontSize: '1.1rem' }}>{alertModal.message}</p>
        </div>
      </Modal>
    </DashboardContainer>
  );
};

export default ShoppingList;
