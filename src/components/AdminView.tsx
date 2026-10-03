import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Database, Activity, TrendingUp, RefreshCw, Lock, Mail, ArrowLeft, LogOut, Eye, X, ExternalLink, HelpCircle } from 'lucide-react';
import { fetchAnalyticsData, AnalyticsMetrics } from '../lib/storage';
import { KeepItLogo } from './KeepItLogo';
import { KeepItem, User } from '../types';

const AUTHORIZED_ADMIN_EMAIL = 'abdulrofihabdullahhamzah@gmail.com';

export const AdminView: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('keepit_admin_email') === AUTHORIZED_ADMIN_EMAIL;
  });
  const [emailInput, setEmailInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedUserForItems, setSelectedUserForItems] = useState<User | null>(null);

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
      setErrorMsg('Invalid administrator credentials.');
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
        <div className="w-full max-w-sm sm:max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left relative z-10">
          <div className="flex items-center justify-between">
            <KeepItLogo size="md" showText variant="white" />
            <a
              href="/"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </a>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-white">Admin Authentication</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter administrator credentials to access system analytics and user items.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter email"
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
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filter items for selected user
  const userItems = selectedUserForItems && metrics
    ? metrics.itemsList.filter((i) => i.userId === selectedUserForItems.id)
    : [];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Admin Header - Mobile Responsive */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
              KeepIt Admin Dashboard
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-400">
              System analytics & user storage inspection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
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
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Analytics Body - Mobile Responsive & Zero Overlap */}
      <main className="grow p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 text-left overflow-y-auto">
        {loading && !metrics ? (
          <div className="py-24 text-center text-sm text-slate-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
            <span>Loading system analytics and user storage from Firestore...</span>
          </div>
        ) : metrics ? (
          <>
            {/* Top Stats Grid - Mobile 2 cols, Tablet 3 cols, Desktop 6 cols */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <div className="bg-slate-950/80 border border-slate-800 p-3.5 sm:p-4 rounded-2xl space-y-1 shadow-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Total Users</span>
                  <Users className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white tabular-nums">{metrics.totalUsers}</div>
                <p className="text-[10px] sm:text-[11px] text-slate-500">Tracked visitors</p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-3.5 sm:p-4 rounded-2xl space-y-1 shadow-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">New (24h)</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white tabular-nums">{metrics.newUsersToday}</div>
                <p className="text-[10px] sm:text-[11px] text-slate-500">Joined past day</p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-3.5 sm:p-4 rounded-2xl space-y-1 shadow-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Returning</span>
                  <Activity className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white tabular-nums">{metrics.returningUsers}</div>
                <p className="text-[10px] sm:text-[11px] text-slate-500">Multiple visits</p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-3.5 sm:p-4 rounded-2xl space-y-1 shadow-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Total Items</span>
                  <Database className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white tabular-nums">{metrics.totalItems}</div>
                <p className="text-[10px] sm:text-[11px] text-slate-500">Vault references</p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-3.5 sm:p-4 rounded-2xl space-y-1 shadow-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Saves/User</span>
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white tabular-nums">{metrics.savesPerUser}</div>
                <p className="text-[10px] sm:text-[11px] text-slate-500">Average per visitor</p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-3.5 sm:p-4 rounded-2xl space-y-1 shadow-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Active (24h)</span>
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white tabular-nums">{metrics.activeUsers24h}</div>
                <p className="text-[10px] sm:text-[11px] text-slate-500">Active past day</p>
              </div>
            </div>

            {/* Users Table with View Storage / Items Action */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  All Signed & Tracked Visitors ({metrics.usersList.length})
                </h2>
                <span className="text-[11px] text-slate-500">Click "View Saved Items" to inspect what each user saved</span>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="w-full text-xs text-left min-w-[650px]">
                  <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3 rounded-l-xl">Visitor ID</th>
                      <th className="p-3">Sessions</th>
                      <th className="p-3">Saved Items Count</th>
                      <th className="p-3">Last Active</th>
                      <th className="p-3 rounded-r-xl text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {metrics.usersList.map((u) => {
                      const count = metrics.itemsList.filter((i) => i.userId === u.id).length;
                      return (
                        <tr key={u.id} className="hover:bg-slate-900/50">
                          <td className="p-3 font-mono text-slate-300">{u.id}</td>
                          <td className="p-3 font-bold text-indigo-400 tabular-nums">{u.sessionCount || 1}</td>
                          <td className="p-3 font-bold text-emerald-400 tabular-nums">{count} items</td>
                          <td className="p-3 text-slate-400">
                            {new Date(u.lastActive || u.createdAt || Date.now()).toLocaleString()}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => setSelectedUserForItems(u)}
                              className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Saved Items</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-xs text-slate-400 py-12">Failed to load analytics metrics.</p>
        )}
      </main>

      {/* User Items Inspection Modal */}
      {selectedUserForItems && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  Visitor Storage: <span className="font-mono text-indigo-400 text-xs">{selectedUserForItems.id}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  {userItems.length} items saved by this user in Firebase
                </p>
              </div>
              <button
                onClick={() => setSelectedUserForItems(null)}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 grow bg-slate-900/50">
              {userItems.length === 0 ? (
                <div className="py-16 text-center text-slate-500 space-y-2">
                  <Database className="w-8 h-8 mx-auto opacity-40 text-slate-400" />
                  <p className="text-xs">No items saved by this visitor yet.</p>
                </div>
              ) : (
                userItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-left"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="capitalize font-bold text-indigo-300">{item.category}</span>
                      <span className="tabular-nums">{new Date(item.createdAt).toLocaleString()}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">{item.title}</h4>

                    {item.whyKept && (
                      <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-900/50 text-xs text-indigo-200 flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span><strong className="font-bold">Why I kept this:</strong> {item.whyKept}</span>
                      </div>
                    )}

                    {item.description && (
                      <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                    )}

                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-sky-400 hover:underline truncate max-w-full"
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.url}</span>
                      </a>
                    )}

                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.tags.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 text-[10px] font-medium bg-slate-900 text-slate-300 rounded-lg border border-slate-800"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
              <span>Synced directly from Firebase Firestore</span>
              <button
                onClick={() => setSelectedUserForItems(null)}
                className="px-4 py-2 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 px-4 sm:px-6 py-4 text-center text-xs text-slate-500 shrink-0">
        KeepIt Secure Admin Console · Authorized access only
      </footer>
    </div>
  );
};
