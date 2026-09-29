import React from 'react';
import { Link } from 'react-router-dom';
import {
  IndianRupee,
  PieChart,
  Target,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      {/* Top Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 32px',
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="logo-badge">
            <IndianRupee size={22} />
          </div>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFF' }}>
            TeenSpend
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-cyan">
              Open Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-pill">
          <Sparkles size={14} /> Built Specially For Teenagers & Students
        </div>

        <h1 className="landing-title">
          Master Your Pocket Money With <span className="text-gradient">TeenSpend</span>
        </h1>

        <p className="landing-subtitle">
          Say goodbye to asking <em>"Where did all my money go?"</em> at the end of the month.
          Track expenses, set budgets, view colorful spending charts, and get practical smart tips.
        </p>

        <div className="landing-cta-group">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-cyan" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
              Go to Your Dashboard <ArrowRight size={20} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-cyan" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
                Start Tracking Free <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
                Existing User? Sign In
              </Link>
            </>
          )}
        </div>

        {/* Hero Visual Sneak Peek Card */}
        <div
          className="card"
          style={{
            maxWidth: '750px',
            width: '100%',
            padding: '28px',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            boxShadow: '0 20px 60px rgba(99, 102, 241, 0.2)',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Monthly Pocket Money Budget
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>
                ₹5,000.00
              </div>
            </div>
            <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)' }}>
              On Track (62% Left)
            </span>
          </div>

          {/* Quick Mock Progress */}
          <div className="progress-container" style={{ height: '10px' }}>
            <div className="progress-bar normal" style={{ width: '38%' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--accent-cyan)' }}>Spent: ₹1,900</span>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>Remaining: ₹3,100</span>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon-badge">
            <IndianRupee size={24} />
          </div>
          <h3>Daily Expense Tracking</h3>
          <p>
            Quickly log street snacks, bus recharges, school supplies, or gaming passes in seconds with payment method tags (UPI, Cash, Card).
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-badge" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
            <PieChart size={24} />
          </div>
          <h3>Graphical Spending Analytics</h3>
          <p>
            Understand spending patterns through dynamic category doughnut charts, monthly trends, and daily comparison bars.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
            <Target size={24} />
          </div>
          <h3>Smart Monthly Budgets</h3>
          <p>
            Set your monthly pocket money limit and category goals. Get visual alerts before you overspend.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
            <Sparkles size={24} />
          </div>
          <h3>Teen-Friendly Money Tips</h3>
          <p>
            Rule-based suggestions based on your actual spending habits: tips to save on snacks, prevent impulse shopping, and build savings.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-badge" style={{ background: 'rgba(236, 72, 153, 0.15)', color: 'var(--accent-rose)' }}>
            <TrendingUp size={24} />
          </div>
          <h3>Deep Search & Filtering</h3>
          <p>
            Filter expenses by category, payment method, date range, or amount. Export your financial records cleanly.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--brand-secondary)' }}>
            <ShieldCheck size={24} />
          </div>
          <h3>Private & Secure</h3>
          <p>
            Bcrypt password hashing, secure JWT tokens, and isolated database records. Your financial data is strictly yours.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '30px 24px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
        }}
      >
        <p>© 2026 TeenSpend. Built for the next generation of smart spenders.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
