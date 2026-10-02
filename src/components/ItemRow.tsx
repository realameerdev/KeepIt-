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
} from 'lucide-react';

interface ItemRowProps {
  item: KeepItem;
  onEdit: (item: KeepItem) => void;
  onDelete: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onTogglePin: (id: string) => void;
  onSelect: (item: KeepItem) => void;
}

export const ItemRow: React.FC<ItemRowProps> = ({
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
      className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-3.5 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl transition-all duration-150 cursor-pointer gap-2.5 sm:gap-3 text-left"
    >
      <div className="flex items-start sm:items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
        {/* Pin button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(item.id);
          }}
          className="text-slate-300 hover:text-slate-900 mt-0.5 sm:mt-0 p-1 cursor-pointer"
          title={item.isPinned ? 'Pinned' : 'Pin to top'}
        >
          <Pin
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
              item.isPinned ? 'fill-slate-900 text-slate-900' : 'text-slate-300'
            }`}
          />
        </button>

        {/* Thumbnail if present */}
        {item.imageUrl && (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100 hidden xs:block">
            <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate tracking-tight">
            {item.title}
          </h4>

          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500 mt-0.5 flex-wrap">
            <span className="capitalize font-medium">{item.category}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="tabular-nums">
              {new Date(item.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </span>
            {item.tags.length > 0 && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-400 truncate">
                  {item.tags.map((t) => `#${t}`).join(' ')}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Row actions */}
      <div
        className="flex items-center gap-1 self-end sm:self-center shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {(item.url || item.description) && (
          <button
            type="button"
            onClick={handleCopy}
            title="Copy Content"
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
  );
};
