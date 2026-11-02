import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TaskListPage from './pages/TaskListPage';
import TaskFormPage from './pages/TaskFormPage';
import PendingTasksPage from './pages/PendingTasksPage';
import CompletedTasksPage from './pages/CompletedTasksPage';
import DueTodayPage from './pages/DueTodayPage';

// Components
import Navbar from './components/Navbar';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/" replace />;
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        <Route path="/" element={<ProtectedRoute><TaskListPage filter="all" /></ProtectedRoute>} />
        <Route path="/pending" element={<ProtectedRoute><TaskListPage filter="pending" /></ProtectedRoute>} />
        <Route path="/completed" element={<ProtectedRoute><TaskListPage filter="completed" /></ProtectedRoute>} />
        <Route path="/today" element={<ProtectedRoute><TaskListPage filter="due-today" /></ProtectedRoute>} />
        <Route path="/due-today" element={<ProtectedRoute><TaskListPage filter="due-today" /></ProtectedRoute>} />

        <Route path="/add" element={<ProtectedRoute><TaskFormPage /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><TaskFormPage isEditMode={true} /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </>
  );
}

export default App;
