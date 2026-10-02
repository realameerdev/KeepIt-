import React, { useState, useMemo } from 'react';
import { KeepItem, FilterView, SortOrder, ViewMode, User } from '../types';
import { ItemCard } from './ItemCard';
import { ItemRow } from './ItemRow';
import { KeepItLogo } from './KeepItLogo';
import { SilkReveal } from './SilkReveal';
import {
  Search,
  Plus,
  Grid,
  List,
  Pin,
  Archive,
  X,
  Link as LinkIcon,
  FileText,
  Image as ImageIcon,
  FolderOpen,
} from 'lucide-react';

interface DashboardProps {
  items: KeepItem[];
  user: User;
  onOpenSaveModal: () => void;
  onEditItem: (item: KeepItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onTogglePin: (id: string) => void;
  onSelectItem: (item: KeepItem) => void;
  currentFilter: FilterView;
  onChangeFilter: (filter: FilterView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  items,
  user,
  onOpenSaveModal,
  onEditItem,
  onDeleteItem,
  onToggleArchive,
  onTogglePin,
  onSelectItem,
  currentFilter,
  onChangeFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    items.forEach((item) => {
      item.tags.forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet).sort();
  }, [items]);

  // Compute stats
  const activeItemsCount = items.filter((i) => !i.isArchived).length;
  const pinnedCount = items.filter((i) => !i.isArchived && i.isPinned).length;

  // Filter items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Filter by main view
        if (currentFilter === 'archived') {
          if (!item.isArchived) return false;
        } else {
          if (item.isArchived) return false;

          if (currentFilter === 'pinned' && !item.isPinned) return false;
          if (currentFilter === 'links' && item.category !== 'link' && !item.url) return false;
          if (currentFilter === 'notes' && item.category !== 'note') return false;
          if (currentFilter === 'images' && item.category !== 'image' && !item.imageUrl) return false;
          if (currentFilter === 'documents' && item.category !== 'document') return false;
          if (currentFilter === 'resources' && item.category !== 'resource') return false;
        }

        // Filter by Tag
        if (selectedTag && !item.tags.includes(selectedTag)) {
          return false;
        }

        // Filter by Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          const matchUrl = item.url?.toLowerCase().includes(q);
          const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
          return matchTitle || matchDesc || matchUrl || matchTags;
        }

