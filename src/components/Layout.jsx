import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
`;

const Layout = () => {
  return (
    <AppContainer>
      <Navbar />
      <MainWrapper>
        <MainContent>
          <Outlet />
        </MainContent>
        <Footer />
      </MainWrapper>
    </AppContainer>
  );
};

export default Layout;
