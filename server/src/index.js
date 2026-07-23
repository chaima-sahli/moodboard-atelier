import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/database.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

import boardRoutes from './routes/board.routes.js';
import elementRoutes from './routes/element.routes.js';
import imageRoutes from './routes/image.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes
app.use('/api/boards', boardRoutes);
app.use('/api/boards/:boardId/elements', elementRoutes);
app.use('/api/images', imageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: 'MongoDB Atlas',
    environment: process.env.NODE_ENV || 'development',
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`- Server running on http://localhost:${PORT}`);
  console.log(`- Database: MongoDB Atlas`);
  console.log(`- Auth: ${process.env.NODE_ENV === 'development' ? 'Development (bypassed)' : 'API Key'}`);
});

export default app;