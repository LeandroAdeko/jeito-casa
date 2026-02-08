import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import '../styles/layout.css';

const Layout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <main className="main-content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
