import express from 'express';
const router = express.Router();
import { createTask, getTasks, getTasksByProject, updateTaskStatus, updateTask, deleteTask } from '../controllers/taskController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

router.use(authenticateToken);

router.get('/project/:id', getTasksByProject);
router.put('/:id/admin', authorizeRole(['admin']), updateTask);
router.post('/', authorizeRole(['admin']), createTask);
router.get('/', getTasks);
router.put('/:id', updateTaskStatus);
router.delete('/:id', authorizeRole(['admin']), deleteTask);

export default router;
