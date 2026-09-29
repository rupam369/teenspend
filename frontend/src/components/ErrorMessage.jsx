import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="auth-error-banner" style={{ margin: '16px 0', width: '100%' }}>
      <AlertCircle size={20} />
      <span style={{ flex: 1 }}>{message}</span>
      {onRetry && (
        <button
          className="btn btn-secondary"
          onClick={onRetry}
          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
