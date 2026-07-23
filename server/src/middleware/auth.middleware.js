import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { apiResponse } from '../utils/apiResponse.js';

// Development mode - bypass auth
export const authenticate = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    req.userId = 'dev-user-123';
    req.userEmail = 'dev@example.com';
    return next();
  }
  
  // In production, use JWT
  return authenticateJWT(req, res, next);
};

// JWT Authentication
export const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return apiResponse.unauthorized(res, 'No token provided');
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key');
    
    // Check if user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return apiResponse.unauthorized(res, 'User not found');
    }
    
    // Check if user is active
    if (!user.isActive) {
      return apiResponse.unauthorized(res, 'Account is disabled');
    }
    
    // Attach user to request
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;
    req.user = user;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return apiResponse.unauthorized(res, 'Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      return apiResponse.unauthorized(res, 'Token expired');
    }
    return apiResponse.unauthorized(res, 'Authentication failed');
  }
};

// Optional: Admin check
export const requireAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return apiResponse.forbidden(res, 'Admin access required');
  }
  next();
};

// Optional: API Key auth for external services
export const authenticateAPIKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return apiResponse.unauthorized(res, 'Invalid API key');
  }
  
  // Use default user for API key auth
  req.userId = 'api-user-123';
  req.userEmail = 'api@example.com';
  next();
};