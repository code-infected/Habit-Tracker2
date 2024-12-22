from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = Flask(__name__)
CORS(app)

# Initial habit dataset with categories
habits_data = {
    'title': [
        'Drink 8 glasses of water',
        'Read for 30 minutes',
        'Exercise for 30 minutes',
        'Meditate for 10 minutes',
        'Write in journal',
        'Practice gratitude',
        'Take vitamins',
        'Walk 10,000 steps',
        'Eat more vegetables',
        'Get 8 hours of sleep',
        'Practice deep breathing',
        'Learn a new word',
        'Do stretching exercises',
        'Plan tomorrow\'s tasks',
        'Clean workspace'
    ],
    'category': [
        'health',
        'personal_development',
        'fitness',
        'mindfulness',
        'personal_development',
        'mindfulness',
        'health',
        'fitness',
        'health',
        'health',
        'mindfulness',
        'personal_development',
        'fitness',
        'productivity',
        'productivity'
    ]
}

# Convert to DataFrame
habits_df = pd.DataFrame(habits_data)

# Create TF-IDF vectorizer for habit titles and categories
vectorizer = TfidfVectorizer()
habit_vectors = vectorizer.fit_transform(
    habits_df['title'] + ' ' + habits_df['category']
)

@app.route('/generate-habit-suggestions', methods=['GET'])
def generate_suggestions():
    try:
        # For now, we'll return random suggestions weighted by category
        # In a real app, you'd pass user's existing habits as parameters
        
        # Get 3 random suggestions, trying to get one from each main category
        categories = ['health', 'fitness', 'mindfulness', 'personal_development', 'productivity']
        selected_habits = []
        
        # Ensure we get habits from different categories
        np.random.shuffle(categories)
        for category in categories[:3]:
            category_habits = habits_df[habits_df['category'] == category]
            if not category_habits.empty:
                selected_habit = category_habits.sample(n=1).iloc[0]
                selected_habits.append({
                    'title': selected_habit['title'],
                    'category': selected_habit['category']
                })
        
        # If we don't have enough habits, fill with random ones
        while len(selected_habits) < 3:
            random_habit = habits_df.sample(n=1).iloc[0]
            habit_dict = {
                'title': random_habit['title'],
                'category': random_habit['category']
            }
            if habit_dict not in selected_habits:
                selected_habits.append(habit_dict)
        
        return jsonify(selected_habits)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)