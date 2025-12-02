/*
  БЛОК 33: app.js v5
  Изменения:
  1. Формат даты xx.xx.xxxx
  2. Открытие всех панелей с общим крестиком
  3. Убрана звездочка из уровня
*/

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

let activePanels = [];
let allPanelsOpen = false;

// Функция форматирования даты в xx.xx.xxxx
function formatCurrentDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}.${month}.${year}`;
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('ICAR v5 запущен');
    
    initDate();
    initUserData();
    initProgressBars();
    initHumanImage();
    initSideTabs();
    initBottomLine();
    initAllModulesPanel();
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
    document.getElementById('userLevel').textContent = `lvl ${AppConfig.userLevel}`; // Без звездочки
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
        // Если панель уже открыта - закрываем
        panel.classList.remove('active');
        activePanels.splice(index, 1);
        hideAllPanelsCloseButton();
    } else {
        // Если панель закрыта - открываем
        panel.classList.add('active');
        activePanels.push(panelType);
        if (activePanels.length === 4) {
            showAllPanelsCloseButton();
            addAllPanelsOpenClass();
        }
    }
}

// Новая функция: открытие всех панелей с эффектами
function openAllCornerPanelsWithEffects() {
    const panels = ['health', 'habits', 'tasks', 'finance'];
    
    // Закрываем все панели сначала
    closeAllCornerPanels();
    
    // Добавляем класс для стилей "все панели открыты"
    addAllPanelsOpenClass();
    
    // Открываем все панели
    panels.forEach((panelType, index) => {
        setTimeout(() => {
            const panel = document.getElementById(`${panelType}Panel`);
            if (panel) {
                panel.classList.add('active');
                activePanels.push(panelType);
                
                // Показываем общий крестик после открытия всех панелей
                if (index === panels.length - 1) {
                    setTimeout(() => {
                        showAllPanelsCloseButton();
                        allPanelsOpen = true;
                    }, 300);
                }
            }
        }, index * 80);
    });
}

function addAllPanelsOpenClass() {
    document.body.classList.add('all-panels-open');
}

function removeAllPanelsOpenClass() {
    document.body.classList.remove('all-panels-open');
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
    removeAllPanelsOpenClass();
}

// Крестики закрытия на каждой панели
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
                
                if (activePanels.length < 4) {
                    hideAllPanelsCloseButton();
                    removeAllPanelsOpenClass();
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

function openAllModules() {
    closeAllCornerPanels();
    const panel = document.getElementById('allModulesPanel');
    if (panel) panel.classList.add('active');
}

function closeAllModules() {
    const panel = document.getElementById('allModulesPanel');
    if (panel) panel.classList.remove('active');
}

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
                              e.target.closest('.module-card') ||
                              e.target.closest('.panel-close') ||
                              e.target.id === 'allPanelsClose';
        
        if (activePanels.length > 0 && !isPanelElement && !allPanelsOpen) {
            closeAllCornerPanels();
        }
        
        const allModules = document.getElementById('allModulesPanel');
        if (allModules && allModules.classList.contains('active')) {
            if (!allModules.contains(e.target) && !e.target.closest('#centerImage')) {
                closeAllModules();
            }
        }
        
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
            closeAllModules();
            const bottomSheet = document.getElementById('bottomSheet');
            if (bottomSheet) bottomSheet.classList.remove('active');
        }
    });
}

// Автообновление прогресс-баров
setInterval(() => {
    if (Math.random() > 0.8) {
        const change = () => Math.floor(Math.random() * 10) - 5;
        
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
}, 10000);