const { supabase, isSupabaseConfigured } = require('../config/supabase');
const { readData, writeData } = require('../config/localDb');
const crypto = require('crypto');

class UserModel {
  static async findByEmail(email) {
    const cleanEmail = email.toLowerCase().trim();
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data;
    } else {
      const db = readData();
      return db.users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
    }
  }

  static async findById(id) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, avatar_url, created_at, updated_at')
        .eq('id', id)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data;
    } else {
      const db = readData();
      const user = db.users.find((u) => u.id === id);
      if (!user) return null;
      // Exclude password_hash
      const { password_hash, ...safeUser } = user;
      return safeUser;
    }
  }

  static async create({ name, email, password_hash, avatar_url = null }) {
    const cleanEmail = email.toLowerCase().trim();
    const now = new Date().toISOString();

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            name: name.trim(),
            email: cleanEmail,
            password_hash,
            avatar_url,
          },
        ])
        .select('id, name, email, avatar_url, created_at, updated_at')
        .single();

      if (error) throw new Error(error.message);
      return data;
    } else {
      const db = readData();
      const newUser = {
        id: crypto.randomUUID ? crypto.randomUUID() : `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        name: name.trim(),
        email: cleanEmail,
        password_hash,
        avatar_url,
        created_at: now,
        updated_at: now,
      };
      db.users.push(newUser);
      writeData(db);

      const { password_hash: _, ...safeUser } = newUser;
      return safeUser;
    }
  }

  static async update(id, updateFields) {
    const now = new Date().toISOString();

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updateFields,
          updated_at: now,
        })
        .eq('id', id)
        .select('id, name, email, avatar_url, created_at, updated_at')
        .single();

      if (error) throw new Error(error.message);
      return data;
    } else {
      const db = readData();
      const index = db.users.findIndex((u) => u.id === id);
      if (index === -1) return null;

      db.users[index] = {
        ...db.users[index],
        ...updateFields,
        updated_at: now,
      };
      writeData(db);

      const { password_hash, ...safeUser } = db.users[index];
      return safeUser;
    }
  }
}

module.exports = UserModel;
