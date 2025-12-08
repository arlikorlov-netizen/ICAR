/* 
  БЛОК 20: panels.js - Логика управления панелями
  Содержит: открытие/закрытие панелей, ярлычки, крестики
*/

// === БЛОК 20.1: Инициализация панелей ===
document.addEventListener('DOMContentLoaded', () => {
    initSideTabs();
    initPanelCloseButtons();
    initAllPanelsCloseButton();
    initCenterImageClick();
});

// === БЛОК 20.2: Ярлычки (4 штуки) ===
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
    
    closeAllPanels();
    
    panel.classList.add('active');
    activePanels = [panelType];
}

// === БЛОК 20.3: Фигурка (открытие всех панелей) ===
function initCenterImageClick() {
    const centerImage = document.getElementById('centerImage');
    if (centerImage) {
        centerImage.addEventListener('click', toggleAllPanels);
    }
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
    
    const bg = document.getElementById('allPanelsBackground');
    if (bg) bg.classList.add('active');
    
    document.body.classList.add('all-panels-open'); // ← ЭТА СТРОКА ДОЛЖНА БЫТЬ
    
    closeAllPanels();
    
    panels.forEach((panelType, index) => {
        setTimeout(() => {
            const panel = document.getElementById(`${panelType}Panel`);
            if (panel) {
                panel.classList.add('active');
                activePanels.push(panelType);
            }
        }, index * 60);
    });
    
    setTimeout(() => {
        const allPanelsClose = document.getElementById('allPanelsClose');
        if (allPanelsClose) allPanelsClose.classList.add('active');
        allPanelsOpen = true;
    }, 300);
}

// === БЛОК 20.4: Крестики на панелях ===
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
                
                if (activePanels.length === 0 && allPanelsOpen) {
                    allPanelsOpen = false;
                    const bg = document.getElementById('allPanelsBackground');
                    if (bg) bg.classList.remove('active');
                    const allPanelsClose = document.getElementById('allPanelsClose');
                    if (allPanelsClose) allPanelsClose.classList.remove('active');
                    document.body.classList.remove('all-panels-open');
                }
            }
        });
    });
}

// === БЛОК 20.5: Общий крестик ===
function initAllPanelsCloseButton() {
    const allPanelsClose = document.getElementById('allPanelsClose');
    if (allPanelsClose) {
        allPanelsClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllPanels();
        });
    }
}