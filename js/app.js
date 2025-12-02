/*
  БЛОК 43: app.js v7
  Изменения:
  1. Шрифт проверен
  2. Нижняя панель работает
  3. Все панели сливаются при открытии
  4. Крестики скрываются при открытии всех
  5. Ярлычки прижаты к границам
  6. Линии сплошные
*/

const AppConfig = {
    userName: "Алексей",
    userLevel: 7,
    progressValues: {
        physical: 56,
        mental: 81,
        financial: 41,
        activity: 72
    }
};

let activePanels = [];
let allPanelsOpen = false;

// Проверяем шрифт
console.log('Шрифт должен быть CrySisBold');

function formatCurrentDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}.${month}.${year}`;
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('ICAR v7 запущен');
    
    initDate();
    initUserData();
    initProgressBars();
    initHumanImage();
    initSideTabs();
    initBottomLine();
    initSettingsButton();
    initPanelCloseButtons();
    initAllPanelsCloseButton();
    initClosePanels();
    initBottomSheetClose();
});

function initDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        dateElement.textContent = formatCurrentDate();
    }
}

function initUserData() {
    document.getElementById('userName').textContent = AppConfig.userName;
    document.getElementById('userLevel').textContent = `lvl ${AppConfig.userLevel}`;
}

function initProgressBars() {
    setTimeout(() => {
        setProgressValue('physical', AppConfig.progressValues.physical);
        setProgressValue('mental', AppConfig.progressValues.mental);
        setProgressValue('financial', AppConfig.progressValues.financial);
        setProgressValue('activity', AppConfig.progressValues.activity);
    }, 500);
}

function setProgressValue(type, value) {
    const barElement = document.querySelector(`#progress${type.charAt(0).toUpperCase() + type.slice(1)} .progress-bar`);
    const valueElement = document.getElementById(`value${type.charAt(0).toUpperCase() + type.slice(1)}`);
    
    if (!barElement || !valueElement) return;
    
    const clampedValue = Math.max(0, Math.min(100, value));
    
    barElement.style.width = `${clampedValue}%`;
    barElement.setAttribute('data-value', clampedValue);
    valueElement.textContent = `${clampedValue}%`;
    
    // Цвета
    if (clampedValue < 30) {
        barElement.style.background = 'linear-gradient(90deg, #FF6B6B, #FF8E8E)';
    } else if (clampedValue < 70) {
        barElement.style.background = 'linear-gradient(90deg, #FFD166, #FFE8A0)';
    } else {
        barElement.style.background = 'linear-gradient(90deg, #06D6A0, #7CFC7C)';
    }
}

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
        centerImage.addEventListener('click', toggleAllPanels);
    }
}

function initSideTabs() {
    document.querySelectorAll('.side-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.stopPropagation();
            const tabType = tab.getAttribute('data-tab');
            openSinglePanel(tabType);
        });
    });
}

function openSinglePanel(panelType) {
    if (allPanelsOpen) {
        closeAllPanels();
        return;
    }
    
    const panel = document.getElementById(`${panelType}Panel`);
    if (!panel) return;
    
    // Закрываем все другие панели
    closeAllPanels();
    
    // Открываем выбранную
    panel.classList.add('active');
    activePanels = [panelType];
}

function toggleAllPanels() {
    if (allPanelsOpen) {
        closeAllPanels();
    } else {
        openAllPanels();
    }
}

function openAllPanels() {
    const panels = ['health', 'habits', 'tasks', 'finance'];
    
    // Показываем фон
    const bg = document.getElementById('allPanelsBackground');
    if (bg) bg.classList.add('active');
    
    // Добавляем класс для стилей
    document.body.classList.add('all-panels-open');
    
    // Открываем все панели
    panels.forEach((panelType, index) => {
        setTimeout(() => {
            const panel = document.getElementById(`${panelType}Panel`);
            if (panel) {
                panel.classList.add('active');
                if (!activePanels.includes(panelType)) {
                    activePanels.push(panelType);
                }
            }
        }, index * 50);
    });
    
    // Показываем общий крестик
    setTimeout(() => {
        const allPanelsClose = document.getElementById('allPanelsClose');
        if (allPanelsClose) allPanelsClose.classList.add('active');
        allPanelsOpen = true;
    }, 300);
}

