import User from '../models/User.model.js';

export const authService = {
  // Register new user
  register: async (userData) => {
    const { email, password, name } = userData;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }
    
    // Create user
    const user = new User({ email, password, name });
    await user.save();
    
    // Generate token
    const token = user.generateToken();
    
    return {
      user: user.toPublicJSON(),
      token,
    };
  },
  
  // Login user
  login: async (email, password) => {
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is disabled');
    }
    
    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Generate token
    const token = user.generateToken();
    
    return {
      user: user.toPublicJSON(),
      token,
    };
  },
  
  // Get user by ID
  getUserById: async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.toPublicJSON();
  },
  
  // Update user
  updateUser: async (userId, updates) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Don't allow email or password updates here
    const allowedUpdates = ['name', 'preferences'];
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        user[field] = updates[field];
      }
    });
    
    await user.save();
    return user.toPublicJSON();
  },
  
  // Change password
  changePassword: async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new Error('User not found');
    }
    
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }
    
    user.password = newPassword;
    await user.save();
    
    return { message: 'Password updated successfully' };
  },
};