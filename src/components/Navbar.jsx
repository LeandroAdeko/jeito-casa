import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import SidebarIcon from './SidebarIcon';
import { TOOLS } from '../config/tools';
import { useAuth } from '../contexts/AuthContext';
import '../styles/layout.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) setIsProfileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const navItems = TOOLS.map(tool => ({
    path: tool.path,
    label: tool.title,
    icon: tool.icon
  }));

  return (
    <>
      {isMenuOpen && <div className="mobile-overlay" onClick={() => setIsMenuOpen(false)} />}
      <header className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <div className="logo" onClick={() => { navigate('/'); setIsMenuOpen(false); }} style={{ cursor: 'pointer' }}>
              Jeito de Casa
            </div>
          </div>

          <button className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
            {isMenuOpen ? '✕' : '☰'}
          </button>

          <nav className={`navbar-nav ${isMenuOpen ? 'open' : ''}`}>
            <ul className="nav-list">
              {navItems.map((item) => (
                <li key={item.path} onClick={() => setIsMenuOpen(false)}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-item ${isActive ? 'active' : ''}`
                    }
                  >
                    <SidebarIcon icon={item.icon} label={item.label} isCollapsed={false} />
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="navbar-actions">
              {currentUser ? (
                <div className="user-nav-wrapper" ref={profileRef}>
                  <div 
                    className={`user-nav-profile ${isProfileOpen ? 'active' : ''}`} 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <div className="user-avatar-small">
                      {currentUser.photoURL ? (
                        <img src={currentUser.photoURL} alt="User" />
                      ) : (
                        <div className="avatar-placeholder-small">
                          {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || '👤'}
                        </div>
                      )}
                    </div>
                    <span className="dropdown-arrow">▾</span>
                  </div>

                  {isProfileOpen && (
                    <div className="profile-dropdown">
                      <div className="profile-info-header">
                        <strong>{currentUser.displayName || 'Usuário'}</strong>
                        <span>{currentUser.email}</span>
                      </div>
                      <button className="dropdown-item" onClick={toggleTheme}>
                        <span className="item-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
                        {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
                      </button>
                      <button className="dropdown-item logout" onClick={handleLogout}>
                        <span className="item-icon">🚪</span>
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="navbar-guest-actions">
                  <button className="action-btn theme-toggle" onClick={toggleTheme} title="Alternar Tema">
                    {theme === 'light' ? '🌙' : '☀️'}
                  </button>
                  <button 
                    className="action-btn login-btn" 
                    onClick={() => navigate('/login')}
                    title="Entrar"
                  >
                    🔑 Entrar
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;
