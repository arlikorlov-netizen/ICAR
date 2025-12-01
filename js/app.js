// === НАЧАЛО БЛОКА APP_JS_003 ===

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

// Текущая активная панель
let activePanel = null;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    console.log('ICAR v3 загружен');
    
    // Инициализация данных
    initUserData();
    initProgressBars();
    
    // Инициализация интерактивных элементов
    initHumanImage();
    initSideTabs();
    initBottomLine();
    initBottomSheet();
    
    // Закрытие панелей при клике вне
    initClosePanels();
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
        const clampedValue = Math.max(0, Math.min(100, value));
        
        // Анимация заполнения
        barElement.style.width = `${clampedValue}%`;
        barElement.setAttribute('data-value', clampedValue);
        
        // Обновление текста
        valueElement.textContent = `${clampedValue}%`;
        
        // Цвет в зависимости от значения
        if (clampedValue < 30) {
            barElement.style.backgroundColor = '#FF6B6B';
        } else if (clampedValue < 70) {
            barElement.style.backgroundColor = '#FFD166';
        } else {
            barElement.style.backgroundColor = '#06D6A0';
        }
    }
}

// Обработчик центральной картинки
function initHumanImage() {
    const humanImage = document.getElementById('humanImage');
    const imageWrapper = document.querySelector('.image-wrapper');
    
    if (humanImage) {
        // Если картинка не загружена, показываем placeholder
        humanImage.onerror = function() {
            this.style.display = 'none';
            if (imageWrapper && !document.querySelector('.image-placeholder')) {
                imageWrapper.innerHTML = `
                    <div class="image-placeholder">
                        <span>👤</span>
                        <div class="image-label">Нажми для деталей</div>
                    </div>
                `;
                
                // Добавляем обработчик для placeholder
                const placeholder = document.querySelector('.image-placeholder');
                if (placeholder) {
                    placeholder.addEventListener('click', () => {
                        alert('Детальная статистика - в разработке!');
                        console.log('Placeholder нажат');
                    });
                }
            }
        };
        
        // Проверяем загрузилась ли картинка
        if (humanImage.complete && humanImage.naturalHeight === 0) {
            humanImage.onerror();
        }
        
        humanImage.addEventListener('click', () => {
            alert('Детальная статистика - в разработке!');
            console.log('Картинка нажата');
        });
    }
}

// Обработчики боковых кнопок
function initSideTabs() {
    const sideTabs = document.querySelectorAll('.side-tab');
    
    sideTabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            event.stopPropagation();
            const tabType = tab.getAttribute('data-tab');
            toggleCornerPanel(tabType, tab);
        });
    });
}

// Переключение угловой панели
function toggleCornerPanel(panelType, button) {
    const panelId = `${panelType}Panel`;
    const panel = document.getElementById(panelId);
    
    if (!panel) return;
    
    // Закрываем все другие панели
    closeAllCornerPanels();
    
    // Если нажимаем на ту же кнопку - закрываем, иначе открываем
    if (activePanel === panelType) {
        activePanel = null;
    } else {
        panel.classList.add('active');
        activePanel = panelType;
        
        // Эффект нажатия кнопки
        if (button) {
            button.style.transform = 'scale(0.9)';
            setTimeout(() => {
                button.style.transform = '';
            }, 200);
        }
        
        console.log(`Открыта панель: ${panelType}`);
    }
}

// Закрытие всех угловых панелей
function closeAllCornerPanels() {
    const panels = document.querySelectorAll('.corner-panel');
    panels.forEach(panel => {
        panel.classList.remove('active');
    });
    activePanel = null;
}

// Обработчик двойной линии
function initBottomLine() {
    const bottomLineTrigger = document.getElementById('bottomLineTrigger');
    const bottomSheet = document.getElementById('bottomSheet');
    
    if (bottomLineTrigger && bottomSheet) {
        bottomLineTrigger.addEventListener('click', () => {
            closeAllCornerPanels(); // Закрываем угловые панели
            bottomSheet.classList.toggle('active');
            
            // Анимация линий
            const lines = document.querySelectorAll('.line');
            lines.forEach(line => {
                line.style.transform = 'scaleX(1.2)';
                setTimeout(() => {
                    line.style.transform = '';
                }, 300);
            });
            
            console.log('Нижняя панель переключена');
        });
    }
}

// Обработчик нижней панели
function initBottomSheet() {
    const closeBottomSheet = document.getElementById('closeBottomSheet');
    const bottomSheet = document.getElementById('bottomSheet');
    
    if (closeBottomSheet && bottomSheet) {
        closeBottomSheet.addEventListener('click', () => {
            bottomSheet.classList.remove('active');
        });
    }
}

// Закрытие панелей при клике вне
function initClosePanels() {
    document.addEventListener('click', (event) => {
        // Закрытие угловых панелей
        if (activePanel && !event.target.closest('.side-tab') && 
            !event.target.closest('.corner-panel')) {
            closeAllCornerPanels();
        }
        
        // Закрытие нижней панели
        const bottomSheet = document.getElementById('bottomSheet');
        if (bottomSheet && bottomSheet.classList.contains('active')) {
            if (!bottomSheet.contains(event.target) && 
                event.target.id !== 'bottomLineTrigger' &&
                !event.target.closest('#bottomLineTrigger')) {
                bottomSheet.classList.remove('active');
            }
        }
    });
    
    // Закрытие при нажатии Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeAllCornerPanels();
            const bottomSheet = document.getElementById('bottomSheet');
            if (bottomSheet) {
                bottomSheet.classList.remove('active');
            }
        }
    });
}

// Демо: изменение значений прогресс-баров
setInterval(() => {
    if (Math.random() > 0.7) { // 30% chance
        const randomChange = () => Math.floor(Math.random() * 15) - 7;
        
        AppConfig.progressValues.physical = Math.max(0, Math.min(100, 
            AppConfig.progressValues.physical + randomChange()));
        AppConfig.progressValues.mental = Math.max(0, Math.min(100, 
            AppConfig.progressValues.mental + randomChange()));
        AppConfig.progressValues.financial = Math.max(0, Math.min(100, 
            AppConfig.progressValues.financial + randomChange()));
        AppConfig.progressValues.activity = Math.max(0, Math.min(100, 
            AppConfig.progressValues.activity + randomChange()));
        
        setProgressValue('physical', AppConfig.progressValues.physical);
        setProgressValue('mental', AppConfig.progressValues.mental);
        setProgressValue('financial', AppConfig.progressValues.financial);
        setProgressValue('activity', AppConfig.progressValues.activity);
    }
}, 10000); // Каждые 10 секунд

// === КОНЕЦ БЛОКА APP_JS_003 ===