/**
 * Storage Service - Manejo de IndexedDB y localStorage
 */

import { openDB } from 'idb';

const DB_NAME = 'keto-pro-db';
const DB_VERSION = 1;

class StorageService {
  constructor() {
    this.db = null;
    this.isIndexedDBAvailable = this.checkIndexedDB();
  }

  /**
   * Verificar si IndexedDB está disponible
   */
  checkIndexedDB() {
    try {
      return typeof indexedDB !== 'undefined';
    } catch (e) {
      return false;
    }
  }

  /**
   * Inicializar base de datos
   */
  async init() {
    if (!this.isIndexedDBAvailable) {
      console.warn('IndexedDB no disponible, usando localStorage');
      return;
    }

    try {
      this.db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          // Store para comidas generadas por IA
          if (!db.objectStoreNames.contains('meals')) {
            const mealStore = db.createObjectStore('meals', {
              keyPath: 'id',
              autoIncrement: true
            });
            mealStore.createIndex('day', 'day');
            mealStore.createIndex('week', 'week');
            mealStore.createIndex('timestamp', 'timestamp');
          }

          // Store para progreso diario
          if (!db.objectStoreNames.contains('progress')) {
            const progressStore = db.createObjectStore('progress', {
              keyPath: 'date'
            });
            progressStore.createIndex('timestamp', 'timestamp');
          }

          // Store para peso
          if (!db.objectStoreNames.contains('weight')) {
            const weightStore = db.createObjectStore('weight', {
              keyPath: 'id',
              autoIncrement: true
            });
            weightStore.createIndex('date', 'date');
          }

          // Store para listas de compra
          if (!db.objectStoreNames.contains('shopping')) {
            db.createObjectStore('shopping', {
              keyPath: 'id',
              autoIncrement: true
            });
          }
        }
      });
    } catch (error) {
      console.error('Error inicializando IndexedDB:', error);
    }
  }

  /**
   * Guardar en IndexedDB
   */
  async saveToIDB(storeName, data) {
    if (!this.db) await this.init();
    if (!this.db) return this.saveToLocalStorage(storeName, data);

    try {
      const tx = this.db.transaction(storeName, 'readwrite');
      await tx.store.put(data);
      await tx.done;
      return true;
    } catch (error) {
      console.error('Error guardando en IndexedDB:', error);
      return false;
    }
  }

  /**
   * Obtener de IndexedDB
   */
  async getFromIDB(storeName, key) {
    if (!this.db) await this.init();
    if (!this.db) return this.getFromLocalStorage(storeName, key);

    try {
      return await this.db.get(storeName, key);
    } catch (error) {
      console.error('Error obteniendo de IndexedDB:', error);
      return null;
    }
  }

  /**
   * Obtener todos de un store
   */
  async getAllFromIDB(storeName) {
    if (!this.db) await this.init();
    if (!this.db) return [];

    try {
      return await this.db.getAll(storeName);
    } catch (error) {
      console.error('Error obteniendo datos de IndexedDB:', error);
      return [];
    }
  }

  /**
   * Eliminar de IndexedDB
   */
  async deleteFromIDB(storeName, key) {
    if (!this.db) await this.init();
    if (!this.db) return false;

    try {
      await this.db.delete(storeName, key);
      return true;
    } catch (error) {
      console.error('Error eliminando de IndexedDB:', error);
      return false;
    }
  }

  /**
   * Limpiar un store completo
   */
  async clearStore(storeName) {
    if (!this.db) await this.init();
    if (!this.db) {
      localStorage.removeItem(`keto-${storeName}`);
      return true;
    }

    try {
      await this.db.clear(storeName);
      return true;
    } catch (error) {
      console.error('Error limpiando store:', error);
      return false;
    }
  }

  /**
   * Fallback: Guardar en localStorage
   */
  saveToLocalStorage(key, data) {
    try {
      localStorage.setItem(`keto-${key}`, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error guardando en localStorage:', error);
      return false;
    }
  }

  /**
   * Fallback: Obtener de localStorage
   */
  getFromLocalStorage(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(`keto-${key}`);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error('Error obteniendo de localStorage:', error);
      return defaultValue;
    }
  }

  /**
   * Exportar todos los datos
   */
  async exportAllData() {
    const data = {
      version: DB_VERSION,
      timestamp: new Date().toISOString(),
      meals: await this.getAllFromIDB('meals'),
      progress: await this.getAllFromIDB('progress'),
      weight: await this.getAllFromIDB('weight'),
      shopping: await this.getAllFromIDB('shopping'),
      settings: {
        userName: localStorage.getItem('keto14-rick-name'),
        userGender: localStorage.getItem('keto14-rick-gender'),
        startDate: localStorage.getItem('keto14-rick-start'),
        planWeeks: localStorage.getItem('keto14-rick-weeks'),
        waterGoal: localStorage.getItem('keto14-rick-water-goal'),
        foodLikes: localStorage.getItem('keto14-rick-like'),
        foodDislikes: localStorage.getItem('keto14-rick-dislike')
      }
    };

    return data;
  }

  /**
   * Importar datos
   */
  async importData(data) {
    try {
      // Importar a IndexedDB
      if (data.meals) {
        for (const meal of data.meals) {
          await this.saveToIDB('meals', meal);
        }
      }

      if (data.progress) {
        for (const prog of data.progress) {
          await this.saveToIDB('progress', prog);
        }
      }

      if (data.weight) {
        for (const weight of data.weight) {
          await this.saveToIDB('weight', weight);
        }
      }

      if (data.shopping) {
        for (const item of data.shopping) {
          await this.saveToIDB('shopping', item);
        }
      }

      // Importar settings a localStorage
      if (data.settings) {
        Object.entries(data.settings).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            localStorage.setItem(`keto14-rick-${key}`, value);
          }
        });
      }

      return true;
    } catch (error) {
      console.error('Error importando datos:', error);
      return false;
    }
  }

  /**
   * Limpiar todos los datos
   */
  async clearAllData() {
    const stores = ['meals', 'progress', 'weight', 'shopping'];

    for (const store of stores) {
      await this.clearStore(store);
    }

    // Limpiar localStorage
    const keysToRemove = Object.keys(localStorage).filter((key) =>
      key.startsWith('keto14-rick-')
    );

    keysToRemove.forEach((key) => localStorage.removeItem(key));

    return true;
  }
}

export default new StorageService();
