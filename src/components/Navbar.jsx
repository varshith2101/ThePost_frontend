import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-brand-link">
          The Post
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/" className="navbar-link">
            Home
          </Link>
        </li>
        <li>
          <Link to="#famous-articles" className="navbar-link">
            Famous Articles
          </Link>
        </li>
        <li>
          <Link to="#all-articles" className="navbar-link">
            All Articles
          </Link>
        </li>
        <li>
          {currentUser ? (
            <button 
              onClick={logout} 
              className="navbar-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Logout ({currentUser.username})
            </button>
          ) : (
            <Link to="/login" className="navbar-link">
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;