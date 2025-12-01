// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    console.log('ICAR приложение загружено');
    
    // Инициализация компонентов
    initHumanFigure();
    initModuleCards();
    initMenuButton();
    
    // Загрузка данных (заглушка)
    loadMockData();
});

// Обработчик фигурки человека
function initHumanFigure() {
    const humanContainer = document.getElementById('humanContainer');
    
    if (humanContainer) {
        humanContainer.addEventListener('click', () => {
            alert('Ежедневный обзор дня - скоро будет реализовано!');
            console.log('Фигурка нажата - открыть ежедневный обзор');
        });
        
        // Эффект нажатия
        humanContainer.addEventListener('touchstart', () => {
            humanContainer.style.transform = 'scale(0.95)';
        });
        
        humanContainer.addEventListener('touchend', () => {
            humanContainer.style.transform = 'scale(1)';
        });
    }
}

// Обработчики карточек модулей
function initModuleCards() {
    const moduleCards = document.querySelectorAll('.module-card');
    
    moduleCards.forEach(card => {
        card.addEventListener('click', () => {
            const module = card.getAttribute('data-module');
            openModule(module);
        });
    });
}

// Открытие модуля
function openModule(moduleName) {
    const moduleNames = {
        'health': 'Здоровье',
        'habits': 'Привычки',
        'tasks': 'Задачи',
        'finance': 'Финансы'
    };
    
    alert(`Модуль "${moduleNames[moduleName]}" - скоро будет доступен!`);
    console.log(`Открыть модуль: ${moduleName}`);
}

// Кнопка меню
function initMenuButton() {
    const menuBtn = document.getElementById('menuBtn');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            alert('Меню настроек - скоро будет доступно!');
            console.log('Меню нажато');
        });
    }
}

// Загрузка тестовых данных
function loadMockData() {
    const modules = ['health', 'habits', 'tasks', 'finance'];
    
    modules.forEach(module => {
        const statusElement = document.querySelector(`.module-card.${module} .module-status`);
        if (statusElement) {
            statusElement.textContent = 'Нет данных';
        }
    });
    
    console.log('Тестовые данные загружены');
}