import React, { useState } from 'react';
import { getCategoryConfig } from '../utils/categoryIcons';
import { formatINR } from '../utils/currency';
import { formatDate, getRelativeDateLabel } from '../utils/dateUtils';
import { Edit2, Trash2, CreditCard, Banknote, Smartphone } from 'lucide-react';
import Modal from './Modal';

const ExpenseTable = ({ expenses = [], onEdit, onDelete }) => {
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteId);
      setDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const getPaymentIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'upi':
        return <Smartphone size={14} color="#06B6D4" />;
      case 'card':
        return <CreditCard size={14} color="#8B5CF6" />;
      case 'cash':
        return <Banknote size={14} color="#10B981" />;
      default:
        return <span style={{ fontSize: '0.8rem' }}>💳</span>;
    }
  };

  if (expenses.length === 0) {
    return null;
  }

  return (
    <>
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Expense</th>
              <th>Category</th>
              <th>Payment</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => {
              const conf = getCategoryConfig(expense.category);
              return (
                <tr key={expense.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      {getRelativeDateLabel(expense.expense_date)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {formatDate(expense.expense_date)}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{expense.title}</div>
                    {expense.description && (
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          maxWidth: '280px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {expense.description}
                      </div>
                    )}
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: conf.bgColor,
                        color: conf.color,
                        borderColor: conf.borderColor,
                        border: '1px solid',
                      }}
                    >
                      <span>{conf.emoji}</span>
                      <span>{expense.category}</span>
                    </span>
                  </td>
                  <td>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.813rem',
                        color: 'var(--text-secondary)',
                        background: 'rgba(255, 255, 255, 0.04)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-pill)',
                      }}
                    >
                      {getPaymentIcon(expense.payment_method)}
                      <span>{expense.payment_method}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="table-amount" style={{ color: '#FFFFFF' }}>
                      {formatINR(expense.amount)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        className="btn-icon"
                        onClick={() => onEdit(expense)}
                        title="Edit expense"
                        aria-label="Edit expense"
                      >
                        <Edit2 size={16} color="var(--accent-cyan)" />
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => setDeleteId(expense.id)}
                        title="Delete expense"
                        aria-label="Delete expense"
                      >
                        <Trash2 size={16} color="var(--accent-rose)" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Expense"
        maxWidth="420px"
      >
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.95rem' }}>
          Are you sure you want to delete this expense record? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setDeleteId(null)}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Expense'}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ExpenseTable;
