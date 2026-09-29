import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getCategoryConfig } from '../utils/categoryIcons';
import { formatINR } from '../utils/currency';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    const conf = getCategoryConfig(item.category);
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span>{conf.emoji}</span>
          <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.9rem' }}>
            {item.category}
          </span>
        </div>
        <div style={{ color: 'var(--accent-cyan)', fontWeight: 800, fontSize: '1.05rem' }}>
          {formatINR(item.total)}
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
          {item.percentage}% of spending
        </div>
      </div>
    );
  }
  return null;
};

const CategoryChart = ({ data = [], height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Not enough expense data to display category breakdown yet.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={4}
          >
            {data.map((entry) => {
              const conf = getCategoryConfig(entry.category);
              return <Cell key={`cell-${entry.category}`} fill={conf.color} stroke="none" />;
            })}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.813rem', fontWeight: 600 }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;
