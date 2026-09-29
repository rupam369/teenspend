import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../hooks/useExpenses';
import { CATEGORIES, PAYMENT_METHODS, CATEGORY_CONFIG } from '../utils/categoryIcons';
import { PlusCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';

const AddExpensePage = () => {
  const { addExpense } = useExpenses();
  const navigate = useNavigate();

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
  const [generalError, setGeneralError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Expense title is required.';
    }
    const amt = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amt) || amt <= 0) {
      newErrors.amount = 'Amount must be greater than ₹0.';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a valid category.';
    }
    if (!formData.expense_date) {
      newErrors.expense_date = 'Please provide an expense date.';
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
    setGeneralError('');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await addExpense({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      navigate('/dashboard');
    } catch (err) {
      setGeneralError(err.message || 'Failed to record expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <button
        className="btn btn-secondary"
        onClick={() => navigate(-1)}
        style={{ marginBottom: '20px', padding: '8px 14px', fontSize: '0.85rem' }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card" style={{ padding: '32px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>Record an Expense</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Keep track of what you spent. We'll automatically update your budget and charts.
          </p>
        </div>

        <ErrorMessage message={generalError} />

        <form onSubmit={handleSubmit}>
          {/* Title */}
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
            {errors.title && <span style={{ color: 'var(--accent-rose)', fontSize: '0.8rem' }}>{errors.title}</span>}
          </div>

          {/* Amount in Rupees */}
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
                  fontSize: '1.2rem',
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
                style={{ paddingLeft: '36px', fontSize: '1.2rem', fontWeight: 700 }}
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
            {errors.amount && <span style={{ color: 'var(--accent-rose)', fontSize: '0.8rem' }}>{errors.amount}</span>}
          </div>

          {/* Category Visual Grid Selector */}
          <div className="form-group">
            <label className="form-label">Category *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
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
                      gap: '8px',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? conf.bgColor : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${isSelected ? conf.color : 'var(--border-subtle)'}`,
                      color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{conf.emoji}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {cat}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.category && <span style={{ color: 'var(--accent-rose)', fontSize: '0.8rem' }}>{errors.category}</span>}
          </div>

          {/* Payment Method & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
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
              {errors.expense_date && <span style={{ color: 'var(--accent-rose)', fontSize: '0.8rem' }}>{errors.expense_date}</span>}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description / Notes (Optional)</label>
            <textarea
              name="description"
              className="form-textarea"
              rows="3"
              placeholder="e.g., Bought at the college cafeteria with Rohan"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '24px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-cyan"
              style={{ padding: '12px 28px' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Saving to TeenSpend...'
              ) : (
                <>
                  <CheckCircle2 size={18} /> Record Expense
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpensePage;
