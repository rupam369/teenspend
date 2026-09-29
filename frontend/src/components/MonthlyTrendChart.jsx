import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatINR, formatCompactINR } from '../utils/currency';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'rgba(19, 26, 42, 0.95)',
          border: '1px solid var(--border-light)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-lg)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '1.1rem' }}>
          {formatINR(payload[0].value)}
        </div>
        <div style={{ color: 'var(--accent-cyan)', fontSize: '0.78rem', marginTop: '2px' }}>
          {payload[0].payload.count || 0} expenses
        </div>
      </div>
    );
  }
  return null;
};

const MonthlyTrendChart = ({ data = [], height = 280 }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Not enough monthly data to display trend yet.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="monthlyTrendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="var(--text-muted)"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
          />
          <YAxis
            stroke="var(--text-muted)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => formatCompactINR(val)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#6366F1"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#monthlyTrendGrad)"
            activeDot={{ r: 6, fill: '#6366F1', stroke: '#FFFFFF', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrendChart;
