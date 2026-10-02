import { KeepItem, User } from '../types';

const STORAGE_KEYS = {
  ITEMS: 'keepit_items_v2',
  USER: 'keepit_user_v2',
};

export const DEFAULT_USER: User = {
  id: 'user_default',
  name: 'Hamzah Abdullah',
  email: 'abdulrofihabdullahhamzah@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  createdAt: new Date('2026-01-15T00:00:00Z').toISOString(),
};

// Seed items reflecting real-life things people keep so they don't lose them
const SEED_ITEMS: KeepItem[] = [
  {
    id: 'item-1',
    userId: 'user_default',
    title: 'Apartment Wi-Fi & Building Access Codes',
    description: 'Network: Greenleaf_5G. Password: Willow&Stones2026. Gate buzzer: #4092. Package locker access pin: 8812.',
    tags: ['Home', 'Important', 'Codes'],
    category: 'note',
    isArchived: false,
    isPinned: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'item-2',
    userId: 'user_default',
    title: 'The Architecture of Open Source Applications',
    description: 'Essential reference book chapters covering scalable web systems, data architecture, and audio processing engines.',
    url: 'https://aosabook.org/en/index.html',
    tags: ['Reading', 'Engineering', 'Resources'],
    category: 'link',
    isArchived: false,
    isPinned: true,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'item-3',
    userId: 'user_default',
    title: 'Warm Minimalist Living Room Moodboard & Materials',
    description: 'Farrow & Ball French Gray (#8B8E85) matched with brushed brass fixtures, linen curtains, and white oak shelving.',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    tags: ['Interior', 'Reference', 'Design'],
    category: 'image',
    isArchived: false,
    isPinned: false,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'item-4',
    userId: 'user_default',
    title: 'Emergency Pediatrician & Family Clinic Contacts',
    description: 'Dr. Sarah Vance at St. Jude Clinic: (415) 892-1200. After-hours nurse helpline: (800) 555-0199. Patient chart ID: #MED-9941.',
    tags: ['Family', 'Health', 'Contacts'],
    category: 'note',
    isArchived: false,
    isPinned: false,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'item-5',
    userId: 'user_default',
    title: 'Interactive Modular Typography & Spacing Calculator',
    description: 'Fast tool for harmonizing type scale ratios (Major Third 1.25) across mobile and desktop interfaces.',
    url: 'https://type-scale.com',
    tags: ['Design', 'CheatSheet', 'Tools'],
    category: 'resource',
    isArchived: false,
    isPinned: false,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'item-6',
    userId: 'user_default',
    title: 'Pour Over Coffee Recipe & Ratio Notes',
    description: '18g medium-fine beans, 300g filtered water at 93°C. 45s bloom with 50g water, spiral pour to 180g by 1:15, finish at 300g by 2:00. Total draw down: 2:45.',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    tags: ['Coffee', 'Ritual', 'Personal'],
    category: 'note',
    isArchived: false,
    isPinned: false,
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

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
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(SEED_ITEMS));
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
};
