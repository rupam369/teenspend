import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { IndianRupee, User, Mail, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-check.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(formData);
      toast.success('Account created! Welcome to TeenSpend 🎉');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
        <h2>Create TeenSpend Account</h2>
        <p>Start tracking your expenses and mastering your money today.</p>
      </div>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <User size={18} />
            </span>
            <input
              type="text"
              name="name"
              className="form-input"
              style={{ paddingLeft: '38px' }}
              placeholder="e.g., Aarav Sharma"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>
        </div>

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
          <label className="form-label">Password (Min. 6 chars)</label>
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
              autoComplete="new-password"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={18} />
            </span>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              style={{ paddingLeft: '38px' }}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '8px', padding: '13px' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating your account...' : 'Create Free Account'}
          {!isSubmitting && <ArrowRight size={18} />}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account?
        <Link to="/login">Sign In here</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
