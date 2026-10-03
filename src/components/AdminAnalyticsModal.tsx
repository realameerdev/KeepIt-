import React, { useEffect, useState } from 'react';
import { X, Users, Database, Activity, TrendingUp, ShieldCheck, RefreshCw } from 'lucide-react';
import { fetchAnalyticsData, AnalyticsMetrics } from '../lib/storage';

interface AdminAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminAnalyticsModal: React.FC<AdminAnalyticsModalProps> = ({ isOpen, onClose }) => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
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
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">Admin & Usage Analytics</h2>
              <p className="text-xs text-slate-400">Anonymous user tracking and platform stats</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Refresh Stats"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 bg-slate-50/50 grow">
          {loading && !metrics ? (
            <div className="py-16 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
              <span>Loading analytics metrics...</span>
            </div>
          ) : metrics ? (
            <>
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total Users</span>
                    <Users className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 tabular-nums">{metrics.totalUsers}</div>
                  <p className="text-[11px] text-slate-500">Unique anonymous visitors</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">New Users (24h)</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 tabular-nums">{metrics.newUsersToday}</div>
                  <p className="text-[11px] text-slate-500">Joined in the last 24 hours</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Returning Users</span>
                    <Activity className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 tabular-nums">{metrics.returningUsers}</div>
                  <p className="text-[11px] text-slate-500">Visited multiple times</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total Items Saved</span>
                    <Database className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 tabular-nums">{metrics.totalItems}</div>
                  <p className="text-[11px] text-slate-500">Links, notes, and resources</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Saves / User</span>
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 tabular-nums">{metrics.savesPerUser}</div>
                  <p className="text-[11px] text-slate-500">Average items per visitor</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Active Users (24h)</span>
                    <Users className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 tabular-nums">{metrics.activeUsers24h}</div>
                  <p className="text-[11px] text-slate-500">Active within past day</p>
                </div>
              </div>

              {/* Users Activity Table */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Recent Tracked Visitors ({metrics.usersList.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-600 font-semibold">
                      <tr>
                        <th className="p-2.5 rounded-l-lg">Visitor ID</th>
                        <th className="p-2.5">Sessions</th>
                        <th className="p-2.5">First Joined</th>
                        <th className="p-2.5 rounded-r-lg">Last Active</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {metrics.usersList.slice(0, 10).map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono text-slate-700">{u.id}</td>
                          <td className="p-2.5 font-semibold text-slate-900">{u.sessionCount || 1}</td>
                          <td className="p-2.5 text-slate-500">
                            {new Date(u.createdAt || Date.now()).toLocaleDateString()}
                          </td>
                          <td className="p-2.5 text-slate-500">
                            {new Date(u.lastActive || Date.now()).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-xs text-slate-500 py-10">Unable to load metrics.</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Anonymous user tracking enabled via Firebase</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
