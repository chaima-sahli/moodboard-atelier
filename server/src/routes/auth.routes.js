import express from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate, authenticateJWT } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { authValidation } from '../validations/auth.validation.js';

const router = express.Router();

// Public routes
router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);

// Protected routes (require authentication)
router.get('/profile', authenticateJWT, authController.getProfile);
router.put('/profile', authenticateJWT, validate(authValidation.updateProfile), authController.updateProfile);
router.put('/change-password', authenticateJWT, validate(authValidation.changePassword), authController.changePassword);

export default router;