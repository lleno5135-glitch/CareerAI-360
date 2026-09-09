import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './Layout.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, sidebarOpen, setSidebarOpen } = useTheme();

  return (
    <nav className={`navbar ${theme}`}>
      <div className="navbar-brand">
        <button className="toggle-sidebar" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
        <h2>CareerAI 360</h2>
      </div>

      <div className="navbar-center">
        <a href="/">Home</a>
        <a href="/courses">Courses</a>
        <a href="/dashboard">Dashboard</a>
      </div>

      <div className="navbar-right">
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        {user ? (
          <div className="user-menu">
            <span>{user.firstName}</span>
            <button onClick={logout} className="btn-logout">Logout</button>
          </div>
        ) : (
          <a href="/login" className="btn-login">Login</a>
        )}
      </div>
    </nav>
  );
};

const Sidebar = ({ isOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <ul className="sidebar-menu">
        <li><a href="/">Dashboard</a></li>
        <li><a href="/courses">Explore Courses</a></li>
        <li><a href="/my-challenges">My Challenges</a></li>
        <li><a href="/resume">Resume Builder</a></li>
        <li><a href="/interview">Interview Practice</a></li>
        <li><a href="/profile">My Profile</a></li>
      </ul>
    </aside>
  );
};

const Layout = ({ children }) => {
  const { sidebarOpen } = useTheme();
  const { theme } = useTheme();

  return (
    <div className={`layout ${theme}`}>
      <Navbar />
      <div className="layout-body">
        <Sidebar isOpen={sidebarOpen} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
