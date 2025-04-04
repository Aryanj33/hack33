import React from 'react';
import '../styles/main.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Mediverse</h3>
          <p>Your comprehensive healthcare companion</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/prescription">Prescription Analysis</a></li>
            <li><a href="/organs">3D Organ Models</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: contact@mediverse.com</p>
          <p>Phone: +1 (123) 456-7890</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Mediverse. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;