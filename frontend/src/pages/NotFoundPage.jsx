import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '32px',
        backgroundColor: 'var(--bg-main)',
      }}
    >
      <div
        style={{
          fontSize: '6rem',
          fontWeight: 900,
          background: 'var(--grad-brand)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
          marginBottom: '16px',
        }}
      >
        404
      </div>

      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFF', marginBottom: '12px' }}>
        Page Not Found
      </h1>

      <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', marginBottom: '28px' }}>
        The page you are looking for doesn't exist or has moved. Let's get you back on track to managing your expenses!
      </p>

      <div style={{ display: 'flex', gap: '14px' }}>
        <Link to="/dashboard" className="btn btn-primary">
          <Home size={18} /> Back to Dashboard
        </Link>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={18} /> Home Page
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
