'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export default function AdminProfile() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/login');
      return;
    }
    setToken(storedToken);
    fetchUsers(storedToken);
  }, []);

  const fetchUsers = async (authToken: string) => {
    try {
      const response = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUsers(response.data);
      setError('');
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('You do not have admin privileges');
        setTimeout(() => router.push('/dashboard'), 2000);
      } else {
        setError('Failed to load users');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    try {
      await axios.delete(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u.id !== userId));
      setSuccess(`User ${userEmail} deleted successfully`);
      setDeleteConfirm(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Cannot delete admin accounts');
      } else {
        setError('Failed to delete user');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/admin/promote')}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Promote User
            </button>
            <button
              onClick={handleBackToDashboard}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {loading ? (
          <div className="text-center text-white text-xl">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="text-center text-white text-xl">
            No users found
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-800">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-800">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-800">
                      Joined Date
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-800">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-900">{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            user.isAdmin
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {user.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {!user.isAdmin && (
                          <div className="relative">
                            {deleteConfirm === user.id ? (
                              <div className="space-x-2">
                                <button
                                  onClick={() =>
                                    handleDeleteUser(user.id, user.email)
                                  }
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition text-sm"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded transition text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(user.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                        {user.isAdmin && (
                          <span className="text-gray-500 text-sm">
                            Admin (Protected)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-100 px-6 py-4">
              <p className="text-gray-600 text-sm">
                Total Users: <span className="font-semibold">{users.length}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
