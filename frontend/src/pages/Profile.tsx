import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { User, Award, Globe, Edit2, CheckCircle } from 'lucide-react';

interface Profile {
  username: string;
  email: string;
  bio: string;
  country: string;
  age: number;
  avatarUrl: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  kdRatio: number;
}

export const ProfileScreen: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('');
  const [age, setAge] = useState<number>(18);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/me');
      if (res.data.success) {
        setProfile(res.data.user);
        setBio(res.data.user.bio || '');
        setCountry(res.data.user.country || '');
        setAge(res.data.user.age || 18);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put('/users/me', { bio, country, age });
      if (res.data.success) {
        alert('Profile updated successfully!');
        setEditing(false);
        fetchProfile();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
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
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Profile summary card */}
      <div className="md:col-span-1 glass-card rounded-2xl p-6 text-center border border-gray-800">
        <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto flex items-center justify-center text-primary mb-4 border-2 border-secondary relative">
          <User className="w-12 h-12" />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">{profile?.username}</h3>
        <p className="text-gray-400 text-sm mb-4">{profile?.email}</p>
        <span className="bg-primary/20 text-secondary border border-primary/50 text-xs px-3 py-1 rounded-full uppercase font-bold tracking-wider">
          Pro Esports Player
        </span>

        <div className="grid grid-cols-3 gap-2 mt-8 text-center bg-white/5 p-4 rounded-xl border border-gray-800">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Matches</p>
            <h4 className="text-lg font-bold text-white">{profile?.matchesPlayed}</h4>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Wins</p>
            <h4 className="text-lg font-bold text-green-400">{profile?.wins}</h4>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">K/D</p>
            <h4 className="text-lg font-bold text-secondary">{profile?.kdRatio.toFixed(2)}</h4>
          </div>
        </div>
      </div>

      {/* Editor or Settings Panel details */}
      <div className="md:col-span-2">
        <div className="glass-card rounded-2xl p-6 border border-gray-800 h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Profile Details</h3>
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-2 text-sm text-secondary hover:underline font-bold"
            >
              <Edit2 className="w-4 h-4" />
              <span>{editing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>

          {!editing ? (
            <div className="space-y-6 text-gray-300">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Biography</p>
                <p className="bg-white/5 p-4 rounded-xl border border-gray-800 text-sm">
                  {profile?.bio || 'Write something about your gaming achievements and skills...'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Country</p>
                  <p className="flex items-center gap-2 text-white font-semibold">
                    <Globe className="w-4 h-4 text-primary" />
                    <span>{profile?.country || 'Not Specified'}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Age</p>
                  <p className="flex items-center gap-2 text-white font-semibold">
                    <Award className="w-4 h-4 text-primary" />
                    <span>{profile?.age || 'Not Specified'}</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-white/5 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary transition text-sm"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-white/5 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value))}
                    className="w-full bg-white/5 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary transition text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-primary to-secondary rounded-lg font-bold text-white flex items-center justify-center gap-2 transition"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
