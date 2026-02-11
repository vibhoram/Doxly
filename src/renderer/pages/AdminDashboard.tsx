import { useState, useEffect, useRef } from 'react';
import { 
  Shield, Users, Activity, TrendingUp, Download, 
  Trash2, Eye, RefreshCw, Radio, Lock, Send, Zap 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const ADMIN_PASSWORD = 'vibhor2026';

interface AnalyticsStats {
  overview: {
    totalEvents: number;
    totalSessions: number;
    activeSessions24h: number;
    maintenance: boolean;
  };
  last24h: {
    events: number;
    toolUsage: Record<string, number>;
  };
  topTools: Array<{ tool: string; count: number }>;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [maintenanceMsg, setMaintenanceMsg] = useState('');
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4777';

  const fetchStats = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/analytics/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = io(apiUrl);
    
    socket.on('admin_event_stream', (event) => {
      setLiveEvents(prev => [event, ...prev].slice(0, 50));
    });

    const interval = setInterval(fetchStats, 10000);
    fetchStats();

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, [isAuthenticated, apiUrl]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success('GOD MODE ACTIVATED 👁️');
    } else {
      toast.error('❌ ACCESS DENIED');
    }
  };

  const handleToggleMaintenance = async () => {
    const active = !stats?.overview.maintenance;
    try {
      await fetch(`${apiUrl}/api/admin/maintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active, message: maintenanceMsg })
      });
      fetchStats();
      toast.success(`System ${active ? 'LOCKED' : 'UNLOCKED'}`);
    } catch (error) {
      toast.error('Control failed');
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg) return;
    try {
      await fetch(`${apiUrl}/api/admin/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: broadcastMsg, type: 'info' })
      });
      setBroadcastMsg('');
      toast.success('Message Broadcasted');
    } catch (error) {
      toast.error('Broadcast failed');
    }
  };

  const handleForceRefresh = async () => {
    if (!confirm('💥 Force refresh ALL users? This will reload every active browser.')) return;
    try {
      await fetch(`${apiUrl}/api/admin/force-refresh`, { method: 'POST' });
      toast.success('Refresh Command Sent');
    } catch (error) {
      toast.error('Command failed');
    }
  };

  const handleWipe = async () => {
    if (!confirm('☢️ WIPE SYSTEM? This clears all analytics and temp files.')) return;
    try {
      await fetch(`${apiUrl}/api/admin/wipe`, { method: 'POST' });
      fetchStats();
      setLiveEvents([]);
      toast.success('System Wiped Clean');
    } catch (error) {
      toast.error('Wipe failed');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-slate-900 border border-white/5 rounded-[2rem] p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)]"
        >
          <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-red-500/10">
            <Shield className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-4xl font-black text-white text-center mb-2 tracking-tighter uppercase italic">GOD MODE</h1>
          <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] text-center mb-10">Doxly Orbital Command</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="System Password"
              className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-white text-center font-black placeholder-slate-600 outline-none focus:border-red-500/50 transition-all text-xl"
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-[0.3em] rounded-2xl transition-all shadow-[0_10px_40px_rgba(220,38,38,0.3)]"
            >
              Authenticate
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-600/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">Orbital Command</h1>
              <p className="text-red-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                Live Network Active
              </p>
            </div>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">Relinquish Power</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Controls */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard icon={Activity} label="Total Actions" value={stats?.overview.totalEvents || 0} color="red" />
              <StatCard icon={Users} label="Active Users" value={stats?.overview.totalSessions || 0} color="blue" />
              <StatCard icon={Radio} label="Live Events" value={liveEvents.length} color="green" />
            </div>

            {/* Broadcast Terminal */}
            <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-3xl">
              <div className="flex items-center gap-4 mb-10">
                <Send className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Global Broadcast</h2>
              </div>
              <form onSubmit={handleBroadcast} className="flex gap-4">
                <input
                  type="text"
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  placeholder="Type a message to show all active users..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-8 py-5 text-white outline-none focus:border-blue-500/50 transition-all font-medium"
                />
                <button type="submit" className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20">Send</button>
              </form>
            </div>

            {/* Live Event Stream */}
            <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-3xl h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <Activity className="w-6 h-6 text-green-400" />
                  <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Real-time Stream</h2>
                </div>
                <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/20" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                   <div className="w-3 h-3 rounded-full bg-green-500/20" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 font-mono text-[11px] pr-4 custom-scrollbar">
                {liveEvents.map((e, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 text-slate-400 group hover:text-white transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-slate-600">[{new Date(e.timestamp).toLocaleTimeString()}]</span>
                      <span className="text-blue-400 font-bold uppercase tracking-tighter">{e.event}</span>
                      {e.tool && <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-300">{e.tool}</span>}
                    </div>
                    <span className="text-[10px] opacity-20">SESSION:{e.sessionId.slice(-6).toUpperCase()}</span>
                  </div>
                ))}
                {liveEvents.length === 0 && <div className="h-full flex items-center justify-center text-slate-600 uppercase italic font-black tracking-widest text-xs opacity-20">Waiting for activity...</div>}
              </div>
            </div>
          </div>

          {/* Side Controls */}
          <div className="space-y-8">
            {/* System Lockdown */}
            <div className={`rounded-[2.5rem] p-10 transition-all duration-700 ${stats?.overview.maintenance ? 'bg-red-600 shadow-[0_0_100px_rgba(220,38,38,0.2)]' : 'bg-slate-900'}`}>
              <div className="flex items-center gap-4 mb-8 text-white">
                <Lock className="w-6 h-6" />
                <h2 className="text-2xl font-black uppercase italic tracking-tight">Lockdown</h2>
              </div>
              <textarea 
                value={maintenanceMsg}
                onChange={(e) => setMaintenanceMsg(e.target.value)}
                placeholder="Lockdown message..."
                className="w-full bg-black/20 border border-white/10 rounded-2xl p-6 text-white text-sm outline-none focus:border-white/20 mb-6 h-32"
              />
              <button 
                onClick={handleToggleMaintenance}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl ${
                  stats?.overview.maintenance 
                    ? 'bg-white text-red-600' 
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {stats?.overview.maintenance ? 'Lift Lockdown' : 'Engage Lockdown'}
              </button>
            </div>

            {/* Lethal Actions */}
            <div className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-10 space-y-6">
              <button 
                onClick={handleForceRefresh}
                className="w-full flex items-center justify-between p-6 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 rounded-2xl transition-all group"
              >
                <div className="text-left">
                  <div className="text-yellow-500 font-black text-xs uppercase tracking-widest mb-1 flex items-center gap-2">
                    <Zap className="w-3 h-3" /> Force Refresh
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">Remote reload all browsers</div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center group-hover:bg-yellow-500 text-yellow-500 group-hover:text-black transition-all">
                  <RefreshCw className="w-4 h-4" />
                </div>
              </button>

              <button 
                onClick={handleWipe}
                className="w-full flex items-center justify-between p-6 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl transition-all group"
              >
                <div className="text-left">
                  <div className="text-red-500 font-black text-xs uppercase tracking-widest mb-1 flex items-center gap-2">
                    <Trash2 className="w-3 h-3" /> System Wipe
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">Clear analytics & temp files</div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center group-hover:bg-red-500 text-red-500 group-hover:text-black transition-all">
                  <Trash2 className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  const colors = {
    red: 'bg-red-600/10 border-red-500/20 text-red-500',
    blue: 'bg-blue-600/10 border-blue-500/20 text-blue-500',
    green: 'bg-green-600/10 border-green-500/20 text-green-500',
  };

  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-3xl">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-4xl font-black text-white mb-2 tracking-tighter">{value.toLocaleString()}</div>
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</div>
    </div>
  );
}

