export type ItemCategory = 'link' | 'note' | 'image' | 'document' | 'resource' | 'other';

export interface KeepItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  whyKept?: string; // "Why I kept this" context
  url?: string;
  imageUrl?: string;
  documentName?: string;
  tags: string[];
  category: ItemCategory;
  isArchived: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  lastActive?: string;
  sessionCount?: number;
}

export type FilterView =
  | 'all'
  | 'pinned'
  | 'links'
  | 'notes'
  | 'images'
  | 'documents'
  | 'resources'
  | 'archived'
  | 'inbox'
  | 'timeline';

export type SortOrder = 'newest' | 'oldest' | 'title';
export type ViewMode = 'grid' | 'list';