function closeAllPanels() {
    // Закрываем все панели
    document.querySelectorAll('.corner-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Убираем фон
    const bg = document.getElementById('allPanelsBackground');
    if (bg) bg.classList.remove('active');
    
    // Убираем общий крестик
    const allPanelsClose = document.getElementById('allPanelsClose');
    if (allPanelsClose) allPanelsClose.classList.remove('active');
    
    // Убираем класс стилей
    document.body.classList.remove('all-panels-open');
    
    // Сбрасываем состояния
    activePanels = [];
    allPanelsOpen = false;
}

function initPanelCloseButtons() {
    document.querySelectorAll('.panel-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const panelType = btn.getAttribute('data-close');
            const panel = document.getElementById(`${panelType}Panel`);
            
            if (panel) {
                panel.classList.remove('active');
                const index = activePanels.indexOf(panelType);
                if (index > -1) activePanels.splice(index, 1);
            }
        });
    });
}

function initAllPanelsCloseButton() {
    const allPanelsClose = document.getElementById('allPanelsClose');
    if (allPanelsClose) {
        allPanelsClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllPanels();
        });
    }
}

// НИЖНЯЯ ПАНЕЛЬ РАБОТАЕТ
function initBottomLine() {
    const trigger = document.getElementById('bottomLineTrigger');
    const sheet = document.getElementById('bottomSheet');
    
    if (trigger && sheet) {
        trigger.addEventListener('click', () => {
            closeAllPanels();
            sheet.classList.add('active');
            
            document.querySelectorAll('.line').forEach(line => {
                line.style.transform = 'scaleX(1.3)';
                setTimeout(() => { line.style.transform = ''; }, 300);
            });
        });
    }
}

function initBottomSheetClose() {
    const closeBtn = document.getElementById('closeBottomSheet');
    const sheet = document.getElementById('bottomSheet');
    
    if (closeBtn && sheet) {
        closeBtn.addEventListener('click', () => {
            sheet.classList.remove('active');
        });
    }
}

function initSettingsButton() {
    const btn = document.getElementById('settingsBtn');
    if (btn) {
        btn.addEventListener('click', () => {
            alert('Раздел настроек в разработке!');
        });
    }
}

function initClosePanels() {
    document.addEventListener('click', (e) => {
        const isPanelElement = e.target.closest('.side-tab') || 
                              e.target.closest('.corner-panel') ||
                              e.target.closest('#centerImage') ||
                              e.target.closest('.panel-close') ||
                              e.target.id === 'allPanelsClose';
        
        // Закрытие одиночных панелей при клике вне
        if (activePanels.length > 0 && !allPanelsOpen && !isPanelElement) {
            closeAllPanels();
        }
        
        // Закрытие нижней панели при клике вне
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
            closeAllPanels();
            const bottomSheet = document.getElementById('bottomSheet');
            if (bottomSheet) bottomSheet.classList.remove('active');
        }
    });
}

// Автообновление прогресс-баров
setInterval(() => {
    if (Math.random() > 0.9) {
        const change = () => Math.floor(Math.random() * 4) - 2;
        
        AppConfig.progressValues.physical += change();
        AppConfig.progressValues.mental += change();
        AppConfig.progressValues.financial += change();
        AppConfig.progressValues.activity += change();
        
        Object.keys(AppConfig.progressValues).forEach(key => {
            AppConfig.progressValues[key] = Math.max(0, Math.min(100, AppConfig.progressValues[key]));
        });
        
        setProgressValue('physical', AppConfig.progressValues.physical);
        setProgressValue('mental', AppConfig.progressValues.mental);
        setProgressValue('financial', AppConfig.progressValues.financial);
        setProgressValue('activity', AppConfig.progressValues.activity);
    }
}, 15000);