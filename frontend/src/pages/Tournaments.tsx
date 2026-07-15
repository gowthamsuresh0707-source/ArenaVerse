import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Trophy, Calendar, Users, DollarSign } from 'lucide-react';

interface Tournament {
  id: string;
  title: string;
  description: string;
  entryFee: string;
  prizePool: string;
  maxTeams: number;
  currentTeamsCount: number;
  startDate: string;
  gameMode: string;
}

export const Tournaments: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await api.get('/tournaments');
        if (res.data.success) {
          setTournaments(res.data.tournaments);
        }
      } catch (err) {
        console.error('Error fetching tournaments', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const handleRegister = async (tournamentId: string) => {
    // Get captain team from API or simulate team registration prompt
    const teamId = prompt('Enter your Team ID to register:');
    if (!teamId) return;

    try {
      const res = await api.post(`/tournaments/${tournamentId}/register`, { teamId });
      if (res.data.success) {
        alert('Successfully registered team to tournament!');
        // Refresh listing
        window.location.reload();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="glass-card rounded-xl p-6 flex flex-col justify-between hover:border-secondary transition-all">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">{tournament.title}</h3>
                <span className="text-xs bg-primary/20 text-secondary border border-primary/50 px-2.5 py-0.5 rounded-full font-semibold uppercase">
                  {tournament.gameMode}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-6 line-clamp-2">{tournament.description}</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>
                    {tournament.currentTeamsCount} / {tournament.maxTeams} Teams
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span>Entry: ₹{tournament.entryFee}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-secondary" />
                  <span className="text-secondary font-semibold">Prize: ₹{tournament.prizePool}</span>
                </div>
              </div>

              <button
                onClick={() => handleRegister(tournament.id)}
                className="w-full mt-2 py-2.5 bg-primary/20 border border-primary/50 text-white font-bold rounded-lg hover:bg-primary hover:border-transparent transition-all uppercase tracking-wider text-xs"
              >
                Register Team
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
