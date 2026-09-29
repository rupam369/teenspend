import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import CategoryChart from '../components/CategoryChart';
import MonthlyTrendChart from '../components/MonthlyTrendChart';
import CategoryComparisonChart from '../components/CategoryComparisonChart';
import DailySpendingChart from '../components/DailySpendingChart';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { formatINR } from '../utils/currency';
import { getCategoryConfig } from '../utils/categoryIcons';
import { BarChart3, PieChart, TrendingUp, Calendar, Sparkles } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const AnalyticsPage = () => {
  const { onOpenAddModal } = useOutletContext() || {};

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [categoryComparison, setCategoryComparison] = useState([]);

  const [dailyDays, setDailyDays] = useState('14');

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [sum, catRes, monthRes, dailyRes, compRes] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.getCategory(),
        analyticsService.getMonthly(),
        analyticsService.getDaily({ days: dailyDays }),
        analyticsService.getComparison(),
      ]);

      setSummary(sum);
      setCategoryData(catRes.categories || []);
      setMonthlyTrend(monthRes || []);
      setDailyData(dailyRes || []);
      setCategoryComparison(compRes || []);
    } catch (err) {
      console.error('Error loading analytics:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dailyDays]);

  if (loading) {
    return <LoadingSpinner message="Generating real-time visual analytics..." />;
  }

  const hasData = summary && summary.totalCount > 0;

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#FFF' }}>
          Graphical Analytics & Spending Patterns
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Interactive visualizations generated dynamically from your database records.
        </p>
      </div>

      {!hasData ? (
        <div className="card">
          <EmptyState
            icon="📈"
            title="Not enough data to display analytics"
            description="Start recording your daily expenses to unlock charts, patterns, and spending breakdowns."
            actionText="Record First Expense"
            onAction={onOpenAddModal}
          />
        </div>
      ) : (
        <>
          {/* Top Analytics Summary Snippet */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              marginBottom: '28px',
            }}
          >
            <div className="card" style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                All-Time Spending
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF', marginTop: '6px' }}>
                {formatINR(summary.totalSpending)}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>
                Across {summary.totalCount} transactions
              </span>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Top Expense Category
              </span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '6px' }}>
                {summary.highestCategory?.category || 'None'}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {formatINR(summary.highestCategory?.total || 0)} spent
              </span>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Average Daily Spend
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '6px' }}>
                {formatINR(summary.averageDailySpending)}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Per day this month</span>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                This Month Spent
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-primary)', marginTop: '6px' }}>
                {formatINR(summary.monthSpending)}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {summary.percentageUsed}% of monthly limit
              </span>
            </div>
          </div>

          {/* Grid of 4 Major Required Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
            {/* Chart 1: Expense by Category (Doughnut) */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <PieChart size={20} color="var(--brand-primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Chart 1: Expense by Category</h3>
              </div>
              <CategoryChart data={categoryData} height={300} />

              {/* Category Breakdown Table Mini */}
              <div style={{ marginTop: '16px', maxHeight: '160px', overflowY: 'auto' }}>
                {categoryData.map((c) => {
                  const conf = getCategoryConfig(c.category);
                  return (
                    <div
                      key={c.category}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        borderBottom: '1px solid var(--border-subtle)',
                        fontSize: '0.85rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{conf.emoji}</span>
                        <span style={{ fontWeight: 600 }}>{c.category}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700 }}>{formatINR(c.total)}</span>
                        <span style={{ color: 'var(--text-muted)', width: '38px', textAlign: 'right' }}>
                          {c.percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart 2: Monthly Spending Trend (Area/Line) */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <TrendingUp size={20} color="#6366F1" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Chart 2: Monthly Spending Trend</h3>
              </div>
              <MonthlyTrendChart data={monthlyTrend} height={320} />
            </div>

            {/* Chart 3: Category Comparison (Bar Chart) */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <BarChart3 size={20} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Chart 3: Category Comparison</h3>
              </div>
              <CategoryComparisonChart data={categoryData} height={300} />
            </div>

            {/* Chart 4: Daily Spending (Bar Chart) */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={20} color="var(--accent-emerald)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Chart 4: Daily Spending</h3>
                </div>

                <select
                  className="form-select"
                  value={dailyDays}
                  onChange={(e) => setDailyDays(e.target.value)}
                  style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  <option value="7">Last 7 Days</option>
                  <option value="14">Last 14 Days</option>
                  <option value="30">Last 30 Days</option>
                </select>
              </div>
              <DailySpendingChart data={dailyData} height={300} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
