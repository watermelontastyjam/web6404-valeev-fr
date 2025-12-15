/**
 * Лабораторная работа №4 - Secret Space VR
 * JavaScript класс для обработки данных бронирования
 */

// Класс для хранения данных бронирования
class VRBooking {
    constructor(name, email, phone, date, time, players, vrType, duration, terms, comments = '') {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.date = date;
        this.time = time;
        this.players = parseInt(players);
        this.vrType = vrType || 'Не указано';
        this.duration = parseInt(duration);
        this.terms = terms;
        this.comments = comments;
        this.bookingId = this.generateId();
        this.createdAt = new Date().toISOString();
    }

    // Генерация уникального ID
    generateId() {
        return 'VR-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    // Метод форматированного вывода в консоль
    logToConsole() {
        console.log('='.repeat(50));
        console.log('🎮 VR БРОНИРОВАНИЕ - ДАННЫЕ ФОРМЫ 🎮');
        console.log('='.repeat(50));
        console.log(`📋 ID бронирования: ${this.bookingId}`);
        console.log(`👤 Имя клиента: ${this.name}`);
        console.log(`📧 Email: ${this.email}`);
        console.log(`📱 Телефон: ${this.phone}`);
        console.log(`📅 Дата: ${this.date}`);
        console.log(`⏰ Время: ${this.time}`);
        console.log(`👥 Количество игроков: ${this.players}`);
        console.log(`🎯 Тип VR-опыта: ${this.vrType}`);
        console.log(`⏱️ Продолжительность: ${this.duration} час(а/ов)`);
        console.log(`✅ Согласие на обработку: ${this.terms ? 'ДА' : 'НЕТ'}`);
        if (this.comments) {
            console.log(`💭 Комментарии: ${this.comments}`);
        }
        console.log(`📅 Заявка создана: ${new Date(this.createdAt).toLocaleString('ru-RU')}`);
        console.log('='.repeat(50));
        
        // Дополнительная красивая стилизация
        console.log('%c✨ Бронирование успешно обработано! ✨', 
            'color: #ff69b4; font-size: 16px; font-weight: bold;');
        console.log('%cМы скоро свяжемся с вами для подтверждения!', 
            'color: #9c27b0; font-size: 14px;');
    }

    // Метод для получения данных в виде объекта
    getData() {
        return {
            bookingId: this.bookingId,
            name: this.name,
            email: this.email,
            phone: this.phone,
            date: this.date,
            time: this.time,
            players: this.players,
            vrType: this.vrType,
            duration: this.duration,
            comments: this.comments,
            createdAt: this.createdAt
        };
    }

    // Метод для валидации данных
    validate() {
        const errors = [];

        if (!this.name || this.name.length < 2) {
            errors.push('Имя должно содержать минимум 2 символа');
        }

        if (!this.email || !this.isValidEmail(this.email)) {
            errors.push('Введите корректный email адрес');
        }

        if (!this.phone || !this.isValidPhone(this.phone)) {
            errors.push('Введите корректный номер телефона');
        }

        if (!this.date || new Date(this.date) < new Date()) {
            errors.push('Выберите корректную дату');
        }

        if (!this.time) {
            errors.push('Выберите время посещения');
        }

        if (!this.players || this.players < 1 || this.players > 10) {
            errors.push('Количество игроков должно быть от 1 до 10');
        }

        if (!this.duration || this.duration < 1 || this.duration > 5) {
            errors.push('Продолжительность должна быть от 1 до 5 часов');
        }

        if (!this.terms) {
            errors.push('Необходимо согласие на обработку данных');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Вспомогательные методы валидации
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^\+7\s?[0-9]{3}\s?[0-9]{3}\s?[0-9]{2}\s?[0-9]{2}$/;
        return phoneRegex.test(phone);
    }
}

// Функция для форматирования телефона
function formatPhoneNumber(phone) {
    return phone.replace(/\D/g, '').replace(/^7/, '+7');
}

// DOM готов
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация только если есть форма бронирования
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        initBookingForm();
    }

