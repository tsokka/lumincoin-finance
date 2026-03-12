# 💸 Lumincoin Finance

Lumincoin Finance is a single‑page web application for tracking personal income and expenses.  
It was developed as part of a frontend web development course.  
I implemented the frontend SPA and integrated it with the provided Node.js API backend.

## 🖥 Demo

- Frontend: https://lumincoin-finance.vercel.app/  
- Backend API: https://lumincoin-finance.onrender.com/

> Note: The backend is hosted on a free tier, so the first request after a period of inactivity may take a few seconds while the service wakes up.

## ✨ Features

- User registration and authentication (sign up / sign in / sign out)
- Dashboard with charts for income and expenses over time
- Categories management for incomes and expenses
- CRUD operations for financial transactions
- Date range filters
- Responsive layout with an off‑canvas sidebar

## 🛠 Tech Stack

### Frontend

- JavaScript (ES6+)
- Webpack bundler
- Bootstrap 5, custom SCSS styles
- Chart.js for visualizing statistics
- Flatpickr for date selection
- Custom client‑side router (SPA architecture)

### Backend

The backend is a Node.js API provided as part of the course template.  
In this project I focused on the frontend and API integration.

- Node.js, Express
- JWT‑based authentication, bcrypt for password hashing
- LowDB file‑based storage
- Joi‑based request validation

## ⚙️ Running the Project Locally

### Prerequisites

- Node.js 16+
- npm

Environment Variables

Create a `.env` file in the `frontend` folder based on `.env.example`.

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend will start on http://localhost:3000 (or the port defined in your .env file).

### Frontend (dev server)

``` bash
cd frontend
npm install
npm run dev
```

The Webpack dev server will start on http://localhost:9000.

### Frontend (production build)

``` bash
cd frontend
npm install
npm run build
```

The production build will be generated in the dist folder.

## 📸 Screenshots

### Login

![Login screen](https://github.com/tsokka/lumincoin-finance/blob/main/frontend/src/static/images/screenshot-login.png?raw=true)

### Dashboard

![Dashboard](https://github.com/tsokka/lumincoin-finance/blob/main/frontend/src/static/images/screenshot-dashboard.png?raw=true)

### Operations

![Operations list](https://github.com/tsokka/lumincoin-finance/blob/main/frontend/src/static/images/screenshot-operations.png?raw=true)

### Edit category

![Edit category](https://github.com/tsokka/lumincoin-finance/blob/main/frontend/src/static/images/screenshot-edit-category.png?raw=true)

## 👤 Author
Frontend: Marina Kolbina  
GitHub: https://github.com/tsokka
