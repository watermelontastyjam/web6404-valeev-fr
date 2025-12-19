// Глобальные переменные
let allGames = [];
let displayedGames = [];

// Загрузка игр с сервера
async function loadGames() {
    try {
        const response = await fetch('http://localhost:3000/api/games');
        allGames = await response.json();
        
        // Получаем случайные 4 игры
        displayedGames = getRandomGames(allGames, 4);
        renderGames();
        
        // Обновляем таблицу сравнения
        renderComparisonTable(allGames);
        
        console.log('✅ Игры загружены:', allGames);
    } catch (error) {
        console.error('❌ Ошибка загрузки игр:', error);
        // Если сервер не работает, используем тестовые данные
        useTestData();
    }
}

// Получить случайные игры
function getRandomGames(games, count) {
    const shuffled = [...games].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Отрисовка карточек игр
function renderGames() {
    const container = document.getElementById('games-container');
    if (!container) return;
    
    container.innerHTML = displayedGames.map(game => {
        // ИСПРАВЛЕНО: Используем локальные картинки из папки images
        const imagePath = game.image && game.image.startsWith('/') 
            ? game.image.slice(1) // Убираем первый слеш
            : `images/games/${game.id || 'default'}.jpg`;
        
        return `
            <div class="game-card">
                <div class="game-card__image-container">
                    <img src="${imagePath}" 
                         alt="${game.title}" 
                         class="game-card__image"
                         onerror="this.onerror=null; this.src='images/games/default.jpg'; this.alt='Изображение временно недоступно';">
                    <div class="game-card__genre-badge">${game.genre}</div>
                    ${game.multiplayer ? '<div class="game-card__multiplayer-badge">👥</div>' : ''}
                </div>
                <div class="game-card__content">
                    <h3 class="game-card__title">${game.title}</h3>
                    <p class="game-card__description">${game.description}</p>
                    <div class="game-card__meta">
                        <div class="stars">${generateStars(game.rating)}</div>
                        <span class="rating-value">${game.rating}/10</span>
                        <span class="game-card__duration">⏱️ ${game.duration}</span>
                    </div>
                    <button class="btn btn--primary btn--small" onclick="bookGame('${game.title}')">
                        Забронировать
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Генерация звездочек для рейтинга
function generateStars(rating) {
    const fullStars = Math.floor(rating / 2);
    const halfStar = rating % 2 >= 1;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
}

// Отрисовка таблицы сравнения
function renderComparisonTable(games) {
    const table = document.querySelector('.comparison-table');
    if (!table) return;
    
    // Удаляем старые строки
    const oldRows = table.querySelectorAll('.table-row');
    oldRows.forEach(row => row.remove());
    
    // Добавляем новые строки
    games.forEach(game => {
        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
            <div class="table-cell">${game.title}</div>
            <div class="table-cell">${game.genre}</div>
            <div class="table-cell">${game.multiplayer ? 'Да' : 'Нет'}</div>
            <div class="table-cell">${game.duration}</div>
            <div class="table-cell">${getRecommendation(game.rating)}</div>
        `;
        table.appendChild(row);
    });
}

// Получить рекомендацию по рейтингу
function getRecommendation(rating) {
    if (rating >= 9) return '<span style="color: #4CAF50;">★ Обязательно</span>';
    if (rating >= 8) return '<span style="color: #FF9800;">▲ Рекомендуем</span>';
    return '<span style="color: #9E9E9E;">○ Попробуйте</span>';
}

// Тестовые данные если сервер не работает
function useTestData() {
    allGames = [
        {
            id: 1,
            title: "Half-Life: Alyx",
            genre: "Шутер",
            rating: 9.5,
            multiplayer: false,
            duration: "11-13 часов",
            description: "Эпический шутер от Valve, переопределяющий стандарты VR-гейминга.",
            image: "images/games/half-life-alyx.jpg"
        },
        {
            id: 2,
            title: "Beat Saber",
            genre: "Ритм-игра",
            rating: 9.0,
            multiplayer: false,
            duration: "Бесконечно",
            description: "Ритм-игра с световыми мечами под музыку.",
            image: "images/games/beat-saber.jpg"
        },
        {
            id: 3,
            title: "I Am Cat",
            genre: "Симулятор",
            rating: 8.5,
            multiplayer: false,
            duration: "3-5 часов",
            description: "Симулятор кота в виртуальной реальности.",
            image: "images/games/i-am-cat.jpg"
        },
        {
            id: 4,
            title: "Crisis Brigade 2",
            genre: "Шутер",
            rating: 8.5,
            multiplayer: true,
            duration: "4-6 часов",
            description: "Шутер от первого лица в стиле SWAT.",
            image: "images/games/crisi-brigade-2.jpg"
        },
        {
            id: 5,
            title: "Arizona Sunshine",
            genre: "Зомби-шутер",
            rating: 8.5,
            multiplayer: true,
            duration: "6-8 часов",
            description: "Зомби-шутер в пустынях Аризоны.",
            image: "images/games/arizona-sunshine.jpg"
        }
    ];
    
    displayedGames = getRandomGames(allGames, 4);
    renderGames();
    renderComparisonTable(allGames);
}

// Бронирование игры
function bookGame(title) {
    alert(`🎮 Игра "${title}" добавлена в список бронирования!\nПерейдите на страницу "О нас" для заполнения формы.`);
    // Перенаправляем на страницу бронирования
    if (!window.location.pathname.includes('about.html')) {
        window.location.href = 'about.html';
    }
}

// Обновить игры (по кнопке)
function refreshGames() {
    if (allGames.length === 0) {
        loadGames();
        return;
    }
    
    displayedGames = getRandomGames(allGames, 4);
    renderGames();
    
    // Анимация обновления
    const btn = document.getElementById('refreshGamesBtn');
    if (btn) {
        const oldText = btn.innerHTML;
        btn.innerHTML = '🎮 Новые игры загружены!';
        btn.classList.add('btn--success');
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerHTML = oldText;
            btn.classList.remove('btn--success');
            btn.disabled = false;
        }, 2000);
    }
}

