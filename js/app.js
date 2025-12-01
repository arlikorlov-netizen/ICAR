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
    console.log('ICAR v5 загружен');
    
    // Инициализация данных
    initUserData();
    initProgressBars();
    
    // Инициализация интерактивных элементов
    initHumanImage();
    initSideTabs();
    initBottomLine();
    initBottomSheet();
    initAllModulesPanel();
    initSettingsButton();
    initPanelCloseButtons();
    
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
        
        barElement.style.width = `${clampedValue}%`;
        barElement.setAttribute('data-value', clampedValue);
        valueElement.textContent = `${clampedValue}%`;
        
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
    const centerImage = document.getElementById('centerImage');
    const imageWrapper = document.querySelector('.image-wrapper');
    
    if (humanImage) {
        humanImage.onerror = function() {
            this.style.display = 'none';
            if (imageWrapper && !document.querySelector('.image-placeholder')) {
                imageWrapper.innerHTML = `
                    <div class="image-placeholder">
                        <span>👤</span>
                    </div>
                `;
            }
        };
        
        if (humanImage.complete && humanImage.naturalHeight === 0) {
            humanImage.onerror();
        }
    }
    
    // Открытие всех модулей по клику на картинку
    if (centerImage) {
        centerImage.addEventListener('click', openAllModules);
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
    
    closeAllCornerPanels();
    
    if (activePanel === panelType) {
        activePanel = null;
    } else {
        panel.classList.add('active');
        activePanel = panelType;
        
        if (button) {
            button.style.transform = 'scale(0.9)';
            setTimeout(() => {
                button.style.transform = '';
            }, 200);
        }
    }
}

// Инициализация кнопок закрытия панелей
function initPanelCloseButtons() {
    const closeButtons = document.querySelectorAll('.panel-close');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const panelType = button.getAttribute('data-close');
            const panel = document.getElementById(`${panelType}Panel`);
            
            if (panel) {
                panel.classList.remove('active');
                if (activePanel === panelType) {
                    activePanel = null;
                }
            }
        });
    });
}

// Закрытие всех угловых панелей
function closeAllCornerPanels() {
    const panels = document.querySelectorAll('.corner-panel');
    panels.forEach(panel => {
        panel.classList.remove('active');
    });
    activePanel = null;
}

// Инициализация панели всех модулей
function initAllModulesPanel() {
    const allModulesPanel = document.getElementById('allModulesPanel');
    const closeModulesBtn = document.getElementById('closeModulesBtn');
    const moduleCards = document.querySelectorAll('.module-card');
    
    if (closeModulesBtn) {
        closeModulesBtn.addEventListener('click', closeAllModules);
    }
    
    moduleCards.forEach(card => {
        card.addEventListener('click', () => {
            const moduleType = card.getAttribute('data-module');
            closeAllModules();
            setTimeout(() => {
                toggleCornerPanel(moduleType);
            }, 300);
        });
    });
}

// Открытие всех модулей
function openAllModules() {
    const allModulesPanel = document.getElementById('allModulesPanel');
    closeAllCornerPanels();
    
    if (allModulesPanel) {
        allModulesPanel.classList.add('active');
    }
}

// Закрытие всех модулей
function closeAllModules() {
    const allModulesPanel = document.getElementById('allModulesPanel');
    
    if (allModulesPanel) {
        allModulesPanel.classList.remove('active');
    }
}

// Обработчик двойной линии
function initBottomLine() {
    const bottomLineTrigger = document.getElementById('bottomLineTrigger');
    const bottomSheet = document.getElementById('bottomSheet');
    
    if (bottomLineTrigger && bottomSheet) {
        bottomLineTrigger.addEventListener('click', () => {
            closeAllCornerPanels();
            closeAllModules();
            bottomSheet.classList.toggle('active');
            
            const lines = document.querySelectorAll('.line');
            lines.forEach(line => {
                line.style.transform = 'scaleX(1.2)';
                setTimeout(() => {
                    line.style.transform = '';
                }, 300);
            });
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

// Обработчик кнопки настроек
function initSettingsButton() {
    const settingsBtn = document.getElementById('settingsBtn');
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            alert('Настройки - в разработке!');
        });
    }
}

// Закрытие панелей при клике вне
function initClosePanels() {
    document.addEventListener('click', (event) => {
        // Закрытие угловых панелей
        const isPanel = event.target.closest('.corner-panel');
        const isPanelClose = event.target.closest('.panel-close');
        const isSideTab = event.target.closest('.side-tab');
        
        if (activePanel && !isSideTab && !isPanel && !isPanelClose) {
            closeAllCornerPanels();
        }
        
        // Закрытие панели всех модулей
        const allModulesPanel = document.getElementById('allModulesPanel');
        if (allModulesPanel && allModulesPanel.classList.contains('active')) {
            if (!allModulesPanel.contains(event.target) && 
                !event.target.closest('#centerImage')) {
                closeAllModules();
            }
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
    
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeAllCornerPanels();
            closeAllModules();
            const bottomSheet = document.getElementById('bottomSheet');
            if (bottomSheet) {
                bottomSheet.classList.remove('active');
            }
        }
    });
}

// Демо: изменение значений прогресс-баров
setInterval(() => {
    if (Math.random() > 0.7) {
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
}, 10000);