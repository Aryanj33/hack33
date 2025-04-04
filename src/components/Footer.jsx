import React from 'react';
import '../styles/footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Mediverse</h3>
          <p>Your comprehensive healthcare companion</p>
          <div className="footer-social">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/prescription">Prescription Analysis</a></li>
            <li><a href="/organs">3D Organ Models</a></li>
            <li><a href="/medicine">Medicine Scanner</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Services</h4>
          <ul>
            <li><a href="/prescription">Prescription Analysis</a></li>
            <li><a href="/organs">3D Anatomy Models</a></li>
            <li><a href="/medicine">Medicine Information</a></li>
            <li><a href="#">Health Education</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <ul>
            <li><i className="fas fa-map-marker-alt"></i> 123 Healthcare Blvd, San Francisco, CA</li>
            <li><i className="fas fa-phone"></i> +1 (123) 456-7890</li>
            <li><i className="fas fa-envelope"></i> contact@mediverse.com</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Mediverse. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;