import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Calendar, Sparkles, User, LogOut } from "lucide-react";
import HabitCard from '@/components/HabitCard';
import AddHabitDialog from '@/components/AddHabitDialog';
import { toast } from "sonner";

const Index = () => {
  const [habits, setHabits] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);

  useEffect(() => {
    fetchHabits();
    fetchRecommendations();
  }, []);

  const fetchHabits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/habits', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch habits');
      const data = await response.json();
      setHabits(data);
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast.error('Failed to load habits');
    }
  };

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/recommendations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error('Failed to load recommendations');
    }
  };

  const handleAddHabit = async (newHabit) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          habit_title: newHabit.title,
          frequency: 'daily'
        }),
      });
      
      if (!response.ok) throw new Error('Failed to create habit');
      
      toast.success('Habit created successfully');
      fetchHabits();
      fetchRecommendations();
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error('Failed to create habit');
    }
  };

  const handleHabitComplete = async (habitId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/habits/${habitId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'completed' }),
      });

      if (!response.ok) throw new Error('Failed to update habit');
      
      toast.success('Habit updated successfully');
      fetchHabits();
    } catch (error) {
      console.error('Error updating habit:', error);
      toast.error('Failed to update habit');
    }
  };

  const handleDeleteHabit = async (habitId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/habits/${habitId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete habit');
      
      toast.success('Habit deleted successfully');
      fetchHabits();
      fetchRecommendations();
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit');
    }
  };

  const handleAddRecommendation = (recommendation) => {
    handleAddHabit({ title: recommendation.title });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Habit Tracker</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAddHabitOpen(true)}
              className="flex items-center gap-2 bg-habit-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              <Plus size={20} />
              Add Habit
            </button>
            <button
              onClick={() => window.location.href = '/profile'}
              className="flex items-center gap-2 bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <User size={20} />
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="text-yellow-500" size={20} />
              Recommended Habits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map((recommendation, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <button
                      onClick={() => handleAddRecommendation(recommendation)}
                      className="text-habit-primary hover:text-habit-primary/80 font-medium"
                    >
                      Add this habit
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => (
            <HabitCard
              key={habit.habit_id}
              id={habit.habit_id}
              title={habit.habit_title}
              status={habit.status}
              frequency={habit.frequency}
              onComplete={() => handleHabitComplete(habit.habit_id)}
              onDelete={() => handleDeleteHabit(habit.habit_id)}
            />
          ))}
        </div>

        <AddHabitDialog
          open={isAddHabitOpen}
          onOpenChange={setIsAddHabitOpen}
          onAddHabit={handleAddHabit}
        />
      </div>
    </div>
  );
};

export default Index;