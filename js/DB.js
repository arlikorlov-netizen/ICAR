/* === БЛОК 24: Работа с IndexedDB === */

const DB_NAME = 'icarDB';
const DB_VERSION = 1;
const SLEEP_STORE = 'sleepRecords';

class SleepDB {
    constructor() {
        this.db = null;
    }

    // Инициализация базы данных
    init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Создаём хранилище для записей сна
                if (!db.objectStoreNames.contains(SLEEP_STORE)) {
                    const store = db.createObjectStore(SLEEP_STORE, { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    
                    // Индексы для поиска
                    store.createIndex('date', 'date', { unique: false });
                    store.createIndex('quality', 'quality', { unique: false });
                }
            };
        });
    }

    // Добавление записи о сне
    async addSleepRecord(sleepData) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([SLEEP_STORE], 'readwrite');
            const store = transaction.objectStore(SLEEP_STORE);
            
            // Добавляем дату записи
            const record = {
                ...sleepData,
                date: new Date().toISOString(),
                createdAt: new Date().getTime()
            };
            
            const request = store.add(record);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Получение всех записей
    async getAllSleepRecords() {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([SLEEP_STORE], 'readonly');
            const store = transaction.objectStore(SLEEP_STORE);
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Удаление записи
    async deleteSleepRecord(id) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([SLEEP_STORE], 'readwrite');
            const store = transaction.objectStore(SLEEP_STORE);
            const request = store.delete(id);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Получение статистики
    async getSleepStats() {
        const records = await this.getAllSleepRecords();
        
        if (records.length === 0) {
            return { avgDuration: 0, avgQuality: 0, totalRecords: 0 };
        }
        
        let totalDuration = 0;
        let totalQuality = 0;
        
        records.forEach(record => {
            if (record.sleepStart && record.sleepEnd) {
                const start = new Date(`2000-01-01T${record.sleepStart}`);
                const end = new Date(`2000-01-01T${record.sleepEnd}`);
                let duration = (end - start) / (1000 * 60 * 60); // в часах
                
                // Учитываем сон через полночь
                if (duration < 0) duration += 24;
                
                totalDuration += duration;
            }
            
            if (record.quality) {
                totalQuality += parseInt(record.quality);
            }
        });
        
        return {
            avgDuration: (totalDuration / records.length).toFixed(1),
            avgQuality: (totalQuality / records.length).toFixed(1),
            totalRecords: records.length
        };
    }
}

// Создаём глобальный экземпляр
window.sleepDB = new SleepDB();