# 💸 TeenSpend — Production-Grade Teenager Expense Tracker

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-purple.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E.svg)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**TeenSpend** is a full-stack financial tracking web application built specifically for teenagers and students. It helps teens track their daily pocket money expenses, visualize where their money goes through interactive Recharts analytics, set monthly and category budget targets, and receive personalized, educational rule-based money advice.

---

## 🌟 Key Features

1. **Secure Authentication & Isolation**:
   - User registration & login with **bcrypt** password hashing (salt rounds = 10).
   - **JWT** (JSON Web Token) authentication with bearer authorization header middleware.
   - Complete multi-tenant user data isolation (users can never access or tamper with another user's records).
   - Profile management with password updates and avatar generation.

2. **Full Expense CRUD & Categorization**:
   - **Create**: Add title, amount in Indian Rupees (₹), category, payment method (UPI, Cash, Card, Bank, Other), date, and optional notes.
   - **Read**: View expenses in responsive tables and dashboard cards.
   - **Update**: Edit existing expense records seamlessly via modal dialogs.
   - **Delete**: Remove expenses with confirmation dialogs.
   - **Filter & Search**: Real-time keyword search, category filter, payment method filter, date range, min/max amount, and sorting.
   - **Export to CSV**: Download complete expense history as CSV spreadsheet.

3. **Live Financial Dashboard**:
   - 6 Key financial indicators:
     - **Monthly Budget**
     - **Remaining Pocket Money**
     - **This Month's Spending**
     - **Today's Spending**
     - **This Week's Spending**
     - **All-Time Total Spent**
   - Real-time remaining budget calculations: $\text{Budget} - \text{Total Spent}$.
   - All amounts rendered in Indian Rupees (**₹**).
   - Average daily spending pace and highest spending category badges.

4. **Interactive Graphical Analytics (Recharts)**:
   - **Chart 1 — Expense by Category**: Interactive doughnut chart with custom tooltips, category emojis, and breakdown percentages.
   - **Chart 2 — Monthly Spending Trend**: Smooth area chart illustrating spending trends over the past 6 months.
   - **Chart 3 — Category Comparison**: Bar chart comparing expense totals across categories.
   - **Chart 4 — Daily Spending**: Bar chart showing daily spending amounts across 7, 14, or 30 days.

5. **Smart Spending Suggestions (Rule-Based Engine)**:
   - Evaluates real user spending patterns and delivers educational, teenager-tailored recommendations:
     - High food & snack alert ($> 35\%$ of total spending).
     - Entertainment & gaming subscription insights ($> 25\%$ of total spending).
     - 48-Hour impulse shopping rule reminder when shopping is high.
     - Budget proximity warning ($> 80\%$ used) and overspending alert ($> 100\%$).
     - Student transit pass savings suggestions.
     - Daily spending pace projection vs monthly limit.
     - Positive reinforcement and savings habits.

6. **Budget Management System**:
   - Set monthly overall allowance limit.
   - Configure optional category caps (Food, Entertainment, Transport, Shopping, Education).
   - Visual progress bars with dynamic status colors (Normal Emerald, Warning Amber, Exceeded Rose).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, React Router v7, Recharts, Lucide Icons |
| **Styling** | Vanilla CSS3 (Custom design system, CSS variables, glassmorphism, responsive grid) |
| **Backend** | Node.js, Express.js (REST APIs, MVC architecture) |
| **Database** | Supabase PostgreSQL with SQL schema, indexes, triggers, and Row Level Security (RLS) |
| **Security** | bcryptjs, jsonwebtoken, CORS, input validators, protected route guards |

---

## 📁 Project Structure

```
new prjct/
├── backend/
│   ├── config/
│   │   ├── db.js                 # Database configuration
│   │   ├── supabase.js           # Supabase PostgreSQL client initialization
│   │   └── localDb.js            # Resilient zero-friction local storage fallback
│   ├── controllers/
│   │   ├── authController.js     # Auth request handling (register, login, profile)
│   │   ├── expenseController.js  # Expense CRUD request handling
│   │   ├── budgetController.js   # Budget limits and status handling
│   │   └── analyticsController.js# Summary and chart analytics handling
│   ├── database/
│   │   ├── schema.sql            # Supabase PostgreSQL schema with RLS & indexes
│   │   └── local_data.json       # Local store persistence
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT Bearer token authentication guard
│   │   └── errorMiddleware.js    # Centralized 404 & 500 JSON error handling
│   ├── models/
│   │   ├── userModel.js          # User database operations
│   │   ├── expenseModel.js       # Expense database operations & queries
│   │   └── budgetModel.js        # Budget database operations & upsert
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth endpoints
│   │   ├── expenseRoutes.js      # /api/expenses endpoints
│   │   ├── budgetRoutes.js       # /api/budget endpoints
│   │   └── analyticsRoutes.js    # /api/analytics endpoints
│   ├── services/
│   │   ├── authService.js        # Password hashing, JWT signing, user profile logic
│   │   ├── expenseService.js     # Expense business validation & CRUD logic
│   │   ├── budgetService.js      # Budget status, remaining math, category caps
│   │   ├── analyticsService.js   # Aggregations, monthly trends, daily spending
│   │   └── suggestionService.js  # Rule-based teenager spending recommendation engine
│   ├── utils/
│   │   ├── jwt.js                # JWT sign & verify utilities
│   │   └── validators.js         # Input sanitization & category validators
│   ├── app.js                    # Express app configuration & middleware
│   ├── server.js                 # Server listener entry point
│   ├── package.json              # Backend dependencies
│   ├── .env.example              # Environment variables template
│   └── verify-e2e.js             # Automated 17-point full-stack test suite
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Top navigation with avatar dropdown & quick add
│   │   │   ├── Sidebar.jsx       # Desktop navigation sidebar with budget widget
│   │   │   ├── MobileNav.jsx     # Mobile bottom navigation bar
│   │   │   ├── DashboardCard.jsx # Metric counter cards
│   │   │   ├── ExpenseTable.jsx  # Expense table with badges and delete modal
│   │   │   ├── ExpenseFormModal.jsx # Add & Edit expense modal dialog
│   │   │   ├── BudgetProgress.jsx# Progress bars with status coloring
│   │   │   ├── CategoryChart.jsx # Recharts Doughnut chart
│   │   │   ├── MonthlyTrendChart.jsx # Recharts Area trend chart
│   │   │   ├── CategoryComparisonChart.jsx # Recharts Bar comparison chart
│   │   │   ├── DailySpendingChart.jsx # Recharts Daily bar chart
│   │   │   ├── SpendingSuggestions.jsx # Rule-based advice cards
│   │   │   ├── Modal.jsx         # Generic accessible modal dialog
│   │   │   ├── LoadingSpinner.jsx# Glowing loading state
│   │   │   ├── ErrorMessage.jsx  # Error banner
│   │   │   ├── EmptyState.jsx    # Friendly illustration empty state
│   │   │   └── ProtectedRoute.jsx# Auth route guard
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Authentication state & session listener
│   │   │   ├── ExpenseContext.jsx# Expenses, summary, and filter mutations
│   │   │   └── ToastContext.jsx  # Auto-dismissing toast notification system
│   │   ├── hooks/
│   │   │   ├── useAuth.js        # Auth hook
│   │   │   ├── useExpenses.js    # Expenses hook
│   │   │   └── useToast.js       # Toast hook
│   │   ├── layouts/
│   │   │   ├── AppLayout.jsx     # Application shell layout
│   │   │   └── AuthLayout.jsx    # Centered authentication shell layout
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Vibrant landing page with features
│   │   │   ├── RegisterPage.jsx  # Account registration page
│   │   │   ├── LoginPage.jsx     # Account login page
│   │   │   ├── DashboardPage.jsx # Main financial overview dashboard
│   │   │   ├── AddExpensePage.jsx# Dedicated add expense page
│   │   │   ├── ExpenseHistoryPage.jsx # Search, filter, and CSV export
│   │   │   ├── AnalyticsPage.jsx # 4 Interactive charts & analytics
│   │   │   ├── BudgetPage.jsx    # Monthly allowance & category caps
│   │   │   ├── ProfilePage.jsx   # Account details & password change
│   │   │   └── NotFoundPage.jsx  # 404 error page
│   │   ├── services/
│   │   │   ├── api.js            # Universal API client with JWT injection
│   │   │   ├── authService.js    # Auth HTTP requests
│   │   │   ├── expenseService.js # Expense HTTP requests
│   │   │   ├── budgetService.js  # Budget HTTP requests
│   │   │   └── analyticsService.js# Analytics HTTP requests
│   │   ├── styles/
│   │   │   ├── index.css         # Design tokens, typography, global utilities
│   │   │   ├── components.css    # Tables, navigation, cards, modals
│   │   │   └── auth.css          # Auth forms & hero layouts
│   │   ├── utils/
│   │   │   ├── currency.js       # ₹ formatting functions
│   │   │   ├── dateUtils.js      # Friendly date formatting & relative dates
│   │   │   └── categoryIcons.js  # Category badges, colors, and emojis
│   │   ├── App.jsx               # Application routes & providers
│   │   └── main.jsx              # React root entry point
│   ├── vite.config.js            # Vite configuration with /api backend proxy
│   ├── package.json              # Frontend dependencies
│   └── index.html                # HTML template with SEO tags & Rupee favicon
│
├── README.md                     # Documentation
└── .gitignore                    # Git ignore file
```

---

## ⚡ Installation & Quick Start

### 1. Prerequisites
- **Node.js** (v18.x or v20+ recommended, tested on Node v24)
- **npm** (v9+ or v11+)

---

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
# Or start directly with node
npm start
```

The backend server will run at `http://localhost:5000`.  
Health check endpoint: `http://localhost:5000/api/health`.

#### Backend Environment Variables (`backend/.env`):
Create a `.env` file in `backend/` (template provided in `.env.example`):

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Authentication Secrets
JWT_SECRET=teenspend_jwt_secure_key_2026_production_secret
JWT_EXPIRES_IN=7d

# Supabase PostgreSQL Configuration
# Paste your credentials from https://supabase.com/dashboard/project/<your-project>/settings/api
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

> **Note on Resilient Architecture**: If `SUPABASE_URL` is omitted or unconfigured during initial local exploration, the backend automatically uses an internal persistent JSON store (`backend/database/local_data.json`) with zero setup friction! Once you paste your Supabase URL and keys, it connects seamlessly to live Supabase PostgreSQL.

---

### 3. Supabase PostgreSQL Database Setup

1. Log into your [Supabase Dashboard](https://supabase.com).
2. Create a new project (e.g. `teenspend-db`).
3. Open the **SQL Editor** in the Supabase sidebar.
4. Copy the complete contents of [`backend/database/schema.sql`](file:///c:/Users/Rupam/OneDrive/Desktop/new%20prjct/backend/database/schema.sql) and paste them into the SQL Editor.
5. Click **Run**. This will create:
   - `users` table with email index and UUID generation.
   - `expenses` table with composite date and category indexes.
   - `budgets` table with unique user-month constraints.
   - Automatic `updated_at` trigger function.
   - Row Level Security (RLS) policies.
6. Copy your **Project URL** and **anon/service_role key** from Project Settings -> API, and paste them into `backend/.env`.

---

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The frontend will run at `http://localhost:5173`.  
Vite automatically proxies all `/api/*` calls to the Express backend on `http://localhost:5000`.

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user (name, email, password, confirmPassword) | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (Bearer) |
| `PUT` | `/api/auth/profile` | Update profile information | Yes (Bearer) |
| `PUT` | `/api/auth/password` | Change password securely | Yes (Bearer) |

### Expenses (`/api/expenses`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/expenses` | Get user expenses (supports category, search, date, amount, sort) | Yes (Bearer) |
| `POST` | `/api/expenses` | Add new expense | Yes (Bearer) |
| `GET` | `/api/expenses/:id` | Get expense by ID (user isolated) | Yes (Bearer) |
| `PUT` | `/api/expenses/:id` | Update expense record | Yes (Bearer) |
| `DELETE` | `/api/expenses/:id` | Delete expense record | Yes (Bearer) |

### Budget (`/api/budget`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/budget` | Get user monthly budget and category limits | Yes (Bearer) |
| `POST` | `/api/budget` | Set or update monthly budget and category caps | Yes (Bearer) |
| `GET` | `/api/budget/status` | Get real-time spend vs budget status and percentage | Yes (Bearer) |

### Analytics (`/api/analytics`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/analytics/summary` | Dashboard summary metrics & smart suggestions | Yes (Bearer) |
| `GET` | `/api/analytics/category` | Category totals, counts, and percentages | Yes (Bearer) |
| `GET` | `/api/analytics/monthly` | 6-month historical spending trend | Yes (Bearer) |
| `GET` | `/api/analytics/daily` | Daily spending breakdown for 7, 14, or 30 days | Yes (Bearer) |
| `GET` | `/api/analytics/comparison` | Category comparison against budget limits | Yes (Bearer) |

---

## 🔒 Security Best Practices Implemented

- **Password Hashing**: Passwords hashed using `bcryptjs` with salt rounds = 10 before storage.
- **Never Plain-text**: Plain-text passwords are never saved and password hashes are never returned in API responses.
- **JWT Authorization**: All private routes require a verified JWT bearer token.
- **Data Isolation**: Every SQL and database query checks `user_id = req.user.id`. Users cannot access, view, or mutate another user's expenses or budgets.
- **Input Validation**: Backend sanitization prevents negative amounts, empty titles, invalid categories, or malformed emails.
- **Safe Environment**: Sensitive credentials stored in `.env` and excluded from git tracking via `.gitignore`.

---

## 🧪 Testing Checklist

Run the automated 17-point integration test suite at any time:

```bash
cd backend
node verify-e2e.js
```

Verification items covered:
- [x] Register user with unique email
- [x] Password hashed using bcrypt
- [x] Login generates valid JWT token
- [x] Duplicate registration returns 409 Conflict
- [x] Unauthenticated request blocked with 401 Unauthorized
- [x] Add expenses across Food, Transport, Education, Entertainment, Shopping
- [x] Edit existing expense
- [x] Search expenses by title or note keyword
- [x] Filter expenses by category
- [x] Configure monthly budget and track remaining balance
- [x] Calculate dashboard summary (today, week, month, remaining)
- [x] Rule-based suggestions generated based on spending ratios
- [x] Chart 1 (Category Doughnut) data generated
- [x] Chart 2 (Monthly Trend) data generated
- [x] Chart 4 (Daily Spending) data generated
- [x] Multi-tenant isolation verified (User 2 cannot see or access User 1 data)
- [x] Delete expense record

---

## 🚀 Future Improvements

1. **OCR Bill & Receipt Scanner**: Use optical character recognition to auto-fill expense amounts and merchant names from printed receipts.
2. **Savings Goals & Piggy Bank**: Allow teens to set specific financial goals (e.g., "Save ₹15,000 for a bicycle") with interactive visual milestones.
3. **Weekly Pocket Money Mode**: Option for teenagers who receive weekly or daily pocket money allowances instead of monthly.
4. **Gamification & Badges**: Achievement badges for maintaining budget discipline and staying under limits for consecutive weeks.

---

## 📄 License
This project is open-source under the MIT License.
