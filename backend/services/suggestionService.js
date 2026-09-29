class SuggestionService {
  /**
   * Generates practical, educational, teenager-friendly spending tips
   * based on actual database spending data.
   */
  static generateSuggestions({
    totalSpentThisMonth,
    monthlyBudget,
    remainingBudget,
    categoryBreakdown,
    dailyAverage,
    totalExpensesCount,
    previousMonthSpent = 0,
  }) {
    const suggestions = [];

    if (totalExpensesCount === 0) {
      return [
        {
          id: 'welcome_tip',
          type: 'info',
          title: 'Welcome to TeenSpend!',
          message: 'Start by tracking your daily expenses like snacks, bus tickets, or games. Every rupee recorded gives you financial superpowers!',
          category: 'General',
          actionText: 'Add First Expense',
        },
      ];
    }

    const budgetPercent = monthlyBudget > 0 ? (totalSpentThisMonth / monthlyBudget) * 100 : 0;

    // 1. Budget Exceeded / Approaching Alert
    if (budgetPercent >= 100) {
      suggestions.push({
        id: 'budget_exceeded',
        type: 'danger',
        title: 'Monthly Budget Exceeded',
        message: `You have spent ₹${totalSpentThisMonth.toLocaleString('en-IN')}, which exceeds your ₹${monthlyBudget.toLocaleString('en-IN')} budget by ₹${Math.abs(remainingBudget).toLocaleString('en-IN')}. Pause non-essential purchases for the rest of this month.`,
        category: 'Budget',
      });
    } else if (budgetPercent >= 80) {
      suggestions.push({
        id: 'budget_warning',
        type: 'warning',
        title: 'Approaching Monthly Budget',
        message: `You have already used ${budgetPercent.toFixed(0)}% of your monthly limit. Try postponing discretionary spending like shopping or hangouts until next month.`,
        category: 'Budget',
      });
    } else if (budgetPercent > 0 && budgetPercent <= 50) {
      suggestions.push({
        id: 'budget_healthy',
        type: 'success',
        title: 'Awesome Budget Discipline!',
        message: `You have only used ${budgetPercent.toFixed(0)}% of your budget so far. You're developing great money habits for the future!`,
        category: 'Budget',
      });
    }

    // 2. High Food Spending Analysis
    const foodCat = categoryBreakdown.find((c) => c.category.toLowerCase() === 'food');
    if (foodCat && totalSpentThisMonth > 0) {
      const foodPercent = (foodCat.total / totalSpentThisMonth) * 100;
      if (foodPercent >= 35) {
        suggestions.push({
          id: 'high_food_spending',
          type: 'warning',
          title: 'High Food & Snack Spending',
          message: `You spent ₹${foodCat.total.toLocaleString('en-IN')} (${foodPercent.toFixed(0)}% of your total spending) on food. Packing a water bottle and homemade snacks can save you ₹500–₹1,000 every month!`,
          category: 'Food',
        });
      }
    }

    // 3. Entertainment & Gaming Purchases
    const entCat = categoryBreakdown.find((c) => c.category.toLowerCase() === 'entertainment');
    if (entCat && totalSpentThisMonth > 0) {
      const entPercent = (entCat.total / totalSpentThisMonth) * 100;
      if (entPercent >= 25 || entCat.total > 2000) {
        suggestions.push({
          id: 'high_entertainment',
          type: 'info',
          title: 'Entertainment & Subscriptions',
          message: `Entertainment accounts for ₹${entCat.total.toLocaleString('en-IN')} this month. Review your gaming in-app purchases and OTT subscriptions to see if you can share family plans.`,
          category: 'Entertainment',
        });
      }
    }

    // 4. Shopping & Impulse Purchases
    const shopCat = categoryBreakdown.find((c) => c.category.toLowerCase() === 'shopping');
    if (shopCat && totalSpentThisMonth > 0) {
      const shopPercent = (shopCat.total / totalSpentThisMonth) * 100;
      if (shopPercent >= 30) {
        suggestions.push({
          id: 'shopping_rule',
          type: 'info',
          title: 'Try the 48-Hour Shopping Rule',
          message: `Shopping is ${shopPercent.toFixed(0)}% of your expenses this month (₹${shopCat.total.toLocaleString('en-IN')}). Next time you want to buy something non-essential online, wait 48 hours to see if you still really need it.`,
          category: 'Shopping',
        });
      }
    }

    // 5. Transportation Notice
    const transCat = categoryBreakdown.find((c) => c.category.toLowerCase() === 'transport');
    if (transCat && totalSpentThisMonth > 0) {
      const transPercent = (transCat.total / totalSpentThisMonth) * 100;
      if (transPercent >= 25) {
        suggestions.push({
          id: 'transport_smart',
          type: 'info',
          title: 'Transportation Insight',
          message: `Transportation is one of your larger spending categories this month (₹${transCat.total.toLocaleString('en-IN')}). Consider student metro/bus concession passes or carpooling with friends.`,
          category: 'Transport',
        });
      }
    }

    // 6. Previous Month Comparison
    if (previousMonthSpent > 0 && totalSpentThisMonth > 0) {
      if (totalSpentThisMonth < previousMonthSpent) {
        const diff = previousMonthSpent - totalSpentThisMonth;
        suggestions.push({
          id: 'month_comparison_better',
          type: 'success',
          title: 'Lower Spending Than Last Month!',
          message: `You spent ₹${diff.toLocaleString('en-IN')} less than the previous period. You're doing a fantastic job keeping your expenses under control!`,
          category: 'Trend',
        });
      }
    }

    // 7. Daily Pace Projection
    if (dailyAverage > 0) {
      const d = new Date();
      const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      const projectedMonthSpend = Math.round(dailyAverage * daysInMonth);

      if (monthlyBudget > 0 && projectedMonthSpend > monthlyBudget) {
        suggestions.push({
          id: 'daily_pace_projection',
          type: 'warning',
          title: 'Daily Spending Pace Alert',
          message: `At your current average pace of ₹${dailyAverage.toFixed(0)}/day, your projected spending will reach ₹${projectedMonthSpend.toLocaleString('en-IN')}, higher than your ₹${monthlyBudget.toLocaleString('en-IN')} budget. Aim for ₹${Math.max(0, Math.round(remainingBudget / Math.max(1, daysInMonth - d.getDate())))}/day for the rest of the month.`,
          category: 'Pacing',
        });
      }
    }

    // Always ensure at least 2 relevant, constructive tips
    if (suggestions.length < 2) {
      suggestions.push({
        id: 'teen_savings_habit',
        type: 'info',
        title: 'Teen Money Tip: Pay Yourself First',
        message: 'Whenever you receive pocket money or festival gifts, try tucking away 20% into your savings before spending the rest!',
        category: 'Savings',
      });
    }

    return suggestions;
  }
}

module.exports = SuggestionService;