// ====== ФОРМА БРОНИРОВАНИЯ ======

// Инициализация формы
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    
    // Инициализация слайдера продолжительности
    const durationSlider = document.getElementById('duration');
    const durationValue = document.getElementById('durationValue');
    
    if (durationSlider && durationValue) {
        durationSlider.addEventListener('input', function() {
            const hours = this.value;
            durationValue.textContent = hours + ' ' + getHoursText(hours);
        });
    }
    
    // Устанавливаем минимальную дату как сегодня
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }
    
    // Обработка отправки формы
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Валидация
        if (!validateForm()) {
            showError('❌ Пожалуйста, заполните все обязательные поля правильно!');
            return;
        }
        
        // Собираем данные формы
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: formatPhone(document.getElementById('phone').value.trim()),
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            players: parseInt(document.getElementById('players').value),
            vrType: document.getElementById('vrType').value,
            duration: durationSlider ? parseInt(durationSlider.value) : 2,
            comments: document.getElementById('comments').value.trim(),
            terms: document.getElementById('terms').checked,
            createdAt: new Date().toISOString()
        };
        
        // Показываем загрузку
        const submitBtn = document.getElementById('submitBtn');
        const oldText = submitBtn.innerHTML;
        submitBtn.innerHTML = '⏳ Отправка...';
        submitBtn.disabled = true;
        
        try {
            // Отправка на сервер
            const response = await fetch('http://localhost:3000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Бронирование создано:', result);
                
                // Показываем успешное сообщение
                showSuccessMessage(form, result.id);
                
                // Обновляем статистику
                updateStats();
                
            } else {
                throw new Error('Ошибка сервера');
            }
        } catch (error) {
            console.error('❌ Ошибка отправки:', error);
            showError('⚠️ Не удалось отправить заявку. Проверьте подключение к серверу.');
            submitBtn.innerHTML = oldText;
            submitBtn.disabled = false;
        }
    });
    
    // Валидация в реальном времени
    initRealTimeValidation();
}

// Форматирование телефона
function formatPhone(phone) {
    return phone.replace(/\D/g, '').replace(/^7/, '+7');
}

