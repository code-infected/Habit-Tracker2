const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const createHabitsTable = `
  CREATE TABLE IF NOT EXISTS habits (
    habit_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    habit_title VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    frequency ENUM('daily', 'weekly', 'monthly') NOT NULL,
    status ENUM('active', 'inactive', 'completed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  );
`;

const createHabitLogsTable = `
  CREATE TABLE IF NOT EXISTS habit_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    habit_id INT,
    completed_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (habit_id) REFERENCES habits(habit_id)
  );
`;

// Execute each query separately
connection.query(createUsersTable, (err) => {
  if (err) {
    console.error('Error creating users table:', err);
    return;
  }
  console.log('Users table created successfully');
});

connection.query(createHabitsTable, (err) => {
  if (err) {
    console.error('Error creating habits table:', err);
    return;
  }
  console.log('Habits table created successfully');
});

connection.query(createHabitLogsTable, (err) => {
  if (err) {
    console.error('Error creating habit_logs table:', err);
    return;
  }
  console.log('Habit logs table created successfully');
});

module.exports = { connection };
