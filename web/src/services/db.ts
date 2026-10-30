import { openDB, type IDBPDatabase } from 'idb';

export interface SavedStrip {
  id: string;
  pngBlob: Blob;
  thumbBlob: Blob;
  templateId: string;
  layout: string;
  createdAt: number;
}

export interface SettingItem {
  key: string;
  value: any;
}

const DB_NAME = 'virtualan';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('strips')) {
          const stripStore = db.createObjectStore('strips', { keyPath: 'id' });
          stripStore.createIndex('by-created', 'createdAt');
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveStrip(data: {
  id?: string;
  pngBlob: Blob;
  thumbBlob: Blob;
  templateId: string;
  layout: string;
}): Promise<string> {
  // Request persistent storage on first save
  if (navigator.storage && navigator.storage.persist) {
    try {
      await navigator.storage.persist();
    } catch {
      // Ignore errors if storage persistence is denied or not supported
    }
  }

  const db = await getDB();
  const id = data.id || `strip_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const strip: SavedStrip = {
    id,
    pngBlob: data.pngBlob,
    thumbBlob: data.thumbBlob,
    templateId: data.templateId,
    layout: data.layout,
    createdAt: Date.now(),
  };

  await db.put('strips', strip);
  return id;
}

export async function listStrips(): Promise<SavedStrip[]> {
  const db = await getDB();
  const strips = await db.getAllFromIndex('strips', 'by-created');
  // Return newest first
  return strips.reverse();
}

export async function countStrips(): Promise<number> {
  const db = await getDB();
  return db.count('strips');
}

export async function getStrip(id: string): Promise<SavedStrip | undefined> {
  const db = await getDB();
  return db.get('strips', id);
}

export async function deleteStrip(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('strips', id);
}

export async function getSetting<T = any>(key: string, defaultValue?: T): Promise<T | undefined> {
  const db = await getDB();
  const res = await db.get('settings', key);
  return res ? (res.value as T) : defaultValue;
}

export async function setSetting(key: string, value: any): Promise<void> {
  const db = await getDB();
  await db.put('settings', { key, value });
}
