import React, { useState } from 'react';
import { KeepItLogo } from './KeepItLogo';
import {
  ArrowRight,
  Plus,
  Search,
  Check,
  Bookmark,
  FileText,
  Image as ImageIcon,
  FolderOpen,
  Globe,
  Link as LinkIcon,
  ShieldCheck,
  ExternalLink,
  Tag,
  HelpCircle,
  Pin,
  Folder,
  X,
  Layers,
  MessageSquare,
  Smartphone,
} from 'lucide-react';
import { KeepItem } from '../types';

interface LandingPageProps {
  onStartKeeping: () => void;
  onOpenVault: () => void;
  sampleItems: KeepItem[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartKeeping,
  onOpenVault,
  sampleItems,
}) => {
  const [quickInput, setQuickInput] = useState('');
  const [interactiveItems, setInteractiveItems] = useState<KeepItem[]>(sampleItems.slice(0, 4));
  const [addedNotice, setAddedNotice] = useState(false);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;

    const isUrl =
      quickInput.startsWith('http://') ||
      quickInput.startsWith('https://') ||
      quickInput.includes('.com') ||
      quickInput.includes('.org') ||
      quickInput.includes('.io');

    const newItem: KeepItem = {
      id: 'preview-' + Date.now(),
      userId: 'demo',
      title: quickInput.trim(),
      description: isUrl ? 'Saved web link' : 'Quick note kept safely',
      url: isUrl ? (quickInput.startsWith('http') ? quickInput : `https://${quickInput}`) : undefined,
      category: isUrl ? 'link' : 'note',
      tags: ['Personal', isUrl ? 'Web' : 'QuickKeep'],
      isArchived: false,
      isPinned: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setInteractiveItems([newItem, ...interactiveItems]);
    setQuickInput('');
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div className="w-full bg-[#FAFAFA] text-slate-900 overflow-hidden">
      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section className="relative pt-8 sm:pt-16 pb-12 sm:pb-20 px-3.5 sm:px-6 lg:px-8 max-w-6xl mx-auto bg-dot-pattern">
        <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200/80 text-[11px] sm:text-xs font-semibold text-slate-700">
            <KeepItLogo size="xs" variant="dark" />
            <span>A quiet place for what matters</span>
          </div>

          {/* Core Product Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-[-0.04em] leading-[1.08] text-balance">
            Keep the things you don't want to lose.
          </h1>

          {/* Short, natural subtitle */}
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl mx-auto text-balance px-2">
            One simple place to save the links, notes, images, documents, and little things you know you'll need again.
          </p>

          {/* Direct CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 px-4 sm:px-0">
            <button
              onClick={onStartKeeping}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-950 text-white font-bold text-xs sm:text-sm rounded-full hover:bg-slate-800 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <span>Start Keeping — It's Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenVault}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-slate-800 font-semibold text-xs sm:text-sm rounded-full border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
            >
              <span>Open Your Vault</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            TACTILE LIVE VAULT PREVIEW (Interactive)
            ========================================================================= */}
        <div className="mt-8 sm:mt-12 max-w-4xl mx-auto">
          <div className="relative rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-6 shadow-lg shadow-slate-200/40">
            {/* Quick Capture Bar */}
            <div className="pb-3.5 mb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="text-xs font-semibold text-slate-400 ml-1.5">Interactive Preview</span>
              </div>

              {/* Try quick add */}
              <form onSubmit={handleQuickAdd} className="flex items-center gap-2 w-full sm:w-auto grow max-w-md sm:ml-auto">
                <input
                  type="text"
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  placeholder="Type a link or note to keep..."
                  className="grow min-w-0 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 transition-all font-medium text-slate-800"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
                >
                  Keep It
                </button>
              </form>
            </div>

            {/* Notification alert banner */}
            {addedNotice && (
              <div className="mb-3 p-2.5 bg-slate-950 text-white text-xs rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Item kept safely in your vault.
                </span>
                <button onClick={() => setAddedNotice(false)} className="text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Preview items grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {interactiveItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition-all space-y-2 text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                      {item.category}
                    </span>
                    {item.isPinned && (
                      <span className="flex items-center gap-0.5 text-[10px] font-semibold text-slate-400">
                        <Pin className="w-3 h-3" /> Pinned
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  {item.url && (
                    <div className="text-[11px] text-slate-600 hover:underline flex items-center gap-1 truncate pt-1">
                      <LinkIcon className="w-3 h-3 shrink-0" />
                      <span className="truncate">{item.url}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom preview note */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
              <span>Your vault is stored locally and stays completely private.</span>
              <button
                onClick={onOpenVault}
                className="font-bold text-slate-900 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Launch Full Vault</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: WHAT IS KEEPIT?
          ========================================================================= */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-200/60 text-center">
        <div className="space-y-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            What is KeepIt?
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-[-0.03em] leading-tight">
            A simple personal space for the things that matter to you.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            KeepIt gives you one simple place to save the links, notes, images, documents, and little things you know you'll need again. No clutter, no feeds, and no algorithms — just your things, kept safe.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: THE EVERYDAY PROBLEM KEEPIT SOLVES
          ========================================================================= */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-200/60">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-12">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            The Problem
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Ever saved something somewhere and couldn't find it later?
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            We find valuable things every single day. But they end up scattered everywhere:
          </p>
        </div>

        {/* Visual comparison of the scattered places */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 text-center space-y-2 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-600">
              <Bookmark className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Bookmarks</h4>
            <p className="text-[11px] text-slate-500 leading-tight">Hundreds of buried browser links</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 text-center space-y-2 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-600">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Random Notes</h4>
            <p className="text-[11px] text-slate-500 leading-tight">Scattered across phone note apps</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 text-center space-y-2 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-600">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Screenshots</h4>
            <p className="text-[11px] text-slate-500 leading-tight">Lost under thousands of photos</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 text-center space-y-2 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-600">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Self-Chats</h4>
            <p className="text-[11px] text-slate-500 leading-tight">Messages texted to yourself in chat</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 text-center space-y-2 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-600">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">50 Open Tabs</h4>
            <p className="text-[11px] text-slate-500 leading-tight">Hoarded until the browser crashes</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 text-center space-y-2 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-600">
              <Folder className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Downloads</h4>
            <p className="text-[11px] text-slate-500 leading-tight">Unorganized folders of files</p>
          </div>
        </div>

        {/* Resolution callout */}
        <div className="mt-8 p-5 rounded-2xl bg-slate-900 text-white text-center max-w-2xl mx-auto space-y-1.5">
          <p className="text-xs sm:text-sm text-slate-300">
            You remember that you saved it — but you don't remember where.
          </p>
          <p className="text-sm sm:text-base font-bold text-white">
            KeepIt provides one simple, dedicated place to keep them.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: WHAT CAN YOU KEEP?
          ========================================================================= */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-200/60">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-12">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            What Can You Keep?
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Anything worth keeping.
          </h2>
          <p className="text-sm text-slate-600">
            KeepIt isn't restricted to one kind of content. Store whatever you know you'll want later:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Links */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2.5 shadow-xs hover:border-slate-300 transition-all">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <LinkIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Links</span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">That article you want to read later</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Articles, blog posts, YouTube videos, and websites you don't want to lose track of.
            </p>
          </div>

          {/* Card 2: Notes */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2.5 shadow-xs hover:border-slate-300 transition-all">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Notes</span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">That idea you don't want to forget</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Thoughts, project concepts, book recommendations, meeting takeaways, and quick drafts.
            </p>
          </div>

          {/* Card 3: Images */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2.5 shadow-xs hover:border-slate-300 transition-all">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Images</span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">That reference you know you'll need</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Design mockups, architecture photos, charts, visual moodboards, and inspiration.
            </p>
          </div>

          {/* Card 4: Documents */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2.5 shadow-xs hover:border-slate-300 transition-all">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Documents</span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">That file you want easy access to</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Important PDFs, receipts, boarding passes, cheat sheets, and guidelines.
            </p>
          </div>

          {/* Card 5: Resources */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2.5 shadow-xs hover:border-slate-300 transition-all">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Resources</span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">That useful tool you keep coming back to</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Online calculators, developer references, color tools, and helpful databases.
            </p>
          </div>

          {/* Card 6: Important Information */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2.5 shadow-xs hover:border-slate-300 transition-all">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Important Information</span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">Codes, addresses, and key details</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Wi-Fi passwords, gate codes, passport numbers, doctor contacts, and locker combinations.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: HOW IT WORKS (3 Simple Steps)
          ========================================================================= */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-200/60">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-12">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            KeepIt in three simple steps.
          </h2>
          <p className="text-sm text-slate-600">
            No complex workflows or setup. It takes three seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 space-y-3.5 text-left">
            <span className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight leading-none block">
              01
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Find something worth keeping.
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              A link, an article, a photo, an address, or an idea you know you'll want later.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 space-y-3.5 text-left">
            <span className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight leading-none block">
              02
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Save it to KeepIt.
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Paste the link, drop the image, or write down the note. Add an optional #tag.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 space-y-3.5 text-left">
            <span className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight leading-none block">
              03
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Find it whenever you need it.
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Search by title, tag, or keyword anytime. It's right where you left it.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: WHY KEEPIT?
          ========================================================================= */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-200/60">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-12">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Why KeepIt?
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Simplicity is the whole point.
          </h2>
          <p className="text-sm text-slate-600">
            Most tools try to do everything and end up bloated. KeepIt does one thing well:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">One Place</span>
            <h3 className="text-sm font-bold text-slate-900">Stop scattering important things across different apps</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Instead of checking three note apps, your browser history, and your chat messages, keep them in one dedicated place.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">Easy to Find</span>
            <h3 className="text-sm font-bold text-slate-900">Search and find what you've kept when you need it</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Instant keyword search and simple tag filters ensure you find any saved item in seconds.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">Simple</span>
            <h3 className="text-sm font-bold text-slate-900">No complicated setup. Just keep what matters</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No mandatory accounts, no bloated enterprise features, and no learning curve. Just open and keep.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">Personal & Private</span>
            <h3 className="text-sm font-bold text-slate-900">Your saved things, organized your way</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Stored safely on your device with full export options (JSON & CSV) at any time. You own 100% of your data.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: REAL-LIFE USE CASES
          ========================================================================= */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-200/60">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-12">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Real-Life Use Cases
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            When do people use KeepIt?
          </h2>
          <p className="text-sm text-slate-600">
            Real situations where people quickly put something into KeepIt:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-xs text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Links
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
              "I found a website I'll need next month."
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Saved to KeepIt under #Resources so it doesn't get lost in browser tabs.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-xs text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Articles
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
              "There's a tutorial I don't want to lose."
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bookmarked with personal notes so you can reference it when building.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-xs text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Notes
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
              "I have an idea I want to come back to."
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Quickly typed into KeepIt in 5 seconds before the inspiration slips away.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-xs text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Documents
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
              "I need to keep this document somewhere."
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              An important policy PDF, receipt, or confirmation number kept safe.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-xs text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Images
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
              "I found an image I want to use as reference."
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              A color scheme, room interior, or UI design pattern saved for later.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-xs text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Information
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
              "I want to save this information before I forget."
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Wi-Fi credentials, gate access pin, or family doctor contact number.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FINAL MEMORABLE CTA
          ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-200/60 text-center">
        <div className="space-y-4 sm:space-y-5">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
            Found something worth keeping?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto">
            Don't let the important things get lost. Keep them in your personal vault.
          </p>

          <div className="pt-3">
            <button
              onClick={onStartKeeping}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-slate-950 text-white font-bold text-xs sm:text-sm rounded-full hover:bg-slate-800 active:scale-95 transition-all shadow-md shadow-slate-950/10 cursor-pointer"
            >
              <span>Keep Something Now — It's Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
