import { KeepItem, User } from '../types';
import { db } from './firebase';
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';

const STORAGE_KEYS = {
  ITEMS: 'keepit_items_v3',
  USER: 'keepit_user_v4',
};

export const DEFAULT_USER: User = {
  id: 'user_default',
  name: 'Nikita Adebayo',
  email: 'nikita.info@gmail.com',
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

  // Sync to Firebase Firestore
  try {
    setDoc(doc(db, 'users', updated.id), updated, { merge: true }).catch((err) =>
      console.warn('Firestore user sync warning:', err)
    );
  } catch (err) {
    console.warn('Firestore unavailable', err);
  }

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

// Sync from Firestore on startup
export const syncItemsFromFirestore = async (): Promise<KeepItem[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'items'));
    const items: KeepItem[] = [];
    querySnapshot.forEach((docSnap) => {
      items.push(docSnap.data() as KeepItem);
    });
    if (items.length > 0) {
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
      return items;
    }
  } catch (err) {
    console.warn('Firestore fetch warning:', err);
  }
  return getStoredItems();
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

  // Sync to Firestore
  try {
    const itemToSync = existingIndex >= 0 ? updated[existingIndex] : item;
    setDoc(doc(db, 'items', itemToSync.id), itemToSync).catch((err) =>
      console.warn('Firestore save item warning:', err)
    );
  } catch (err) {
    console.warn('Firestore unavailable', err);
  }

  return updated;
};

export const deleteItemFromStorage = (id: string): KeepItem[] => {
  const items = getStoredItems().filter((i) => i.id !== id);
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));

  // Delete from Firestore
  try {
    deleteDoc(doc(db, 'items', id)).catch((err) =>
      console.warn('Firestore delete warning:', err)
    );
  } catch (err) {
    console.warn('Firestore unavailable', err);
  }

  return items;
};

export const toggleArchiveItem = (id: string): KeepItem[] => {
  const items = getStoredItems().map((i) => {
    if (i.id === id) {
      const updatedItem = { ...i, isArchived: !i.isArchived, updatedAt: new Date().toISOString() };
      try {
        setDoc(doc(db, 'items', id), updatedItem, { merge: true }).catch(() => {});
      } catch {}
      return updatedItem;
    }
    return i;
  });
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  return items;
};

export const togglePinItem = (id: string): KeepItem[] => {
  const items = getStoredItems().map((i) => {
    if (i.id === id) {
      const updatedItem = { ...i, isPinned: !i.isPinned, updatedAt: new Date().toISOString() };
      try {
        setDoc(doc(db, 'items', id), updatedItem, { merge: true }).catch(() => {});
      } catch {}
      return updatedItem;
    }
    return i;
  });
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
