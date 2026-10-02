import React from 'react';
import { KeepItLogo } from './KeepItLogo';
import { Coffee, ExternalLink } from 'lucide-react';

interface FooterProps {
  onStartKeeping: () => void;
  onSelectTab?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onStartKeeping, onSelectTab }) => {
  return (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          {/* Brand & Mission */}
          <div className="space-y-1.5 max-w-sm text-left">
            <KeepItLogo size="sm" showText variant="dark" />
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Keep the things you don't want to lose — links, notes, images, documents, and resources.
            </p>
          </div>

          {/* Subtle Support Card & Navigation Links */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto justify-between lg:justify-end">
            {/* Buy Me a Coffee Support Card */}
            <a
              href="https://devameer.xyz/buy-me-a-coffee"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200/90 hover:border-amber-200 text-slate-700 hover:text-amber-950 text-xs font-semibold transition-all duration-200 shadow-2xs shrink-0 cursor-pointer"
              title="Support KeepIt development"
            >
              <div className="w-6 h-6 rounded-lg bg-white border border-slate-200/80 group-hover:border-amber-200 flex items-center justify-center text-slate-600 group-hover:text-amber-700 transition-colors shrink-0">
                <Coffee className="w-3.5 h-3.5" />
              </div>
              <span>Buy me a coffee</span>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-amber-600 opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>

            {/* Essential Navigation Links */}
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
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 sm:gap-4">
          <p>© 2026 KeepIt. All rights reserved.</p>
          <span className="text-[11px] text-slate-400">
            Simple, personal, and private by default.
          </span>
        </div>
      </div>
    </footer>
  );
};
