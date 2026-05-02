import express from 'express';
const router = express.Router();
import { createProject, getProjects, addMember, getMembers, getAllUsers, removeMember, deleteProject } from '../controllers/projectController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

router.use(authenticateToken);

router.delete('/:id/members/:userId', (req, res, next) => {
  console.log('Delete member route hit (no auth check):', req.params);
  next();
}, removeMember);
router.delete('/:id', authorizeRole(['admin']), deleteProject);
router.get('/users/all', authorizeRole(['admin']), getAllUsers);
router.post('/:id/members', authorizeRole(['admin']), addMember);
router.get('/:id/members', getMembers);
router.post('/', authorizeRole(['admin']), createProject);
router.get('/', getProjects);

export default router;
