import React from 'react';
import { KeepItLogo } from './KeepItLogo';
import { Coffee, ExternalLink } from 'lucide-react';

interface FooterProps {
  onStartKeeping: () => void;
  onSelectTab?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onStartKeeping, onSelectTab }) => {
  return (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
        
        {/* Simple Support Note with Normal Color Direction */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
          <p className="text-xs text-slate-600 font-normal leading-relaxed">
            Do you love or enjoy using Keep It? Was it helpful to you? If so, consider supporting development!
          </p>

          <a
            href="https://devameer.xyz/buy-me-a-coffee"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-all shadow-2xs shrink-0 cursor-pointer"
            title="Buy me a coffee"
          >
            <Coffee className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-800 transition-colors" />
            <span>Buy me a coffee</span>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
          </a>
        </div>

        {/* Main Footer Row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-1 pb-4 border-b border-slate-100">
          {/* Brand & Mission */}
          <div className="space-y-1 max-w-sm text-left">
            <KeepItLogo size="sm" showText variant="dark" />
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Keep the things you don't want to lose — links, notes, images, documents, and resources.
            </p>
          </div>

          {/* Essential Navigation Links */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 w-full lg:w-auto justify-between lg:justify-end">
            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-600">
              {onSelectTab && (
                <>
                  <button
                    type="button"
                    onClick={() => onSelectTab('overview')}
                    className="hover:text-slate-950 transition-colors cursor-pointer"
                  >
                    Overview
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectTab('vault')}
                    className="hover:text-slate-950 transition-colors cursor-pointer"
                  >
                    Your Vault
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectTab('settings')}
                    className="hover:text-slate-950 transition-colors cursor-pointer"
                  >
                    Settings
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={onStartKeeping}
                className="text-slate-900 font-bold hover:underline cursor-pointer"
              >
                + Keep Something
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom Minimal Legal Row */}
        <div className="pt-1 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 sm:gap-4">
          <p>© 2026 KeepIt. All rights reserved.</p>
          <span className="text-[11px] text-slate-400">
            Simple, personal, and private by default.
          </span>
        </div>
      </div>
    </footer>
  );
};
