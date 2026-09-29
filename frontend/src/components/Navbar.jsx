import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { PlusCircle, Menu, LogOut, User, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onOpenSidebar, onOpenAddModal, title = 'Dashboard' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-navbar">
      <div className="nav-left">
        <button
          className="btn-icon mobile-menu-btn"
          onClick={onOpenSidebar}
          aria-label="Open navigation menu"
          style={{ display: 'none' }}
        >
          <Menu size={20} />
        </button>
        <div className="nav-title-group">
          <h2>{title}</h2>
          <p>TeenSpend • Real-time Expense Tracking</p>
        </div>
      </div>

      <div className="nav-right">
        <button
          className="btn btn-cyan"
          onClick={onOpenAddModal}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <PlusCircle size={16} />
          <span>Add Expense</span>
        </button>

        {/* Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            className="user-profile-menu"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            role="button"
            tabIndex={0}
          >
            <img
              src={user?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name || 'teen'}`}
              alt={user?.name || 'User avatar'}
              className="user-avatar"
            />
            <div className="user-info-text">
              <span className="user-name">{user?.name || 'Teen'}</span>
              <span className="user-role">Smart Saver</span>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </div>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: '200px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-lg)',
                padding: '8px',
                zIndex: 100,
              }}
            >
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/profile');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.875rem',
                  color: 'var(--text-main)',
                  textAlign: 'left',
                }}
                className="card-hover"
              >
                <User size={16} />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  handleLogout();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.875rem',
                  color: 'var(--accent-rose)',
                  textAlign: 'left',
                  marginTop: '4px',
                  borderTop: '1px solid var(--border-subtle)',
                }}
                className="card-hover"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
