import React, { useState, useEffect } from 'react';
import { KeepItem, ItemCategory } from '../types';
import {
  X,
  Link as LinkIcon,
  FileText,
  Image as ImageIcon,
  FolderOpen,
  Pin,
  Tag,
  Upload,
  AlertCircle,
  Bookmark,
} from 'lucide-react';
import { getStoredUser } from '../lib/storage';

interface SaveItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: KeepItem) => void;
  initialItem?: KeepItem | null;
}

const COMMON_TAGS = [
  'Work',
  'Design',
  'Personal',
  'Finance',
  'Health',
  'Reading',
  'Dev',
  'Travel',
  'Home',
  'Important',
];

export const SaveItemModal: React.FC<SaveItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
}) => {
  const user = getStoredUser();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<ItemCategory>('note');
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [errors, setErrors] = useState<{ title?: string }>({});

  useEffect(() => {
    if (initialItem) {
      setTitle(initialItem.title || '');
      setDescription(initialItem.description || '');
      setUrl(initialItem.url || '');
      setImageUrl(initialItem.imageUrl || '');
      setCategory(initialItem.category || 'note');
      setTags(initialItem.tags || []);
      setIsPinned(Boolean(initialItem.isPinned));
    } else {
      resetForm();
    }
  }, [initialItem, isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setUrl('');
    setImageUrl('');
    setCategory('note');
    setTags([]);
    setNewTagInput('');
    setIsPinned(false);
    setErrors({});
  };

  if (!isOpen) return null;

  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        if (category === 'note') setCategory('image');
      };
      reader.readAsDataURL(file);
    }
  };

  // Smart detect category when URL entered
  const handleUrlBlur = () => {
    if (url.trim()) {
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
        setUrl(formattedUrl);
      }
      if (category === 'note') {
        setCategory('link');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrors({ title: 'Please enter a title for what you want to keep' });
      return;
    }

    const itemToSave: KeepItem = {
      id: initialItem ? initialItem.id : 'item-' + Date.now(),
      userId: user.id,
      title: title.trim(),
      description: description.trim(),
      url: url.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      category,
      tags,
      isArchived: initialItem ? initialItem.isArchived : false,
      isPinned,
      createdAt: initialItem ? initialItem.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(itemToSave);
    onClose();
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              {initialItem ? 'Edit Kept Item' : 'Keep Something'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Save what you don't want to lose
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 grow text-left">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Type of Item
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-xs font-medium">
              {[
                { id: 'link', label: 'Link', icon: LinkIcon },
                { id: 'note', label: 'Note', icon: FileText },
                { id: 'image', label: 'Image', icon: ImageIcon },
                { id: 'document', label: 'Document', icon: FolderOpen },
                { id: 'resource', label: 'Resource', icon: Bookmark },
              ].map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id as ItemCategory)}
                    className={`py-2 px-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Title / Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({});
              }}
              placeholder="e.g. Wi-Fi Access Codes, Great Design Article, Coffee Recipe..."
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 transition-all font-medium ${
                errors.title ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
              }`}
              autoFocus
            />
            {errors.title && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
              </p>
            )}
          </div>

          {/* URL / Link */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
              Web Link <span className="text-[11px] font-normal text-slate-400 lowercase">(optional)</span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={handleUrlBlur}
              placeholder="https://example.com/useful-page"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 transition-all font-mono"
            />
          </div>

          {/* Description / Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Notes / Details <span className="text-[11px] font-normal text-slate-400 lowercase">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key notes, passwords, instructions, thoughts, or quotes..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Image Attachment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
              Image or Snapshot <span className="text-[11px] font-normal text-slate-400 lowercase">(optional)</span>
            </label>

            {imageUrl ? (
              <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-100 max-h-44">
                <img
                  src={imageUrl}
                  alt="Attached preview"
                  className="w-full h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg text-xs backdrop-blur-xs transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label className="flex items-center justify-center gap-2 p-2.5 border border-dashed border-slate-300 rounded-xl hover:border-slate-400 hover:bg-slate-50 cursor-pointer transition-colors text-xs font-medium text-slate-600">
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span>Upload Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  placeholder="Or paste image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 transition-all font-mono"
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Tags
            </label>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-800 rounded-lg"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(newTagInput);
                  }
                }}
                placeholder="Add tag and press Enter"
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 transition-all"
              />
              <button
                type="button"
                onClick={() => handleAddTag(newTagInput)}
                className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>

            {/* Suggested quick tags */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[11px] text-slate-400">
              <span>Suggestions:</span>
              {COMMON_TAGS.filter((t) => !tags.includes(t)).slice(0, 5).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => handleAddTag(t)}
                  className="text-slate-600 hover:text-slate-900 hover:underline transition-colors cursor-pointer"
                >
                  +{t}
                </button>
              ))}
            </div>
          </div>

          {/* Options: Pin to top */}
          <div className="pt-2 border-t border-slate-100">
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="rounded text-slate-900 focus:ring-slate-900 w-4 h-4 cursor-pointer"
              />
              <Pin className="w-3.5 h-3.5 text-slate-400" />
              <span>Pin this item to the top of your vault</span>
            </label>
          </div>
        </form>

        {/* Footer actions */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <span>{initialItem ? 'Save Changes' : 'Keep It'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
