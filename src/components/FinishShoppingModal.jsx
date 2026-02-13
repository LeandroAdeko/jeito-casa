import React from 'react';
import styled from 'styled-components';
import Modal from './Modal';
import { Button } from './Button';

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 10px 0;
`;

const OptionButton = styled(Button)`
  justify-content: flex-start;
  padding: 16px;
  height: auto;
  
  & > span {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    gap: 4px;
  }
`;

const OptionTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OptionDescription = styled.div`
  font-size: 0.85rem;
  opacity: 0.8;
  font-weight: normal;
`;

const FinishShoppingModal = ({ isOpen, onClose, onFinish }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Finalizar Compra"
      footer={<Button variant="secondary" onClick={onClose} fullWidth>Cancelar</Button>}
    >
      <OptionsContainer>
        <OptionButton 
          variant="danger" 
          fullWidth 
          onClick={() => onFinish('delete_checked')}
        >
          <span>
            <OptionTitle>✅ Apagar itens marcados</OptionTitle>
            <OptionDescription>Mantém apenas o que você ainda não comprou para a próxima vez.</OptionDescription>
          </span>
        </OptionButton>

        <OptionButton 
          variant="outline" 
          fullWidth 
          onClick={() => onFinish('uncheck_all')}
          style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
        >
          <span>
            <OptionTitle>🔄 Apenas desmarcar tudo</OptionTitle>
            <OptionDescription>Mantém todos os itens na lista, mas desmarca todos como "não comprados".</OptionDescription>
          </span>
        </OptionButton>

        <OptionButton 
          variant="ghost" 
          fullWidth 
          onClick={() => onFinish('delete_all')}
          style={{ color: 'var(--danger-color)' }}
        >
          <span>
            <OptionTitle>🗑️ Apagar tudo</OptionTitle>
            <OptionDescription>Remove permanentemente todos os itens desta lista.</OptionDescription>
          </span>
        </OptionButton>
      </OptionsContainer>
    </Modal>
  );
};

export default FinishShoppingModal;
