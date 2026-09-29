import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { getCategoryConfig } from '../utils/categoryIcons';
import { formatINR, formatCompactINR } from '../utils/currency';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    const conf = getCategoryConfig(label);
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <span>{conf.emoji}</span>
          <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.85rem' }}>{label}</span>
        </div>
        <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '1.05rem' }}>
          {formatINR(item.total || item.spent)}
        </div>
        {item.budget !== undefined && item.budget > 0 && (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            Budget: {formatINR(item.budget)} ({item.percentage}% used)
          </div>
        )}
      </div>
    );
  }
  return null;
};

const CategoryComparisonChart = ({ data = [], height = 280 }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Not enough category data for comparison yet.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" vertical={false} />
          <XAxis
            dataKey="category"
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
          <Bar dataKey="total" radius={[6, 6, 0, 0]}>
            {data.map((entry) => {
              const conf = getCategoryConfig(entry.category);
              return <Cell key={`bar-${entry.category}`} fill={conf.color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryComparisonChart;
