import React from 'react';
import { formatINR } from '../utils/currency';

const BudgetProgress = ({
  title = 'Monthly Budget',
  spent = 0,
  budget = 5000,
  showAmounts = true,
  category = null,
}) => {
  const percentage = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
  const rawPercentage = budget > 0 ? (spent / budget) * 100 : 0;
  const remaining = budget - spent;

  let statusClass = 'normal';
  if (rawPercentage >= 100) {
    statusClass = 'danger';
  } else if (rawPercentage >= 80) {
    statusClass = 'warning';
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {title}
          </span>
          {rawPercentage >= 100 && (
            <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--accent-rose)', fontSize: '0.688rem' }}>
              Exceeded
            </span>
          )}
          {rawPercentage >= 80 && rawPercentage < 100 && (
            <span className="badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-amber)', fontSize: '0.688rem' }}>
              Near Limit
            </span>
          )}
        </div>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: statusClass === 'danger' ? 'var(--accent-rose)' : statusClass === 'warning' ? 'var(--accent-amber)' : 'var(--accent-cyan)' }}>
          {rawPercentage.toFixed(0)}%
        </span>
      </div>

      <div className="progress-container">
        <div
          className={`progress-bar ${statusClass}`}
          style={{ width: `${Math.min(100, rawPercentage)}%` }}
        />
      </div>

      {showAmounts && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span>Spent: {formatINR(spent)}</span>
          <span>
            {remaining >= 0 ? `Left: ${formatINR(remaining)}` : `Over by: ${formatINR(Math.abs(remaining))}`}
          </span>
          <span>Limit: {formatINR(budget)}</span>
        </div>
      )}
    </div>
  );
};

export default BudgetProgress;
