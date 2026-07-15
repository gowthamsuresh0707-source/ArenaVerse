import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Award, ShieldAlert, Zap } from 'lucide-react';

interface LeaderboardPlayer {
  id: string;
  username: string;
  avatarUrl: string | null;
  country: string | null;
  wins: number;
  losses: number;
  kdRatio: number;
}

export const Leaderboard: React.FC = () => {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/leaderboards/players');
        if (res.data.success) {
          setPlayers(res.data.players);
        }
      } catch (err) {
        console.error('Error fetching leaderboards data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="glass-card rounded-2xl p-6 border border-gray-800">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-secondary" />
          <span>Global Player Rankings</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Rank</th>
                <th className="py-4 px-6">Player</th>
                <th className="py-4 px-6">Wins</th>
                <th className="py-4 px-6">Losses</th>
                <th className="py-4 px-6">K/D Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm text-gray-300">
              {players.map((player, idx) => (
                <tr key={player.id} className="hover:bg-white/5 transition-all">
                  <td className="py-4 px-6 font-bold text-secondary">
                    {idx + 1}
                  </td>
                  <td className="py-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {player.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-white">{player.username}</span>
                  </td>
                  <td className="py-4 px-6 text-green-400 font-bold">{player.wins}</td>
                  <td className="py-4 px-6 text-red-400 font-bold">{player.losses}</td>
                  <td className="py-4 px-6 font-bold">{player.kdRatio.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
