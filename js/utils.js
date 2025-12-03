/* 
  БЛОК 21: utils.js - Вспомогательные функции
  Содержит: утилиты, хелперы, вспомогательный код
*/

// === БЛОК 21.1: Логгер ===
const Logger = {
    log: function(message, data = null) {
        console.log(`[ICAR] ${message}`, data || '');
    },
    
    error: function(message, error) {
        console.error(`[ICAR ERROR] ${message}`, error);
    },
    
    warn: function(message) {
        console.warn(`[ICAR WARN] ${message}`);
    }
};

// === БЛОК 21.2: Валидация ===
const Validator = {
    isElement: function(elementId) {
        const element = document.getElementById(elementId);
        if (!element) {
            Logger.warn(`Элемент ${elementId} не найден`);
            return false;
        }
        return true;
    },
    
    isNumber: function(value) {
        return typeof value === 'number' && !isNaN(value);
    },
    
    isInRange: function(value, min, max) {
        return value >= min && value <= max;
    }
};

// === БЛОК 21.3: Утилиты DOM ===
const DOMUtils = {
    showElement: function(elementId) {
        if (Validator.isElement(elementId)) {
            document.getElementById(elementId).style.display = 'block';
        }
    },
    
    hideElement: function(elementId) {
        if (Validator.isElement(elementId)) {
            document.getElementById(elementId).style.display = 'none';
        }
    },
    
    addClass: function(elementId, className) {
        if (Validator.isElement(elementId)) {
            document.getElementById(elementId).classList.add(className);
        }
    },
    
    removeClass: function(elementId, className) {
        if (Validator.isElement(elementId)) {
            document.getElementById(elementId).classList.remove(className);
        }
    },
    
    toggleClass: function(elementId, className) {
        if (Validator.isElement(elementId)) {
            document.getElementById(elementId).classList.toggle(className);
        }
    }
};

// === БЛОК 21.4: Утилиты даты ===
const DateUtils = {
    getCurrentDate: function() {
        const now = new Date();
        return {
            day: now.getDate(),
            month: now.getMonth() + 1,
            year: now.getFullYear(),
            hours: now.getHours(),
            minutes: now.getMinutes()
        };
    },
    
    formatDate: function(date) {
        const day = String(date.day).padStart(2, '0');
        const month = String(date.month).padStart(2, '0');
        return `${day}.${month}.${date.year}`;
    },
    
    formatTime: function(date) {
        const hours = String(date.hours).padStart(2, '0');
        const minutes = String(date.minutes).padStart(2, '0');
        return `${hours}:${minutes}`;
    }
};

// === БЛОК 21.5: Утилиты чисел ===
const NumberUtils = {
    clamp: function(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },
    
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    formatPercent: function(value) {
        return `${Math.round(value)}%`;
    },
    
    calculateProgress: function(current, total) {
        return total > 0 ? (current / total) * 100 : 0;
    }
};

// === БЛОК 21.6: Экспорт утилит ===
window.Logger = Logger;
window.Validator = Validator;
window.DOMUtils = DOMUtils;
window.DateUtils = DateUtils;
window.NumberUtils = NumberUtils;