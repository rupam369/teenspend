import React, { useState, useEffect } from 'react';
import { budgetService } from '../services/budgetService';
import { useToast } from '../hooks/useToast';
import { useExpenses } from '../hooks/useExpenses';
import BudgetProgress from '../components/BudgetProgress';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatINR } from '../utils/currency';
import { CATEGORIES, getCategoryConfig } from '../utils/categoryIcons';
import { Target, Save, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const BudgetPage = () => {
  const toast = useToast();
  const { fetchSummary } = useExpenses();

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [budgetStatus, setBudgetStatus] = useState(null);

  const [monthlyBudgetInput, setMonthlyBudgetInput] = useState('5000');
  const [categoryBudgetsInput, setCategoryBudgetsInput] = useState({
    Food: '1500',
    Entertainment: '800',
    Transport: '700',
    Shopping: '1000',
    Education: '500',
    Other: '500',
  });

  const loadBudgetData = async () => {
    setLoading(true);
    try {
      const statusData = await budgetService.getStatus();
      setBudgetStatus(statusData);
      setMonthlyBudgetInput(String(statusData.monthly_budget || '5000'));

      const initialCatBudgets = {};
      CATEGORIES.forEach((c) => {
        const found = (statusData.category_status || []).find((s) => s.category === c);
        initialCatBudgets[c] = found && found.budget > 0 ? String(found.budget) : '';
      });
      setCategoryBudgetsInput((prev) => ({ ...prev, ...initialCatBudgets }));
    } catch (err) {
      console.error('Failed to load budget data:', err);
      toast.error('Failed to load budget limits.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgetData();
  }, []);

  const handleCategoryBudgetChange = (cat, val) => {
    setCategoryBudgetsInput((prev) => ({
      ...prev,
      [cat]: val,
    }));
  };

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    const parsedTotal = parseFloat(monthlyBudgetInput);
    if (isNaN(parsedTotal) || parsedTotal <= 0) {
      toast.error('Please enter a valid monthly budget limit (> ₹0)');
      return;
    }

    setIsSaving(true);
    try {
      const cleanCategories = {};
      Object.entries(categoryBudgetsInput).forEach(([cat, val]) => {
        const num = parseFloat(val);
        if (!isNaN(num) && num > 0) {
          cleanCategories[cat] = num;
        }
      });

      await budgetService.saveBudget({
        monthly_budget: parsedTotal,
        category_budgets: cleanCategories,
      });

      toast.success('Budget saved successfully! 🎯');
      await Promise.all([loadBudgetData(), fetchSummary()]);
    } catch (err) {
      toast.error(err.message || 'Failed to save budget.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your budget metrics..." />;
  }

  const monthlyBudget = budgetStatus?.monthly_budget || 5000;
  const totalSpent = budgetStatus?.total_spent || 0;
  const remaining = budgetStatus?.remaining_budget ?? (monthlyBudget - totalSpent);
  const percentage = budgetStatus?.percentage_used || 0;
  const categoryStatus = budgetStatus?.category_status || [];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#FFF' }}>
          Monthly Budget & Spending Limits
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Take control of your pocket money. Set limits, track real-time progress, and avoid going broke.
        </p>
      </div>

      {/* Main Budget Health Card */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="metric-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--brand-primary)' }}>
              <Target size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Overall Monthly Budget</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {budgetStatus?.month || 'Current Month'}
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Remaining Pocket Money
            </span>
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: remaining >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)',
              }}
            >
              {formatINR(remaining)}
            </div>
          </div>
        </div>

        <BudgetProgress
          title="Total Monthly Spend"
          spent={totalSpent}
          budget={monthlyBudget}
        />
      </div>

      {/* Budget Settings Form */}
      <form onSubmit={handleSaveBudget} className="card" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Adjust Your Budget Targets</h3>
            <p style={{ fontSize: '0.813rem', color: 'var(--text-muted)' }}>
              Enter your total monthly allowance and optional category-specific caps.
            </p>
          </div>

          <button type="submit" className="btn btn-cyan" disabled={isSaving}>
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Total Monthly Limit */}
        <div className="form-group" style={{ maxWidth: '360px', marginBottom: '28px' }}>
          <label className="form-label">Total Monthly Budget Limit (₹) *</label>
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
              min="1"
              step="50"
              className="form-input"
              style={{ paddingLeft: '34px', fontSize: '1.1rem', fontWeight: 700 }}
              value={monthlyBudgetInput}
              onChange={(e) => setMonthlyBudgetInput(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Category Budget Inputs */}
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Optional Category Limits (₹)
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {CATEGORIES.map((cat) => {
            const conf = getCategoryConfig(cat);
            return (
              <div
                key={cat}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <span style={{ fontSize: '1.3rem' }}>{conf.emoji}</span>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {cat}
                  </label>
                  <div style={{ position: 'relative', marginTop: '4px' }}>
                    <span
                      style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                        fontSize: '0.85rem',
                      }}
                    >
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      className="form-input"
                      style={{ padding: '6px 10px 6px 26px', fontSize: '0.85rem' }}
                      placeholder="e.g. 1500"
                      value={categoryBudgetsInput[cat] || ''}
                      onChange={(e) => handleCategoryBudgetChange(cat, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </form>

      {/* Category Progress Bars Overview */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>
          Category Spending vs Targets
        </h3>

        {categoryStatus.length > 0 ? (
          <div>
            {categoryStatus.map((cs) => {
              const conf = getCategoryConfig(cs.category);
              return (
                <div key={cs.category} style={{ marginBottom: '16px' }}>
                  <BudgetProgress
                    title={`${conf.emoji} ${cs.category}`}
                    spent={cs.spent}
                    budget={cs.budget}
                    category={cs.category}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No category spending recorded yet this month.
          </p>
        )}
      </div>
    </div>
  );
};

export default BudgetPage;
