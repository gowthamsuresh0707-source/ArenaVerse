import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { ShieldAlert, Users, Award, TrendingUp } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalTournaments: number;
  totalTeams: number;
  totalVolume: string;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Error fetching admin dashboard statistics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1 font-semibold">Total Users</p>
            <h3 className="text-3xl font-extrabold text-white">{stats?.totalUsers || 0}</h3>
          </div>
          <div className="p-4 bg-primary/20 rounded-xl text-primary">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1 font-semibold">Total Teams</p>
            <h3 className="text-3xl font-extrabold text-white">{stats?.totalTeams || 0}</h3>
          </div>
          <div className="p-4 bg-secondary/20 rounded-xl text-secondary">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1 font-semibold">Active Tournaments</p>
            <h3 className="text-3xl font-extrabold text-white">{stats?.totalTournaments || 0}</h3>
          </div>
          <div className="p-4 bg-accent/20 rounded-xl text-accent">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1 font-semibold">Total Transaction Volume</p>
            <h3 className="text-3xl font-extrabold text-white">₹{stats?.totalVolume || '0.00'}</h3>
          </div>
          <div className="p-4 bg-green-500/20 rounded-xl text-green-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};
