import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Wallet, PlusCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Transaction {
  id: string;
  type: string;
  amount: string;
  status: string;
  createdAt: string;
}

export const WalletScreen: React.FC = () => {
  const [balance, setBalance] = useState('0.00');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchWallet = async () => {
    try {
      const res = await api.get('/wallet');
      if (res.data.success && res.data.wallet) {
        setBalance(res.data.wallet.balance);
        setTransactions(res.data.wallet.transactions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    try {
      // Simulate Razorpay transaction ID and payment process callback triggers
      const simulatedPaymentId = 'pay_' + Math.random().toString(36).substr(2, 9);
      const simulatedOrderId = 'order_' + Math.random().toString(36).substr(2, 9);

      const res = await api.post('/wallet/deposit', {
        amount: parseFloat(amount),
        paymentId: simulatedPaymentId,
        orderId: simulatedOrderId,
      });

      if (res.data.success) {
        alert('Simulated Deposit Successful!');
        setAmount('');
        fetchWallet();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Deposit failed');
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Wallet Balance Card & Deposit Form */}
      <div className="space-y-6 lg:col-span-1">
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden neon-border-primary">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/20 rounded-lg text-primary">
              <Wallet className="w-8 h-8" />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Current Wallet Balance</p>
              <h2 className="text-3xl font-black text-white">₹{balance}</h2>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-gray-800">
          <h3 className="text-lg font-bold text-white mb-4">Add Funds (Simulated)</h3>
          <form onSubmit={handleDeposit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Enter Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white/5 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-secondary transition"
                placeholder="e.g. 500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-secondary text-background hover:bg-secondary/90 font-extrabold rounded-lg flex items-center justify-center gap-2 transition"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Simulate Pay via Razorpay</span>
            </button>
          </form>
        </div>
      </div>

      {/* Transaction History panel */}
      <div className="lg:col-span-2">
        <div className="glass-card rounded-2xl p-6 border border-gray-800 h-full">
          <h3 className="text-lg font-bold text-white mb-6">Transaction History</h3>

          {transactions.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No wallet activity logs found.</p>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-96 pr-2">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${tx.type === 'DEPOSIT' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {tx.type === 'DEPOSIT' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white uppercase">{tx.type.replace('_', ' ')}</p>
                      <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${tx.type === 'DEPOSIT' ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.type === 'DEPOSIT' ? '+' : '-'}₹{tx.amount}
                    </p>
                    <span className="text-[10px] bg-white/10 text-gray-400 px-2 py-0.5 rounded uppercase font-semibold">
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
