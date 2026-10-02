import React, { useState } from 'react';
import { KeepItem } from '../types';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  Edit2,
  Trash2,
  Archive,
  Pin,
  Tag,
  Link as LinkIcon,
  Calendar,
} from 'lucide-react';

interface ItemDetailsModalProps {
  item: KeepItem | null;
  onClose: () => void;
  onEdit: (item: KeepItem) => void;
  onDelete: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  item,
  onClose,
  onEdit,
  onDelete,
  onToggleArchive,
  onTogglePin,
}) => {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const handleCopy = () => {
    const text = [
      item.title,
      item.url ? `URL: ${item.url}` : '',
      item.description ? `Notes:\n${item.description}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh] text-left">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-100">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500">
            <span className="capitalize font-semibold text-slate-800">{item.category}</span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>
                Kept on{' '}
                {new Date(item.createdAt).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onTogglePin(item.id)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                item.isPinned ? 'text-slate-900 bg-slate-100' : 'text-slate-400 hover:text-slate-700'
              }`}
              title={item.isPinned ? 'Unpin item' : 'Pin item'}
            >
              <Pin className={`w-4 h-4 ${item.isPinned ? 'fill-slate-900' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5">
          {/* Attached Image if present */}
          {item.imageUrl && (
            <div className="rounded-xl overflow-hidden bg-slate-100 border border-slate-100 max-h-72">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-auto object-cover max-h-72"
              />
            </div>
          )}

          {/* Title */}
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-slate-900 leading-snug tracking-tight">
              {item.title}
            </h2>
          </div>

          {/* URL section if present */}
          {item.url && (
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <LinkIcon className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs text-slate-700 font-mono truncate">{item.url}</span>
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>Visit Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Description */}
          {item.description && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Notes
              </span>
              <div className="p-3.5 sm:p-4 bg-slate-50 rounded-xl text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {item.description}
              </div>
            </div>
          )}

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3 text-slate-400" />
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onEdit(item);
              }}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onToggleArchive(item.id);
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              title={item.isArchived ? 'Restore item' : 'Archive item'}
            >
              <Archive className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this kept item?')) {
                  onDelete(item.id);
                  onClose();
                }
              }}
              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              title="Delete item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
