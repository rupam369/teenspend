import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import ExpenseFormModal from '../components/ExpenseFormModal';
import { useExpenses } from '../hooks/useExpenses';

const getPageTitle = (pathname) => {
  switch (pathname) {
    case '/dashboard':
      return 'Dashboard Overview';
    case '/add-expense':
      return 'Record New Expense';
    case '/history':
      return 'Expense History & Filter';
    case '/analytics':
      return 'Spending Analytics & Trends';
    case '/budget':
      return 'Monthly Budget & Limits';
    case '/profile':
      return 'Profile & Settings';
    default:
      return 'TeenSpend';
  }
};

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const { addExpense } = useExpenses();
  const location = useLocation();

  const title = getPageTitle(location.pathname);

  return (
    <div className="app-layout">
      {/* Sidebar for Desktop & Drawer for Mobile */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenAddModal={() => setAddModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenAddModal={() => setAddModalOpen(true)}
          title={title}
        />

        <main className="page-container">
          <Outlet context={{ onOpenAddModal: () => setAddModalOpen(true) }} />
        </main>
      </div>

      {/* Bottom bar for mobile users */}
      <MobileNav onOpenAddModal={() => setAddModalOpen(true)} />

      {/* Global Quick Add Expense Modal */}
      <ExpenseFormModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={addExpense}
        title="Add New Expense"
      />
    </div>
  );
};

export default AppLayout;
