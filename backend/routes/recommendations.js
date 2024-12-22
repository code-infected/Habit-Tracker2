const express = require('express');
const router = express.Router();
const { connection } = require('../db');
const { authenticateToken } = require('../middleware/auth');
const axios = require('axios');

router.get('/', authenticateToken, async (req, res) => {
  try {
    // Get user's existing habits
    const query = `
      SELECT habit_title, frequency 
      FROM habits 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 5
    `;

    connection.query(query, [req.user.id], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      try {
        // Get recommendations from Flask service
        const flaskResponse = await axios.get('http://localhost:5001/generate-habit-suggestions');
        const recommendations = flaskResponse.data;

        // Filter out habits the user already has
        const userHabits = results.map(habit => habit.habit_title.toLowerCase());
        const filteredRecommendations = recommendations.filter(
          habit => !userHabits.includes(habit.title.toLowerCase())
        );

        // If we filtered out too many, get random ones from our backup list
        const commonHabits = [
          { title: 'Drink 8 glasses of water', category: 'health' },
          { title: 'Read for 30 minutes', category: 'personal_development' },
          { title: 'Exercise for 30 minutes', category: 'fitness' },
          { title: 'Meditate for 10 minutes', category: 'mindfulness' },
          { title: 'Write in journal', category: 'personal_development' },
          { title: 'Practice gratitude', category: 'mindfulness' },
          { title: 'Take vitamins', category: 'health' },
          { title: 'Walk 10,000 steps', category: 'fitness' }
        ];

        while (filteredRecommendations.length < 3) {
          const randomHabit = commonHabits[Math.floor(Math.random() * commonHabits.length)];
          if (!userHabits.includes(randomHabit.title.toLowerCase()) &&
              !filteredRecommendations.find(h => h.title === randomHabit.title)) {
            filteredRecommendations.push(randomHabit);
          }
        }

        res.json(filteredRecommendations.slice(0, 3));
      } catch (flaskError) {
        // Fallback to basic recommendations if Flask service is unavailable
        console.error('Flask service error:', flaskError);
        const shuffled = commonHabits
          .filter(habit => !userHabits.includes(habit.title.toLowerCase()))
          .sort(() => 0.5 - Math.random());
        res.json(shuffled.slice(0, 3));
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;