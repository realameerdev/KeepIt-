import React, { useState } from 'react';
import { KeepItem } from '../types';
import {
  ExternalLink,
  Copy,
  Check,
  Pin,
  MoreHorizontal,
  Archive,
  Trash2,
  Edit2,
  HelpCircle,
} from 'lucide-react';

interface ItemCardProps {
  item: KeepItem;
  onEdit: (item: KeepItem) => void;
  onDelete: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onTogglePin: (id: string) => void;
  onSelect: (item: KeepItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  onToggleArchive,
  onTogglePin,
  onSelect,
}) => {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = item.url || item.description || item.title;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className="group relative bg-white border border-slate-200/90 hover:border-slate-400 rounded-xl sm:rounded-2xl p-3.5 sm:p-4.5 flex flex-col justify-between transition-all duration-200 hover:shadow-xs cursor-pointer text-left"
    >
      <div>
        {/* Top bar: Pin, Category & Actions */}
        <div className="flex items-center justify-between gap-1.5 mb-2 sm:mb-2.5">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 min-w-0">
            {item.isPinned && (
              <span className="flex items-center gap-1 font-semibold text-slate-900 shrink-0">
                <Pin className="w-3 h-3 fill-slate-900 text-slate-900" />
                <span className="hidden xs:inline">Pinned</span>
              </span>
            )}
            {item.isPinned && <span aria-hidden="true" className="shrink-0 text-slate-300">·</span>}
            <span className="capitalize truncate max-w-[80px] sm:max-w-none font-medium">{item.category}</span>
            <span aria-hidden="true" className="shrink-0 text-slate-300">·</span>
            <span className="tabular-nums shrink-0">
              {new Date(item.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>

          {/* Quick item actions */}
          <div
            className="flex items-center gap-0.5 opacity-90 sm:opacity-70 group-hover:opacity-100 transition-opacity shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {(item.url || item.description) && (
              <button
                type="button"
                onClick={handleCopy}
                title="Copy Link or Content"
                className="p-1 sm:p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            )}

            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                title="Open Link"
                className="p-1 sm:p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {/* Menu Dropdown Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 sm:p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-30 text-xs text-slate-700 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onEdit(item);
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onTogglePin(item.id);
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Pin className="w-3.5 h-3.5" /> {item.isPinned ? 'Unpin' : 'Pin to Top'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onToggleArchive(item.id);
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Archive className="w-3.5 h-3.5" /> {item.isArchived ? 'Restore' : 'Archive'}
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onDelete(item.id);
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Optional Image Preview */}
        {item.imageUrl && (
          <div className="mb-2.5 rounded-lg sm:rounded-xl overflow-hidden bg-slate-100 border border-slate-100 max-h-32 sm:max-h-36">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-24 sm:h-32 object-cover group-hover:scale-[1.02] transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Title */}
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-slate-800 transition-colors leading-snug tracking-tight mb-1 line-clamp-2">
          {item.title}
        </h3>

        {/* "Why I Kept This" Context */}
        {item.whyKept && (
          <div className="mb-2 p-2 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 font-medium flex items-start gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
            <span className="leading-tight"><strong className="font-bold">Why I kept this:</strong> {item.whyKept}</span>
          </div>
        )}

        {/* Description / Content snippet */}
        {item.description && (
          <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2 font-normal">
            {item.description}
          </p>
        )}

        {/* URL Link representation */}
        {item.url && (
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono mb-2 truncate">
            <span className="truncate hover:underline text-slate-600">
              {item.url.replace(/^https?:\/\//, '')}
            </span>
          </div>
        )}
      </div>

      {/* Footer Meta & Tags */}
      {item.tags.length > 0 && (
        <div className="pt-2 border-t border-slate-100/90 mt-1.5">
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-400 flex-wrap truncate">
            {item.tags.slice(0, 3).map((tag, idx) => (
              <React.Fragment key={tag}>
                <span>#{tag}</span>
                {idx < Math.min(item.tags.length, 3) - 1 && (
                  <span aria-hidden="true" className="text-slate-200">·</span>
                )}
              </React.Fragment>
            ))}
            {item.tags.length > 3 && (
              <span className="text-slate-400">+{item.tags.length - 3}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
