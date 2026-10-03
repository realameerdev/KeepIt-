import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Database, Activity, TrendingUp, RefreshCw, Lock, Mail, ArrowLeft, LogOut } from 'lucide-react';
import { fetchAnalyticsData, AnalyticsMetrics } from '../lib/storage';
import { KeepItLogo } from './KeepItLogo';

const AUTHORIZED_ADMIN_EMAIL = 'abdulrofihabdullahhamzah@gmail.com';

export const AdminView: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('keepit_admin_email') === AUTHORIZED_ADMIN_EMAIL;
  });
  const [emailInput, setEmailInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await fetchAnalyticsData();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAnalytics();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleaned = emailInput.trim().toLowerCase();
    if (cleaned === AUTHORIZED_ADMIN_EMAIL) {
      localStorage.setItem('keepit_admin_email', AUTHORIZED_ADMIN_EMAIL);
      setIsAuthenticated(true);
    } else {
      setErrorMsg('Access denied. Only authorized admin email is permitted.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('keepit_admin_email');
    setIsAuthenticated(false);
    setEmailInput('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-left">
          <div className="flex items-center justify-between">
            <KeepItLogo size="md" showText variant="white" />
            <a
              href="/"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to App
            </a>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-white">Admin Authentication</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Restricted area. Enter your authorized administrator email to access KeepIt system analytics.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Authorized Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="abdulrofihabdullahhamzah@gmail.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 font-medium bg-red-950/40 border border-red-900/50 p-2.5 rounded-xl">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              Authenticate & Access Dashboard
            </button>
          </form>

          <p className="text-[11px] text-slate-500 text-center">
            Locked to: <span className="font-mono text-slate-400">{AUTHORIZED_ADMIN_EMAIL}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Admin Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
              KeepIt Admin Dashboard
            </h1>
            <p className="text-xs text-slate-400">
              Authorized: <span className="text-emerald-400 font-mono">{AUTHORIZED_ADMIN_EMAIL}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAnalytics}
            disabled={loading}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <a
            href="/"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>App</span>
          </a>
          <button
            onClick={handleLogout}
            className="px-3 py-2 bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-900/50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </header>

      {/* Main Analytics Body */}
      <main className="grow p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6 text-left">
        {loading && !metrics ? (
          <div className="py-24 text-center text-sm text-slate-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
            <span>Loading system analytics from Firestore...</span>
          </div>
        ) : metrics ? (
          <>
            {/* Top Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Total Users</span>
                  <Users className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-black text-white tabular-nums">{metrics.totalUsers}</div>
                <p className="text-[11px] text-slate-500">Anonymous visitors</p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-bold uppercase tracking-wider">New (24h)</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white tabular-nums">{metrics.newUsersToday}</div>
                <p className="text-[11px] text-slate-500">Joined past day</p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Returning</span>
                  <Activity className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-white tabular-nums">{metrics.returningUsers}</div>
                <p className="text-[11px] text-slate-500">Multiple sessions</p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Total Items</span>
                  <Database className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-black text-white tabular-nums">{metrics.totalItems}</div>
                <p className="text-[11px] text-slate-500">Vault references</p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Saves/User</span>
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-white tabular-nums">{metrics.savesPerUser}</div>
                <p className="text-[11px] text-slate-500">Average per visitor</p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Active (24h)</span>
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white tabular-nums">{metrics.activeUsers24h}</div>
                <p className="text-[11px] text-slate-500">Active past day</p>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Tracked Anonymous Visitors ({metrics.usersList.length})
                </h2>
                <span className="text-[11px] text-slate-500">Synced in real-time with Firestore</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3 rounded-l-xl">Visitor ID</th>
                      <th className="p-3">Session Count</th>
                      <th className="p-3">First Joined</th>
                      <th className="p-3 rounded-r-xl">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {metrics.usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-900/50">
                        <td className="p-3 font-mono text-slate-300">{u.id}</td>
                        <td className="p-3 font-bold text-indigo-400 tabular-nums">{u.sessionCount || 1}</td>
                        <td className="p-3 text-slate-400">
                          {new Date(u.createdAt || Date.now()).toLocaleString()}
                        </td>
                        <td className="p-3 text-slate-400">
                          {new Date(u.lastActive || Date.now()).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-xs text-slate-400 py-12">Failed to load analytics metrics.</p>
        )}
      </main>

      {/* Admin Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 px-6 py-4 text-center text-xs text-slate-500">
        KeepIt Secure Admin Console · Authorized access only
      </footer>
    </div>
  );
};
