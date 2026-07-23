import { authService } from '../services/auth.service.js';
import { apiResponse } from '../utils/apiResponse.js';

export const authController = {
  // Register new user
  register: async (req, res, next) => {
    try {
      const result = await authService.register(req.body);
      return apiResponse.created(res, result, 'User registered successfully');
    } catch (error) {
      if (error.message.includes('already exists')) {
        return apiResponse.badRequest(res, error.message);
      }
      next(error);
    }
  },
  
  // Login user
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return apiResponse.success(res, result, 'Login successful');
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        return apiResponse.unauthorized(res, error.message);
      }
      if (error.message === 'Account is disabled') {
        return apiResponse.badRequest(res, error.message);
      }
      next(error);
    }
  },
  
  // Get current user profile
  getProfile: async (req, res, next) => {
    try {
      const user = await authService.getUserById(req.userId);
      return apiResponse.success(res, user, 'Profile fetched successfully');
    } catch (error) {
      if (error.message === 'User not found') {
        return apiResponse.notFound(res, error.message);
      }
      next(error);
    }
  },
  
  // Update user profile
  updateProfile: async (req, res, next) => {
    try {
      const user = await authService.updateUser(req.userId, req.body);
      return apiResponse.success(res, user, 'Profile updated successfully');
    } catch (error) {
      if (error.message === 'User not found') {
        return apiResponse.notFound(res, error.message);
      }
      next(error);
    }
  },
  
  // Change password
  changePassword: async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await authService.changePassword(
        req.userId,
        currentPassword,
        newPassword
      );
      return apiResponse.success(res, result, 'Password changed successfully');
    } catch (error) {
      if (error.message === 'Current password is incorrect') {
        return apiResponse.badRequest(res, error.message);
      }
      if (error.message === 'User not found') {
        return apiResponse.notFound(res, error.message);
      }
      next(error);
    }
  },
};