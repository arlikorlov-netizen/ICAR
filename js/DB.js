/* === БЛОК 24: Заглушка базы данных === */

const sleepDB = {
    // Простая заглушка - храним в памяти
    records: [],
    
    init: function() {
        console.log('База данных сна (заглушка) инициализирована');
        return Promise.resolve();
    },
    
    addSleepRecord: function(data) {
        return new Promise((resolve) => {
            const record = {
                id: Date.now(),
                ...data,
                date: new Date().toLocaleDateString('ru-RU')
            };
            
            this.records.push(record);
            console.log('Запись сохранена в памяти:', record);
            resolve(record.id);
        });
    },
    
    getAllRecords: function() {
        return Promise.resolve(this.records);
    },
    
    getSleepStats: function() {
        if (this.records.length === 0) {
            return Promise.resolve({
                avgDuration: 0,
                avgQuality: 0,
                totalRecords: 0
            });
        }
        
        // Простой расчёт
        const totalRecords = this.records.length;
        const lastRecord = this.records[this.records.length - 1];
        
        return Promise.resolve({
            avgDuration: '7.5', // заглушка
            avgQuality: lastRecord.quality || '3',
            totalRecords: totalRecords
        });
    }
};

window.sleepDB = sleepDB;