/*
  БЛОК 16: app.js v2
  Изменения:
  1. Исправлена логика открытия панелей
  2. Добавлены кнопки закрытия на панелях
  3. Улучшена анимация
  4. Добавлена обработка ошибок картинки
  5. Исправлено закрытие при клике вне
*/

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

let activePanel = null;

// 1. Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    console.log('ICAR v2 запущен');
    
    initUserData();
    initProgressBars();
    initHumanImage();
    initSideTabs();
    initBottomLine();
    initBottomSheet();
    initAllModulesPanel();
    initSettingsButton();
    initPanelCloseButtons();
    initClosePanels();
});

// 2. Данные пользователя
function initUserData() {
    document.getElementById('userName').textContent = AppConfig.userName;
    document.getElementById('userLevel').textContent = `Уровень: ${AppConfig.userLevel}`;
}

// 3. Прогресс-бары
function initProgressBars() {
    setTimeout(() => {
        setProgressValue('physical', AppConfig.progressValues.physical);
        setProgressValue('mental', AppConfig.progressValues.mental);
        setProgressValue('financial', AppConfig.progressValues.financial);
        setProgressValue('activity', AppConfig.progressValues.activity);
    }, 500);
}

// 4. Установка значения прогресс-бара
function setProgressValue(type, value) {
    const barElement = document.querySelector(`#progress${type.charAt(0).toUpperCase() + type.slice(1)} .progress-bar`);
    const valueElement = document.getElementById(`value${type.charAt(0).toUpperCase() + type.slice(1)}`);
    
    if (!barElement || !valueElement) return;
    
    const clampedValue = Math.max(0, Math.min(100, value));
    
    barElement.style.width = `${clampedValue}%`;
    barElement.setAttribute('data-value', clampedValue);
    valueElement.textContent = `${clampedValue}%`;
    
    // Цвет в зависимости от значения
    if (clampedValue < 30) {
        barElement.style.background = 'linear-gradient(90deg, #FF6B6B, #FF8E8E)';
    } else if (clampedValue < 70) {
        barElement.style.background = 'linear-gradient(90deg, #FFD166, #FFE8A0)';
    } else {
        barElement.style.background = 'linear-gradient(90deg, #06D6A0, #7CFC7C)';
    }
}

// 5. Картинка человека
function initHumanImage() {
    const humanImage = document.getElementById('humanImage');
    const centerImage = document.getElementById('centerImage');
    
    if (humanImage) {
        humanImage.onerror = function() {
            this.style.display = 'none';
            const wrapper = document.querySelector('.image-wrapper');
            if (wrapper && !wrapper.querySelector('.image-placeholder')) {
                wrapper.innerHTML = '<div class="image-placeholder"><span>👤</span></div>';
            }
        };
        
        if (humanImage.complete && humanImage.naturalHeight === 0) {
            humanImage.onerror();
        }
    }
    
    if (centerImage) {
        centerImage.addEventListener('click', openAllModules);
    }
}

// 6. Боковые кнопки
function initSideTabs() {
    document.querySelectorAll('.side-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.stopPropagation();
            const tabType = tab.getAttribute('data-tab');
            toggleCornerPanel(tabType, tab);
        });
    });
}

// 7. Переключение панели
function toggleCornerPanel(panelType, button) {
    const panel = document.getElementById(`${panelType}Panel`);
    if (!panel) return;
    
    closeAllCornerPanels();
    
    if (activePanel === panelType) {
        activePanel = null;
    } else {
        panel.classList.add('active');
        activePanel = panelType;
        
        if (button) {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => { button.style.transform = ''; }, 200);
        }
    }
}

// 8. Кнопки закрытия панелей
function initPanelCloseButtons() {
    document.querySelectorAll('.panel-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const panelType = btn.getAttribute('data-close');
            const panel = document.getElementById(`${panelType}Panel`);
            
            if (panel) {
                panel.classList.remove('active');
                if (activePanel === panelType) activePanel = null;
            }
        });
    });
}

