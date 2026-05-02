import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initDB } from './config/db.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Basic middleware
  app.use(cors());
  app.use(express.json());

  // Simple Request Logger
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // Initialize Database
  await initDB();

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  
  // Debug direct route
  app.delete('/api/projects/:id/members/:userId', (req, res) => {
    console.log('DIRECT DELETE HIT:', req.params);
    res.json({ message: 'Direct hit works' });
  });

  app.use('/api/tasks', taskRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  
  // API 404 Fallback
  app.use('/api/*', (req, res) => {
    console.log(`404 at API route: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: `API route not found: ${req.method} ${req.originalUrl}` });
  });

  // Healthy check
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  // Integration with Vite
  if (process.env.NODE_ENV !== 'production') {
    console.log('Starting Vite in middleware mode...');
    const vite = await createViteServer({
      root: path.resolve(__dirname, '../frontend'),
      configFile: path.resolve(__dirname, '../frontend/vite.config.js'),
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware is ready');
  } else {
    const distPath = path.resolve(__dirname, '../frontend/dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
