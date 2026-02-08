import React from 'react';
import styled from 'styled-components';
import Modal from './Modal';
import { Button } from './Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 20px;
  padding: 10px 0;
`;

const Icon = styled.div`
  font-size: 3rem;
  margin-bottom: 10px;
`;

const Message = styled.p`
  font-size: 1.1rem;
  color: var(--text-color);
  margin: 0;
  line-height: 1.5;
`;

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmar Ação", 
  message = "Tem certeza que deseja prosseguir?",
  confirmLabel = "Confirmar",
  confirmVariant = "danger",
  icon = "⚠️"
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button variant={confirmVariant} onClick={onConfirm}>{confirmLabel}</Button>
        </>
      }
    >
      <Container>
        {icon && <Icon>{icon}</Icon>}
        <Message>{message}</Message>
      </Container>
    </Modal>
  );
};

export default ConfirmModal;
