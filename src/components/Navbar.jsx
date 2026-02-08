import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SidebarIcon from './SidebarIcon';
import { TOOLS } from '../config/tools';
import { useAuth } from '../contexts/AuthContext';

const MobileOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;
  backdrop-filter: blur(2px);
`;

const Header = styled.header`
  background-color: var(--sidebar-bg);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 60px;
  display: flex;
  align-items: center;
`;

const NavContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
  color: var(--text-color);
  white-space: nowrap;
  cursor: pointer;

  @media (max-width: 1024px) {
    font-size: 1rem;
  }
`;

const MobileMenuBtn = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.4rem;
  color: var(--text-color);
  cursor: pointer;
  z-index: 1002;

  @media (max-width: 850px) {
    display: block;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 15px;

  @media (max-width: 850px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background-color: var(--card-bg);
    flex-direction: column;
    padding: 15px;
    border-bottom: 1px solid var(--border-color);
    box-shadow: var(--shadow);
    gap: 12px;
    align-items: flex-start;
  }
`;

const NavList = styled.ul`
  display: flex;
  gap: 2px;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: 850px) {
    flex-direction: column;
    width: 100%;
  }
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.2s;
  color: var(--text-color);
  font-size: 0.9rem;
  text-decoration: none;

  &:hover, &.active {
    background-color: var(--primary-color);
    color: #ffffff;
  }

  @media (max-width: 1024px) {
    font-size: 0.85rem;
    padding: 6px 8px;
  }

  @media (max-width: 850px) {
    width: 100%;
    padding: 10px 12px;
    font-size: 1rem;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 15px;

  @media (max-width: 850px) {
    margin-left: 0;
    padding-top: 12px;
    border-top: 1px solid var(--border-color);
    width: 100%;
    justify-content: space-between;
  }
`;

const UserWrapper = styled.div`
  position: relative;
  @media (max-width: 850px) {
    width: 100%;
  }
`;

const ProfileTrigger = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: ${props => props.active ? 'var(--hover-bg)' : 'transparent'};

  &:hover {
    background-color: var(--hover-bg);
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--primary-color);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: var(--shadow);
  width: 220px;
  padding: 8px 0;
  z-index: 1001;

  @media (max-width: 850px) {
    right: auto;
    left: 0;
    top: auto;
    bottom: calc(100% + 10px);
    width: 100%;
    box-shadow: 0 -4px 12px rgba(0,0,0,0.1);
  }
`;

const DropdownHeader = styled.div`
  padding: 8px 16px 12px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;

  strong {
    font-size: 0.95rem;
    color: var(--text-color);
  }

  span {
    font-size: 0.8rem;
    color: var(--text-secondary);
  }
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 0.9rem;
  cursor: pointer;
  text-align: left;

  &:hover {
    background-color: var(--hover-bg);
  }

  &.logout {
    color: #ff4d4f;
    border-top: 1px solid var(--border-color);
    margin-top: 4px;
  }
`;

const ActionBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  border-radius: 4px;
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  gap: 4px;

  &:hover {
    background-color: var(--hover-bg);
  }
`;

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
      {isMenuOpen && <MobileOverlay onClick={() => setIsMenuOpen(false)} />}
      <Header>
        <NavContainer>
          <Logo onClick={() => { navigate('/'); setIsMenuOpen(false); }}>
            Jeito de Casa
          </Logo>

          <MobileMenuBtn onClick={toggleMenu}>
            {isMenuOpen ? '✕' : '☰'}
          </MobileMenuBtn>

          <NavLinks isOpen={isMenuOpen}>
            <NavList>
              {navItems.map((item) => (
                <li key={item.path} onClick={() => setIsMenuOpen(false)} style={{ listStyle: 'none' }}>
                  <StyledNavLink
                    to={item.path}
                    className={({ isActive }) => isActive ? 'active' : ''}
                  >
                    <SidebarIcon icon={item.icon} label={item.label} isCollapsed={false} />
                  </StyledNavLink>
                </li>
              ))}
            </NavList>

            <Actions>
              {currentUser ? (
                <UserWrapper ref={profileRef}>
                  <ProfileTrigger 
                    active={isProfileOpen}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <Avatar>
                      {currentUser.photoURL ? (
                        <img src={currentUser.photoURL} alt="User" />
                      ) : (
                        <AvatarPlaceholder>
                          {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || '👤'}
                        </AvatarPlaceholder>
                      )}
                    </Avatar>
                    <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>▾</span>
                  </ProfileTrigger>

                  {isProfileOpen && (
                    <Dropdown>
                      <DropdownHeader>
                        <strong>{currentUser.displayName || 'Usuário'}</strong>
                        <span>{currentUser.email}</span>
                      </DropdownHeader>
                      <DropdownItem onClick={toggleTheme}>
                        <span>{theme === 'light' ? '🌙' : '☀️'}</span>
                        {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
                      </DropdownItem>
                      <DropdownItem className="logout" onClick={handleLogout}>
                        <span>🚪</span>
                        Sair
                      </DropdownItem>
                    </Dropdown>
                  )}
                </UserWrapper>
              ) : (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <ActionBtn onClick={toggleTheme} title="Alternar Tema">
                    {theme === 'light' ? '🌙' : '☀️'}
                  </ActionBtn>
                  <ActionBtn 
                    onClick={() => navigate('/login')}
                    title="Entrar"
                    style={{ fontWeight: 600 }}
                  >
                    🔑 Entrar
                  </ActionBtn>
                </div>
              )}
            </Actions>
          </NavLinks>
        </NavContainer>
      </Header>
    </>
  );
};

export default Navbar;
