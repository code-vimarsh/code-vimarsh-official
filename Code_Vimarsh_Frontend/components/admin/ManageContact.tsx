import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, Trash2, Clock, AlertCircle } from 'lucide-react';
import api from '../../services/api';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'Open' | 'Resolved';
  created_at: string;
}

const ManageContact: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/contact');
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Open' ? 'Resolved' : 'Open';
    try {
      const res = await api.patch(`/contact/${id}/status`, { status: newStatus });
      if (res.data.success) {
        setMessages(messages.map(m => m.id === id ? { ...m, status: newStatus as any } : m));
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this message?")) return;
    setDeletingId(id);
    try {
      const res = await api.delete(`/contact/${id}`);
      if (res.data.success) {
        setMessages(messages.filter(m => m.id !== id));
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete message');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-textMuted">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-3"></div>
        Loading messages...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
        <AlertCircle size={18} />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="text-primary" size={24} />
            Contact Messages
          </h2>
          <p className="text-sm text-textMuted mt-1">View and manage inquiries from the website contact form</p>
        </div>
        <div className="bg-surfaceLight/50 px-4 py-2 rounded-lg border border-surfaceLight text-sm text-textMuted">
          Total Messages: <span className="text-white font-bold">{messages.length}</span>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-xl border border-surfaceLight border-dashed">
          <Mail size={32} className="mx-auto text-textMuted mb-3 opacity-50" />
          <h3 className="text-white font-medium">No messages yet</h3>
          <p className="text-sm text-textMuted mt-1">When users submit the contact form, their messages will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className={`bg-surface border rounded-xl p-5 transition-colors ${
                msg.status === 'Open' ? 'border-primary/30' : 'border-surfaceLight opacity-75'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">{msg.subject}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm">
                        <span className="text-gray-300 font-medium">{msg.name}</span>
                        <span className="text-textMuted px-2 border-l border-surfaceLight">
                          <a href={`mailto:${msg.email}`} className="hover:text-primary transition-colors">{msg.email}</a>
                        </span>
                        <span className="text-textMuted text-xs px-2 border-l border-surfaceLight flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                      msg.status === 'Open' 
                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' 
                        : 'bg-green-500/10 text-green-400 border-green-500/20'
                    }`}>
                      {msg.status}
                    </span>
                  </div>

                  <div className="bg-bgDark/50 p-4 rounded-lg text-sm text-gray-300 whitespace-pre-wrap leading-relaxed border border-surfaceLight/50">
                    {msg.message}
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 pt-1">
                  <button
                    onClick={() => toggleStatus(msg.id, msg.status)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      msg.status === 'Open'
                        ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20'
                        : 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/20'
                    }`}
                  >
                    <CheckCircle size={16} />
                    {msg.status === 'Open' ? 'Mark Resolved' : 'Reopen'}
                  </button>
                  
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    disabled={deletingId === msg.id}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 transition-all disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    {deletingId === msg.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageContact;
