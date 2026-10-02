import { KeepItem, User } from '../types';

const STORAGE_KEYS = {
  ITEMS: 'keepit_items_v3',
  USER: 'keepit_user_v3',
};

export const DEFAULT_USER: User = {
  id: 'user_default',
  name: 'Hamzah Abdullah',
  email: 'abdulrofihabdullahhamzah@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  createdAt: new Date().toISOString(),
};

// Vault starts completely empty so users add their own items
const SEED_ITEMS: KeepItem[] = [];

export const getStoredUser = (): User => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
      return DEFAULT_USER;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USER;
  }
};

export const updateStoredUser = (updates: Partial<User>): User => {
  const current = getStoredUser();
  const updated = { ...current, ...updates };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
  return updated;
};

export const getStoredItems = (): KeepItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(SEED_ITEMS));
      return SEED_ITEMS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_ITEMS;
  }
};

export const saveItemToStorage = (item: KeepItem): KeepItem[] => {
  const items = getStoredItems();
  const existingIndex = items.findIndex((i) => i.id === item.id);
  let updated: KeepItem[];
  if (existingIndex >= 0) {
    updated = [...items];
    updated[existingIndex] = { ...item, updatedAt: new Date().toISOString() };
  } else {
    updated = [item, ...items];
  }
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(updated));
  return updated;
};

export const deleteItemFromStorage = (id: string): KeepItem[] => {
  const items = getStoredItems().filter((i) => i.id !== id);
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  return items;
};

export const toggleArchiveItem = (id: string): KeepItem[] => {
  const items = getStoredItems().map((i) =>
    i.id === id ? { ...i, isArchived: !i.isArchived, updatedAt: new Date().toISOString() } : i
  );
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  return items;
};

export const togglePinItem = (id: string): KeepItem[] => {
  const items = getStoredItems().map((i) =>
    i.id === id ? { ...i, isPinned: !i.isPinned, updatedAt: new Date().toISOString() } : i
  );
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  return items;
};

export const resetToSampleData = (): void => {
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
};

export const clearAllItems = (): void => {
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify([]));
};
