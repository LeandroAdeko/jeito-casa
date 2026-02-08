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

const EmptyStateContent = styled.div`
  text-align: center;
  margin-top: 60px;
  color: var(--text-secondary);

  h2 { color: var(--text-color); margin-bottom: 10px; }
  p { margin-bottom: 20px; }
`;

const ModalBody = styled.div`
  text-align: center;
  padding: 10px 0;
  
  p { font-size: 1.1rem; color: var(--text-color); }
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
      <Header>
        <Title>🛍️ Listas de Compras</Title>
        <HeaderActions>
          <SyncStatusIndicator status={syncStatus} />
          <Button onClick={createNewList} leftIcon="➕" variant="primary" fullWidth={true}>
            Nova Lista
          </Button>
        </HeaderActions>
      </Header>

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
        <EmptyStateContent>
          <h2>Nenhuma lista encontrada</h2>
          <p>Clique em "Nova Lista" para começar!</p>
        </EmptyStateContent>
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
        <ModalBody>
          <p>{alertModal.message}</p>
        </ModalBody>
      </Modal>
    </DashboardContainer>
  );
};

export default ShoppingList;
