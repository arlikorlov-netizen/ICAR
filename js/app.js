// === НАЧАЛО БЛОКА APP_JS_002 ===

// Конфигурация приложения
const AppConfig = {
    userName: "Алексей",
    userLevel: 7,
    progressValues: {
        physical: 65,
        mental: 80,
        financial: 45,
        activity: 70
    }
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    console.log('ICAR v2 загружен');
    
    // Инициализация данных
    initUserData();
    initProgressBars();
    
    // Инициализация интерактивных элементов
    initHumanImage();
    initTabButtons();
    initSlideUpButton();
    initPanelCloses();
    
    // Загрузка тестовых данных
    loadTestData();
});

// Установка данных пользователя
function initUserData() {
    const userNameElement = document.getElementById('userName');
    const userLevelElement = document.getElementById('userLevel');
    
    if (userNameElement) {
        userNameElement.textContent = AppConfig.userName;
    }
    
    if (userLevelElement) {
        userLevelElement.textContent = `Уровень: ${AppConfig.userLevel}`;
    }
}

// Инициализация прогресс-баров
function initProgressBars() {
    const progressItems = {
        physical: document.getElementById('progressPhysical'),
        mental: document.getElementById('progressMental'),
        financial: document.getElementById('progressFinancial'),
        activity: document.getElementById('progressActivity')
    };
    
    // Установка начальных значений
    setTimeout(() => {
        setProgressValue('physical', AppConfig.progressValues.physical);
        setProgressValue('mental', AppConfig.progressValues.mental);
        setProgressValue('financial', AppConfig.progressValues.financial);
        setProgressValue('activity', AppConfig.progressValues.activity);
    }, 300);
}

// Установка значения прогресс-бара
function setProgressValue(type, value) {
    const barElement = document.querySelector(`#progress${type.charAt(0).toUpperCase() + type.slice(1)} .progress-bar`);
    const valueElement = document.getElementById(`value${type.charAt(0).toUpperCase() + type.slice(1)}`);
    
    if (barElement && valueElement) {
        // Ограничение значения 0-100
        const clampedValue = Math.max(0, Math.min(100, value));
        
        // Анимация заполнения
        barElement.style.width = `${clampedValue}%`;
        barElement.setAttribute('data-value', clampedValue);
        
        // Обновление текста
        valueElement.textContent = `${clampedValue}%`;
        
        // Цвет в зависимости от значения
        if (clampedValue < 30) {
            barElement.style.backgroundColor = '#FF6B6B'; // Красный
        } else if (clampedValue < 70) {
            barElement.style.backgroundColor = '#FFD166'; // Жёлтый
        } else {
            barElement.style.backgroundColor = '#06D6A0'; // Зелёный
        }
    }
}

// Обработчик центральной картинки
function initHumanImage() {
    const humanImage = document.getElementById('humanImage');
    
    if (humanImage) {
        // Установка placeholder картинки если нет файла
        if (humanImage.src.includes('human-figure.png') && !imageExists('assets/human-figure.png')) {
            humanImage.style.display = 'none';
            humanImage.parentElement.innerHTML += `
                <div class="placeholder-image">
                    <div style="width:150px;height:200px;background:#1A1A1A;border:2px solid #32CD32;
                        border-radius:20px;display:flex;align-items:center;justify-content:center;">
                        <span style="font-size:40px;">👤</span>
                    </div>
                </div>
            `;
        }
        
        humanImage.addEventListener('click', () => {
            alert('Детальная статистика - в разработке!');
            console.log('Картинка нажата - открыть детали');
        });
    }
}

// Проверка существования картинки
function imageExists(url) {
    // В реальном приложении здесь была бы проверка файла
    return false; // Возвращаем false для демонстрации
}

