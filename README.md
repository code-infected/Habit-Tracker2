# Habit Tracker with AI Recommendations

A full-stack web application for tracking habits with AI-powered recommendations. Built with React, Node.js, and Flask.

## Features

- **User Authentication**
  - Secure registration and login
  - Protected routes
  - Token-based authentication

- **Habit Tracking**
  - Create, read, update, and delete habits
  - Track daily progress
  - Visual progress indicators
  - Customizable habit frequencies

- **AI Recommendations**
  - Personalized habit suggestions
  - Category-based recommendations
  - Smart habit matching based on user preferences
  - Fallback recommendations system

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui component library
- React Query for data fetching
- React Router for navigation

### Backend
- Node.js with Express
- MySQL database
- JWT for authentication
- bcrypt for password hashing

### AI Service
- Python with Flask
- scikit-learn for recommendations
- NumPy and Pandas for data processing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- MySQL

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd habit-tracker
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Install Python dependencies:
```bash
cd AI-Service
pip install -r requirements.txt
```

5. Set up environment variables:
Create a `.env` file in the backend directory with:
```
MYSQL_HOST=localhost
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=habit_tracker
JWT_SECRET=your_secret_key
```

6. Initialize the database:
```bash
mysql -u root -p
CREATE DATABASE habit_tracker;
```

### Running the Application

1. Start the Node.js backend:
```bash
cd backend
npm start
```

2. Start the Flask recommendation service:
```bash
cd AI-Service
python app.py
```

3. Start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Project Structure

```
├── src/                  # Frontend source code
│   ├── components/       # React components
│   ├── pages/           # Page components
│   └── utils/           # Utility functions
├── backend/             # Node.js backend
│   ├── routes/          # API routes
│   └── middleware/      # Custom middleware
└── AI-Service/ # Python AI service
    └── app.py           # Flask application
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login

### Habits
- GET `/api/habits` - Get user habits
- POST `/api/habits` - Create new habit
- PUT `/api/habits/:id` - Update habit
- DELETE `/api/habits/:id` - Delete habit

### Recommendations
- GET `/api/recommendations` - Get habit recommendations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.