/* === БЛОК 24: Простая база данных для сна === */

const sleepDB = {
    db: null,
    
    // Инициализация
    init: function() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('SleepDB', 1);
            
            request.onerror = () => reject(request.error);
            
            request.onsuccess = () => {
                this.db = request.result;
                console.log('База данных сна готова');
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('sleepRecords')) {
                    db.createObjectStore('sleepRecords', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                }
            };
        });
    },
    
    // Добавление записи
    addSleepRecord: function(data) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject('База данных не инициализирована');
                return;
            }
            
            const transaction = this.db.transaction(['sleepRecords'], 'readwrite');
            const store = transaction.objectStore('sleepRecords');
            
            const record = {
                ...data,
                date: new Date().toLocaleDateString('ru-RU'),
                timestamp: Date.now()
            };
            
            const request = store.add(record);
            
            request.onsuccess = () => {
                console.log('Запись добавлена, ID:', request.result);
                resolve(request.result);
            };
            
            request.onerror = () => reject(request.error);
        });
    },
    
    // Получение всех записей (упрощённое)
    getAllRecords: function() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject('База данных не инициализирована');
                return;
            }
            
            const transaction = this.db.transaction(['sleepRecords'], 'readonly');
            const store = transaction.objectStore('sleepRecords');
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
};

// Делаем глобально доступной
window.sleepDB = sleepDB;