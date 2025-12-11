/* === БЛОК 23: Логика модального окна сна === */

// Главная функция инициализации
async function initSleepApp() {
    try {
        // 1. Инициализируем базу данных
        await sleepDB.init();
        console.log('База данных инициализирована');
        
        // 2. Инициализируем модальное окно
        initSleepModal();
        
        // 3. Загружаем статистику сна
        await updateSleepDisplay();
        
    } catch (error) {
        console.error('Ошибка инициализации приложения сна:', error);
    }
}

// Функция инициализации модального окна
function initSleepModal() {
    const recordBtn = document.getElementById('recordSleepBtn');
    const modalOverlay = document.getElementById('sleepModalOverlay');
    const modalClose = document.getElementById('sleepModalClose');
    const qualityButtons = document.querySelectorAll('.quality-btn');
    const sleepForm = document.getElementById('sleepForm');
    
    // Проверяем элементы
    if (!recordBtn || !modalOverlay) {
        console.warn('Элементы модального окна не найдены');
        return;
    }
    
    // Открытие модального окна
    recordBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        modalOverlay.classList.add('active');
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
            
            // Проверяем заполнение времени
            if (!sleepStart || !sleepEnd) {
                alert('Заполните время начала и окончания сна');
                return;
            }
            
            try {
                // Сохраняем в базу данных
                await sleepDB.addSleepRecord({ 
                    sleepStart: sleepStart, 
                    sleepEnd: sleepEnd, 
                    quality: quality 
                });
                
                console.log('Запись сна сохранена');
                
                // Обновляем отображение статистики
                await updateSleepDisplay();
                
                // Закрываем и сбрасываем форму
                modalOverlay.classList.remove('active');
                sleepForm.reset();
                
                // Сбрасываем оценку качества на среднюю (3)
                qualityButtons.forEach(b => b.classList.remove('active'));
                if (qualityButtons[2]) {
                    qualityButtons[2].classList.add('active');
                }
                
            } catch (error) {
                console.error('Ошибка сохранения сна:', error);
                alert('Не удалось сохранить запись. Попробуйте снова.');
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
        
        // Если есть записи - показываем статистику
        if (stats.totalRecords > 0) {
            healthPanelBody.innerHTML = `
                <div class="sleep-stats">
                    <div>Средняя длительность: ${stats.avgDuration}ч</div>
                    <div>Качество сна: ${stats.avgQuality}/5</div>
                    <div>Всего записей: ${stats.totalRecords}</div>
                </div>
                <button class="sleep-record-btn" id="recordSleepBtn">Записать сон</button>
            `;
        } 
        // Если записей нет - показываем только кнопку
        else {
            healthPanelBody.innerHTML = `
                <button class="sleep-record-btn" id="recordSleepBtn">Записать первую запись сна</button>
            `;
        }
        
        // Переинициализируем обработчик кнопки
        const newRecordBtn = document.getElementById('recordSleepBtn');
        if (newRecordBtn) {
            newRecordBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const modal = document.getElementById('sleepModalOverlay');
                if (modal) modal.classList.add('active');
            });
        }
        
    } catch (error) {
        console.error('Ошибка загрузки статистики сна:', error);
    }
}

// Запускаем приложение при загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSleepApp);
} else {
    initSleepApp();
}