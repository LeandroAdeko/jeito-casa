import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import SidebarIcon from './SidebarIcon';
import { TOOLS } from '../config/tools';
import '../styles/layout.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navItems = [
    { path: '/', label: 'Início', icon: '🏠' },
    ...TOOLS.map(tool => ({
      path: tool.path,
      label: tool.title,
      icon: tool.icon
    }))
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">Jeito de Casa</div>
        <div className="header-controls">
            <button className="toggle-btn" onClick={toggleSidebar}>
            {isCollapsed ? '➡️' : '⬅️'}
            </button>
        </div>
      </div>
      <nav>
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
              >
                <SidebarIcon icon={item.icon} label={item.label} isCollapsed={isCollapsed} />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button className="toggle-btn theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
