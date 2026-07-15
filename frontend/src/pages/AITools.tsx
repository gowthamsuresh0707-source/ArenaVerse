import React, { useState } from 'react';
import { api } from '../utils/api';
import { Wand2, ShieldCheck, HelpCircle } from 'lucide-react';

export const AITools: React.FC = () => {
  const [gameName, setGameName] = useState('');
  const [prizePool, setPrizePool] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generateDescription = async () => {
    if (!gameName) return;
    setLoading(true);
    try {
      const res = await api.post('/ai/generate-description', {
        gameName,
        prizePool: parseFloat(prizePool || '0'),
      });
      if (res.data.success) {
        setResult(res.data.description);
      }
    } catch (err) {
      console.error(err);
      setResult('Failed to generate description.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="glass-card rounded-2xl p-6 border border-gray-800">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-secondary" />
          <span>AI Tournament Assistant</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Game Name</label>
            <input
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="e.g. Valorant"
              className="w-full bg-white/5 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-secondary transition text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Prize Pool (₹)</label>
            <input
              type="number"
              value={prizePool}
              onChange={(e) => setPrizePool(e.target.value)}
              placeholder="e.g. 50000"
              className="w-full bg-white/5 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-secondary transition text-sm"
            />
          </div>

          <button
            onClick={generateDescription}
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition"
          >
            {loading ? 'Generating...' : 'Generate Description & Rules'}
          </button>
        </div>

        {result && (
          <div className="mt-8 bg-white/5 p-4 rounded-xl border border-gray-800">
            <h4 className="text-sm font-semibold text-secondary uppercase mb-2">Generated Output</h4>
            <p className="text-gray-300 text-sm whitespace-pre-line">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};
