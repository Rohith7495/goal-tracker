'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Goal {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/login');
      return;
    }
    setToken(storedToken);
    fetchGoals(storedToken);
    checkAdminStatus(storedToken);
  }, []);

  const fetchGoals = async (authToken: string) => {
    try {
      const response = await axios.get('/api/goals', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setGoals(response.data);
    } catch (err: any) {
      setError('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const checkAdminStatus = async (authToken: string) => {
    try {
      const response = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      // If the request succeeds, the user is admin
      setIsAdmin(true);
    } catch (err) {
      // User is not admin
      setIsAdmin(false);
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;

    try {
      const response = await axios.post(
        '/api/goals',
        { title: newGoal, description: newDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGoals([...goals, response.data]);
      setNewGoal('');
      setNewDescription('');
    } catch (err) {
      setError('Failed to add goal');
    }
  };

  const handleToggleGoal = async (id: string, completed: boolean) => {
    try {
      const response = await axios.patch(
        `/api/goals/${id}`,
        { completed: !completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGoals(goals.map((g) => (g.id === id ? response.data : g)));
    } catch (err) {
      setError('Failed to update goal');
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      await axios.delete(`/api/goals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(goals.filter((g) => g.id !== id));
    } catch (err) {
      setError('Failed to delete goal');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">My Goals</h1>
          <div className="space-x-4 flex">
            {isAdmin && (
              <button
                onClick={() => router.push('/admin')}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Admin Panel
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleAddGoal} className="mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="What's your next goal?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Add a description (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 h-20"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Add Goal
            </button>
          </div>
        </form>

        {loading ? (
          <div className="text-center text-white">Loading goals...</div>
        ) : goals.length === 0 ? (
          <div className="text-center text-white text-xl">
            No goals yet. Create one to get started!
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="bg-white rounded-lg shadow-lg p-6 flex items-start justify-between hover:shadow-xl transition"
              >
                <div className="flex items-start space-x-4 flex-1">
                  <input
                    type="checkbox"
                    checked={goal.completed}
                    onChange={() => handleToggleGoal(goal.id, goal.completed)}
                    className="w-6 h-6 mt-1 cursor-pointer accent-blue-500"
                  />
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-semibold ${
                        goal.completed
                          ? 'line-through text-gray-400'
                          : 'text-gray-800'
                      }`}
                    >
                      {goal.title}
                    </h3>
                    {goal.description && (
                      <p
                        className={`text-sm ${
                          goal.completed ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        {goal.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Created: {new Date(goal.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="ml-4 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
