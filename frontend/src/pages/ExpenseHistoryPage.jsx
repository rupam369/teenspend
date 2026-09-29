import React, { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import ExpenseTable from '../components/ExpenseTable';
import ExpenseFormModal from '../components/ExpenseFormModal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { CATEGORIES, PAYMENT_METHODS } from '../utils/categoryIcons';
import { formatINR } from '../utils/currency';
import {
  Search,
  Filter,
  Download,
  RotateCcw,
  PlusCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const ExpenseHistoryPage = () => {
  const { expenses, loading, filters, updateFilters, resetFilters, updateExpense, deleteExpense } =
    useExpenses();
  const { onOpenAddModal } = useOutletContext() || {};

  const [editingExpense, setEditingExpense] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Total amount matching current filters
  const totalFilteredAmount = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const handleSearchChange = (e) => {
    updateFilters({ search: e.target.value });
  };

  const handleCategoryChange = (e) => {
    updateFilters({ category: e.target.value });
  };

  const handlePaymentChange = (e) => {
    updateFilters({ payment_method: e.target.value });
  };

  const handleSortChange = (e) => {
    updateFilters({ sortBy: e.target.value });
  };

  const exportToCSV = () => {
    if (expenses.length === 0) return;

    const headers = ['Date', 'Title', 'Category', 'Payment Method', 'Amount (INR)', 'Description'];
    const rows = expenses.map((e) => [
      `"${e.expense_date}"`,
      `"${e.title.replace(/"/g, '""')}"`,
      `"${e.category}"`,
      `"${e.payment_method}"`,
      e.amount,
      `"${(e.description || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `teenspend_expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>Expense History</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Filter, search, review, and export all your recorded expenses.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="btn btn-secondary"
            onClick={exportToCSV}
            disabled={expenses.length === 0}
            title="Download CSV spreadsheet"
          >
            <Download size={16} /> Export CSV
          </button>
          <button className="btn btn-cyan" onClick={onOpenAddModal}>
            <PlusCircle size={16} /> Add Expense
          </button>
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="card" style={{ marginBottom: '24px', padding: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          {/* Text Search */}
          <div className="search-box">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="form-input"
              placeholder="Search expenses by title or note..."
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>

          {/* Category Dropdown */}
          <div style={{ minWidth: '150px' }}>
            <select className="form-select" value={filters.category} onChange={handleCategoryChange}>
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div style={{ minWidth: '170px' }}>
            <select className="form-select" value={filters.sortBy} onChange={handleSortChange}>
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>

          {/* Toggle More Filters */}
          <button
            className={`btn ${showAdvancedFilters ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            style={{ padding: '10px 14px' }}
          >
            <SlidersHorizontal size={16} /> Filters
          </button>

          {/* Reset Filters */}
          <button
            className="btn btn-secondary"
            onClick={resetFilters}
            title="Reset all filters"
            style={{ padding: '10px 14px' }}
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Collapsible Advanced Filters */}
        {showAdvancedFilters && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '14px',
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Payment Method</label>
              <select className="form-select" value={filters.payment_method} onChange={handlePaymentChange}>
                <option value="All">All Methods</option>
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>From Date</label>
              <input
                type="date"
                className="form-input"
                value={filters.startDate}
                onChange={(e) => updateFilters({ startDate: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>To Date</label>
              <input
                type="date"
                className="form-input"
                value={filters.endDate}
                onChange={(e) => updateFilters({ endDate: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Min Amount (₹)</label>
              <input
                type="number"
                placeholder="Min ₹"
                className="form-input"
                value={filters.minAmount}
                onChange={(e) => updateFilters({ minAmount: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Max Amount (₹)</label>
              <input
                type="number"
                placeholder="Max ₹"
                className="form-input"
                value={filters.maxAmount}
                onChange={(e) => updateFilters({ maxAmount: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Filter Results Summary Card */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          padding: '0 4px',
        }}
      >
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Showing <strong>{expenses.length}</strong> record{expenses.length === 1 ? '' : 's'}
        </span>
        <span style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 700 }}>
          Total Filtered Spend: <span style={{ color: 'var(--accent-cyan)' }}>{formatINR(totalFilteredAmount)}</span>
        </span>
      </div>

      {/* Expense List Table Card */}
      <div className="card">
        {loading ? (
          <LoadingSpinner message="Filtering your expense records..." />
        ) : expenses.length > 0 ? (
          <ExpenseTable
            expenses={expenses}
            onEdit={(exp) => setEditingExpense(exp)}
            onDelete={deleteExpense}
          />
        ) : (
          <EmptyState
            icon="🔍"
            title="No matching expenses found"
            description="Try changing your search keywords or resetting your filter criteria."
            actionText="Reset All Filters"
            onAction={resetFilters}
          />
        )}
      </div>

      {/* Edit Expense Modal */}
      {editingExpense && (
        <ExpenseFormModal
          isOpen={!!editingExpense}
          onClose={() => setEditingExpense(null)}
          onSubmit={(data) => updateExpense(editingExpense.id, data)}
          initialData={editingExpense}
          title="Edit Expense"
        />
      )}
    </div>
  );
};

export default ExpenseHistoryPage;
