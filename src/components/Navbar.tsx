import React, { useState, useEffect } from 'react';
import { KeepItLogo } from './KeepItLogo';
import { Plus, Menu, X, Settings as SettingsIcon, LayoutGrid, Compass } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSaveModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab = 'vault',
  onSelectTab,
  onOpenSaveModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollY > 28);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-2 sm:top-3 z-40 w-full px-3 sm:px-6 transition-all duration-500 ease-silk animate-silk-down ${
        isScrolled ? 'max-w-4xl mx-auto' : 'max-w-7xl mx-auto'
      }`}
    >
      <div
        className={`backdrop-blur-xl rounded-2xl sm:rounded-full flex items-center justify-between gap-2 transition-all duration-500 ease-silk ${
          isScrolled
            ? 'bg-white/95 border border-slate-300/90 shadow-lg shadow-slate-900/6 px-3.5 sm:px-5 h-12.5 sm:h-14 scale-[0.99] sm:scale-100'
            : 'bg-white/85 border border-slate-200/90 shadow-xs sm:shadow-sm px-3.5 sm:px-6 h-14 sm:h-16'
        }`}
      >
        {/* Zone 1: Single Brand Zone */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0 transition-transform duration-300">
          <button
            onClick={() => onSelectTab('overview')}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity text-left cursor-pointer shrink-0"
            aria-label="KeepIt Home"
          >
            <KeepItLogo size={isScrolled ? 24 : 'sm'} showText variant="dark" />
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav
          className={`hidden md:flex items-center gap-1 text-xs font-semibold p-1 rounded-full border transition-all duration-500 ease-silk ${
            isScrolled
              ? 'bg-slate-100/90 border-slate-200/90 py-0.5'
              : 'bg-slate-100/70 border-slate-200/60 p-1'
          }`}
        >
          <button
            onClick={() => onSelectTab('overview')}
            className={`transition-all duration-300 ease-silk px-4 py-1.5 rounded-full cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/70'
            }`}
          >
            <span>Overview</span>
          </button>

          <button
            onClick={() => onSelectTab('vault')}
            className={`transition-all duration-300 ease-silk px-4 py-1.5 rounded-full cursor-pointer whitespace-nowrap ${
              activeTab === 'vault' || activeTab === 'all'
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/70'
            }`}
          >
            <span>Your Vault</span>
          </button>

          <button
            onClick={() => onSelectTab('settings')}
            className={`transition-all duration-300 ease-silk px-4 py-1.5 rounded-full cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/70'
            }`}
          >
            <span>Settings</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Settings Icon (Desktop) */}
          <button
            onClick={() => onSelectTab('settings')}
            className={`p-2 rounded-full transition-colors cursor-pointer hidden md:block shrink-0 ${
              activeTab === 'settings'
                ? 'text-slate-900 bg-slate-100'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Vault Settings & Backup"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* Add item button: Single-line, compact on mobile */}
          <button
            onClick={onOpenSaveModal}
            className={`inline-flex items-center justify-center gap-1 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 active:scale-95 transition-all shadow-xs cursor-pointer shrink-0 whitespace-nowrap ${
              isScrolled
                ? 'px-3 py-1.5 sm:px-4 sm:py-2 text-xs'
                : 'px-3.5 py-1.5 sm:px-4.5 sm:py-2 text-xs'
            }`}
            title="Keep Something"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden sm:inline">Keep Something</span>
            <span className="sm:hidden text-[11px]">Keep</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer shrink-0"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl p-3 animate-silk-drawer">
          <div className="flex flex-col space-y-1 text-xs font-semibold text-slate-700">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onSelectTab('overview');
              }}
              className={`text-left py-2.5 px-3 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'overview' ? 'bg-slate-900 text-white font-bold' : 'hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onSelectTab('vault');
              }}
              className={`text-left py-2.5 px-3 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'vault' || activeTab === 'all' ? 'bg-slate-900 text-white font-bold' : 'hover:bg-slate-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Your Vault</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onSelectTab('settings');
              }}
              className={`text-left py-2.5 px-3 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'settings' ? 'bg-slate-900 text-white font-bold' : 'hover:bg-slate-100'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Settings & Export</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
