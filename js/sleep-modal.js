/* === БЛОК 23: Логика модального окна сна === */

// Ждём полной загрузки
document.addEventListener('DOMContentLoaded', async function() {
    try {
        await sleepDB.init();
        console.log('База данных сна готова');
        setupSleepModal();
        updateSleepDisplay();
    } catch (error) {
        console.error('Ошибка БД сна:', error);
    }
});

function setupSleepModal() {
    // Кнопка будет найдена позже, когда панель откроется
    // Настраиваем только модальное окно
    const modalOverlay = document.getElementById('sleepModalOverlay');
    const modalClose = document.getElementById('sleepModalClose');
    const qualityButtons = document.querySelectorAll('.quality-btn');
    const sleepForm = document.getElementById('sleepForm');
    
    if (!modalOverlay) return;
    
    // Закрытие крестиком
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modalOverlay.classList.remove('active');
        });
    }
    
    // Закрытие по клику вне
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });
    
    // Кнопки качества
    qualityButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            qualityButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Отправка формы
    if (sleepForm) {
        sleepForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const sleepStart = document.getElementById('sleepStart').value;
            const sleepEnd = document.getElementById('sleepEnd').value;
            const quality = document.querySelector('.quality-btn.active')?.textContent || '3';
            
            try {
                await sleepDB.addSleepRecord({ sleepStart, sleepEnd, quality });
                console.log('Сон сохранён');
                
                await updateSleepDisplay();
                modalOverlay.classList.remove('active');
                sleepForm.reset();
                qualityButtons.forEach(b => b.classList.remove('active'));
                if (qualityButtons[2]) qualityButtons[2].classList.add('active');
                
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Ошибка сохранения');
            }
        });
    }
}

// Обновление отображения
async function updateSleepDisplay() {
    try {
        const stats = await sleepDB.getSleepStats();
        const panelBody = document.querySelector('#healthPanel .panel-body');
        
        if (!panelBody) return;
        
        if (stats.totalRecords > 0) {
            panelBody.innerHTML = `
                <div>Средний сон: ${stats.avgDuration}ч</div>
                <div>Качество: ${stats.avgQuality}/5</div>
                <div>Записей: ${stats.totalRecords}</div>
                <button class="sleep-record-btn" id="recordSleepBtn">Записать сон</button>
            `;
            
            // Добавляем обработчик для новой кнопки
            const newBtn = document.getElementById('recordSleepBtn');
            if (newBtn) {
                newBtn.addEventListener('click', function() {
                    document.getElementById('sleepModalOverlay').classList.add('active');
                });
            }
        } else {
            panelBody.innerHTML = `
                <button class="sleep-record-btn" id="recordSleepBtn">Записать первый сон</button>
            `;
            
            const newBtn = document.getElementById('recordSleepBtn');
            if (newBtn) {
                newBtn.addEventListener('click', function() {
                    document.getElementById('sleepModalOverlay').classList.add('active');
                });
            }
        }
    } catch (error) {
        console.error('Ошибка статистики:', error);
    }
}