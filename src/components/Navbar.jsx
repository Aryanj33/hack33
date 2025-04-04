import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/main.scss';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">MEDIVERSE</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/prescription">Prescription Analysis</Link>
        <Link to="/organs">3D Organ Models</Link>
        <Link to="/medicine">Medicine Scanner</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </nav>
  );
};

export default Navbar;