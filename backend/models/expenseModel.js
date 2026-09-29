const { supabase, isSupabaseConfigured } = require('../config/supabase');
const { readData, writeData } = require('../config/localDb');
const crypto = require('crypto');

class ExpenseModel {
  static async findAllByUserId(userId, options = {}) {
    const {
      category,
      payment_method,
      startDate,
      endDate,
      search,
      minAmount,
      maxAmount,
      sortBy = 'date-desc',
      limit,
      offset,
    } = options;

    if (isSupabaseConfigured) {
      let query = supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId);

      if (category && category !== 'All') {
        query = query.eq('category', category);
      }
      if (payment_method && payment_method !== 'All') {
        query = query.eq('payment_method', payment_method);
      }
      if (startDate) {
        query = query.gte('expense_date', startDate);
      }
      if (endDate) {
        query = query.lte('expense_date', endDate);
      }
      if (minAmount !== undefined && minAmount !== '') {
        query = query.gte('amount', Number(minAmount));
      }
      if (maxAmount !== undefined && maxAmount !== '') {
        query = query.lte('amount', Number(maxAmount));
      }
      if (search && search.trim() !== '') {
        query = query.or(`title.ilike.%${search.trim()}%,description.ilike.%${search.trim()}%`);
      }

      // Sorting
      if (sortBy === 'date-asc') {
        query = query.order('expense_date', { ascending: true }).order('created_at', { ascending: true });
      } else if (sortBy === 'amount-desc') {
        query = query.order('amount', { ascending: false });
      } else if (sortBy === 'amount-asc') {
        query = query.order('amount', { ascending: true });
      } else {
        // default date-desc
        query = query.order('expense_date', { ascending: false }).order('created_at', { ascending: false });
      }

      if (limit) {
        query = query.limit(Number(limit));
      }
      if (offset) {
        query = query.range(Number(offset), Number(offset) + Number(limit || 10) - 1);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data || [];
    } else {
      const db = readData();
      let list = (db.expenses || []).filter((e) => e.user_id === userId);

      if (category && category !== 'All') {
        list = list.filter((e) => e.category.toLowerCase() === category.toLowerCase());
      }
      if (payment_method && payment_method !== 'All') {
        list = list.filter((e) => e.payment_method.toLowerCase() === payment_method.toLowerCase());
      }
      if (startDate) {
        list = list.filter((e) => e.expense_date >= startDate);
      }
      if (endDate) {
        list = list.filter((e) => e.expense_date <= endDate);
      }
      if (minAmount !== undefined && minAmount !== '') {
        list = list.filter((e) => Number(e.amount) >= Number(minAmount));
      }
      if (maxAmount !== undefined && maxAmount !== '') {
        list = list.filter((e) => Number(e.amount) <= Number(maxAmount));
      }
      if (search && search.trim() !== '') {
        const q = search.trim().toLowerCase();
        list = list.filter(
          (e) =>
            (e.title && e.title.toLowerCase().includes(q)) ||
            (e.description && e.description.toLowerCase().includes(q))
        );
      }

      // Sorting
      list.sort((a, b) => {
        if (sortBy === 'date-asc') {
          return new Date(a.expense_date) - new Date(b.expense_date) || new Date(a.created_at) - new Date(b.created_at);
        } else if (sortBy === 'amount-desc') {
          return Number(b.amount) - Number(a.amount);
        } else if (sortBy === 'amount-asc') {
          return Number(a.amount) - Number(b.amount);
        } else {
          return new Date(b.expense_date) - new Date(a.expense_date) || new Date(b.created_at) - new Date(a.created_at);
        }
      });

      if (offset !== undefined && limit !== undefined) {
        const start = Number(offset);
        const end = start + Number(limit);
        return list.slice(start, end);
      } else if (limit !== undefined) {
        return list.slice(0, Number(limit));
      }

      return list;
    }
  }

  static async findById(id, userId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data;
    } else {
      const db = readData();
      return (db.expenses || []).find((e) => e.id === id && e.user_id === userId) || null;
    }
  }

  static async create({
    user_id,
    title,
    amount,
    category,
    description = '',
    payment_method = 'UPI',
    expense_date,
  }) {
    const now = new Date().toISOString();
    const date = expense_date || now.split('T')[0];
    const parsedAmount = Number(parseFloat(amount).toFixed(2));

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('expenses')
        .insert([
          {
            user_id,
            title: title.trim(),
            amount: parsedAmount,
            category: category.trim(),
            description: (description || '').trim(),
            payment_method: payment_method.trim(),
            expense_date: date,
          },
        ])
        .select('*')
        .single();

      if (error) throw new Error(error.message);
      return data;
    } else {
      const db = readData();
      const newExpense = {
        id: crypto.randomUUID ? crypto.randomUUID() : `exp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        user_id,
        title: title.trim(),
        amount: parsedAmount,
        category: category.trim(),
        description: (description || '').trim(),
        payment_method: payment_method.trim(),
        expense_date: date,
        created_at: now,
        updated_at: now,
      };

      if (!db.expenses) db.expenses = [];
      db.expenses.push(newExpense);
      writeData(db);
      return newExpense;
    }
  }

  static async update(id, userId, updateFields) {
    const now = new Date().toISOString();
    const cleanFields = { ...updateFields };
    if (cleanFields.amount !== undefined) {
      cleanFields.amount = Number(parseFloat(cleanFields.amount).toFixed(2));
    }
    if (cleanFields.title !== undefined) {
      cleanFields.title = cleanFields.title.trim();
    }
    if (cleanFields.description !== undefined) {
      cleanFields.description = cleanFields.description.trim();
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('expenses')
        .update({
          ...cleanFields,
          updated_at: now,
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select('*')
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data;
    } else {
      const db = readData();
      const index = (db.expenses || []).findIndex((e) => e.id === id && e.user_id === userId);
      if (index === -1) return null;

      db.expenses[index] = {
        ...db.expenses[index],
        ...cleanFields,
        updated_at: now,
      };
      writeData(db);
      return db.expenses[index];
    }
  }

  static async delete(id, userId) {
    if (isSupabaseConfigured) {
      const { error, count } = await supabase
        .from('expenses')
        .delete({ count: 'exact' })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw new Error(error.message);
      return true;
    } else {
      const db = readData();
      const initialLength = (db.expenses || []).length;
      db.expenses = (db.expenses || []).filter((e) => !(e.id === id && e.user_id === userId));
      const deleted = db.expenses.length < initialLength;
      if (deleted) writeData(db);
      return deleted;
    }
  }
}

module.exports = ExpenseModel;
