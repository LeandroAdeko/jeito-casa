import React from 'react';
import styled from 'styled-components';

const StatusContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  background: ${props => {
    if (props.$isSyncing) return 'rgba(100, 108, 255, 0.1)';
    if (props.$error) return 'rgba(255, 59, 48, 0.1)';
    if (props.$isOnline) return 'rgba(52, 199, 89, 0.1)';
    return 'rgba(142, 142, 147, 0.1)';
  }};
  color: ${props => {
    if (props.$isSyncing) return 'var(--primary-color)';
    if (props.$error) return '#ff3b30';
    if (props.$isOnline) return '#34c759';
    return 'var(--text-secondary)';
  }};
  border: 1px solid ${props => {
    if (props.$isSyncing) return 'var(--primary-color)';
    if (props.$error) return '#ff3b30';
    if (props.$isOnline) return '#34c759';
    return 'var(--border-color)';
  }};
`;

const Spinner = styled.div`
  width: 12px;
  height: 12px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
`;

/**
 * Componente para mostrar status de sincronização Firebase
 * @param {Object} syncStatus - Status retornado por useFirebaseSync
 */
const SyncStatusIndicator = ({ syncStatus }) => {
  if (!syncStatus) return null;

  const { isSyncing, isOnline, error, lastSyncTime } = syncStatus;

  // Calcular tempo desde última sincronização
  const getTimeSinceSync = () => {
    if (!lastSyncTime) return null;
    const seconds = Math.floor((new Date() - lastSyncTime) / 1000);
    if (seconds < 60) return 'agora';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}min atrás`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h atrás`;
  };

  const getMessage = () => {
    if (error) return error;
    if (isSyncing) return 'Salvando...';
    if (isOnline && lastSyncTime) {
      const timeSince = getTimeSinceSync();
      return timeSince ? `Salvo ${timeSince}` : 'Sincronizado';
    }
    if (isOnline) return 'Sincronizado';
    return 'Apenas local';
  };

  return (
    <StatusContainer 
      $isSyncing={isSyncing} 
      $isOnline={isOnline} 
      $error={error}
      title={error || (isOnline ? 'Dados salvos na nuvem' : 'Dados salvos apenas localmente')}
    >
      {isSyncing ? (
        <Spinner />
      ) : (
        <Dot />
      )}
      <span>{getMessage()}</span>
    </StatusContainer>
  );
};

export default SyncStatusIndicator;
