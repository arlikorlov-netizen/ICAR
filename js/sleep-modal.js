/* === БЛОК 23: Модальное окно записи сна (упрощённое) === */

document.addEventListener('DOMContentLoaded', function() {
    setupSleepModal();
});

function setupSleepModal() {
    const modalOverlay = document.getElementById('sleepModalOverlay');
    const modalClose = document.getElementById('sleepModalClose');
    const qualityButtons = document.querySelectorAll('.quality-btn');
    const sleepForm = document.getElementById('sleepForm');
    
    if (!modalOverlay) return;
    
    // Делегирование: ловим клик на кнопки записи сна
    document.addEventListener('click', function(e) {
        if (e.target && (e.target.id === 'recordSleepBtn' || e.target.classList.contains('sleep-record-btn'))) {
            e.stopPropagation();
            modalOverlay.classList.add('active');
        }
    });
    
    // Закрытие крестиком
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modalOverlay.classList.remove('active');
        });
    }
    
    // Закрытие по клику вне
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });
    
    // Кнопки качества
    qualityButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            qualityButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Отправка формы
    if (sleepForm) {
        sleepForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const sleepStart = document.getElementById('sleepStart').value;
            const sleepEnd = document.getElementById('sleepEnd').value;
            const quality = document.querySelector('.quality-btn.active')?.textContent || '3';
            
            alert(`Сон записан: ${sleepStart} - ${sleepEnd}, качество: ${quality}/5`);
            
            // Закрываем и сбрасываем
            modalOverlay.classList.remove('active');
            sleepForm.reset();
            qualityButtons.forEach(b => b.classList.remove('active'));
            if (qualityButtons[2]) qualityButtons[2].classList.add('active');
        });
    }
}