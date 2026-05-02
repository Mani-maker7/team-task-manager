import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <h2 className="text-xl font-bold">TaskMaster</h2>
        </Link>
        <div className="navbar-links">
          {token ? (
            <div className="logged-in-area">
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              {user?.role === 'admin' && <Link to="/admin" className="nav-link">Admin Panel</Link>}
              {user?.role === 'member' && <Link to="/member" className="nav-link">My Tasks</Link>}
              <span className="user-info">
                Hi, <span className="font-semibold text-blue-400">{user?.name}</span>
              </span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          ) : (
            <div className="logged-out-area">
              <Link to="/login" className="login-link">Login / Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
