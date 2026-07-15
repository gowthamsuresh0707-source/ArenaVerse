import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuthStore } from '../stores/authStore';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/register', { email, username, password });
      if (res.data.success) {
        setAuth(res.data.accessToken, res.data.user);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Check details.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md glass-card neon-border p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>
        <h2 className="text-3xl font-extrabold text-white text-center mb-2 uppercase tracking-wide">ArenaVerse</h2>
        <p className="text-center text-gray-400 text-sm mb-6">Create your fighter profile</p>

        {error && (
          <div className="bg-accent/20 border border-accent/40 text-accent p-3 rounded-lg text-sm text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-secondary transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-secondary transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-secondary transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-primary to-secondary rounded-lg font-bold text-white uppercase tracking-wider hover:opacity-90 transition mt-6"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-400 text-xs mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-secondary font-bold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};
