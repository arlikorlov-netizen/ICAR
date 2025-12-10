/* === БЛОК 23: Логика модального окна сна === */

document.addEventListener('DOMContentLoaded', () => {
    initSleepModal();
});

function initSleepModal() {
    const recordBtn = document.getElementById('recordSleepBtn');
    const modalOverlay = document.getElementById('sleepModalOverlay');
    const modalClose = document.getElementById('sleepModalClose');
    const qualityButtons = document.querySelectorAll('.quality-btn');
    const sleepForm = document.getElementById('sleepForm');
    
    if (!recordBtn || !modalOverlay) return;
    
    // Открытие модального окна
    recordBtn.addEventListener('click', () => {
        modalOverlay.classList.add('active');
    });
    
    // Закрытие модального окна
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });
    }
    
    // Клик вне модального окна
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });
    
    // Кнопки оценки качества
    qualityButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            qualityButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Отправка формы
    if (sleepForm) {
        sleepForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const sleepStart = document.getElementById('sleepStart').value;
            const sleepEnd = document.getElementById('sleepEnd').value;
            const quality = document.querySelector('.quality-btn.active')?.textContent || '3';
            
            // Здесь будет сохранение в IndexedDB
            console.log('Сон записан:', { sleepStart, sleepEnd, quality });
            
            modalOverlay.classList.remove('active');
            sleepForm.reset();
            qualityButtons.forEach(b => b.classList.remove('active'));
            qualityButtons[2].classList.add('active'); // Сбрасываем на среднюю оценку
        });
    }
}