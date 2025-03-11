// components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="/" className="navbar-brand-link">
          The Post
        </a>
      </div>
      <ul className="navbar-links">
        <li>
          <a href="/" className="navbar-link">
            Home
          </a>
        </li>
        <li>
          <a href="#famous-articles" className="navbar-link">
            Famous Articles
          </a>
        </li>
        <li>
          <a href="#all-articles" className="navbar-link">
            All Articles
          </a>
        </li>
        {/* <li>
          <Link to="/newsletter-25" className="navbar-link">
            Newsletter '25
          </Link>
        </li> */}
      </ul>
    </nav>
  );
};

export default Navbar;
