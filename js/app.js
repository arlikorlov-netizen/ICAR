/*
  БЛОК 26: app.js v4
  Изменения 1, 8, 10:
  1. Функция даты
  2. Клик на фигурку открывает все 4 панели
  3. Основная логика приложения
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

let activePanels = []; // Теперь массив для нескольких панелей

// Функция форматирования даты
function formatCurrentDate() {
    const now = new Date();
    const options = { month: 'long', day: 'numeric' };
    return now.toLocaleDateString('ru-RU', options);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('ICAR v4 запущен');
    
    initDate();
    initUserData();
    initProgressBars();
    initHumanImage();
    initSideTabs();
    initBottomLine();
    initAllModulesPanel();
    initSettingsButton();
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
        // ИЗМЕНЕНИЕ 8: Клик на фигурку открывает ВСЕ 4 панели
        centerImage.addEventListener('click', openAllCornerPanels);
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
    } else {
        // Если панель закрыта - открываем
        panel.classList.add('active');
        activePanels.push(panelType);
    }
}

// ИЗМЕНЕНИЕ 8: Функция открытия всех 4 панелей
function openAllCornerPanels() {
    const panels = ['health', 'habits', 'tasks', 'finance'];
    
    // Закрываем все панели сначала
    closeAllCornerPanels();
    
    // Открываем все панели с небольшой задержкой для анимации
    panels.forEach((panelType, index) => {
        setTimeout(() => {
            const panel = document.getElementById(`${panelType}Panel`);
            if (panel) {
                panel.classList.add('active');
                activePanels.push(panelType);
            }
        }, index * 100); // Задержка для последовательного открытия
    });
}

function closeAllCornerPanels() {
    document.querySelectorAll('.corner-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    activePanels = [];
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

// ИЗМЕНЕНИЕ 9: Закрытие панелей при клике вне
function initClosePanels() {
    document.addEventListener('click', (e) => {
        const isPanelElement = e.target.closest('.side-tab') || 
                              e.target.closest('.corner-panel') ||
                              e.target.closest('#centerImage') ||
                              e.target.closest('.module-card');
        
        if (activePanels.length > 0 && !isPanelElement) {
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