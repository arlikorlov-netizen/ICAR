/* === БЛОК 23: Логика модального окна сна === */

document.addEventListener('DOMContentLoaded', () => {
    initSleepModal();
});

function initSleepModal() {
    const recordBtn = document.getElementById('recordSleepBtn');
    const modalOverlay = document.getElementById('sleepModalOverlay');
    const modalClose = document.getElementById('sleepModalClose');
    const qualityButtons = document.querySelectorAll('.quality-btn');
    const sleepForm = document.getElementById('sleepForm');
    
    if (!recordBtn || !modalOverlay) return;
    
    // Открытие модального окна
    recordBtn.addEventListener('click', () => {
        modalOverlay.classList.add('active');
    });
    
    // Закрытие модального окна
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });
    }
    
    // Клик вне модального окна
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });
    
    // Кнопки оценки качества
    qualityButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            qualityButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Отправка формы
if (sleepForm) {
    sleepForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const sleepStart = document.getElementById('sleepStart').value;
        const sleepEnd = document.getElementById('sleepEnd').value;
        const quality = document.querySelector('.quality-btn.active')?.textContent || '3';
        
        try {
            // Сохраняем в IndexedDB
            await sleepDB.addSleepRecord({ sleepStart, sleepEnd, quality });
            console.log('Сон успешно сохранён в базу данных');
            
            // Обновляем отображение в панели здоровья
            updateSleepDisplay();
            
            // Закрываем модальное окно
            modalOverlay.classList.remove('active');
            sleepForm.reset();
            qualityButtons.forEach(b => b.classList.remove('active'));
            qualityButtons[2].classList.add('active');
            
        } catch (error) {
            console.error('Ошибка сохранения сна:', error);
            alert('Ошибка сохранения записи');
        }
    });
}

// Функция обновления отображения в панели здоровья
async function updateSleepDisplay() {
    try {
        const stats = await sleepDB.getSleepStats();
        const healthPanelBody = document.querySelector('#healthPanel .panel-body');
        
        if (healthPanelBody && stats.totalRecords > 0) {
            // Очищаем и добавляем статистику
            healthPanelBody.innerHTML = `
                <div class="sleep-stats">
                    <div>Средняя длительность: ${stats.avgDuration}ч</div>
                    <div>Качество сна: ${stats.avgQuality}/5</div>
                    <div>Всего записей: ${stats.totalRecords}</div>
                </div>
                <button class="sleep-record-btn" id="recordSleepBtn">Записать сон</button>
            `;
            
            // Переинициализируем кнопку
            const newRecordBtn = document.getElementById('recordSleepBtn');
            if (newRecordBtn) {
                newRecordBtn.addEventListener('click', () => {
                    document.getElementById('sleepModalOverlay').classList.add('active');
                });
            }
        }
    } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
    }
}

// Инициализируем при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initSleepModal();
    updateSleepDisplay(); // Загружаем статистику при загрузке
});
}