// Обработчики кнопок-закладок
function initTabButtons() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const rightPanel = document.getElementById('rightPanel');
    const panelTitle = document.getElementById('panelTitle');
    const panelBody = document.getElementById('panelBody');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabType = button.getAttribute('data-tab');
            openTabPanel(tabType, button);
        });
    });
    
    // Функция открытия панели
    function openTabPanel(tabType, button) {
        if (rightPanel && panelTitle && panelBody) {
            // Определяем контент для панели
            const panelContents = {
                health: {
                    title: '❤️ Здоровье',
                    content: 'Статистика сна, энергия, настроение<br>Средний сон: 7.5ч<br>Энергия: 3/5<br>Настроение: 4/5'
                },
                habits: {
                    title: '🎯 Привычки',
                    content: 'Ежедневные привычки<br>✅ Медитация<br>✅ Спорт<br>⚪ Чтение'
                },
                tasks: {
                    title: '✅ Задачи',
                    content: 'Текущие задачи<br>⚪ Купить продукты<br>✅ Позвонить маме<br>⚪ Записаться к врачу'
                },
                finance: {
                    title: '💰 Финансы',
                    content: 'Финансовый обзор<br>Расходы сегодня: 500₽<br>Бюджет: 1500₽<br>Сбережения: 25000₽'
                }
            };
            
            const content = panelContents[tabType] || {
                title: 'Панель',
                content: 'Выберите раздел'
            };
            
            // Заполняем панель
            panelTitle.textContent = content.title;
            panelBody.innerHTML = content.content;
            
            // Показываем панель
            rightPanel.classList.add('active');
            
            // Эффект нажатия кнопки
            button.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                button.style.transform = '';
            }, 300);
            
            console.log(`Открыта панель: ${tabType}`);
        }
    }
}

// Обработчик широкой кнопки снизу
function initSlideUpButton() {
    const slideUpBtn = document.getElementById('slideUpBtn');
    const bottomSheet = document.getElementById('bottomSheet');
    const sheetBody = document.getElementById('sheetBody');
    
    if (slideUpBtn && bottomSheet && sheetBody) {
        slideUpBtn.addEventListener('click', () => {
            // Заполняем контент панели
            sheetBody.innerHTML = `
                <div style="display:flex;flex-direction:column;gap:15px;">
                    <div style="background:#1A1A1A;padding:15px;border-radius:10px;border:1px solid #32CD32;">
                        <strong>Быстрый ввод</strong><br>
                        Внесите данные за сегодня
                    </div>
                    <div style="background:#1A1A1A;padding:15px;border-radius:10px;border:1px solid #32CD32;">
                        <strong>Статистика</strong><br>
                        Просмотр прогресса за неделю
                    </div>
                    <div style="background:#1A1A1A;padding:15px;border-radius:10px;border:1px solid #32CD32;">
                        <strong>Настройки</strong><br>
                        Настройки приложения
                    </div>
                </div>
            `;
            
            // Показываем панель
            bottomSheet.classList.add('active');
            console.log('Нижняя панель открыта');
        });
    }
}

// Закрытие панелей
function initPanelCloses() {
    const closeRightPanel = document.getElementById('closeRightPanel');
    const closeBottomSheet = document.getElementById('closeBottomSheet');
    const rightPanel = document.getElementById('rightPanel');
    const bottomSheet = document.getElementById('bottomSheet');
    
    if (closeRightPanel && rightPanel) {
        closeRightPanel.addEventListener('click', () => {
            rightPanel.classList.remove('active');
        });
    }
    
    if (closeBottomSheet && bottomSheet) {
        closeBottomSheet.addEventListener('click', () => {
            bottomSheet.classList.remove('active');
        });
    }
    
    // Закрытие по клику вне панелей
    document.addEventListener('click', (event) => {
        if (rightPanel && rightPanel.classList.contains('active')) {
            if (!rightPanel.contains(event.target) && 
                !event.target.closest('.tab-button')) {
                rightPanel.classList.remove('active');
            }
        }
        
        if (bottomSheet && bottomSheet.classList.contains('active')) {
            if (!bottomSheet.contains(event.target) && 
                event.target.id !== 'slideUpBtn') {
                bottomSheet.classList.remove('active');
            }
        }
    });
}

// Загрузка тестовых данных
function loadTestData() {
    console.log('Тестовые данные загружены:', AppConfig);
    
    // Обновление прогресс-баров каждые 5 секунд (для демо)
    setInterval(() => {
        const randomChange = () => Math.floor(Math.random() * 10) - 5;
        
        AppConfig.progressValues.physical = Math.max(0, Math.min(100, 
            AppConfig.progressValues.physical + randomChange()));
        AppConfig.progressValues.mental = Math.max(0, Math.min(100, 
            AppConfig.progressValues.mental + randomChange()));
        AppConfig.progressValues.financial = Math.max(0, Math.min(100, 
            AppConfig.progressValues.financial + randomChange()));
        AppConfig.progressValues.activity = Math.max(0, Math.min(100, 
            AppConfig.progressValues.activity + randomChange()));
        
        // Обновляем бары
        setProgressValue('physical', AppConfig.progressValues.physical);
        setProgressValue('mental', AppConfig.progressValues.mental);
        setProgressValue('financial', AppConfig.progressValues.financial);
        setProgressValue('activity', AppConfig.progressValues.activity);
        
    }, 5000); // Каждые 5 секунд
}

// === КОНЕЦ БЛОКА APP_JS_002 ===