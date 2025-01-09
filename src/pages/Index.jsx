import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Plus, Calendar, Sparkles, User, LogOut, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [habits, setHabits] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState("");

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

  // Habit Card Component
  const HabitCard = ({ id, title, status, frequency, onComplete, onDelete }) => {
    const progress = status === 'completed' ? 100 : 0;
    const completedToday = status === 'completed';

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-white">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold text-gray-800">{title}</CardTitle>
            <div className="flex gap-2">
              <button
                onClick={onComplete}
                className="text-gray-600 hover:text-green-500 transition-colors"
              >
                {completedToday ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <Circle className="h-6 w-6" />
                )}
              </button>
              <button
                onClick={onDelete}
                className="text-gray-600 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-6 w-6" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Frequency</span>
              <span className="font-semibold capitalize">{frequency}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Status</span>
              <span className="font-semibold capitalize">{status}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Add Habit Dialog Component
  const AddHabitDialog = ({ open, onOpenChange, onAddHabit }) => {
    const handleSubmit = (e) => {
      e.preventDefault();
      if (newHabitTitle.trim()) {
        onAddHabit({ title: newHabitTitle.trim() });
        setNewHabitTitle("");
        onOpenChange(false);
      }
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add New Habit</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">
                Habit Name
              </label>
              <Input
                id="title"
                value={newHabitTitle}
                onChange={(e) => setNewHabitTitle(e.target.value)}
                placeholder="Enter habit name..."
                className="w-full"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Habit
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg shadow-sm">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">Habit Tracker</h1>
            <p className="text-gray-500">Track and maintain your daily habits</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddHabitOpen(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Habit
            </button>
            <button
              onClick={() => window.location.href = '/profile'}
              className="inline-flex items-center gap-2 bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <User className="h-4 w-4" /> Profile
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Habits</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{habits.length}</div>
              <p className="text-xs text-gray-500">All tracked habits</p>
            </CardContent>
          </Card>
          <Card className="bg-white hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Habits</CardTitle>
              <Circle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {habits.filter(h => h.status === 'active').length}
              </div>
              <p className="text-xs text-gray-500">Habits in progress</p>
            </CardContent>
          </Card>
          <Card className="bg-white hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Completed Today</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {habits.filter(h => h.status === 'completed').length}
              </div>
              <p className="text-xs text-gray-500">Achievements today</p>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-yellow-500" size={20} />
              <h2 className="text-xl font-semibold text-gray-800">Recommended Habits</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map((recommendation, index) => (
                <Card key={index} className="bg-white hover:shadow-md transition-all">
                  <CardHeader>
                    <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <button
                      onClick={() => handleAddRecommendation(recommendation)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Add this habit
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Habits Grid */}
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