import express from 'express';
const router = express.Router();
import { getDashboardStats, getOverdueTasks } from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/auth.js';

router.use(authenticateToken);

router.get('/', getDashboardStats);
router.get('/overdue', getOverdueTasks);

export default router;
