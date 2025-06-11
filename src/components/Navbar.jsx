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
          <Link to="/medicine" onClick={() => setIsExpanded(false)}>
            <i className="fas fa-pills"></i> Medicine Scanner
          </Link>
          <Link to="/symptoms" onClick={() => setIsExpanded(false)}>
            <i className="fas fa-stethoscope"></i> Symptoms Analyser
          </Link>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;