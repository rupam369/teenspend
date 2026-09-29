import React from 'react';
import { PlusCircle } from 'lucide-react';

const EmptyState = ({
  icon = '💸',
  title = 'No expenses yet',
  description = 'Start by adding your first expense to see spending analytics and smart money tips!',
  actionText,
  onAction,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {typeof icon === 'string' ? icon : icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionText && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          <PlusCircle size={18} />
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
