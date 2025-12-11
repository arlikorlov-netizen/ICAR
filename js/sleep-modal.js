/* === БЛОК 23: Логика модального окна сна === */

// Главная функция инициализации
async function initSleepApp() {
    try {
        await sleepDB.init();
        console.log('База данных инициализирована');
        initSleepModal();
        await updateSleepDisplay();
    } catch (error) {
        console.error('Ошибка инициализации:', error);
    }
}

// Функция инициализации модального окна
function initSleepModal() {
    const modalOverlay = document.getElementById('sleepModalOverlay');
    const modalClose = document.getElementById('sleepModalClose');
    const qualityButtons = document.querySelectorAll('.quality-btn');
    const sleepForm = document.getElementById('sleepForm');
    
    if (!modalOverlay) {
        console.warn('Модальное окно не найдено');
        return;
    }
    
    // Делегирование: ловим клик на ВСЕМ документе
    document.addEventListener('click', function(e) {
        // Если кликнули на кнопку "Записать сон" (даже если она появилась позже)
        if (e.target && e.target.id === 'recordSleepBtn') {
            e.stopPropagation();
            modalOverlay.classList.add('active');
        }
        
        // Если кликнули на кнопку внутри панели здоровья (динамически созданную)
        if (e.target && e.target.classList.contains('sleep-record-btn')) {
            e.stopPropagation();
            modalOverlay.classList.add('active');
        }
    });
    
    // Закрытие модального окна (крестик)
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modalOverlay.classList.remove('active');
        });
    }
    
    // Закрытие по клику вне окна
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });
    
    // Кнопки оценки качества (1-5)
    qualityButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            qualityButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Отправка формы записи сна
    if (sleepForm) {
        sleepForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const sleepStart = document.getElementById('sleepStart').value;
            const sleepEnd = document.getElementById('sleepEnd').value;
            const activeQualityBtn = document.querySelector('.quality-btn.active');
            const quality = activeQualityBtn ? activeQualityBtn.textContent : '3';
            
            if (!sleepStart || !sleepEnd) {
                alert('Заполните время начала и окончания сна');
                return;
            }
            
            try {
                await sleepDB.addSleepRecord({ 
                    sleepStart: sleepStart, 
                    sleepEnd: sleepEnd, 
                    quality: quality 
                });
                
                console.log('Запись сна сохранена');
                await updateSleepDisplay();
                modalOverlay.classList.remove('active');
                sleepForm.reset();
                
                qualityButtons.forEach(b => b.classList.remove('active'));
                if (qualityButtons[2]) qualityButtons[2].classList.add('active');
                
            } catch (error) {
                console.error('Ошибка сохранения сна:', error);
                alert('Не удалось сохранить запись');
            }
        });
    }
}

// Функция обновления отображения статистики сна
async function updateSleepDisplay() {
    try {
        const stats = await sleepDB.getSleepStats();
        const healthPanelBody = document.querySelector('#healthPanel .panel-body');
        
        if (!healthPanelBody) return;
        
        if (stats.totalRecords > 0) {
            healthPanelBody.innerHTML = `
                <div class="sleep-stats">
                    <div>Средняя длительность: ${stats.avgDuration}ч</div>
                    <div>Качество сна: ${stats.avgQuality}/5</div>
                    <div>Всего записей: ${stats.totalRecords}</div>
                </div>
                <button class="sleep-record-btn" id="recordSleepBtn">Записать сон</button>
            `;
        } else {
            healthPanelBody.innerHTML = `
                <button class="sleep-record-btn" id="recordSleepBtn">Записать первую запись сна</button>
            `;
        }
        
    } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
    }
}

// Запускаем приложение
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSleepApp);
} else {
    initSleepApp();
}