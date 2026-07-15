import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Shield, LogOut, User, Trophy, Wallet } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex text-gray-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 glass-panel border-r border-gray-800 flex flex-col justify-between p-6">
        <div>
          <div className="mb-10">
            <Link to="/" className="text-2xl font-extrabold tracking-wider text-secondary neon-text uppercase">
              ArenaVerse
            </Link>
          </div>

          <nav className="space-y-4">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/20 transition-all">
              <Trophy className="w-5 h-5 text-primary" />
              <span>Tournaments</span>
            </Link>
            <Link to="/leaderboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/20 transition-all">
              <Award className="w-5 h-5 text-primary" />
              <span>Leaderboards</span>
            </Link>
            <Link to="/chat" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/20 transition-all">
              <User className="w-5 h-5 text-primary" />
              <span>Team Chat</span>
            </Link>
            <Link to="/ai-tools" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/20 transition-all">
              <User className="w-5 h-5 text-primary" />
              <span>AI Tools</span>
            </Link>
            <Link to="/wallet" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/20 transition-all">
              <Wallet className="w-5 h-5 text-primary" />
              <span>Wallet</span>
            </Link>


            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/20 transition-all">
              <User className="w-5 h-5 text-primary" />
              <span>My Profile</span>
            </Link>
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/20 transition-all text-secondary">
                <Shield className="w-5 h-5" />
                <span>Admin Panel</span>
              </Link>
            )}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-400 transition-all w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Dashboard</h1>
            <p className="text-gray-400 text-sm">Welcome back, {user?.username || 'Gamer'}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-primary/30 text-secondary border border-primary/50 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              {user?.role}
            </span>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
};