// Валидация формы
function validateForm() {
    let isValid = true;
    
    // Проверка имени
    const name = document.getElementById('name');
    if (!name.value.trim() || name.value.trim().length < 2) {
        markInvalid(name, 'Имя должно содержать минимум 2 символа');
        isValid = false;
    } else {
        markValid(name);
    }
    
    // Проверка email
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value)) {
        markInvalid(email, 'Введите корректный email');
        isValid = false;
    } else {
        markValid(email);
    }
    
    // Проверка телефона
    const phone = document.getElementById('phone');
    const phoneRegex = /^[\+]?[7-8]?[0-9\s\-\(\)]{10,15}$/;
    if (!phone.value.trim() || !phoneRegex.test(phone.value)) {
        markInvalid(phone, 'Введите корректный номер телефона');
        isValid = false;
    } else {
        markValid(phone);
    }
    
    // Проверка даты
    const date = document.getElementById('date');
    const selectedDate = new Date(date.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!date.value || selectedDate < today) {
        markInvalid(date, 'Выберите корректную дату (не раньше сегодняшней)');
        isValid = false;
    } else {
        markValid(date);
    }
    
    // Проверка времени
    const time = document.getElementById('time');
    if (!time.value) {
        markInvalid(time, 'Выберите время');
        isValid = false;
    } else {
        markValid(time);
    }
    
    // Проверка количества игроков
    const players = document.getElementById('players');
    const playersNum = parseInt(players.value);
    if (!players.value || playersNum < 1 || playersNum > 10) {
        markInvalid(players, 'Введите число от 1 до 10');
        isValid = false;
    } else {
        markValid(players);
    }
    
    // Проверка чекбокса
    const terms = document.getElementById('terms');
    if (!terms.checked) {
        markInvalid(terms, 'Необходимо согласие');
        isValid = false;
    } else {
        markValid(terms);
    }
    
    return isValid;
}

// Инициализация валидации в реальном времени
function initRealTimeValidation() {
    const inputs = document.querySelectorAll('.form__input, .form__select, .form__checkbox');
    
    inputs.forEach(input => {
        // Для текстовых полей и селектов
        if (input.type !== 'checkbox') {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('invalid')) {
                    validateField(this);
                }
            });
        }
        
        // Для чекбокса
        if (input.type === 'checkbox') {
            input.addEventListener('change', function() {
                validateField(this);
            });
        }
    });
}

// Валидация отдельного поля
function validateField(field) {
    const value = field.value ? field.value.trim() : '';
    let isValid = true;
    let errorMessage = '';
    
    switch(field.id) {
        case 'name':
            if (!value || value.length < 2) {
                isValid = false;
                errorMessage = 'Имя должно содержать минимум 2 символа';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value || !emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Введите корректный email';
            }
            break;
            
        case 'phone':
            const phoneRegex = /^[\+]?[7-8]?[0-9\s\-\(\)]{10,15}$/;
            if (!value || !phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Введите корректный номер телефона';
            }
            break;
            
        case 'date':
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (!value || selectedDate < today) {
                isValid = false;
                errorMessage = 'Выберите корректную дату';
            }
            break;
            
        case 'time':
            if (!value) {
                isValid = false;
                errorMessage = 'Выберите время';
            }
            break;
            
        case 'players':
            const playersNum = parseInt(value);
            if (!value || playersNum < 1 || playersNum > 10) {
                isValid = false;
                errorMessage = 'Введите число от 1 до 10';
            }
            break;
            
        case 'terms':
            if (!field.checked) {
                isValid = false;
                errorMessage = 'Необходимо согласие';
            }
            break;
    }
    
    if (isValid) {
        markValid(field);
    } else {
        markInvalid(field, errorMessage);
    }
}

// Пометить поле как невалидное
function markInvalid(field, message) {
    field.classList.add('invalid');
    field.classList.remove('valid');
    
    // Показать сообщение об ошибке
    const errorDiv = field.parentElement.querySelector('.form__error') || 
                    field.closest('.form__group').querySelector('.form__error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        errorDiv.style.color = 'var(--color-error)';
    }
}

// Пометить поле как валидное
function markValid(field) {
    field.classList.remove('invalid');
    field.classList.add('valid');
    
    const errorDiv = field.parentElement.querySelector('.form__error') || 
                    field.closest('.form__group').querySelector('.form__error');
    if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }
}

// Показать сообщение об успехе
function showSuccessMessage(form, bookingId) {
    const successHTML = `
        <div class="success-message" style="text-align: center; padding: 3rem; background: linear-gradient(135deg, var(--color-success), #4CAF50); border-radius: var(--radius-lg); color: white;">
            <div style="font-size: 5rem; margin-bottom: 1rem;">🎉</div>
            <h3 style="font-size: var(--font-size-xl); margin-bottom: 1rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">Бронирование успешно создано!</h3>
            <p style="font-size: var(--font-size-lg); margin-bottom: 0.5rem;">Номер заявки: <strong style="font-size: var(--font-size-xxl);">#${bookingId}</strong></p>
            <p style="margin-bottom: 2rem;">Мы свяжемся с вами в течение 2 часов для подтверждения.</p>
            <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: var(--radius-md); margin: 2rem 0;">
                <p style="margin: 0;">📧 Подтверждение отправлено на вашу почту</p>
                <p style="margin: 0;">📱 SMS будет отправлено на указанный телефон</p>
            </div>
            <button onclick="location.reload()" class="btn" style="background: white; color: var(--color-success); font-weight: bold; padding: 1rem 2rem; margin-top: 1rem;">
                Создать новое бронирование
            </button>
        </div>
    `;
    
    form.innerHTML = successHTML;
}

