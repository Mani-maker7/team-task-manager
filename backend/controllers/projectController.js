import * as db from '../config/db.js';

export const createProject = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Project name is required.' });

  try {
    const [result] = await db.query('INSERT INTO projects (name, created_by) VALUES (?, ?)', [name, req.user.id]);
    const projectId = result.insertId;

    // Automatically add the creator as a member
    await db.query('INSERT INTO project_members (project_id, user_id) VALUES (?, ?)', [projectId, req.user.id]);

    res.status(201).json({ id: projectId, name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      [projects] = await db.query('SELECT * FROM projects');
    } else {
      [projects] = await db.query(`
        SELECT p.* FROM projects p
        JOIN project_members pm ON p.id = pm.project_id
        WHERE pm.user_id = ?
      `, [req.user.id]);
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMember = async (req, res) => {
  const { userId } = req.body;
  const { id: projectId } = req.params;

  if (!userId) return res.status(400).json({ message: 'User ID is required.' });

  try {
    const [existing] = await db.query('SELECT * FROM project_members WHERE project_id = ? AND user_id = ?', [projectId, userId]);
    if (existing.length > 0) return res.status(400).json({ message: 'User is already a member of this project.' });

    await db.query('INSERT INTO project_members (project_id, user_id) VALUES (?, ?)', [projectId, userId]);
    res.json({ message: 'Member added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeMember = async (req, res) => {
  const { id: projectId, userId } = req.params;
  console.log(`Removing member ${userId} from project ${projectId}`);

  try {
    const [result] = await db.query('DELETE FROM project_members WHERE project_id = ? AND user_id = ?', [projectId, userId]);
    console.log(`Delete result:`, result);
    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  const { id: projectId } = req.params;
  console.log(`Deleting project ${projectId}`);

  try {
    await db.query('DELETE FROM projects WHERE id = ?', [projectId]);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getMembers = async (req, res) => {
  const { id: projectId } = req.params;
  try {
    const [members] = await db.query(`
      SELECT u.id, u.name, u.email, u.role FROM users u
      JOIN project_members pm ON u.id = pm.user_id
      WHERE pm.project_id = ?
    `, [projectId]);
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, role FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
