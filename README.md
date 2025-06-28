# Expense Tracker

The **Expense Tracker** is a full-stack web application for managing personal and administrative expenses. Built with **Django** (backend) and **React** (frontend), it allows users to register, log in, create/edit/delete expenses, filter expenses by date or category, and view spending summaries via a pie chart. Admins can view and manage all users' expenses. The application uses **JWT authentication** stored in HTTP-only cookies and supports **pagination** for efficient data handling.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Pagination](#pagination)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features
- **User Authentication**: Register, log in, and log out with JWT-based authentication (HTTP-only cookies).
- **Expense Management**: Create, edit, delete, and view expenses with fields for title, amount, category, date, and notes.
- **Filtering**: Filter expenses by start date, end date, category, and (for admins) user.
- **Pagination**: Expenses are paginated (10 per page) for efficient data retrieval.
- **Spending Summary**: Visualize spending by category using a pie chart (Chart.js).
- **Admin Panel**: Admins can view and manage all expenses with user-specific filters.
- **Responsive UI**: Built with Tailwind CSS for a modern, responsive design.
- **Notifications**: Toast notifications for success/error actions (e.g., expense created/deleted).

## Tech Stack
- **Backend**:
  - Django 5.2.3
  - Django REST Framework
  - SimpleJWT for authentication
  - PostgreSQL database
  - Django CORS Headers
- **Frontend**:
  - React 18
  - Redux Toolkit for state management
  - Axios for API requests
  - Tailwind CSS for styling
  - Chart.js for pie charts
  - Lucide React for icons
- **Authentication**: JWT stored in HTTP-only cookies
- **Deployment**: Local development (`http://localhost:8000` backend, `http://localhost:5173` frontend)

## Prerequisites
- **Python 3.8+**: [Download](https://www.python.org/downloads/)
- **Node.js 18+**: [Download](https://nodejs.org/en/download/)
- **PostgreSQL 13+**: [Download](https://www.postgresql.org/download/) or use Docker
- **Git**: For cloning the repository
- **pip**: Python package manager
- **npm**: Node package manager

## Installation and Setup

### Clone the Repository
git clone https://github.com/nikhilrajpk/Expense_Tracker.git
cd Expense_Tracker
Backend Setup
Navigate to the Backend Directory:
cd expense_tracker
Create a Virtual Environment:

python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
Install Dependencies: Create a requirements.txt if not present:

django==5.2.3
djangorestframework==3.15.2
djangorestframework-simplejwt==5.3.1
python-dotenv==1.0.1
psycopg2-binary==2.9.9
django-cors-headers==4.4.0
Install:

pip install -r requirements.txt
Set Up Environment Variables: Create a .env file in expense_tracker:
env

SECRET_KEY=your-secret-key  # Generate: python -c "import secrets; print(secrets.token_urlsafe(50))"
DB_NAME=expense_tracker
DB_USER=your-postgres-user
DB_PASSWORD=your-postgres-password
DB_HOST=localhost
DB_PORT=5432
Set Up PostgreSQL: Create the database:

psql -U your-postgres-user -c "CREATE DATABASE expense_tracker;"
Run Migrations:

python manage.py makemigrations
python manage.py migrate
Create a Superuser:

python manage.py createsuperuser
Frontend Setup
Navigate to the Frontend Directory:

cd ../expense-tracker-frontend
Install Dependencies:

npm install
Ensure package.json includes:

"dependencies": {
  "axios": "^1.7.2",
  "chart.js": "^4.4.3",
  "lucide-react": "^0.441.0",
  "react": "^18.2.0",
  "react-chartjs-2": "^5.2.0",
  "react-dom": "^18.2.0",
  "react-redux": "^9.1.2",
  "react-router-dom": "^6.26.2",
  "@redux-devtools/extension": "^3.3.0",
  "@reduxjs/toolkit": "^2.2.7"
}
Configure Vite Proxy: In vite.config.js:

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
Running the Application
Start the Backend:

cd expense_tracker
source venv/bin/activate  # On Windows: venv\Scripts\activate
python manage.py runserver
Backend runs at http://localhost:8000.
Start the Frontend: In a new terminal:

cd expense-tracker-frontend
npm run dev
Frontend runs at http://localhost:5173.
Access the Application:
Open http://localhost:5173 in your browser.
Register at /register, log in at /login, and access /dashboard.
Admins can access /admin with a superuser account.
Usage
Register/Login: Create an account or log in to manage expenses.
Dashboard:
Create expenses (title, amount, category, date, notes).
View expenses in a paginated table (10 per page).
Filter by start date, end date, or category.
View spending by category in a pie chart.
Admin Panel:
View all expenses with user-specific filters.
Navigate pages and edit/delete expenses.
Expense Details: Edit or delete individual expenses at /expense/<id>.
API Endpoints

Endpoint	Method	Description	Authentication
/api/auth/register/	POST	Register a new user	None
/api/auth/login/	POST	Log in (sets JWT cookies)	None
/api/auth/user/	GET	Get current user details	JWT
/api/auth/users/	GET	List all users (admin-only)	JWT, IsStaff
/api/expenses/	GET	List expenses (paginated, filtered)	JWT
/api/expenses/	POST	Create a new expense	JWT
/api/expenses/<id>/	GET	Retrieve an expense	JWT, IsOwnerOrAdmin
/api/expenses/<id>/	PUT	Update an expense	JWT, IsOwnerOrAdmin
/api/expenses/<id>/	DELETE	Delete an expense	JWT, IsOwnerOrAdmin
/api/summary/	GET	Get spending summary by category	JWT
Query Parameters for /api/expenses/:

page: Page number (e.g., ?page=2).
start_date, end_date: Filter by date (e.g., ?start_date=2025-06-01).
category: Filter by category (e.g., ?category=food).
user: Filter by user ID (admin-only, e.g., ?user=1).
