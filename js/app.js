/*
  БЛОК 38: app.js v6
  Изменения:
  1. Исправлена логика крестиков
  2. Фон для всех панелей
  3. Исправлено открытие/закрытие
  4. Значения прогресса как на скриншоте
*/

const AppConfig = {
    userName: "Алексей",
    userLevel: 7,
    progressValues: {
        physical: 56,  // Как на скриншоте
        mental: 81,    // Как на скриншоте
        financial: 41, // Как на скриншоте
        activity: 72   // Как на скриншоте
    }
};

let activePanels = [];
let allPanelsOpen = false;

function formatCurrentDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}.${month}.${year}`;
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('ICAR v6 запущен');
    
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
    
    // Цвета как на скриншоте
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
        centerImage.addEventListener('click', openAllCornerPanelsWithEffects);
    }
}

function initSideTabs() {
    document.querySelectorAll('.side-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.stopPropagation();
            const tabType = tab.getAttribute('data-tab');
            toggleCornerPanel(tabType);
        });
    });
}

function toggleCornerPanel(panelType) {
    const panel = document.getElementById(`${panelType}Panel`);
    if (!panel) return;
    
    const index = activePanels.indexOf(panelType);
    
    if (index > -1) {
        // Закрываем панель
        panel.classList.remove('active');
        activePanels.splice(index, 1);
        hideAllPanelsCloseButton();
        hideAllPanelsBackground();
        removeAllPanelsOpenClass();
        allPanelsOpen = false;
    } else {
        // Открываем панель
        panel.classList.add('active');
        activePanels.push(panelType);
        // НЕ показываем общий крестик если открыта только одна панель
    }
}

function openAllCornerPanelsWithEffects() {
    const panels = ['health', 'habits', 'tasks', 'finance'];
    
    if (allPanelsOpen) {
        closeAllCornerPanels();
        return;
    }
    
    // Показываем фон
    showAllPanelsBackground();
    
    // Добавляем класс для стилей
    addAllPanelsOpenClass();
    
    // Открываем все панели
    panels.forEach((panelType, index) => {
        setTimeout(() => {
            const panel = document.getElementById(`${panelType}Panel`);
            if (panel) {
                panel.classList.add('active');
                if (!activePanels.includes(panelType)) {
                    activePanels.push(panelType);
                }
                
                // Показываем общий крестик после открытия
                if (index === panels.length - 1) {
                    setTimeout(() => {
                        showAllPanelsCloseButton();
                        allPanelsOpen = true;
                    }, 400);
                }
            }
        }, index * 60);
    });
}

function addAllPanelsOpenClass() {
    document.body.classList.add('all-panels-open');
}

function removeAllPanelsOpenClass() {
    document.body.classList.remove('all-panels-open');
}

function showAllPanelsBackground() {
    const bg = document.getElementById('allPanelsBackground');
    if (bg) bg.classList.add('active');
}

function hideAllPanelsBackground() {
    const bg = document.getElementById('allPanelsBackground');
    if (bg) bg.classList.remove('active');
}

function showAllPanelsCloseButton() {
    const allPanelsClose = document.getElementById('allPanelsClose');
    if (allPanelsClose) {
        allPanelsClose.classList.add('active');
    }
}

function hideAllPanelsCloseButton() {
    const allPanelsClose = document.getElementById('allPanelsClose');
    if (allPanelsClose) {
        allPanelsClose.classList.remove('active');
    }
}

function closeAllCornerPanels() {
    document.querySelectorAll('.corner-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    activePanels = [];
    allPanelsOpen = false;
    hideAllPanelsCloseButton();
    hideAllPanelsBackground();
    removeAllPanelsOpenClass();
}

// Крестики на отдельных панелях
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
                
                // Если закрыли все панели
                if (activePanels.length === 0) {
                    hideAllPanelsCloseButton();
                    hideAllPanelsBackground();
                    removeAllPanelsOpenClass();
                    allPanelsOpen = false;
                }
            }
        });
    });
}

// Общий крестик для закрытия всех панелей
function initAllPanelsCloseButton() {
    const allPanelsClose = document.getElementById('allPanelsClose');
    if (allPanelsClose) {
        allPanelsClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllCornerPanels();
        });
    }
}

function initBottomLine() {
    const trigger = document.getElementById('bottomLineTrigger');
    const sheet = document.getElementById('bottomSheet');
    
    if (trigger && sheet) {
        trigger.addEventListener('click', () => {
            closeAllCornerPanels();
            sheet.classList.toggle('active');
            
            document.querySelectorAll('.line').forEach(line => {
                line.style.transform = 'scaleX(1.3)';
                setTimeout(() => { line.style.transform = ''; }, 300);
            });
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
        // Если клик вне панелей и они открыты по отдельности
        const isPanelElement = e.target.closest('.side-tab') || 
                              e.target.closest('.corner-panel') ||
                              e.target.closest('#centerImage') ||
                              e.target.closest('.panel-close') ||
                              e.target.id === 'allPanelsClose' ||
                              e.target.closest('#allPanelsBackground');
        
        if (activePanels.length > 0 && !allPanelsOpen && !isPanelElement) {
            closeAllCornerPanels();
        }
        
        // Если клик на фон когда все панели открыты
        if (allPanelsOpen && e.target.id === 'allPanelsBackground') {
            closeAllCornerPanels();
        }
        
        // Нижняя панель
        const bottomSheet = document.getElementById('bottomSheet');
        if (bottomSheet && bottomSheet.classList.contains('active')) {
            if (!bottomSheet.contains(e.target) && 
                e.target.id !== 'bottomLineTrigger' &&
                !e.target.closest('#bottomLineTrigger')) {
                bottomSheet.classList.remove('active');
            }
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllCornerPanels();
            const bottomSheet = document.getElementById('bottomSheet');
            if (bottomSheet) bottomSheet.classList.remove('active');
        }
    });
}

// Автообновление
setInterval(() => {
    if (Math.random() > 0.9) {
        const change = () => Math.floor(Math.random() * 6) - 3;
        
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
}, 12000);