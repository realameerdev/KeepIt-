import { KeepItem, User } from '../types';
import { db } from './firebase';
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';

const STORAGE_KEYS = {
  ITEMS: 'keepit_items_v3',
  USER: 'keepit_user_v4',
  ANON_ID: 'keepit_anon_id_v1',
};

// Generate persistent anonymous ID if none exists
const getOrCreateAnonId = (): string => {
  try {
    let anonId = localStorage.getItem(STORAGE_KEYS.ANON_ID);
    if (!anonId) {
      anonId = 'anon_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
      localStorage.setItem(STORAGE_KEYS.ANON_ID, anonId);
    }
    return anonId;
  } catch {
    return 'anon_fallback_' + Date.now();
  }
};

export const DEFAULT_USER: User = {
  id: getOrCreateAnonId(),
  name: 'Anonymous Explorer',
  email: 'explorer@keepit.local',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  createdAt: new Date().toISOString(),
  lastActive: new Date().toISOString(),
  sessionCount: 1,
};

// Vault starts completely empty so users add their own items
const SEED_ITEMS: KeepItem[] = [];

export const getStoredUser = (): User => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    const anonId = getOrCreateAnonId();
    if (!raw) {
      const newUser: User = {
        ...DEFAULT_USER,
        id: anonId,
      };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      // Sync new user to Firestore
      setDoc(doc(db, 'users', anonId), newUser, { merge: true }).catch(() => {});
      return newUser;
    }
    const user: User = JSON.parse(raw);
    // Ensure ID matches persistent anon ID
    if (user.id !== anonId) {
      user.id = anonId;
    }
    // Update lastActive and sessionCount
    user.lastActive = new Date().toISOString();
    user.sessionCount = (user.sessionCount || 1) + 1;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    // Sync user activity to Firestore
    setDoc(doc(db, 'users', anonId), user, { merge: true }).catch(() => {});

    return user;
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
  const user = getStoredUser();
  const itemWithUser = { ...item, userId: item.userId || user.id };
  const items = getStoredItems();
  const existingIndex = items.findIndex((i) => i.id === itemWithUser.id);
  let updated: KeepItem[];
  if (existingIndex >= 0) {
    updated = [...items];
    updated[existingIndex] = { ...itemWithUser, updatedAt: new Date().toISOString() };
  } else {
    updated = [itemWithUser, ...items];
  }
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(updated));

  // Sync to Firestore
  try {
    const itemToSync = existingIndex >= 0 ? updated[existingIndex] : itemWithUser;
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

// Analytics Data Aggregator
export interface AnalyticsMetrics {
  totalUsers: number;
  newUsersToday: number;
  returningUsers: number;
  totalItems: number;
  savesPerUser: number;
  activeUsers24h: number;
  usersList: User[];
  itemsList: KeepItem[];
}

export const fetchAnalyticsData = async (): Promise<AnalyticsMetrics> => {
  let usersList: User[] = [];
  let itemsList: KeepItem[] = [];

  try {
    const usersSnap = await getDocs(collection(db, 'users'));
    usersSnap.forEach((doc) => {
      usersList.push(doc.data() as User);
    });
  } catch {
    // fallback to local user
    usersList = [getStoredUser()];
  }

  try {
    const itemsSnap = await getDocs(collection(db, 'items'));
    itemsSnap.forEach((doc) => {
      itemsList.push(doc.data() as KeepItem);
    });
  } catch {
    itemsList = getStoredItems();
  }

  // Ensure current user is counted
  const currentUser = getStoredUser();
  if (!usersList.some((u) => u.id === currentUser.id)) {
    usersList.push(currentUser);
  }

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const totalUsers = usersList.length;
  const newUsersToday = usersList.filter((u) => new Date(u.createdAt || 0) > oneDayAgo).length;
  const returningUsers = usersList.filter((u) => (u.sessionCount || 1) > 1).length;
  const totalItems = itemsList.length;
  const savesPerUser = totalUsers > 0 ? Number((totalItems / totalUsers).toFixed(1)) : 0;
  const activeUsers24h = usersList.filter((u) => new Date(u.lastActive || u.createdAt || 0) > oneDayAgo).length;

  return {
    totalUsers,
    newUsersToday,
    returningUsers,
    totalItems,
    savesPerUser,
    activeUsers24h,
    usersList,
    itemsList,
  };
};

export const resetToSampleData = (): void => {
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify([]));
};

export const clearAllItems = (): void => {
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify([]));
};
