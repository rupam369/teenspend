export const CATEGORIES = [
  'Food',
  'Transport',
  'Education',
  'Entertainment',
  'Shopping',
  'Bills',
  'Health',
  'Travel',
  'Other',
];

export const PAYMENT_METHODS = [
  'UPI',
  'Cash',
  'Card',
  'Bank',
  'Other',
];

export const CATEGORY_CONFIG = {
  Food: {
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    label: 'Food & Snacks',
    emoji: '🍔',
  },
  Transport: {
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    label: 'Transport & Commute',
    emoji: '🚌',
  },
  Education: {
    color: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    label: 'Books & Courses',
    emoji: '📚',
  },
  Entertainment: {
    color: '#EC4899',
    bgColor: 'rgba(236, 72, 153, 0.15)',
    borderColor: 'rgba(236, 72, 153, 0.3)',
    label: 'Gaming & Fun',
    emoji: '🎮',
  },
  Shopping: {
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    label: 'Shopping & Gear',
    emoji: '🛍️',
  },
  Bills: {
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    label: 'Bills & Recharges',
    emoji: '📱',
  },
  Health: {
    color: '#06B6D4',
    bgColor: 'rgba(6, 182, 212, 0.15)',
    borderColor: 'rgba(6, 182, 212, 0.3)',
    label: 'Fitness & Health',
    emoji: '💊',
  },
  Travel: {
    color: '#F97316',
    bgColor: 'rgba(249, 115, 22, 0.15)',
    borderColor: 'rgba(249, 115, 22, 0.3)',
    label: 'Trips & Outings',
    emoji: '✈️',
  },
  Other: {
    color: '#94A3B8',
    bgColor: 'rgba(148, 163, 184, 0.15)',
    borderColor: 'rgba(148, 163, 184, 0.3)',
    label: 'Miscellaneous',
    emoji: '🏷️',
  },
};

export const getCategoryConfig = (category) => {
  return CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Other;
};
