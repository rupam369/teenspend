const { supabase, isSupabaseConfigured } = require('../config/supabase');
const { readData, writeData } = require('../config/localDb');
const crypto = require('crypto');

class BudgetModel {
  static getCurrentMonthString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  static async findByMonth(userId, month = BudgetModel.getCurrentMonthString()) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .eq('month', month)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data;
    } else {
      const db = readData();
      return (db.budgets || []).find((b) => b.user_id === userId && b.month === month) || null;
    }
  }

  static async upsert(userId, { monthly_budget, category_budgets = {}, month }) {
    const targetMonth = month || BudgetModel.getCurrentMonthString();
    const now = new Date().toISOString();
    const parsedBudget = Number(parseFloat(monthly_budget || 0).toFixed(2));

    if (isSupabaseConfigured) {
      // Check if existing
      const existing = await this.findByMonth(userId, targetMonth);

      if (existing) {
        const { data, error } = await supabase
          .from('budgets')
          .update({
            monthly_budget: parsedBudget,
            category_budgets,
            updated_at: now,
          })
          .eq('id', existing.id)
          .eq('user_id', userId)
          .select('*')
          .single();

        if (error) throw new Error(error.message);
        return data;
      } else {
        const { data, error } = await supabase
          .from('budgets')
          .insert([
            {
              user_id: userId,
              monthly_budget: parsedBudget,
              category_budgets,
              month: targetMonth,
            },
          ])
          .select('*')
          .single();

        if (error) throw new Error(error.message);
        return data;
      }
    } else {
      const db = readData();
      if (!db.budgets) db.budgets = [];

      const index = db.budgets.findIndex((b) => b.user_id === userId && b.month === targetMonth);
      if (index !== -1) {
        db.budgets[index] = {
          ...db.budgets[index],
          monthly_budget: parsedBudget,
          category_budgets: {
            ...(db.budgets[index].category_budgets || {}),
            ...category_budgets,
          },
          updated_at: now,
        };
        writeData(db);
        return db.budgets[index];
      } else {
        const newBudget = {
          id: crypto.randomUUID ? crypto.randomUUID() : `bgt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          user_id: userId,
          monthly_budget: parsedBudget,
          category_budgets,
          month: targetMonth,
          created_at: now,
          updated_at: now,
        };
        db.budgets.push(newBudget);
        writeData(db);
        return newBudget;
      }
    }
  }
}

module.exports = BudgetModel;
