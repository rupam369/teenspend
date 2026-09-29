import React from 'react';
import { Sparkles, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const SpendingSuggestions = ({ suggestions = [], onAction }) => {
  if (!suggestions || suggestions.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'danger':
        return <AlertTriangle size={20} color="var(--accent-rose)" />;
      case 'warning':
        return <AlertTriangle size={20} color="var(--accent-amber)" />;
      case 'success':
        return <CheckCircle size={20} color="var(--accent-emerald)" />;
      default:
        return <Info size={20} color="var(--accent-cyan)" />;
    }
  };

  return (
    <div className="suggestion-banner">
      <div className="suggestion-header">
        <h3>
          <Sparkles size={20} color="var(--brand-primary)" />
          Smart Money Insights for You
        </h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          Rule-based Smart Assistant
        </span>
      </div>

      <div className="suggestion-cards">
        {suggestions.map((item) => (
          <div key={item.id} className={`suggestion-item ${item.type || 'info'}`}>
            <div style={{ flexShrink: 0, marginTop: '2px' }}>{getIcon(item.type)}</div>
            <div className="suggestion-content" style={{ flex: 1 }}>
              <h4>{item.title}</h4>
              <p>{item.message}</p>
              {item.actionText && onAction && (
                <button
                  className="btn btn-secondary"
                  onClick={onAction}
                  style={{ marginTop: '10px', padding: '6px 12px', fontSize: '0.78rem' }}
                >
                  {item.actionText}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpendingSuggestions;
