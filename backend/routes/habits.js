const express = require('express');
const router = express.Router();
const { connection } = require('../db');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, (req, res) => {
  const query = 'SELECT * FROM habits WHERE user_id = ?';
  connection.query(query, [req.user.id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

router.post('/', authenticateToken, (req, res) => {
  const { habit_title, frequency } = req.body;
  const query = 'INSERT INTO habits (habit_title, frequency, user_id, start_date) VALUES (?, ?, ?, CURDATE())';
  connection.query(query, [habit_title, frequency, req.user.id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: results.insertId, message: 'Habit created successfully' });
  });
});

router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const query = 'UPDATE habits SET status = ? WHERE habit_id = ? AND user_id = ?';
  connection.query(query, [status, id, req.user.id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Habit updated successfully' });
  });
});

router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM habits WHERE habit_id = ? AND user_id = ?';
  connection.query(query, [id, req.user.id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Habit deleted successfully' });
  });
});

module.exports = router;