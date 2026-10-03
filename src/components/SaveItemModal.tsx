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
  Sparkles,
  Loader2,
  Check,
} from 'lucide-react';
import { getStoredUser } from '../lib/storage';
import { fetchLinkMetadata } from '../lib/linkMetadata';

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
  const [category, setCategory] = useState<ItemCategory>('link');
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; url?: string; description?: string; imageUrl?: string }>({});
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const [fetchSuccessNotice, setFetchSuccessNotice] = useState(false);

  useEffect(() => {
    if (initialItem) {
      setTitle(initialItem.title || '');
      setDescription(initialItem.description || '');
      setUrl(initialItem.url || '');
      setImageUrl(initialItem.imageUrl || '');
      setCategory(initialItem.category || 'link');
      setTags(initialItem.tags || []);
      setIsPinned(Boolean(initialItem.isPinned));
      setErrors({});
    } else {
      resetForm();
    }
  }, [initialItem, isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setUrl('');
    setImageUrl('');
    setCategory('link');
    setTags([]);
    setNewTagInput('');
    setIsPinned(false);
    setErrors({});
    setIsFetchingMetadata(false);
    setFetchSuccessNotice(false);
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
        if (errors.imageUrl) setErrors((prev) => ({ ...prev, imageUrl: undefined }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger automated metadata fetch when URL is pasted or blurred
  const handleAutoFetchUrl = async (targetUrl: string) => {
    if (!targetUrl.trim()) return;
    let formatted = targetUrl.trim();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = `https://${formatted}`;
      setUrl(formatted);
    }

    setIsFetchingMetadata(true);
    setErrors((prev) => ({ ...prev, url: undefined }));

    try {
      const metadata = await fetchLinkMetadata(formatted);
      if (!title.trim() || title === 'Kept from ' + formatted) {
        setTitle(metadata.title);
      }
      if (!description.trim()) {
        setDescription(metadata.description);
      }
      if (!imageUrl && metadata.imageUrl) {
        setImageUrl(metadata.imageUrl);
      }
      if (metadata.tags && metadata.tags.length > 0) {
        const mergedTags = Array.from(new Set([...tags, ...metadata.tags]));
        setTags(mergedTags);
      }
      setFetchSuccessNotice(true);
      setTimeout(() => setFetchSuccessNotice(false), 3000);
    } catch (err) {
      console.error('Failed to auto-fetch link content', err);
    } finally {
      setIsFetchingMetadata(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; url?: string; description?: string; imageUrl?: string } = {};

    // 1. Title compulsory for all sections
    if (!title.trim()) {
      newErrors.title = 'Title / Name is required';
    }

    // 2. Compulsory field validation per category
    if (category === 'link') {
      if (!url.trim()) {
        newErrors.url = 'Web link (URL) is required for Link items';
      }
    } else if (category === 'note') {
      if (!description.trim()) {
        newErrors.description = 'Note content / details are required for Note items';
      }
    } else if (category === 'image') {
      if (!imageUrl.trim()) {
        newErrors.imageUrl = 'An image upload or image URL is required for Image items';
      }
    } else if (category === 'document') {
      if (!url.trim() && !description.trim()) {
        newErrors.url = 'Document link or document content description is required';
      }
    } else if (category === 'resource') {
      if (!url.trim() && !description.trim()) {
        newErrors.url = 'Resource URL or summary details are required';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
        className="w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              {initialItem ? 'Edit Kept Item' : 'Keep Something'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Every section requires its compulsory information
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
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 grow">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Section / Category <span className="text-red-500">*</span>
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
                    onClick={() => {
                      setCategory(cat.id as ItemCategory);
                      setErrors({});
                    }}
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

          {/* Title (Compulsory for all) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Title / Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder={
                category === 'link'
                  ? 'e.g. Awesome Article Title'
                  : category === 'note'
                  ? 'e.g. Wi-Fi Password & Gate Codes'
                  : 'e.g. Project Inspiration Image'
              }
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 transition-all font-medium ${
                errors.title ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
              </p>
            )}
          </div>

          {/* URL / Link (Compulsory if Link) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                Web Link {category === 'link' ? <span className="text-red-500">*</span> : <span className="text-[11px] font-normal text-slate-400 lowercase">(optional)</span>}
              </label>
              {url.trim() && (
                <button
                  type="button"
                  onClick={() => handleAutoFetchUrl(url)}
                  disabled={isFetchingMetadata}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {isFetchingMetadata ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Extracting Content...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3" />
                      <span>Auto-fetch link content</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (errors.url) setErrors((prev) => ({ ...prev, url: undefined }));
                }}
                onBlur={(e) => {
                  if (e.target.value.trim()) {
                    handleAutoFetchUrl(e.target.value);
                  }
                }}
                placeholder="https://example.com/any-link-at-all"
                className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 transition-all font-mono ${
                  errors.url ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                }`}
              />
            </div>

            {fetchSuccessNotice && (
              <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium animate-in fade-in">
                <Check className="w-3.5 h-3.5" /> Successfully fetched link content & metadata!
              </p>
            )}

            {errors.url && (
              <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.url}
              </p>
            )}
            <p className="text-[11px] text-slate-400">
              Paste any link at all. Our scraping engine automatically fetches the title, description, and preview image.
            </p>
          </div>

          {/* Description / Notes (Compulsory if Note) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Note Content / Summary {category === 'note' ? <span className="text-red-500">*</span> : <span className="text-[11px] font-normal text-slate-400 lowercase">(optional)</span>}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              placeholder={
                category === 'note'
                  ? 'Compulsory note details, passwords, codes, or text...'
                  : 'Key details or summary extracted from link...'
              }
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 transition-all resize-none leading-relaxed ${
                errors.description ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.description}
              </p>
            )}
          </div>

          {/* Image Attachment (Compulsory if Image) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
              Image / Snapshot {category === 'image' ? <span className="text-red-500">*</span> : <span className="text-[11px] font-normal text-slate-400 lowercase">(optional)</span>}
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
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    if (errors.imageUrl) setErrors((prev) => ({ ...prev, imageUrl: undefined }));
                  }}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 transition-all font-mono"
                />
              </div>
            )}
            {errors.imageUrl && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.imageUrl}
              </p>
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
