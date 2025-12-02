/*
  БЛОК 27: panels.js v1
  Отдельный файл для логики панелей
  Изменения 4, 9:
  1. Управление панелями модулей
  2. Закрытие при клике вне панели (уже в app.js)
  3. Анимации открытия/закрытия
*/

class PanelManager {
    constructor() {
        this.panels = {
            health: document.getElementById('healthPanel'),
            habits: document.getElementById('habitsPanel'),
            tasks: document.getElementById('tasksPanel'),
            finance: document.getElementById('financePanel')
        };
        this.activePanels = new Set();
    }
    
    // Открыть одну панель
    openPanel(panelName) {
        const panel = this.panels[panelName];
        if (panel && !this.activePanels.has(panelName)) {
            panel.classList.add('active');
            this.activePanels.add(panelName);
            this.animateLine(panelName, true);
        }
    }
    
    // Закрыть одну панель
    closePanel(panelName) {
        const panel = this.panels[panelName];
        if (panel && this.activePanels.has(panelName)) {
            panel.classList.remove('active');
            this.activePanels.delete(panelName);
            this.animateLine(panelName, false);
        }
    }
    
    // Открыть все панели
    openAllPanels() {
        Object.keys(this.panels).forEach(panelName => {
            this.openPanel(panelName);
        });
    }
    
    // Закрыть все панели
    closeAllPanels() {
        Object.keys(this.panels).forEach(panelName => {
            this.closePanel(panelName);
        });
    }
    
    // Переключить панель
    togglePanel(panelName) {
        if (this.activePanels.has(panelName)) {
            this.closePanel(panelName);
        } else {
            this.openPanel(panelName);
        }
    }
    
    // Анимация линии при открытии/закрытии
    animateLine(panelName, isOpening) {
        const lineId = `line${panelName.charAt(0).toUpperCase() + panelName.slice(1)}`;
        const line = document.getElementById(lineId);
        
        if (line) {
            if (isOpening) {
                line.style.strokeDashoffset = '0';
                line.style.opacity = '1';
            } else {
                line.style.strokeDashoffset = '10';
                line.style.opacity = '0.5';
            }
        }
    }
    
    // Проверить, является ли элемент частью панели
    isPanelElement(element) {
        return element.closest('.corner-panel') || 
               element.closest('.side-tab') ||
               element.closest('.module-card');
    }
}

// Инициализация PanelManager
let panelManager;

document.addEventListener('DOMContentLoaded', () => {
    panelManager = new PanelManager();
    
    // Переопределяем функции из app.js для использования PanelManager
    window.toggleCornerPanel = function(panelType) {
        panelManager.togglePanel(panelType);
    };
    
    window.openAllCornerPanels = function() {
        panelManager.openAllPanels();
    };
    
    window.closeAllCornerPanels = function() {
        panelManager.closeAllPanels();
    };
    
    // Обновляем activePanels для совместимости
    setInterval(() => {
        window.activePanels = Array.from(panelManager.activePanels);
    }, 100);
});