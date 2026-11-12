/**
 * PlayStation 6 Virtual Gen 5 NVMe IndexedDB Storage Subsystem
 * Provides persistent high-capacity storage for games, WASM files, high-res textures,
 * media streaming configurations, and full console snapshots.
 */

const DB_NAME = 'PS6_NVME_STORAGE_V1';
const DB_VERSION = 1;

export const STORES = {
  GAMES: 'games',
  MEDIA: 'media',
  USERS: 'users',
  SNAPSHOTS: 'snapshots',
  BLOBS: 'blobs'
} as const;

export interface StorageStats {
  usedMb: number;
  totalMb: number;
  usedPercent: number;
  itemCount: number;
  connected: boolean;
  dbName: string;
  version: number;
}

export interface BenchmarkResult {
  writeSpeedMbps: number;
  readSpeedMbps: number;
  latencyMs: number;
  iterations: number;
  status: 'passed' | 'failed';
}

/**
 * Open or upgrade the PS6 IndexedDB database
 */
export function openPS6Database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser environment.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORES.GAMES)) {
        db.createObjectStore(STORES.GAMES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.MEDIA)) {
        db.createObjectStore(STORES.MEDIA, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.USERS)) {
        db.createObjectStore(STORES.USERS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.SNAPSHOTS)) {
        db.createObjectStore(STORES.SNAPSHOTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.BLOBS)) {
        db.createObjectStore(STORES.BLOBS, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open PS6 IndexedDB'));
    };
  });
}

/**
 * Put an item into a specified store
 */
export async function idbPut<T>(storeName: string, item: T): Promise<void> {
  const db = await openPS6Database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.put(item);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get an item by ID from a specified store
 */
export async function idbGet<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
  const db = await openPS6Database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result as T | undefined);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all items from a specified store
 */
export async function idbGetAll<T>(storeName: string): Promise<T[]> {
  const db = await openPS6Database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete an item from a specified store
 */
export async function idbDelete(storeName: string, key: IDBValidKey): Promise<void> {
  const db = await openPS6Database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.delete(key);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Clear all items in a specified store
 */
export async function idbClear(storeName: string): Promise<void> {
  const db = await openPS6Database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Estimate storage usage using modern StorageManager API
 */
export async function getPS6StorageEstimate(): Promise<StorageStats> {
  let usedMb = 1.4;
  let totalMb = 2048000; // Simulated 2TB NVMe baseline
  let usedPercent = 0.05;
  let itemCount = 0;

  try {
    const db = await openPS6Database();
    for (const s of [STORES.GAMES, STORES.MEDIA, STORES.USERS, STORES.SNAPSHOTS]) {
      const items = await idbGetAll(s);
      itemCount += items.length;
    }

    if (navigator.storage && navigator.storage.estimate) {
      const est = await navigator.storage.estimate();
      if (est.usage !== undefined) {
        usedMb = parseFloat((est.usage / (1024 * 1024)).toFixed(2));
      }
      if (est.quota !== undefined) {
        totalMb = parseFloat((est.quota / (1024 * 1024)).toFixed(0));
      }
      usedPercent = totalMb > 0 ? parseFloat(((usedMb / totalMb) * 100).toFixed(2)) : 0;
    }

    return {
      usedMb,
      totalMb,
      usedPercent,
      itemCount,
      connected: true,
      dbName: DB_NAME,
      version: DB_VERSION
    };
  } catch (err) {
    console.warn('Storage estimate warning:', err);
    return {
      usedMb: 2.1,
      totalMb: 2048000,
      usedPercent: 0.1,
      itemCount,
      connected: true,
      dbName: DB_NAME,
      version: DB_VERSION
    };
  }
}

/**
 * Run high-speed NVMe benchmark on IndexedDB
 */
export async function runIndexedDBBenchmark(): Promise<BenchmarkResult> {
  const db = await openPS6Database();
  const testData = new Uint8Array(256 * 1024); // 256 KB chunk
  for (let i = 0; i < testData.length; i++) {
    testData[i] = (i % 256);
  }

  const iterations = 8;
  const startWrite = performance.now();

  for (let i = 0; i < iterations; i++) {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORES.BLOBS, 'readwrite');
      const store = tx.objectStore(STORES.BLOBS);
      const req = store.put({ key: `bench-test-${i}`, data: testData, ts: Date.now() });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  const writeTimeMs = Math.max(1, performance.now() - startWrite);
  const totalWrittenBytes = testData.length * iterations;
  const writeSpeedMbps = parseFloat(((totalWrittenBytes / (1024 * 1024)) / (writeTimeMs / 1000)).toFixed(2));

  // Benchmark Read
  const startRead = performance.now();
  for (let i = 0; i < iterations; i++) {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORES.BLOBS, 'readonly');
      const store = tx.objectStore(STORES.BLOBS);
      const req = store.get(`bench-test-${i}`);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
  const readTimeMs = Math.max(1, performance.now() - startRead);
  const readSpeedMbps = parseFloat(((totalWrittenBytes / (1024 * 1024)) / (readTimeMs / 1000)).toFixed(2));

  // Clean up benchmark blobs
  for (let i = 0; i < iterations; i++) {
    idbDelete(STORES.BLOBS, `bench-test-${i}`).catch(() => {});
  }

  return {
    writeSpeedMbps,
    readSpeedMbps,
    latencyMs: parseFloat((writeTimeMs / iterations).toFixed(2)),
    iterations,
    status: 'passed'
  };
}

/**
 * Save complete Console Snapshot to IndexedDB
 */
export async function saveConsoleSnapshot(payload: {
  games?: any[];
  users?: any[];
  settings?: any;
  media?: any[];
  friends?: any[];
  notifications?: any[];
  messages?: any[];
  [key: string]: any;
}): Promise<string> {
  const snapshotId = `snapshot-${Date.now()}`;
  const record = {
    id: snapshotId,
    timestamp: new Date().toISOString(),
    formattedDate: new Date().toLocaleString(),
    payload
  };

  await idbPut(STORES.SNAPSHOTS, record);
  return snapshotId;
}

/**
 * Get all saved snapshots from IndexedDB
 */
export async function getConsoleSnapshots(): Promise<any[]> {
  try {
    return await idbGetAll(STORES.SNAPSHOTS);
  } catch {
    return [];
  }
}
