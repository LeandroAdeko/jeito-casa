import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 25px;
  box-shadow: var(--shadow);
  margin-bottom: 20px;
  border: 1px solid var(--border-color);
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
  width: 100%;
`;

const ActionsWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const SectionCard = ({ title, children, actions, className = '', titleLevel = 2 }) => {
  const TitleTag = styled(`h${titleLevel}`)`
    margin: 0;
    flex: 1 1 auto;
  `;

  return (
    <CardContainer className={className}>
      {(title || actions) && (
        <HeaderWrapper>
          {title && <TitleTag>{title}</TitleTag>}
          {actions && <ActionsWrapper>{actions}</ActionsWrapper>}
        </HeaderWrapper>
      )}
      {children}
    </CardContainer>
  );
};

export default SectionCard;
