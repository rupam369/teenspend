import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Receipt,
  BarChart3,
  Target,
  User,
  LogOut,
  IndianRupee,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useExpenses } from '../hooks/useExpenses';
import { formatINR } from '../utils/currency';

const Sidebar = ({ isOpen, onClose, onOpenAddModal }) => {
  const { logout } = useAuth();
  const { summary } = useExpenses();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Add Expense', path: '/add-expense', icon: PlusCircle },
    { label: 'Expense History', path: '/history', icon: Receipt },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Monthly Budget', path: '/budget', icon: Target },
    { label: 'Profile Settings', path: '/profile', icon: User },
  ];

  const monthlyBudget = summary?.monthlyBudget || 5000;
  const monthSpending = summary?.monthSpending || 0;
  const remaining = summary?.remainingBudget ?? (monthlyBudget - monthSpending);
  const percentUsed = monthlyBudget > 0 ? Math.min(100, Math.round((monthSpending / monthlyBudget) * 100)) : 0;

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-badge">
          <IndianRupee size={22} />
        </div>
        <div className="logo-text" style={{ flex: 1 }}>
          <h1>TeenSpend</h1>
          <p>Smart Money</p>
        </div>
        <button
          className="btn-icon mobile-close-btn"
          onClick={onClose}
          style={{ display: isOpen ? 'flex' : 'none' }}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Quick Monthly Budget Widget in Sidebar */}
      <div className="sidebar-footer">
        <div className="sidebar-budget-widget">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <span>Monthly Budget</span>
            <span style={{ color: percentUsed >= 80 ? 'var(--accent-amber)' : 'var(--accent-cyan)', fontWeight: 700 }}>
              {percentUsed}%
            </span>
          </div>
          <div className="progress-container" style={{ height: '6px' }}>
            <div
              className={`progress-bar ${percentUsed >= 100 ? 'danger' : percentUsed >= 80 ? 'warning' : 'normal'}`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '6px' }}>
            <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{formatINR(monthSpending)}</span>
            <span style={{ color: 'var(--text-muted)' }}>{formatINR(monthlyBudget)}</span>
          </div>
        </div>

        <button
          className="btn btn-secondary"
          onClick={handleLogout}
          style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--accent-rose)', padding: '10px 14px' }}
        >
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
