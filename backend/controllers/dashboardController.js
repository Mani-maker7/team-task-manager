import * as db from '../config/db.js';

export const getDashboardStats = async (req, res) => {
  try {
    let whereClause = '';
    let params = [];

    if (req.user.role === 'member') {
      whereClause = 'WHERE assigned_to = ?';
      params = [req.user.id];
    }

    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress
      FROM tasks
      ${whereClause}
    `, params);

    res.json(stats[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOverdueTasks = async (req, res) => {
  try {
    let whereClause = "WHERE due_date < CURDATE() AND status != 'completed'";
    let params = [];

    if (req.user.role === 'member') {
      whereClause += ' AND assigned_to = ?';
      params = [req.user.id];
    }

    const [tasks] = await db.query(`
      SELECT t.*, p.name as project_name 
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      ${whereClause}
    `, params);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
