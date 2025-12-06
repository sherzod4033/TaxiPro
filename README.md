# 🚕 TaxiPro - Сервис Такси

Полноценное веб-приложение для управления службой такси с современным интерфейсом и REST API.

## 🌟 Возможности

### Backend (FastAPI)
- ✅ **Управление водителями** - CRUD операции, статусы (доступен/занят/оффлайн)
- ✅ **Управление пассажирами** - регистрация, профили, рейтинги
- ✅ **Управление поездками** - создание, назначение водителя, отслеживание статуса
- ✅ **RESTful API** - полная документация Swagger/OpenAPI
- ✅ **База данных SQLite** - легкая настройка и использование
- ✅ **Валидация данных** - Pydantic схемы

### Frontend
- ✨ **Премиум дизайн** - темная тема, градиенты, glassmorphism
- 🎨 **Современный UI** - плавные анимации и переходы
- 📱 **Адаптивный дизайн** - работает на всех устройствах
- 🔄 **Реал-тайм обновления** - мгновенная синхронизация с бэкендом
- 📊 **Панель статистики** - обзор системы в реальном времени

## 🗂️ Структура проекта

```
taxi-service/
├── backend/
│   ├── main.py                 # Основное приложение FastAPI
│   ├── database.py             # Конфигурация БД
│   ├── models.py               # SQLAlchemy модели
│   ├── schemas.py              # Pydantic схемы
│   ├── requirements.txt        # Python зависимости
│   └── routers/
│       ├── drivers.py          # API для водителей
│       ├── passengers.py       # API для пассажиров
│       └── trips.py            # API для поездок
└── frontend/
    ├── index.html              # Главная страница
    ├── styles/
    │   └── main.css            # Стили
    └── scripts/
        ├── app.js              # Основная логика
        ├── drivers.js          # Управление водителями
        ├── passengers.js       # Управление пассажирами
        └── trips.js            # Управление поездками
```

## 🚀 Установка и запуск

### Backend

1. **Установите зависимости:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Запустите сервер:**
```bash
uvicorn main:app --reload
```

Сервер будет доступен на `http://localhost:8000`

API документация: `http://localhost:8000/docs`

### Frontend

1. **Откройте файл в браузере:**
```bash
cd frontend
start index.html  # Windows
# или просто откройте index.html в браузере
```

## 📡 API Endpoints

### Водители
- `GET /api/drivers` - Список водителей
- `GET /api/drivers/{id}` - Информация о водителе
- `POST /api/drivers` - Создать водителя
- `PUT /api/drivers/{id}` - Обновить данные
- `PATCH /api/drivers/{id}/status` - Изменить статус
- `DELETE /api/drivers/{id}` - Удалить водителя

### Пассажиры
- `GET /api/passengers` - Список пассажиров
- `GET /api/passengers/{id}` - Информация о пассажире
- `POST /api/passengers` - Регистрация
- `PUT /api/passengers/{id}` - Обновить профиль
- `DELETE /api/passengers/{id}` - Удалить аккаунт

### Поездки
- `GET /api/trips` - Список поездок
- `GET /api/trips/{id}` - Детали поездки
- `POST /api/trips` - Создать поездку
- `PATCH /api/trips/{id}/accept` - Принять поездку
- `PATCH /api/trips/{id}/start` - Начать поездку
- `PATCH /api/trips/{id}/complete` - Завершить поездку
- `PATCH /api/trips/{id}/cancel` - Отменить поездку

## 💾 База данных

### Driver (Водители)
```
- id: Integer (PK)
- name: String
- phone: String (unique)
- license_number: String (unique)
- car_model: String
- car_number: String (unique)
- rating: Float
- status: Enum (available, busy, offline)
- created_at: DateTime
```

### Passenger (Пассажиры)
```
- id: Integer (PK)
- name: String
- phone: String (unique)
- email: String (unique)
- rating: Float
- created_at: DateTime
```

### Trip (Поездки)
```
- id: Integer (PK)
- passenger_id: Integer (FK)
- driver_id: Integer (FK, nullable)
- pickup_location: String
- dropoff_location: String
- distance: Float (nullable)
- price: Float (nullable)
- status: Enum (pending, accepted, in_progress, completed, cancelled)
- created_at: DateTime
- completed_at: DateTime (nullable)
```

## 🎯 Использование

### 1. Добавить водителей
   - Перейдите в раздел "Водители"
   - Нажмите "Добавить водителя"
   - Заполните форму
   - Измените статус на "Доступен"

### 2. Зарегистрировать пассажиров
   - Перейдите в раздел "Пассажиры"
   - Нажмите "Зарегистрировать пассажира"
   - Введите данные

### 3. Создать поездку
   - Перейдите в раздел "Поездки"
   - Нажмите "Создать поездку"
   - Выберите пассажира
   - Укажите маршрут
   - Назначьте водителя
   - Управляйте статусом поездки

## 🎨 Дизайн

Приложение использует современный премиум дизайн:
- **Цвета**: Градиенты purple/blue с акцентами
- **Шрифт**: Inter (Google Fonts)
- **Эффекты**: Glassmorphism, плавные переходы, hover анимации
- **Тема**: Темная с яркими акцентами

## 🛠️ Технологии

### Backend
- **FastAPI** - современный веб-фреймворк
- **SQLAlchemy** - ORM для работы с БД
- **Pydantic** - валидация данных
- **Uvicorn** - ASGI сервер
- **SQLite** - легковесная база данных

### Frontend
- **HTML5** - семантическая разметка
- **CSS3** - современные стили, анимации
- **JavaScript** - интерактивность, API интеграция
- **Fetch API** - HTTP запросы

## 📝 Примеры запросов

### Создать водителя
```bash
curl -X POST "http://localhost:8000/api/drivers" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Иван Петров",
    "phone": "+79991234567",
    "license_number": "ABC123456",
    "car_model": "Toyota Camry",
    "car_number": "A123BC77"
  }'
```

### Создать поездку
```bash
curl -X POST "http://localhost:8000/api/trips" \
  -H "Content-Type: application/json" \
  -d '{
    "passenger_id": 1,
    "pickup_location": "Красная площадь",
    "dropoff_location": "Аэропорт Шереметьево"
  }'
```

## 🔮 Будущие улучшения

- [ ] Аутентификация и авторизация
- [ ] WebSocket для реал-тайм обновлений
- [ ] Интеграция с картами (Google Maps / Яндекс.Карты)
- [ ] Расчет расстояния и цены по API карт
- [ ] История платежей
- [ ] Push-уведомления
- [ ] Мобильное приложение
- [ ] Админ-панель с аналитикой

## 📄 Лицензия

MIT License

## 👨‍💻 Автор

Создано с ❤️ для демонстрации возможностей FastAPI и современного веб-дизайна
