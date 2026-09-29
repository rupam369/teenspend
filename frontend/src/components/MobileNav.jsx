import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Plus, BarChart3, User } from 'lucide-react';

const MobileNav = ({ onOpenAddModal }) => {
  return (
    <div className="mobile-nav-bar">
      <NavLink
        to="/dashboard"
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <LayoutDashboard size={20} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/history"
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <Receipt size={20} />
        <span>History</span>
      </NavLink>

      <button
        className="mobile-add-btn"
        onClick={onOpenAddModal}
        aria-label="Add new expense"
      >
        <Plus size={24} />
      </button>

      <NavLink
        to="/analytics"
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <BarChart3 size={20} />
        <span>Analytics</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <User size={20} />
        <span>Profile</span>
      </NavLink>
    </div>
  );
};

export default MobileNav;
