/* 
  БЛОК 19: core.js - Ядро приложения
  Содержит: конфигурацию, инициализацию, общие функции
*/

// === БЛОК 19.1: Конфигурация приложения ===
const AppConfig = {
    userName: "ICAR",
    userLevel: 5,
    version: "1.0.98", // ← Добавляем версию
    commitHash: "a1b2c3d", // ← Добавляем хэш коммита
    progressValues: {
        physical: 56,
        mental: 81,
        financial: 41,
        activity: 72
    }
};

// === БЛОК 19.2: Глобальные переменные ===
let activePanels = [];
let allPanelsOpen = false;

// === БЛОК 19.3: Инициализация приложения ===
document.addEventListener('DOMContentLoaded', () => {
    console.log('ICAR запущен');
    
    initDate();
    initUserData();
    initProgressBars();
    initHumanImage();
    initBottomLine();
    initSettingsButton();
    initClosePanels();
    initBottomSheetClose();
    initCommitHash();
    // Линии будут обновлены через setTimeout в updateConnectionLines
});

// === БЛОК 19.4: Функции инициализации ===
function initDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        dateElement.textContent = `${day}.${month}.${year}`;
    }
}

function initUserData() {
    document.getElementById('userName').textContent = AppConfig.userName;
    document.getElementById('userLevel').textContent = `lvl ${AppConfig.userLevel}`;
}

function initProgressBars() {
    // Сначала устанавливаем начальные значения сразу
    setProgressValue('physical', AppConfig.progressValues.physical);
    setProgressValue('mental', AppConfig.progressValues.mental);
    setProgressValue('financial', AppConfig.progressValues.financial);
    setProgressValue('activity', AppConfig.progressValues.activity);
    
    // Потом анимируем (если нужно)
    setTimeout(() => {
        setProgressValue('physical', AppConfig.progressValues.physical);
        setProgressValue('mental', AppConfig.progressValues.mental);
        setProgressValue('financial', AppConfig.progressValues.financial);
        setProgressValue('activity', AppConfig.progressValues.activity);
    }, 100);
}

function setProgressValue(type, value) {
    const barElement = document.querySelector(`#progress${type.charAt(0).toUpperCase() + type.slice(1)} .progress-bar`);
    const valueElement = document.getElementById(`value${type.charAt(0).toUpperCase() + type.slice(1)}`);
    
    if (!barElement || !valueElement) return;
    
    const clampedValue = Math.max(0, Math.min(100, value));
    
    barElement.style.width = `${clampedValue}%`;
    barElement.setAttribute('data-value', clampedValue);
    valueElement.textContent = `${clampedValue}%`;
    
 barElement.style.background = 'var(--color-accent)';
}

function initHumanImage() {
    const humanImage = document.getElementById('humanImage');
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
}

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

// === НОВАЯ ФУНКЦИЯ: Отображение хэша коммита ===
function initCommitHash() {
    const commitElement = document.getElementById('commitHash');
    if (!commitElement) return;
    
    // Используем версию и хэш из конфига
    const versionText = `VER. ${AppConfig.version} #${AppConfig.commitHash}`;
    commitElement.textContent = versionText;
    
    commitElement.style.fontSize = '9px';
    commitElement.style.opacity = '0.6';
    commitElement.style.marginLeft = '3px';
}

// === БЛОК 19.5: Закрытие панелей по клику вне ===
function initClosePanels() {
    document.addEventListener('click', (e) => {
        const isPanelElement = e.target.closest('.side-tab') || 
                              e.target.closest('.corner-panel') ||
                              e.target.closest('#centerImage') ||
                              e.target.closest('.panel-close') ||
                              e.target.id === 'allPanelsClose';
        
        // Закрытие одиночных панелей
        if (activePanels.length > 0 && !allPanelsOpen && !isPanelElement) {
            closeAllPanels();
        }
        
        // Закрытие при клике на фон
        if (allPanelsOpen && e.target.id === 'allPanelsBackground') {
            closeAllPanels();
        }
        
        // Закрытие нижней панели
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

// === БЛОК 19.6: Общие функции управления ===
function closeAllPanels() {
    document.querySelectorAll('.corner-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    const bg = document.getElementById('allPanelsBackground');
    if (bg) bg.classList.remove('active');
    
    const allPanelsClose = document.getElementById('allPanelsClose');
    if (allPanelsClose) allPanelsClose.classList.remove('active');
    
    document.body.classList.remove('all-panels-open');
    
    activePanels = [];
    allPanelsOpen = false;
}

// === БЛОК 19.7: Автообновление прогресс-баров ===
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

// === БЛОК 19.8: Линии соединения ===
function updateConnectionLines() {
    const dots = {
        health: document.querySelector('.health-dot'),
        habits: document.querySelector('.habits-dot'),
        tasks: document.querySelector('.tasks-dot'),
        finance: document.querySelector('.finance-dot')
    };
    
    const tabs = {
        health: document.querySelector('.health-tab'),
        habits: document.querySelector('.habits-tab'),
        tasks: document.querySelector('.tasks-tab'),
        finance: document.querySelector('.finance-tab')
    };
    
    const svg = document.getElementById('connectionLines');
    if (!svg) return;
    
    const svgRect = svg.getBoundingClientRect();
    
    Object.keys(dots).forEach(type => {
        const dot = dots[type];
        const tab = tabs[type];
        if (!dot || !tab) return;
        
        const dotRect = dot.getBoundingClientRect();
        const tabRect = tab.getBoundingClientRect();
        
        // Координаты ТОЧКИ ВЫХОДА из круглешка (на его границе)
        let dotX, dotY;
        
        if (type === 'health' || type === 'tasks') {
            // Левые круглешки - линия выходит из ЛЕВОЙ стороны
            dotX = dotRect.left - svgRect.left;
            dotY = dotRect.top + dotRect.height/2 - svgRect.top;
        } else {
            // Правые круглешки - линия выходит из ПРАВОЙ стороны
            dotX = dotRect.right - svgRect.left;
            dotY = dotRect.top + dotRect.height/2 - svgRect.top;
        }
        
        // Координаты точки входа в ярлычок (на его границе)
        let tabX, tabY;
        
        if (type === 'health' || type === 'tasks') {
            // Левые ярлычки - линия входит в ПРАВУЮ сторону
            tabX = tabRect.right - svgRect.left;
            tabY = tabRect.top + tabRect.height/2 - svgRect.top;
        } else {
            // Правые ярлычки - линия входит в ЛЕВУЮ сторону
            tabX = tabRect.left - svgRect.left;
            tabY = tabRect.top + tabRect.height/2 - svgRect.top;
        }
        
        // Обновляем линию
        const line = document.getElementById(`line${type.charAt(0).toUpperCase() + type.slice(1)}`);
        if (line) {
            line.setAttribute('d', `M${dotX},${dotY} L${tabX},${tabY}`);
        }
    });
}

// Инициализация при загрузке
window.addEventListener('load', () => {
    // Ждём немного для отрисовки всех элементов
    setTimeout(updateConnectionLines, 100);
    setTimeout(updateConnectionLines, 500); // Двойная проверка
});

// Обновление при изменении размера
window.addEventListener('resize', updateConnectionLines);