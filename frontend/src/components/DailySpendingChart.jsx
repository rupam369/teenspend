import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatINR, formatCompactINR } from '../utils/currency';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
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
          {label} ({item.date})
        </div>
        <div style={{ color: 'var(--accent-cyan)', fontWeight: 800, fontSize: '1.05rem' }}>
          {formatINR(payload[0].value)}
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
          {item.count || 0} transaction{item.count === 1 ? '' : 's'}
        </div>
      </div>
    );
  }
  return null;
};

const DailySpendingChart = ({ data = [], height = 280 }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Not enough daily records to display chart yet.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="var(--text-muted)"
            fontSize={11}
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
          <Bar dataKey="total" fill="#06B6D4" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailySpendingChart;
