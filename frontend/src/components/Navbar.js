import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">Task Manager</Link>
      <div className="nav-links">
        {user && <span>Hi, {user.username}!</span>}
        <Link to="/">All Tasks</Link>
        <Link to="/pending">Pending</Link>
        <Link to="/completed">Completed</Link>
        <Link to="/today">Due Today</Link>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;