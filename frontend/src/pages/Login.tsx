import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuthStore } from '../stores/authStore';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        setAuth(res.data.accessToken, res.data.user);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Verify credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md glass-card neon-border p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>
        <h2 className="text-3xl font-extrabold text-white text-center mb-2 uppercase tracking-wide">ArenaVerse</h2>
        <p className="text-center text-gray-400 text-sm mb-6">Enter the Battle Arena</p>

        {error && (
          <div className="bg-accent/20 border border-accent/40 text-accent p-3 rounded-lg text-sm text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            Login
          </button>
        </form>

        <p className="text-center text-gray-400 text-xs mt-6">
          Don't have an account?{' '}
          <a href="/register" className="text-secondary font-bold hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};
