import type { AuditEvent, StoredAuditEvent } from "../types/event.types";

const DB_NAME = "stee_audit_db";
const DB_VERSION = 1;
const STORE_NAME = "audit_events";

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request: IDBOpenDBRequest = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db: IDBDatabase = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function addEvent(event: AuditEvent): Promise<void> {
  const db: IDBDatabase = await openDB();

  const tx: IDBTransaction = db.transaction(
    STORE_NAME,
    "readwrite"
  );

  const store: IDBObjectStore = tx.objectStore(STORE_NAME);
  store.add(event);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllEvents(): Promise<StoredAuditEvent[]> {
  const db: IDBDatabase = await openDB();

  const tx: IDBTransaction = db.transaction(
    STORE_NAME,
    "readonly"
  );

  const store: IDBObjectStore = tx.objectStore(STORE_NAME);
  const request: IDBRequest<StoredAuditEvent[]> = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () =>
      resolve(request.result);
    request.onerror = () =>
      reject(request.error);
  });
}

export async function clearEvents(): Promise<void> {
  const db: IDBDatabase = await openDB();

  const tx: IDBTransaction = db.transaction(
    STORE_NAME,
    "readwrite"
  );

  const store: IDBObjectStore = tx.objectStore(STORE_NAME);
  store.clear();

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
