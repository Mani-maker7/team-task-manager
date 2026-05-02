import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Request Logger (unchanged)
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // DB init (same)
  await initDB();

  // API Routes (same)
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);

  // Debug route (same)
  app.delete('/api/projects/:id/members/:userId', (req, res) => {
    console.log('DIRECT DELETE HIT:', req.params);
    res.json({ message: 'Direct hit works' });
  });

  app.use('/api/tasks', taskRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  // Health check (same)
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  // API 404 (same)
  app.use('/api/*', (req, res) => {
    console.log(`404 at API route: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
      message: `API route not found: ${req.method} ${req.originalUrl}`
    });
  });

  // Root check (added for Railway sanity)
  app.get('/', (req, res) => {
    res.send('Backend API Running');
  });

  // Start server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();