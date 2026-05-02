import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool;

export async function initDB() {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
    });

    // Test connection
    await pool.query('SELECT 1');

    console.log('MySQL Connected');

    await createTables();

  } catch (error) {
    console.error('DB INIT FAILED:', error.message);
  }
}

async function createTables() {
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin','member') DEFAULT 'member',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const projectsTable = `
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const projectMembersTable = `
    CREATE TABLE IF NOT EXISTS project_members (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT,
      user_id INT
    );
  `;

  const tasksTable = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status ENUM('pending','in_progress','completed') DEFAULT 'pending',
      assigned_to INT,
      project_id INT,
      due_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(usersTable);
    await pool.query(projectsTable);
    await pool.query(projectMembersTable);
    await pool.query(tasksTable);

    console.log('Tables ready');
  } catch (error) {
    console.error('TABLE ERROR:', error.message);
  }
}

// 🔥 SAFE QUERY FUNCTION
export const query = async (sql, params = []) => {
  if (!pool) {
    throw new Error("Database not initialized");
  }
  const [rows] = await pool.execute(sql, params);
  return [rows];
};