    // Инициализация слайдера продолжительности
    const durationSlider = document.getElementById('duration');
    const durationValue = document.getElementById('durationValue');
    
    if (durationSlider && durationValue) {
        durationSlider.addEventListener('input', function() {
            const hours = this.value;
            durationValue.textContent = hours + ' ' + getHoursText(hours);
        });
    }

    // Анимация при загрузке страницы
    animatePageLoad();
});

// Инициализация формы бронирования
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    const submitBtn = document.getElementById('submitBtn');
    const durationSlider = document.getElementById('duration');

    // Валидация в реальном времени
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });

    // Согласие на обработку данных
    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox) {
        termsCheckbox.addEventListener('change', function() {
            const errorElement = this.closest('.form__group').querySelector('.form__error');
            if (this.checked) {
                clearError(errorElement);
            } else if (this.required) {
                showError(errorElement, 'Это поле обязательно');
            }
        });
    }

    // Обработка отправки формы
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        if (validateForm()) {
            // Показываем состояние загрузки
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '⏳ Обработка...';
            submitBtn.disabled = true;

            try {
                // Собираем данные формы
                const formData = {
                    name: document.getElementById('name').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    phone: formatPhoneNumber(document.getElementById('phone').value.trim()),
                    date: document.getElementById('date').value,
                    time: document.getElementById('time').value,
                    players: document.getElementById('players').value,
                    vrType: document.getElementById('vrType').value,
                    duration: durationSlider.value,
                    terms: document.getElementById('terms').checked,
                    comments: document.getElementById('comments').value.trim()
                };

                // Создаем объект класса VRBooking
                const booking = new VRBooking(
                    formData.name,
                    formData.email,
                    formData.phone,
                    formData.date,
                    formData.time,
                    formData.players,
                    formData.vrType,
                    formData.duration,
                    formData.terms,
                    formData.comments
                );

                // Валидация
                const validation = booking.validate();
                if (!validation.isValid) {
                    throw new Error(validation.errors.join('\n'));
                }

                // Выводим в консоль
                booking.logToConsole();

                // Показываем успешное сообщение
                showSuccessMessage(form, booking);

                // Очищаем форму через 3 секунды
                setTimeout(() => {
                    form.reset();
                    if (durationSlider && durationValue) {
                        durationValue.textContent = '2 часа';
                    }
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 3000);

            } catch (error) {
                // Показываем ошибку
                showFormError(submitBtn, error.message);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }
    });
}

// Валидация отдельного поля
function validateField(event) {
    const field = event.target;
    const formGroup = field.closest('.form__group');
    const errorElement = formGroup.querySelector('.form__error');
    
    if (!field.checkValidity()) {
        let errorMessage = getFieldErrorMessage(field);
        showError(errorElement, errorMessage);
        return false;
    }
    
    clearError(errorElement);
    return true;
}

// Очистка ошибки поля
function clearFieldError(event) {
    const field = event.target;
    const formGroup = field.closest('.form__group');
    const errorElement = formGroup.querySelector('.form__error');
    clearError(errorElement);
}

// Получение сообщения об ошибке для поля
function getFieldErrorMessage(field) {
    if (field.validity.valueMissing) {
        return 'Это поле обязательно для заполнения';
    }
    
    if (field.validity.typeMismatch) {
        if (field.type === 'email') {
            return 'Введите корректный email адрес';
        }
        return 'Неверный формат данных';
    }
    
    if (field.validity.patternMismatch) {
        if (field.type === 'tel') {
            return 'Формат: +7 XXX XXX XX XX';
        }
        return 'Неверный формат';
    }
    
    if (field.validity.tooShort || field.validity.tooLong) {
        return `Длина должна быть от ${field.minLength} до ${field.maxLength} символов`;
    }
    
    if (field.validity.rangeUnderflow || field.validity.rangeOverflow) {
        return `Значение должно быть от ${field.min} до ${field.max}`;
    }
    
    return 'Неверное значение';
}

