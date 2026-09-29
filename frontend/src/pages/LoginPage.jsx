import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { IndianRupee, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim() || !formData.password) {
      setError('Please provide both your email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back to TeenSpend!');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div className="logo-badge">
          <IndianRupee size={28} />
        </div>
        <h2>Welcome Back</h2>
        <p>Log in to access your expenses, charts, and budget.</p>
      </div>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <Mail size={18} />
            </span>
            <input
              type="email"
              name="email"
              className="form-input"
              style={{ paddingLeft: '38px' }}
              placeholder="e.g., aarav@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="form-label">Password</label>
          </div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <Lock size={18} />
            </span>
            <input
              type="password"
              name="password"
              className="form-input"
              style={{ paddingLeft: '38px' }}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '12px', padding: '13px' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing In...' : 'Sign In to TeenSpend'}
          {!isSubmitting && <LogIn size={18} />}
        </button>
      </form>

      <div className="auth-footer">
        New to TeenSpend?
        <Link to="/register">Create an account</Link>
      </div>
    </div>
  );
};

export default LoginPage;
