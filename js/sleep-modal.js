async function updateSleepDisplay() {
    try {
        const stats = await sleepDB.getSleepStats();
        const panelBody = document.querySelector('#healthPanel .panel-body');
        
        if (!panelBody) return;
        
        if (stats.totalRecords > 0) {
            panelBody.innerHTML = `
                <div>Записей сна: ${stats.totalRecords}</div>
                <div>Последняя оценка: ${stats.avgQuality}/5</div>
                <button class="sleep-record-btn" id="recordSleepBtn">Записать сон</button>
            `;
        } else {
            panelBody.innerHTML = `
                <button class="sleep-record-btn" id="recordSleepBtn">Записать первый сон</button>
            `;
        }
        
        const newBtn = document.getElementById('recordSleepBtn');
        if (newBtn) {
            newBtn.addEventListener('click', function() {
                document.getElementById('sleepModalOverlay').classList.add('active');
            });
        }
        
    } catch (error) {
        console.error('Ошибка:', error);
    }
}