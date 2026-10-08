/**
 * Persistent IndexedDB Storage Engine for NOFS TV
 * Stores News, Images (Base64/Blobs), Categories, Reporters, Breaking News, Comments, and Settings.
 * Has large storage capacity (100MB+) so real mobile/PC camera uploads persist permanently.
 */

const DB_NAME = 'nofs_tv_database_v1';
const DB_VERSION = 1;

export const STORES = {
  NEWS: 'news',
  CATEGORIES: 'categories',
  REPORTERS: 'reporters',
  BREAKING: 'breaking_news',
  COMMENTS: 'comments',
  MEDIA: 'media_library',
  SETTINGS: 'settings'
};

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      Object.values(STORES).forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function dbGetAll<T>(storeName: string): Promise<T[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn(`IndexedDB read fallback for ${storeName}:`, e);
    // Fallback to localStorage if IndexedDB fails
    const local = localStorage.getItem(`nofs_idb_fallback_${storeName}`);
    return local ? JSON.parse(local) : [];
  }
}

export async function dbPut<T extends { id: string }>(storeName: string, item: T): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(item);
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn(`IndexedDB put fallback for ${storeName}:`, e);
    try {
      const items = await dbGetAll<T>(storeName);
      const filtered = items.filter((i) => i.id !== item.id);
      filtered.push(item);
      localStorage.setItem(`nofs_idb_fallback_${storeName}`, JSON.stringify(filtered));
    } catch (_) {}
  }
}

export async function dbDelete(storeName: string, id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn(`IndexedDB delete fallback for ${storeName}:`, e);
  }
}

export async function dbSaveAll<T extends { id: string }>(storeName: string, items: T[]): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      store.clear();
      items.forEach((item) => store.put(item));
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (e) {
    console.warn(`IndexedDB saveAll fallback for ${storeName}:`, e);
    localStorage.setItem(`nofs_idb_fallback_${storeName}`, JSON.stringify(items));
  }
}

/**
 * Image compressor utility to convert any phone/camera file to optimized Base64
 * Ensures fast load times and clean database storage.
 */
export function compressImageFile(file: File, maxWidth = 1280, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Image decode error'));
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
