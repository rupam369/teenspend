import React, { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useAuth } from '../hooks/useAuth';
import { formatINR } from '../utils/currency';
import { getGreeting } from '../utils/dateUtils';
import DashboardCard from '../components/DashboardCard';
import SpendingSuggestions from '../components/SpendingSuggestions';
import BudgetProgress from '../components/BudgetProgress';
import CategoryChart from '../components/CategoryChart';
import MonthlyTrendChart from '../components/MonthlyTrendChart';
import ExpenseTable from '../components/ExpenseTable';
import ExpenseFormModal from '../components/ExpenseFormModal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import {
  Wallet,
  TrendingDown,
  Calendar,
  Clock,
  Target,
  Flame,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();
  const { summary, summaryLoading, updateExpense, deleteExpense } = useExpenses();
  const { onOpenAddModal } = useOutletContext() || {};

  const [editingExpense, setEditingExpense] = useState(null);

  if (summaryLoading && !summary) {
    return <LoadingSpinner message="Calculating your financial summary..." />;
  }

  const totalSpent = summary?.totalSpending || 0;
  const monthSpent = summary?.monthSpending || 0;
  const todaySpent = summary?.todaySpending || 0;
  const weekSpent = summary?.weekSpending || 0;
  const monthlyBudget = summary?.monthlyBudget || 5000;
  const remainingBudget = summary?.remainingBudget ?? (monthlyBudget - monthSpent);
  const highestCat = summary?.highestCategory || { category: 'None', total: 0 };
  const dailyAverage = summary?.averageDailySpending || 0;
  const recentExpenses = summary?.recentExpenses || [];
  const suggestions = summary?.suggestions || [];
  const totalCount = summary?.totalCount || 0;

  return (
    <div>
      {/* Header Greeting Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFF' }}>
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Friend'}! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.938rem', marginTop: '4px' }}>
            Here is your spending overview and pocket money status for this month.
          </p>
        </div>

        <button
          className="btn btn-cyan"
          onClick={onOpenAddModal}
          style={{ padding: '12px 20px', fontSize: '0.95rem' }}
        >
          <PlusCircle size={18} />
          <span>Record Expense</span>
        </button>
      </div>

      {/* Smart Rule-Based Suggestions Banner */}
      <SpendingSuggestions suggestions={suggestions} onAction={onOpenAddModal} />

      {/* Primary Financial Metric Cards (6 Cards) */}
      <div className="metrics-grid">
        {/* 1. Monthly Budget */}
        <DashboardCard
          title="Monthly Budget"
          value={formatINR(monthlyBudget)}
          subtitle="Set monthly limit"
          icon={Target}
          color="#8B5CF6"
          bgColor="rgba(139, 92, 246, 0.15)"
        />

        {/* 2. Remaining Budget */}
        <DashboardCard
          title="Remaining Budget"
          value={formatINR(remainingBudget)}
          subtitle={remainingBudget >= 0 ? 'Safe to spend' : 'Over budget!'}
          icon={Wallet}
          color={remainingBudget >= 0 ? '#10B981' : '#EF4444'}
          bgColor={remainingBudget >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}
          badgeText={remainingBudget >= 0 ? 'Available' : 'Deficit'}
        />

        {/* 3. This Month Spent */}
        <DashboardCard
          title="This Month"
          value={formatINR(monthSpent)}
          subtitle={`${((monthSpent / Math.max(1, monthlyBudget)) * 100).toFixed(0)}% of limit used`}
          icon={TrendingDown}
          color="#3B82F6"
          bgColor="rgba(59, 130, 246, 0.15)"
        />

        {/* 4. Today's Spending */}
        <DashboardCard
          title="Today's Spending"
          value={formatINR(todaySpent)}
          subtitle="Logged today"
          icon={Clock}
          color="#06B6D4"
          bgColor="rgba(6, 182, 212, 0.15)"
        />

        {/* 5. This Week's Spending */}
        <DashboardCard
          title="This Week"
          value={formatINR(weekSpent)}
          subtitle="Mon - Sun"
          icon={Calendar}
          color="#F59E0B"
          bgColor="rgba(245, 158, 11, 0.15)"
        />

        {/* 6. Total All-time Spent */}
        <DashboardCard
          title="Total Spent"
          value={formatINR(totalSpent)}
          subtitle={`${totalCount} total transactions`}
          icon={Flame}
          color="#EC4899"
          bgColor="rgba(236, 72, 153, 0.15)"
        />
      </div>

      {/* Budget Progress & Key Spending Highlights Bar */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Monthly Budget Health</h3>
          <Link to="/budget" style={{ fontSize: '0.813rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
            Adjust Budget Limits →
          </Link>
        </div>

        <BudgetProgress
          title="Pocket Money Budget"
          spent={monthSpent}
          budget={monthlyBudget}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Highest Spending Category
            </span>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
              {highestCat.category !== 'None' ? `${highestCat.category} (${formatINR(highestCat.total)})` : 'None yet'}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Daily Spending Pace
            </span>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '2px' }}>
              {formatINR(dailyAverage)} / day
            </div>
          </div>
        </div>
      </div>

      {/* Dual Charts Section: Category Doughnut + Monthly Trend */}
      {totalCount > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {/* Category Chart Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Expenses by Category</h3>
              <Link to="/analytics" style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                Full Analytics →
              </Link>
            </div>
            <CategoryChart data={summary?.categoryBreakdown || []} height={260} />
          </div>

          {/* Monthly Trend Area Chart */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Monthly Spending Trend</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last 6 Months</span>
            </div>
            <MonthlyTrendChart data={summary?.monthlyTrend || []} height={260} />
          </div>
        </div>
      ) : (
        <div className="card" style={{ marginBottom: '32px' }}>
          <EmptyState
            icon="📊"
            title="Not enough data to display charts yet"
            description="Add your first few expenses like school lunch, bus ticket, or books to unlock interactive charts and trends!"
            actionText="Add Expense Now"
            onAction={onOpenAddModal}
          />
        </div>
      )}

      {/* Recent Transactions List */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Expenses</h3>
            <p style={{ fontSize: '0.813rem', color: 'var(--text-muted)' }}>Latest transactions recorded</p>
          </div>
          {recentExpenses.length > 0 && (
            <Link to="/history" className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.813rem' }}>
              View All History <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {recentExpenses.length > 0 ? (
          <ExpenseTable
            expenses={recentExpenses}
            onEdit={(exp) => setEditingExpense(exp)}
            onDelete={deleteExpense}
          />
        ) : (
          <EmptyState
            icon="💸"
            title="No expenses recorded yet"
            description="Whenever you spend pocket money on food, transit, or games, log it here."
            actionText="Record Your First Expense"
            onAction={onOpenAddModal}
          />
        )}
      </div>

      {/* Edit Expense Modal */}
      {editingExpense && (
        <ExpenseFormModal
          isOpen={!!editingExpense}
          onClose={() => setEditingExpense(null)}
          onSubmit={(data) => updateExpense(editingExpense.id, data)}
          initialData={editingExpense}
          title="Edit Expense"
        />
      )}
    </div>
  );
};

export default DashboardPage;
