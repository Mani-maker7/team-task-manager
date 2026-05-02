import * as db from '../config/db.js';

export const createTask = async (req, res) => {
  const { title, description, assigned_to, project_id, due_date } = req.body;
  if (!title || !project_id) return res.status(400).json({ message: 'Title and Project ID are required.' });

  try {
    const [result] = await db.query(
      'INSERT INTO tasks (title, description, assigned_to, project_id, due_date) VALUES (?, ?, ?, ?, ?)',
      [title, description, assigned_to, project_id, due_date]
    );
    res.status(201).json({ id: result.insertId, title, status: 'pending' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'admin') {
      [tasks] = await db.query(`
        SELECT t.*, u.name as assigned_name, p.name as project_name 
        FROM tasks t
        LEFT JOIN users u ON t.assigned_to = u.id
        LEFT JOIN projects p ON t.project_id = p.id
      `);
    } else {
      [tasks] = await db.query(`
        SELECT t.*, u.name as assigned_name, p.name as project_name 
        FROM tasks t
        LEFT JOIN users u ON t.assigned_to = u.id
        LEFT JOIN projects p ON t.project_id = p.id
        WHERE t.assigned_to = ?
      `, [req.user.id]);
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasksByProject = async (req, res) => {
  const { id: projectId } = req.params;
  try {
    const [tasks] = await db.query(`
      SELECT t.*, u.name as assigned_name 
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.project_id = ?
    `, [projectId]);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!['pending', 'in_progress', 'completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    // Member can only update their own tasks, Admin can update any
    if (req.user.role === 'member') {
      const [task] = await db.query('SELECT * FROM tasks WHERE id = ? AND assigned_to = ?', [id, req.user.id]);
      if (task.length === 0) return res.status(403).json({ message: 'You can only update tasks assigned to you.' });
    }

    await db.query('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, assigned_to, project_id, due_date, status } = req.body;
  
  try {
    await db.query(
      'UPDATE tasks SET title = ?, description = ?, assigned_to = ?, project_id = ?, due_date = ?, status = ? WHERE id = ?',
      [title, description, assigned_to, project_id, due_date, status, id]
    );
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