        return true;
      })
      .sort((a, b) => {
        // Pinned items always come first unless viewing archived
        if (currentFilter !== 'archived') {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
        }

        if (sortOrder === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortOrder === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortOrder === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [items, currentFilter, selectedTag, searchQuery, sortOrder]);

  return (
    <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 sm:space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Your Vault
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
            "Keep the things you don't want to lose." · {activeItemsCount} items kept
          </p>
        </div>

        <button
          onClick={onOpenSaveModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Keep Something</span>
        </button>
      </div>

      {/* Search & Filter Controls Toolbar */}
      <div className="space-y-3.5 sm:space-y-4">
        {/* Row 1: Search input + View switcher + Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          {/* Search bar */}
          <div className="relative grow">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, note, link, or #tag..."
              className="w-full pl-10 pr-9 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900 placeholder:text-slate-400 transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort selection */}
          <div className="flex items-center justify-between sm:justify-start gap-2 shrink-0">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="grow sm:grow-0 px-3 py-2 sm:py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-slate-900 cursor-pointer"
            >
              <option value="newest">Recently Kept</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>

            {/* Grid vs List toggle */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Filter Segmented Control */}
        <div className="relative">
          <div className="-mx-3.5 px-3.5 sm:mx-0 sm:px-0 flex items-center gap-1.5 overflow-x-auto py-1 text-xs font-semibold no-scrollbar">
            <button
              onClick={() => onChangeFilter('all')}
              className={`px-3 py-1.5 sm:px-3.5 rounded-lg transition-colors shrink-0 cursor-pointer whitespace-nowrap ${
                currentFilter === 'all'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All Items ({activeItemsCount})
            </button>

            <button
              onClick={() => onChangeFilter('pinned')}
              className={`px-3 py-1.5 sm:px-3.5 rounded-lg transition-colors shrink-0 cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                currentFilter === 'pinned'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Pin className="w-3 h-3" />
              <span>Pinned ({pinnedCount})</span>
            </button>

            <button
              onClick={() => onChangeFilter('links')}
              className={`px-3 py-1.5 sm:px-3.5 rounded-lg transition-colors shrink-0 cursor-pointer whitespace-nowrap ${
                currentFilter === 'links'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Links
            </button>

            <button
              onClick={() => onChangeFilter('notes')}
              className={`px-3 py-1.5 sm:px-3.5 rounded-lg transition-colors shrink-0 cursor-pointer whitespace-nowrap ${
                currentFilter === 'notes'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Notes
            </button>

            <button
              onClick={() => onChangeFilter('images')}
              className={`px-3 py-1.5 sm:px-3.5 rounded-lg transition-colors shrink-0 cursor-pointer whitespace-nowrap ${
                currentFilter === 'images'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Images
            </button>

            <button
              onClick={() => onChangeFilter('documents')}
              className={`px-3 py-1.5 sm:px-3.5 rounded-lg transition-colors shrink-0 cursor-pointer whitespace-nowrap ${
                currentFilter === 'documents'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Documents
            </button>

            <button
              onClick={() => onChangeFilter('resources')}
              className={`px-3 py-1.5 sm:px-3.5 rounded-lg transition-colors shrink-0 cursor-pointer whitespace-nowrap ${
                currentFilter === 'resources'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Resources
            </button>

            <button
              onClick={() => onChangeFilter('archived')}
              className={`px-3 py-1.5 sm:px-3.5 rounded-lg transition-colors shrink-0 cursor-pointer whitespace-nowrap ${
                currentFilter === 'archived'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Archived
            </button>
          </div>
        </div>

        {/* Row 3: Tags Filter bar (if tags exist) */}
        {allTags.length > 0 && (
          <div className="pt-2 border-t border-slate-100/90">
            <div className="-mx-3.5 px-3.5 sm:mx-0 sm:px-0 flex items-center gap-1.5 overflow-x-auto py-1 text-xs text-slate-500 no-scrollbar">
              <span className="shrink-0 text-[11px] font-medium text-slate-400 mr-1 whitespace-nowrap">Filter by tag:</span>
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="font-bold text-slate-900 hover:underline shrink-0 flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg whitespace-nowrap cursor-pointer"
                >
                  Clear #{selectedTag} <X className="w-3 h-3" />
                </button>
              )}
              {allTags.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTag(selectedTag === t ? null : t)}
                  className={`px-2.5 py-1 text-[11px] rounded-lg transition-colors shrink-0 whitespace-nowrap cursor-pointer ${
                    selectedTag === t
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Items Display or Thoughtful Empty State */}
      {filteredItems.length === 0 ? (
        <div className="p-8 sm:p-14 text-center rounded-2xl sm:rounded-3xl bg-white border border-slate-200 max-w-xl mx-auto space-y-4 my-8 sm:my-12">
          <div className="flex justify-center">
            <KeepItLogo size="md" variant="dark" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {searchQuery || selectedTag
                ? 'No matching kept items found'
                : currentFilter === 'archived'
                ? 'No archived items'
                : 'Your vault is ready'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              {searchQuery || selectedTag
                ? 'Try a different keyword or clear your tag filter to find what you need.'
                : currentFilter === 'archived'
                ? 'Items you archive will appear here safely out of the way.'
                : 'Keep links, notes, images, documents, and resources you don’t want to lose.'}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenSaveModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Keep Something</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filteredItems.map((item, index) => (
            <SilkReveal key={item.id} delay={Math.min(index * 30, 240)}>
              <ItemCard
                item={item}
                onEdit={onEditItem}
                onDelete={onDeleteItem}
                onToggleArchive={onToggleArchive}
                onTogglePin={onTogglePin}
                onSelect={onSelectItem}
              />
            </SilkReveal>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item, index) => (
            <SilkReveal key={item.id} delay={Math.min(index * 20, 200)}>
              <ItemRow
                item={item}
                onEdit={onEditItem}
                onDelete={onDeleteItem}
                onToggleArchive={onToggleArchive}
                onTogglePin={onTogglePin}
                onSelect={onSelectItem}
              />
            </SilkReveal>
          ))}
        </div>
      )}
    </div>
  );
};
