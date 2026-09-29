import React from 'react';

const DashboardCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  color = '#6366F1',
  bgColor = 'rgba(99, 102, 241, 0.15)',
}) => {
  return (
    <div className="card metric-card card-hover">
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        <div className="metric-icon-wrap" style={{ backgroundColor: bgColor, color }}>
          {Icon && <Icon size={20} />}
        </div>
      </div>
      <div className="metric-value">{value}</div>
      {(subtitle || badgeText) && (
        <div className="metric-sub">
          {badgeText && (
            <span
              className="badge"
              style={{ backgroundColor: bgColor, color, padding: '2px 8px', fontSize: '0.7rem' }}
            >
              {badgeText}
            </span>
          )}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
