/* 
  БЛОК 20: panels.js - Логика управления панелями
  Содержит: открытие/закрытие панелей, ярлычки, крестики
*/

console.log('panels.js загружен');

function toggleAllPanels() {
    console.log('toggleAllPanels вызвана!');
    if (allPanelsOpen) {
        console.log('Закрываем все панели');
        closeAllPanels();
    } else {
        console.log('Открываем все панели');
        openAllPanels();
    }
}

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
    
    // Отправляем событие об открытии панели
    const event = new CustomEvent('panelOpened', { detail: { panel: panelType } });
    document.dispatchEvent(event);
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
            console.log('🔥 openAllPanels() ВЫЗВАНА!');
        console.log('Добавляем класс на body...');
        
        // ПРОСТОЙ ТЕСТ - сразу красим body в красный
        document.body.style.backgroundColor = 'red';
    document.body.classList.add('all-panels-open');
        console.log('=== ОТКРЫТИЕ ВСЕХ ПАНЕЛЕЙ ===');
        console.log('1. allPanelsOpen до:', allPanelsOpen);
        console.log('2. body классы до:', document.body.className);
        
        const panels = ['health', 'habits', 'tasks', 'finance'];
        
        const bg = document.getElementById('allPanelsBackground');
        if (bg) {
            bg.classList.add('active');
            console.log('3. Фон добавлен');
        }
    
    document.body.classList.add('all-panels-open');
    console.log('4. all-panels-open добавлен. Теперь body классы:', document.body.className);
    // Скрываем ВСЕ крестики на панелях
    document.querySelectorAll('.panel-close').forEach(closeBtn => {
        closeBtn.style.display = 'none';
        closeBtn.style.opacity = '0';
        closeBtn.style.visibility = 'hidden';
    });
    
        // НЕ ЗАКРЫВАЕМ панели, а просто сбрасываем активные
        document.querySelectorAll('.corner-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        activePanels = [];
    
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
        if (allPanelsClose) {
            allPanelsClose.classList.add('active');
            allPanelsClose.style.display = 'flex';
            allPanelsClose.style.opacity = '1';
            allPanelsClose.style.visibility = 'visible';
        }
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

function closeAllPanels() {
    document.querySelectorAll('.corner-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Восстанавливаем крестики на панелях
    document.querySelectorAll('.panel-close').forEach(closeBtn => {
        closeBtn.style.display = '';
        closeBtn.style.opacity = '';
        closeBtn.style.visibility = '';
    });
    
    const bg = document.getElementById('allPanelsBackground');
    if (bg) bg.classList.remove('active');
    
    const allPanelsClose = document.getElementById('allPanelsClose');
    if (allPanelsClose) {
        allPanelsClose.classList.remove('active');
        allPanelsClose.style.opacity = '';
        allPanelsClose.style.visibility = '';
    }
    
    document.body.classList.remove('all-panels-open');
    
    activePanels = [];
    allPanelsOpen = false;
}