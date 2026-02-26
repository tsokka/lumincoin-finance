# Lumincoin Finance

Веб-приложение для учёта личных финансов с аутентификацией, 
управлением категориями доходов/расходов и визуализацией данных.

## 🖥 Демо
[Ссылка на демо, если есть]

## 📸 Скриншоты
[Скриншот дашборда]
[Скриншот списка операций]

## 🛠 Технологии
### Frontend
- JavaScript (ES6+), Webpack
- Bootstrap 5, SASS
- Chart.js (графики)
- Flatpickr (выбор дат)
- SPA с кастомным роутером

### Backend
- Node.js, Express
- JWT-аутентификация, bcrypt
- LowDB (файловая БД)
- Joi (валидация)

## ⚙️ Установка и запуск

### Требования
- Node.js 16+

### Backend
cd backend
npm install
npm start

### Frontend
cd frontend
npm install
npm run dev

## 📁 Структура проекта
lumincoin-finance/
├── frontend/
│   ├── src/
│   │   ├── components/    # UI-компоненты
│   │   ├── services/      # API-сервисы
│   │   ├── utils/         # Утилиты
│   │   ├── router.js      # SPA-роутер
│   │   ├── templates/     # HTML-шаблоны
│   │   └── styles/        # SCSS-стили
│   ├── package.json
│   └── webpack.config.js
├── backend/
│   ├── controllers/       # Контроллеры
│   ├── routes/            # API-маршруты
│   ├── models/            # Модели данных
│   ├── normalizers/       # Нормализация
│   └── package.json
└── .gitignore

## 📌 Реализованные функции
- Регистрация и авторизация (JWT + refresh tokens)
- CRUD категорий доходов и расходов
- CRUD финансовых операций
- Дашборд с графиками (Chart.js)
- Фильтрация по датам
- Адаптивная вёрстка с offcanvas sidebar

## 👤 Автор
[Marina Kolbina] — Frontend Developer