// 9. Закрытие всех панелей
function closeAllCornerPanels() {
    document.querySelectorAll('.corner-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    activePanel = null;
}

// 10. Панель всех модулей
function initAllModulesPanel() {
    const closeBtn = document.getElementById('closeModulesBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeAllModules);
    }
    
    document.querySelectorAll('.module-card').forEach(card => {
        card.addEventListener('click', () => {
            const moduleType = card.getAttribute('data-module');
            closeAllModules();
            setTimeout(() => toggleCornerPanel(moduleType), 300);
        });
    });
}

// 11. Открыть все модули
function openAllModules() {
    closeAllCornerPanels();
    const panel = document.getElementById('allModulesPanel');
    if (panel) panel.classList.add('active');
}

// 12. Закрыть все модули
function closeAllModules() {
    const panel = document.getElementById('allModulesPanel');
    if (panel) panel.classList.remove('active');
}

// 13. Двойная линия
function initBottomLine() {
    const trigger = document.getElementById('bottomLineTrigger');
    const sheet = document.getElementById('bottomSheet');
    
    if (trigger && sheet) {
        trigger.addEventListener('click', () => {
            closeAllCornerPanels();
            closeAllModules();
            sheet.classList.toggle('active');
            
            document.querySelectorAll('.line').forEach(line => {
                line.style.transform = 'scaleX(1.3)';
                setTimeout(() => { line.style.transform = ''; }, 300);
            });
        });
    }
}

// 14. Нижняя панель
function initBottomSheet() {
    const closeBtn = document.getElementById('closeBottomSheet');
    const sheet = document.getElementById('bottomSheet');
    
    if (closeBtn && sheet) {
        closeBtn.addEventListener('click', () => {
            sheet.classList.remove('active');
        });
    }
}

// 15. Кнопка настроек
function initSettingsButton() {
    const btn = document.getElementById('settingsBtn');
    if (btn) {
        btn.addEventListener('click', () => {
            alert('Раздел настроек в разработке!');
        });
    }
}

// 16. Закрытие при клике вне
function initClosePanels() {
    document.addEventListener('click', (e) => {
        // Не закрывать если клик по кнопке, панели или кнопке закрытия
        const isPanelElement = e.target.closest('.side-tab') || 
                              e.target.closest('.corner-panel') || 
                              e.target.closest('.panel-close') ||
                              e.target.closest('#centerImage');
        
        if (activePanel && !isPanelElement) {
            closeAllCornerPanels();
        }
        
        // Закрыть панель всех модулей
        const allModules = document.getElementById('allModulesPanel');
        if (allModules && allModules.classList.contains('active')) {
            if (!allModules.contains(e.target) && !e.target.closest('#centerImage')) {
                closeAllModules();
            }
        }
        
        // Закрыть нижнюю панель
        const bottomSheet = document.getElementById('bottomSheet');
        if (bottomSheet && bottomSheet.classList.contains('active')) {
            if (!bottomSheet.contains(e.target) && 
                e.target.id !== 'bottomLineTrigger' &&
                !e.target.closest('#bottomLineTrigger')) {
                bottomSheet.classList.remove('active');
            }
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllCornerPanels();
            closeAllModules();
            const bottomSheet = document.getElementById('bottomSheet');
            if (bottomSheet) bottomSheet.classList.remove('active');
        }
    });
}

// 17. Демо-обновление прогресс-баров
setInterval(() => {
    if (Math.random() > 0.8) {
        const change = () => Math.floor(Math.random() * 10) - 5;
        
        AppConfig.progressValues.physical += change();
        AppConfig.progressValues.mental += change();
        AppConfig.progressValues.financial += change();
        AppConfig.progressValues.activity += change();
        
        // Ограничиваем значения
        Object.keys(AppConfig.progressValues).forEach(key => {
            AppConfig.progressValues[key] = Math.max(0, Math.min(100, AppConfig.progressValues[key]));
        });
        
        setProgressValue('physical', AppConfig.progressValues.physical);
        setProgressValue('mental', AppConfig.progressValues.mental);
        setProgressValue('financial', AppConfig.progressValues.financial);
        setProgressValue('activity', AppConfig.progressValues.activity);
    }
}, 8000);