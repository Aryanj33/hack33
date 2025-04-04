import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.scss';

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <nav className={`navbar ${isExpanded ? 'expanded' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/">MEDIVERSE</Link>
        </div>
        
        <button 
          className="navbar-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle navigation"
        >
          <div className={`hamburger ${isExpanded ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        
        <div className={`navbar-links ${isExpanded ? 'show' : ''}`}>
          <Link to="/prescription" onClick={() => setIsExpanded(false)}>
            <i className="fas fa-prescription"></i> Prescription
          </Link>
          <Link to="/organs" onClick={() => setIsExpanded(false)}>
            <i className="fas fa-lungs"></i> 3D Organs
          </Link>
          <Link to="/medicine" onClick={() => setIsExpanded(false)}>
            <i className="fas fa-pills"></i> Medicine Scanner
          </Link>
          <a href="#about" onClick={() => setIsExpanded(false)}>
            <i className="fas fa-info-circle"></i> About
          </a>
          <a href="#contact" onClick={() => setIsExpanded(false)}>
            <i className="fas fa-envelope"></i> Contact
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;