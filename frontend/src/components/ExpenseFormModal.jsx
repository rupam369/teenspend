import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { CATEGORIES, PAYMENT_METHODS, CATEGORY_CONFIG } from '../utils/categoryIcons';
import { PlusCircle, Save } from 'lucide-react';

const ExpenseFormModal = ({ isOpen, onClose, onSubmit, initialData = null, title = 'Add New Expense' }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    payment_method: 'UPI',
    expense_date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        category: initialData.category || 'Food',
        payment_method: initialData.payment_method || 'UPI',
        expense_date: initialData.expense_date || new Date().toISOString().split('T')[0],
        description: initialData.description || '',
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        category: 'Food',
        payment_method: 'UPI',
        expense_date: new Date().toISOString().split('T')[0],
        description: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    const amt = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amt) || amt <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    if (!formData.expense_date) {
      newErrors.expense_date = 'Date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      onClose();
    } catch (err) {
      // Error is handled in context or parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Expense' : title}>
      <form onSubmit={handleSubmit}>
        {/* Title Input */}
        <div className="form-group">
          <label className="form-label">Expense Title *</label>
          <input
            type="text"
            name="title"
            className="form-input"
            placeholder="e.g., Mom's Birthday Gift, Movie Ticket, Cold Coffee"
            value={formData.title}
            onChange={handleChange}
            autoFocus
          />
          {errors.title && <span style={{ color: 'var(--accent-rose)', fontSize: '0.78rem' }}>{errors.title}</span>}
        </div>

        {/* Amount Input */}
        <div className="form-group">
          <label className="form-label">Amount (₹) *</label>
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--accent-cyan)',
                fontWeight: 700,
                fontSize: '1.1rem',
              }}
            >
              ₹
            </span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              name="amount"
              className="form-input"
              style={{ paddingLeft: '34px', fontSize: '1.1rem', fontWeight: 600 }}
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>
          {errors.amount && <span style={{ color: 'var(--accent-rose)', fontSize: '0.78rem' }}>{errors.amount}</span>}
        </div>

        {/* Category Visual Selector */}
        <div className="form-group">
          <label className="form-label">Category *</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {CATEGORIES.map((cat) => {
              const conf = CATEGORY_CONFIG[cat];
              const isSelected = formData.category === cat;
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setFormData((prev) => ({ ...prev, category: cat }))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? conf.bgColor : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${isSelected ? conf.color : 'var(--border-subtle)'}`,
                    color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.813rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{conf.emoji}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat}</span>
                </button>
              );
            })}
          </div>
          {errors.category && <span style={{ color: 'var(--accent-rose)', fontSize: '0.78rem' }}>{errors.category}</span>}
        </div>

        {/* Payment Method & Date (Two Column) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select
              name="payment_method"
              className="form-select"
              value={formData.payment_method}
              onChange={handleChange}
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Expense Date *</label>
            <input
              type="date"
              name="expense_date"
              className="form-input"
              value={formData.expense_date}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.expense_date && <span style={{ color: 'var(--accent-rose)', fontSize: '0.78rem' }}>{errors.expense_date}</span>}
          </div>
        </div>

        {/* Optional Description */}
        <div className="form-group">
          <label className="form-label">Description / Note (Optional)</label>
          <textarea
            name="description"
            className="form-textarea"
            rows="2"
            placeholder="Add any extra notes or where you bought it..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-cyan" disabled={isSubmitting}>
            {isSubmitting ? (
              'Saving...'
            ) : initialData ? (
              <>
                <Save size={18} /> Update Expense
              </>
            ) : (
              <>
                <PlusCircle size={18} /> Add Expense
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseFormModal;
