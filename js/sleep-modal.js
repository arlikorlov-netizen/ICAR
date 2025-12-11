async function updateSleepDisplay() {
    try {
        const records = await sleepDB.getAllRecords();
        const panelBody = document.querySelector('#healthPanel .panel-body');
        
        if (!panelBody) return;
        
        if (records.length > 0) {
            // Простая статистика
            const lastRecord = records[records.length - 1];
            panelBody.innerHTML = `
                <div>Последний сон: ${lastRecord.sleepStart} - ${lastRecord.sleepEnd}</div>
                <div>Качество: ${lastRecord.quality}/5</div>
                <div>Всего записей: ${records.length}</div>
                <button class="sleep-record-btn" id="recordSleepBtn">Записать сон</button>
            `;
        } else {
            panelBody.innerHTML = `
                <button class="sleep-record-btn" id="recordSleepBtn">Записать первый сон</button>
            `;
        }
        
        // Вешаем обработчик на новую кнопку
        const newBtn = document.getElementById('recordSleepBtn');
        if (newBtn) {
            newBtn.addEventListener('click', function() {
                document.getElementById('sleepModalOverlay').classList.add('active');
            });
        }
        
    } catch (error) {
        console.error('Ошибка загрузки записей:', error);
    }
}