// Валидация всей формы
function validateForm() {
    const form = document.getElementById('bookingForm');
    const fields = form.querySelectorAll('input[required], select[required]');
    let isValid = true;

    fields.forEach(field => {
        const formGroup = field.closest('.form__group');
        const errorElement = formGroup.querySelector('.form__error');
        
        if (!field.checkValidity()) {
            let errorMessage = getFieldErrorMessage(field);
            showError(errorElement, errorMessage);
            isValid = false;
        } else {
            clearError(errorElement);
        }
    });

    // Особая проверка для чекбокса
    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox && termsCheckbox.required && !termsCheckbox.checked) {
        const formGroup = termsCheckbox.closest('.form__group');
        const errorElement = formGroup.querySelector('.form__error');
        showError(errorElement, 'Необходимо согласие на обработку данных');
        isValid = false;
    }

    return isValid;
}

// Показать ошибку
function showError(errorElement, message) {
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.opacity = '1';
        errorElement.parentElement.classList.add('has-error');
    }
}

// Очистить ошибку
function clearError(errorElement) {
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.opacity = '0';
        errorElement.parentElement.classList.remove('has-error');
    }
}

// Показать сообщение об успехе
function showSuccessMessage(form, booking) {
    const successHTML = `
        <div class="success-message" style="
            background: linear-gradient(135deg, #4caf50, #2e7d32);
            color: white;
            padding: 2rem;
            border-radius: 1rem;
            text-align: center;
            margin: 2rem 0;
            animation: fadeIn 0.5s ease-out;
        ">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
            <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">Бронирование успешно создано!</h3>
            <p style="margin-bottom: 0.5rem;">ID: <strong>${booking.bookingId}</strong></p>
            <p style="margin-bottom: 0.5rem;">${booking.name}, мы свяжемся с вами в течение 2 часов</p>
            <p style="font-size: 0.9rem; opacity: 0.9;">Проверьте консоль браузера (F12) для просмотра деталей</p>
        </div>
    `;
    
    form.innerHTML = successHTML;
}

// Показать ошибку формы
function showFormError(button, message) {
    const form = button.closest('form');
    const errorHTML = `
        <div class="error-message" style="
            background: linear-gradient(135deg, #f44336, #c62828);
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            text-align: center;
            margin: 1rem 0;
            animation: shake 0.5s ease-in-out;
        ">
            <p style="margin: 0; font-weight: bold;">⚠️ Ошибка: ${message}</p>
        </div>
    `;
    
    form.insertAdjacentHTML('afterbegin', errorHTML);
    
    // Удаляем сообщение через 5 секунд
    setTimeout(() => {
        const errorMsg = form.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }, 5000);
}

// Получение правильного окончания для часов
function getHoursText(hours) {
    hours = parseInt(hours);
    if (hours === 1) return 'час';
    if (hours >= 2 && hours <= 4) return 'часа';
    return 'часов';
}

// Анимация при загрузке страницы
function animatePageLoad() {
    // Добавляем класс для анимации загрузки
    document.body.classList.add('page-loaded');
    
    // Анимация для карточек игр
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Анимация для графиков сравнения
    const chartBars = document.querySelectorAll('.chart-bar__value');
    chartBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.width = bar.style.width;
        }, 500 + index * 200);
    });
}

// Добавляем стили для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .has-error .form__input,
    .has-error .form__select {
        border-color: #f44336 !important;
        background-color: #ffebee !important;
    }
    
    .page-loaded .game-card {
        animation: fadeIn 0.5s ease-out;
    }
`;
document.head.appendChild(style);

// Экспорт класса для использования в консоли (для тестирования)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VRBooking };
} else {
    window.VRBooking = VRBooking;
}