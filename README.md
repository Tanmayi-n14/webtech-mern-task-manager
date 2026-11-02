# 📝 MERN Task Manager

A full-stack task management web application built with the **MERN** stack (MongoDB, Express.js, React, Node.js) featuring JWT authentication, responsive glassmorphism UI, task filtering, priority sorting, and real-time status management.

---

## ✨ Features

- **🔐 User Authentication**: Secure registration & login with hashed passwords (`bcryptjs`) and JSON Web Tokens (`jsonwebtoken`).
- **📋 Task CRUD**: Create, read, edit, and delete personal tasks.
- **⚡ Status Toggling**: Instant check/uncheck for completed vs. pending tasks with optimistic UI updates.
- **🎯 Smart Filtering**:
  - All Tasks
  - Pending Tasks
  - Completed Tasks
  - Tasks Due Today
- **🔍 Search & Sort**: Real-time search by title, filter by priority (*Low*, *Medium*, *High*), and sort by due date or priority.
- **🎨 Modern Glassmorphism UI**: Styled with responsive modern CSS, gradient accents, and mobile-friendly layouts.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router v7, Axios, Modern CSS
- **Backend**: Node.js, Express 5, Native MongoDB Driver, Mongoose
- **Security**: JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`), CORS, Dotenv

---

## 📂 Project Structure

```text
mern-task-manager/
├── backend/
│   ├── .env.example       # Sample environment configuration
│   ├── package.json       # Backend dependencies & start scripts
│   └── server.js          # Express server with Auth & Task REST APIs
├── frontend/
│   ├── public/            # Static assets & HTML template
│   ├── src/
│   │   ├── components/    # Reusable components (e.g., Navbar)
│   │   ├── context/       # AuthContext for managing JWT sessions
│   │   ├── pages/         # Login, Register, TaskList, TaskForm pages
│   │   ├── App.js         # Routing & route protection
│   │   ├── index.js       # React root mount
│   │   └── index.css      # Custom styling & glassmorphism theme
│   └── package.json       # Frontend dependencies & React scripts
├── .gitignore             # Excludes node_modules, build, .env
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on `localhost:27017` (or a MongoDB Atlas connection URI)

---

### 1. Backend Setup

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   *Make sure your `.env` has:*
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017
   JWT_SECRET=your_jwt_secret_key_here
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   *The server runs on `http://localhost:5000`.*

---

### 2. Frontend Setup

1. Open a second terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Register a new user (`{ username, password }`)
- `POST /auth/login` - Authenticate user & return JWT token

### Tasks (Protected - Requires `Authorization: Bearer <token>`)
- `GET /tasks` - Retrieve all tasks for the authenticated user
- `GET /tasks/:id` - Retrieve a specific task by ID
- `POST /tasks` - Create a new task (`{ title, description, dueDate, priority }`)
- `PUT /tasks/:id` - Update task details or mark complete
- `DELETE /tasks/:id` - Delete a task by ID

---

## 📄 License
This project is open-source under the ISC License.

---

## 👤 Author

* **Tanmayi Nagabhairava** ([@Tanmayi-n14](https://github.com/Tanmayi-n14)) — `PES1UG24CS493`
* Department of Computer Science & Engineering, PES University