// Показать ошибку
function showError(message) {
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-error);
        color: white;
        padding: 1rem 2rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    alertDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 1.5rem;">⚠️</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
}

// Получить текст для часов
function getHoursText(hours) {
    hours = parseInt(hours);
    if (hours === 1) return 'час';
    if (hours >= 2 && hours <= 4) return 'часа';
    return 'часов';
}

// Обновление статистики
async function updateStats() {
    const statsContainer = document.getElementById('stats-container');
    if (!statsContainer) return;
    
    try {
        // Пытаемся загрузить бронирования
        const bookingsResponse = await fetch('http://localhost:3000/api/bookings', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        let bookings = [];
        if (bookingsResponse.ok) {
            bookings = await bookingsResponse.json();
        }
        
        // Пытаемся загрузить игры
        const gamesResponse = await fetch('http://localhost:3000/api/games', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        let games = [];
        if (gamesResponse.ok) {
            games = await gamesResponse.json();
        }
        
        // Если API не отвечают, используем тестовые данные
        if (!bookings.length && !games.length) {
            // Тестовые данные
            bookings = [
                {
                    "id": 1,
                    "name": "Анна Иванова",
                    "date": new Date().toISOString().split('T')[0],
                    "players": 2
                },
                {
                    "id": 2,
                    "name": "Петр Сидоров",
                    "date": new Date().toISOString().split('T')[0],
                    "players": 4
                }
            ];
            
            games = [
                { "id": 1, "title": "Half-Life: Alyx" },
                { "id": 2, "title": "Beat Saber" },
                { "id": 3, "title": "I Am Cat" },
                { "id": 4, "title": "Crisis Brigade 2" },
                { "id": 5, "title": "Arizona Sunshine" }
            ];
        }
        
        const today = new Date().toISOString().split('T')[0];
        const todayBookings = bookings.filter(b => b.date === today).length;
        const totalBookings = bookings.length;
        
        // Рассчитываем среднее количество игроков
        const avgPlayers = bookings.length > 0 
            ? Math.round(bookings.reduce((sum, b) => sum + (parseInt(b.players) || 2), 0) / bookings.length)
            : 2;
        
        statsContainer.innerHTML = `
            <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin: 2rem 0;">
                <div class="stat-card" style="background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary)); padding: 1.5rem; border-radius: var(--radius-lg); text-align: center; color: white; box-shadow: var(--shadow-md);">
                    <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📅</div>
                    <div style="font-size: var(--font-size-xxl); font-weight: bold; margin: 0.5rem 0;">${todayBookings}</div>
                    <div style="font-size: var(--font-size-sm); opacity: 0.9;">бронирований сегодня</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, var(--color-secondary-light), var(--color-secondary)); padding: 1.5rem; border-radius: var(--radius-lg); text-align: center; color: white; box-shadow: var(--shadow-md);">
                    <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🎮</div>
                    <div style="font-size: var(--font-size-xxl); font-weight: bold; margin: 0.5rem 0;">${games.length}</div>
                    <div style="font-size: var(--font-size-sm); opacity: 0.9;">доступных игр</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, var(--color-accent), #ff4081); padding: 1.5rem; border-radius: var(--radius-lg); text-align: center; color: white; box-shadow: var(--shadow-md);">
                    <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">👥</div>
                    <div style="font-size: var(--font-size-xxl); font-weight: bold; margin: 0.5rem 0;">${totalBookings}</div>
                    <div style="font-size: var(--font-size-sm); opacity: 0.9;">всего бронирований</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, var(--color-info), #2196f3); padding: 1.5rem; border-radius: var(--radius-lg); text-align: center; color: white; box-shadow: var(--shadow-md);">
                    <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">⭐</div>
                    <div style="font-size: var(--font-size-xxl); font-weight: bold; margin: 0.5rem 0;">${avgPlayers}</div>
                    <div style="font-size: var(--font-size-sm); opacity: 0.9;">среднее кол-во игроков</div>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
        // Показываем тестовую статистику при ошибке
        statsContainer.innerHTML = `
            <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin: 2rem 0;">
                <div class="stat-card" style="background: var(--color-bg-light); padding: 1.5rem; border-radius: var(--radius-lg); text-align: center; border: 2px solid var(--color-primary-light);">
                    <div style="font-size: 2rem; color: var(--color-primary);">📅</div>
                    <div style="font-size: var(--font-size-xl); font-weight: bold; color: var(--color-primary); margin: 0.5rem 0;">2</div>
                    <div style="color: var(--color-text-light); font-size: var(--font-size-sm);">бронирований сегодня</div>
                </div>
                <div class="stat-card" style="background: var(--color-bg-light); padding: 1.5rem; border-radius: var(--radius-lg); text-align: center; border: 2px solid var(--color-secondary-light);">
                    <div style="font-size: 2rem; color: var(--color-secondary);">🎮</div>
                    <div style="font-size: var(--font-size-xl); font-weight: bold; color: var(--color-secondary); margin: 0.5rem 0;">5</div>
                    <div style="color: var(--color-text-light); font-size: var(--font-size-sm);">доступных игр</div>
                </div>
                <div class="stat-card" style="background: var(--color-bg-light); padding: 1.5rem; border-radius: var(--radius-lg); text-align: center; border: 2px solid var(--color-accent);">
                    <div style="font-size: 2rem; color: var(--color-accent);">👥</div>
                    <div style="font-size: var(--font-size-xl); font-weight: bold; color: var(--color-accent); margin: 0.5rem 0;">4</div>
                    <div style="color: var(--color-text-light); font-size: var(--font-size-sm);">всего бронирований</div>
                </div>
                <div class="stat-card" style="background: var(--color-bg-light); padding: 1.5rem; border-radius: var(--radius-lg); text-align: center; border: 2px solid var(--color-info);">
                    <div style="font-size: 2rem; color: var(--color-info);">⭐</div>
                    <div style="font-size: var(--font-size-xl); font-weight: bold; color: var(--color-info); margin: 0.5rem 0;">3</div>
                    <div style="color: var(--color-text-light); font-size: var(--font-size-sm);">среднее кол-во игроков</div>
                </div>
            </div>
        `;
    }
}

// ====== ИНИЦИАЛИЗАЦИЯ ======

// При загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Страница загружена');
    
    // Скрываем загрузчик если есть
    const loader = document.getElementById('page-loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }, 1000);
    }
    
    // Проверяем на какой странице находимся
    const path = window.location.pathname;
    
    if (path.includes('games.html') || path.endsWith('games.html')) {
        console.log('🎮 Загружаем игры...');
        loadGames();
        
        // Вешаем обработчик на кнопку обновления
        const refreshBtn = document.getElementById('refreshGamesBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', refreshGames);
        }
    }
    
    // Если на странице "О нас"
    if (path.includes('about.html') || path.endsWith('about.html')) {
        console.log('📝 Инициализируем форму бронирования...');
        initBookingForm();
        updateStats();
        
        // Инициализируем подсказки
        initTooltips();
    }
});

// Инициализация подсказок
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
            
            setTimeout(() => tooltip.classList.add('show'), 10);
            
            this._tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.classList.remove('show');
                setTimeout(() => {
                    if (this._tooltip && this._tooltip.parentNode) {
                        this._tooltip.parentNode.removeChild(this._tooltip);
                    }
                }, 200);
            }
        });
    });
}

// Добавляем стили для подсказок в CSS
const tooltipStyles = `
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}

.tooltip {
    position: fixed;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    z-index: 10000;
    pointer-events: none;
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.2s, transform 0.2s;
    max-width: 300px;
    word-wrap: break-word;
    white-space: nowrap;
}

.tooltip.show {
    opacity: 1;
    transform: translateY(0);
}

.invalid {
    border-color: var(--color-error) !important;
    background-color: rgba(244, 67, 54, 0.1) !important;
}

.valid {
    border-color: var(--color-success) !important;
}

.btn--success {
    background: linear-gradient(135deg, var(--color-success), #4CAF50) !important;
}
`;

// Добавляем стили в head
if (!document.querySelector('#tooltip-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'tooltip-styles';
    styleSheet.textContent = tooltipStyles;
    document.head.appendChild(styleSheet);
}