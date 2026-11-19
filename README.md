# 📝 MERN Task Manager — Full-Stack Web Application

[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_18-339933?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Server-Express_5-black?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)](https://www.mongodb.com/)
[![JWT Auth](https://img.shields.io/badge/Auth-JWT_Bcrypt-FF6F00?logo=jsonwebtokens)](https://jwt.io/)
[![Docker Ready](https://img.shields.io/badge/Docker-Compose_Ready-2496ED?logo=docker)](https://www.docker.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A production-ready full-stack task management web application built on the **MERN** stack (MongoDB, Express.js, React, Node.js). Features stateless **JSON Web Token (JWT)** authentication, bcrypt password hashing, dynamic task filtering (All, Pending, Completed, Due Today), priority-based sorting, and optimistic UI updates with responsive glassmorphism design.

Developed as the **Capstone Project** for **Web Technologies (UE23CS202)** at **PES University**.

---

## ✨ Features & Architecture Highlights

- **🔐 Stateless Authentication**: Secure user registration and login issuing signed JSON Web Tokens (`jsonwebtoken`) with `bcryptjs` salt hashing.
- **📋 Full Task CRUD & State Management**: Create, read, update, and delete tasks with optimistic React state synchronization.
- **⚡ Filter & Due-Date Intelligence**:
  - **All Tasks View**: Complete overview with priority badges (High, Medium, Low).
  - **Pending Tasks**: Filter unfulfilled commitments.
  - **Completed Tasks**: Track finished milestones with instant status toggle.
  - **Due Today**: Automatic client-side date comparison highlighting pressing deadlines.
- **🛡️ Protected API Routes**: Express middleware (`verifyToken`) validating incoming `Authorization: Bearer <token>` headers.
- **🐳 Containerized Deployment**: Instant 1-command startup via Docker Compose (`docker-compose.yml`).

---

## 🗺️ System Full-Stack Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Layer (React 18 SPA)"]
        UI["Glassmorphism UI Pages<br/>(TaskList, Pending, Completed, DueToday)"]
        CTX["AuthContext (JWT in Memory / LocalStorage)"]
        API_CLIENT["Axios / Fetch REST Client"]
    end

    subgraph Server ["Server Layer (Express.js / Node.js)"]
        ROUTER["Express Middleware Router"]
        AUTH_MID["verifyToken Middleware<br/>(JWT Verification)"]
        AUTH_ROUTES["/auth/register<br/>/auth/login"]
        TASK_ROUTES["/tasks (CRUD Endpoints)"]
    end

    subgraph Database ["Persistence Layer (MongoDB)"]
        USERS_COL["'users' Collection<br/>(User Credentials & Bcrypt Hash)"]
        TASKS_COL["'tasks' Collection<br/>(User-Scoped Documents)"]
    end

    UI --> CTX
    CTX --> API_CLIENT
    API_CLIENT -->|HTTP / JSON + Bearer Token| ROUTER
    
    ROUTER --> AUTH_ROUTES
    ROUTER --> AUTH_MID
    AUTH_MID --> TASK_ROUTES
    
    AUTH_ROUTES --> USERS_COL
    TASK_ROUTES --> TASKS_COL
```

---

## 📡 REST API Reference

All task endpoints require an `Authorization: Bearer <token>` header obtained via login.

| Method | Endpoint | Auth | Description | Request Body Payload |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/auth/register` | ❌ | Create new user account | `{"username": "tanmayi", "password": "securepassword"}` |
| `POST` | `/auth/login` | ❌ | Authenticate & receive JWT token | `{"username": "tanmayi", "password": "securepassword"}` |
| `GET` | `/tasks` | ✅ | Fetch all tasks for current user | *None* |
| `POST` | `/tasks` | ✅ | Create a new task | `{"title": "Project Review", "description": "Prep demo", "priority": "High", "dueDate": "2026-11-20"}` |
| `PUT` | `/tasks/:id` | ✅ | Update task details / status | `{"completed": true}` |
| `DELETE` | `/tasks/:id` | ✅ | Delete a task by ID | *None* |

---

## 🚀 Quickstart & Setup

### Option A: 1-Command Startup (Docker Compose)
To run MongoDB and the backend automatically:
```bash
git clone https://github.com/Tanmayi-n14/webtech-mern-task-manager.git
cd webtech-mern-task-manager
docker compose up -d
```
Then start the React frontend:
```bash
cd frontend
npm install
npm start
```
*Access the app at `http://localhost:3000`.*

---

### Option B: Local Manual Setup

#### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in `backend/`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-secret-key-here
```
Start the API server:
```bash
npm run dev
# Server running at http://localhost:5000
```

#### 2. Frontend Setup
In a separate terminal:
```bash
cd frontend
npm install
npm start
# Client running at http://localhost:3000
```

---

## 📂 Repository Contents

```text
webtech-mern-task-manager/
├── docker-compose.yml               # Container orchestration for MongoDB + Backend
├── backend/
│   ├── Dockerfile                   # Container build manifest for Node.js API
│   ├── server.js                    # Express app, JWT auth, MongoDB native driver logic
│   ├── package.json                 # Backend dependencies (express, mongodb, bcryptjs, jwt)
│   └── .env.example                 # Template for required environment variables
├── frontend/
│   ├── src/
│   │   ├── context/AuthContext.js   # Global auth state and JWT session management
│   │   ├── components/Navbar.js     # Responsive navigation header
│   │   ├── pages/                   # TaskList, Pending, Completed, DueToday, Login, Register
│   │   ├── App.js                   # Client-side routing with protected view gates
│   │   └── index.css                # Glassmorphism styling and responsive layout
│   └── package.json                 # Frontend dependencies (React 18, React Router)
└── README.md
```

---

## 👤 Author

* **Tanmayi Nagabhairava** ([@Tanmayi-n14](https://github.com/Tanmayi-n14)) — `PES1UG24CS493`
* Department of Computer Science & Engineering, PES University
