/* === БЛОК 23: Модальное окно записи сна === */

let sleepModalInitialized = false;

function initSleepModal() {
    if (sleepModalInitialized) return;
    
    const modalOverlay = document.getElementById('sleepModalOverlay');
    const modalClose = document.getElementById('sleepModalClose');
    const qualityButtons = document.querySelectorAll('.quality-btn');
    const sleepForm = document.getElementById('sleepForm');
    
    if (!modalOverlay) {
        console.log('Модальное окно не найдено');
        return;
    }
    
    console.log('Инициализируем модальное окно сна');
    
    // 1. Делегирование на весь документ
    document.addEventListener('click', function(e) {
        // Проверяем ВСЕ возможные кнопки записи сна
        const isSleepBtn = e.target.id === 'recordSleepBtn' || 
                          e.target.classList.contains('sleep-record-btn') ||
                          (e.target.tagName === 'BUTTON' && e.target.textContent.includes('сон'));
        
        if (isSleepBtn) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Кнопка сна нажата, открываем модальное окно');
            modalOverlay.classList.add('active');
        }
    });
    
    // 2. Закрытие крестиком
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modalOverlay.classList.remove('active');
        });
    }
    
    // 3. Закрытие по клику вне
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });
    
    // 4. Кнопки качества
    if (qualityButtons.length > 0) {
        qualityButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                qualityButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // 5. Отправка формы
    if (sleepForm) {
        sleepForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const sleepStart = document.getElementById('sleepStart').value;
            const sleepEnd = document.getElementById('sleepEnd').value;
            const qualityBtn = document.querySelector('.quality-btn.active');
            const quality = qualityBtn ? qualityBtn.textContent : '3';
            
            console.log('Сон записан:', { sleepStart, sleepEnd, quality });
            alert(`Сон записан: ${sleepStart} - ${sleepEnd}\nКачество: ${quality}/5`);
            
            modalOverlay.classList.remove('active');
            sleepForm.reset();
            
            // Сбрасываем качество на 3
            if (qualityButtons.length > 2) {
                qualityButtons.forEach(b => b.classList.remove('active'));
                qualityButtons[2].classList.add('active');
            }
        });
    }
    
    sleepModalInitialized = true;
}

// Инициализируем при загрузке
document.addEventListener('DOMContentLoaded', initSleepModal);

// Инициализируем при открытии панели здоровья
document.addEventListener('panelOpened', function(e) {
    if (e.detail.panel === 'health') {
        console.log('Панель здоровья открыта, проверяем модальное окно');
        initSleepModal();
    }
});