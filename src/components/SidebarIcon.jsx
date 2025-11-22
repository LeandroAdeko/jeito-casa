import React from 'react';
import styled from 'styled-components';

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const IconWrapper = styled.span`
  font-size: 1.2rem;
  min-width: 24px;
  margin-right: 15px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Label = styled.span`
  opacity: ${props => props.$isCollapsed ? 0 : 1};
  width: ${props => props.$isCollapsed ? 0 : 'auto'};
  transition: opacity 0.3s, width 0.3s;
  white-space: nowrap;
  overflow: hidden;
`;

const SidebarIcon = ({ icon, label, isCollapsed }) => {
  return (
    <ItemWrapper>
      <IconWrapper>{icon}</IconWrapper>
      <Label $isCollapsed={isCollapsed}>{label}</Label>
    </ItemWrapper>
  );
};

export default SidebarIcon;
