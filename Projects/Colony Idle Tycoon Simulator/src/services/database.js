// Multi-Slot IndexedDB Client-Side Database Service for Kingdom Colony Idle Tycoon
const DB_NAME = 'KingdomColonyDB_MultiSlot';
const DB_VERSION = 2;
export const MAX_SLOTS = 5;

class KingdomDatabase {
  constructor() {
    this.db = null;
  }

  async initDB() {
    if (this.db) return this.db;

    return new Promise((resolve) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('character_slots')) {
          db.createObjectStore('character_slots', { keyPath: 'slotId' });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.warn('IndexedDB failed to initialize, using LocalStorage fallback.', event);
        resolve(null);
      };
    });
  }

  async saveSlot(slotId, gameData) {
    const payload = {
      slotId,
      characterId: gameData.characterId || 'arthur',
      rulerName: gameData.rulerName || 'Sovereign Arthur',
      realmName: gameData.realmName || 'Crown Dominion',
      crownJewels: gameData.crownJewels || 0,
      gold: gameData.resources?.gold || 0,
      data: gameData,
      updatedAt: Date.now()
    };

    try {
      const db = await this.initDB();
      if (db) {
        const tx = db.transaction('character_slots', 'readwrite');
        const store = tx.objectStore('character_slots');
        await new Promise((res, rej) => {
          const req = store.put(payload);
          req.onsuccess = res;
          req.onerror = rej;
        });
      }
    } catch (err) {
      console.warn('Saving slot to IndexedDB failed, fallback to localStorage', err);
    }

    localStorage.setItem(`kingdom_slot_${slotId}`, JSON.stringify(payload));
    return true;
  }

  async loadSlot(slotId) {
    try {
      const db = await this.initDB();
      if (db) {
        const tx = db.transaction('character_slots', 'readonly');
        const store = tx.objectStore('character_slots');
        const result = await new Promise((res) => {
          const req = store.get(slotId);
          req.onsuccess = () => res(req.result);
          req.onerror = () => res(null);
        });

        if (result && result.data) {
          return result.data;
        }
      }
    } catch (err) {
      console.warn('Loading slot from IndexedDB failed', err);
    }

    const raw = localStorage.getItem(`kingdom_slot_${slotId}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        return parsed.data || null;
      } catch (e) {
        return null;
      }
    }

    return null;
  }

  async listAllSlots() {
    const slots = [];
    try {
      const db = await this.initDB();
      if (db) {
        const tx = db.transaction('character_slots', 'readonly');
        const store = tx.objectStore('character_slots');
        const allItems = await new Promise((res) => {
          const req = store.getAll();
          req.onsuccess = () => res(req.result || []);
          req.onerror = () => res([]);
        });
        if (allItems.length > 0) return allItems;
      }
    } catch (err) {
      console.warn('Listing slots from IndexedDB failed', err);
    }

    // LocalStorage fallback
    for (let i = 1; i <= MAX_SLOTS; i++) {
      const raw = localStorage.getItem(`kingdom_slot_slot_${i}`);
      if (raw) {
        try {
          slots.push(JSON.parse(raw));
        } catch (e) {}
      }
    }

    return slots;
  }

  async deleteSlot(slotId) {
    try {
      const db = await this.initDB();
      if (db) {
        const tx = db.transaction('character_slots', 'readwrite');
        const store = tx.objectStore('character_slots');
        store.delete(slotId);
      }
    } catch (err) {
      console.warn('Error deleting slot', err);
    }
    localStorage.removeItem(`kingdom_slot_${slotId}`);
  }
}

export const dbService = new KingdomDatabase();
