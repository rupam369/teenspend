const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');
const { generateToken } = require('../utils/jwt');
const { isValidEmail, isValidPassword } = require('../utils/validators');

class AuthService {
  static async register({ name, email, password, confirmPassword }) {
    if (!name || !name.trim()) {
      const error = new Error('Please provide your full name.');
      error.statusCode = 400;
      throw error;
    }

    if (!isValidEmail(email)) {
      const error = new Error('Please provide a valid email address.');
      error.statusCode = 400;
      throw error;
    }

    if (!isValidPassword(password)) {
      const error = new Error('Password must be at least 6 characters long.');
      error.statusCode = 400;
      throw error;
    }

    if (password !== confirmPassword) {
      const error = new Error('Passwords do not match.');
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      const error = new Error('An account with this email address already exists. Please log in.');
      error.statusCode = 409;
      throw error;
    }

    // Hash password with bcrypt salt rounds = 10
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      name,
      email,
      password_hash,
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`,
    });

    const token = generateToken(newUser);

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar_url: newUser.avatar_url,
      },
      token,
    };
  }

  static async login({ email, password }) {
    if (!email || !password) {
      const error = new Error('Please provide both email and password.');
      error.statusCode = 400;
      throw error;
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
      },
      token,
    };
  }

  static async getMe(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  static async updateProfile(userId, { name, avatar_url }) {
    const updates = {};
    if (name && name.trim()) updates.name = name.trim();
    if (avatar_url) updates.avatar_url = avatar_url;

    const updatedUser = await UserModel.update(userId, updates);
    return updatedUser;
  }

  static async changePassword(userId, { currentPassword, newPassword }) {
    if (!isValidPassword(newPassword)) {
      const error = new Error('New password must be at least 6 characters long.');
      error.statusCode = 400;
      throw error;
    }

    // Need raw user record with password_hash
    const rawUser = await UserModel.findById(userId);
    // Find user directly with password hash
    const fullUser = await UserModel.findByEmail(rawUser.email);

    const isMatch = await bcrypt.compare(currentPassword, fullUser.password_hash);
    if (!isMatch) {
      const error = new Error('Current password is incorrect.');
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await UserModel.update(userId, { password_hash: newHash });
    return { success: true, message: 'Password updated successfully.' };
  }
}

module.exports = AuthService;
