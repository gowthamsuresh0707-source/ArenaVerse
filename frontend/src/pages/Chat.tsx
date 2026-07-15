import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { api } from '../utils/api';
import { Send, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  senderId: string;
  senderUsername: string;
  content: string;
  createdAt: string;
}

export const TeamChat: React.FC = () => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [socket, setSocket] = useState<any>(null);

  // Default team channel for demonstration purposes
  const teamId = 'demo-team-id';

  useEffect(() => {
    // 1. Fetch channel messages history logs
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/chat/history?teamId=${teamId}`);
        if (res.data.success) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchHistory();
  }, [teamId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await api.post('/chat', {
        teamId,
        content: text,
      });

      if (res.data.success) {
        setText('');
        // Locally append to update view immediately
        const newMsg: ChatMessage = {
          id: res.data.message.id,
          senderId: user!.userId,
          senderUsername: user!.username,
          content: text,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, newMsg]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto glass-card rounded-2xl border border-gray-800 flex flex-col h-[500px]">
      {/* Header Channel metadata */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider">Team Discussion</h3>
        <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/50 px-3 py-1 rounded-full font-bold uppercase">
          Live Connection Active
        </span>
      </div>

      {/* Messages stream view list */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === user!.userId;
          return (
            <div key={msg.id} className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                {msg.senderUsername ? msg.senderUsername.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className={`p-3 rounded-xl max-w-md ${isMe ? 'bg-primary text-white' : 'bg-white/5 border border-gray-800 text-gray-200'}`}>
                <p className="text-xs text-secondary font-semibold mb-1">{msg.senderUsername || 'Teammate'}</p>
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Outgoing Message form panel */}
      <form onSubmit={handleSend} className="p-4 border-t border-gray-800 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Send message to team chat..."
          className="flex-1 bg-white/5 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary transition text-sm"
        />
        <button
          type="submit"
          className="p-3 bg-secondary text-background hover:bg-secondary/90 rounded-lg transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
