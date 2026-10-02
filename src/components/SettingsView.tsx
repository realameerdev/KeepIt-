import React, { useState } from 'react';
import { User, KeepItem } from '../types';
import {
  updateStoredUser,
  getStoredItems,
  resetToSampleData,
} from '../lib/storage';
import {
  User as UserIcon,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  Bookmark,
  Pin,
  Tag,
} from 'lucide-react';
import { SilkReveal } from './SilkReveal';

interface SettingsViewProps {
  user: User;
  onUserUpdate: (updated: User) => void;
  onRefreshItems: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUserUpdate,
  onRefreshItems,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const items = getStoredItems();
  const totalCount = items.filter((i) => !i.isArchived).length;
  const pinnedCount = items.filter((i) => !i.isArchived && i.isPinned).length;
  const uniqueTagsCount = new Set(items.flatMap((i) => i.tags)).size;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateStoredUser({
      name,
      email,
    });
    onUserUpdate(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportJSON = () => {
    const exportData = {
      user,
      items,
      exportedAt: new Date().toISOString(),
      app: 'KeepIt',
      version: '2.0.0',
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keepit_vault_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Category', 'URL', 'Description', 'Tags', 'Pinned', 'CreatedAt'];
    const rows = items.map((i) => [
      `"${i.id}"`,
      `"${(i.title || '').replace(/"/g, '""')}"`,
      `"${i.category}"`,
      `"${(i.url || '').replace(/"/g, '""')}"`,
      `"${(i.description || '').replace(/"/g, '""')}"`,
      `"${i.tags.join(';')}"`,
      `"${i.isPinned ? 'Yes' : 'No'}"`,
      `"${i.createdAt}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keepit_vault_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.items && Array.isArray(parsed.items)) {
          localStorage.setItem('keepit_items_v2', JSON.stringify(parsed.items));
          if (parsed.user) {
            localStorage.setItem('keepit_user_v2', JSON.stringify(parsed.user));
            onUserUpdate(parsed.user);
          }
          onRefreshItems();
          setImportStatus(`Successfully restored ${parsed.items.length} items to your vault.`);
        } else {
          setImportStatus('Invalid KeepIt backup file format.');
        }
      } catch {
        setImportStatus('Failed to read or parse JSON file.');
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm('Reset your vault to the initial sample items?')) {
      resetToSampleData();
      onRefreshItems();
      onUserUpdate(user);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 animate-in fade-in duration-200 text-left">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Vault Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your personal space and export your data
        </p>
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="p-3 sm:p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile changes saved successfully.</span>
        </div>
      )}

      {importStatus && (
        <div className="p-3 sm:p-4 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Vault Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <SilkReveal delay={0}>
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Total Kept</span>
              <Bookmark className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{totalCount}</div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Stored safely</span>
          </div>
        </SilkReveal>

        <SilkReveal delay={30}>
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Pinned Items</span>
              <Pin className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{pinnedCount}</div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Kept at the top</span>
          </div>
        </SilkReveal>

        <SilkReveal delay={60}>
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Active Tags</span>
              <Tag className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{uniqueTagsCount}</div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Custom topics</span>
          </div>
        </SilkReveal>
      </div>

      {/* Profile Form */}
      <SilkReveal delay={90}>
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8">
          <h2 className="text-base font-bold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-slate-500" />
            Personal Profile
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      </SilkReveal>

      {/* Data Backup & Portability */}
      <SilkReveal delay={120}>
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-5 sm:space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Download className="w-4 h-4 text-slate-500" />
              Data Ownership & Portability
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              You own 100% of what you keep. Export your vault at any time in structured JSON or CSV.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={handleExportJSON}
              className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-white text-left transition-all flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="text-xs font-bold text-slate-900 block">Export JSON Backup</span>
                <span className="text-[11px] text-slate-500">Full structured vault with tags and notes</span>
              </div>
              <Download className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
            </button>

            <button
              onClick={handleExportCSV}
              className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-white text-left transition-all flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="text-xs font-bold text-slate-900 block">Export CSV Spreadsheet</span>
                <span className="text-[11px] text-slate-500">Compatible with Excel, Sheets, and Notion</span>
              </div>
              <Download className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer">
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Import Vault from JSON</span>
                <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
              </label>
            </div>

            <div className="flex items-center justify-center sm:justify-end gap-3">
              <button
                onClick={handleResetData}
                className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1.5 py-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Sample Vault</span>
              </button>
            </div>
          </div>
        </div>
      </SilkReveal>
    </div>
  );
};
