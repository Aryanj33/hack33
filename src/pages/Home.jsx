import React from 'react';
import ParticleBackground from '../components/ParticleBackground';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/home.scss';
import Testimonials from './Testimonials';
import { Chatbot } from '../components/ChatBot';


const Home = () => {
  return (
    <div className="home-container">
      <ParticleBackground />
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>Your Personal <span>Healthcare</span> Companion</h1>
            <p>Empowering patients with AI-driven medical insights and interactive tools</p>
            <div className="hero-buttons">
              <a href="#features" className="btn-primary">Explore Features</a>
              <a href="#about" className="btn-secondary">Learn More</a>
            </div>
          </div>
          <div className="hero-image">
          {/* <img src={process.env.PUBLIC_URL + '/assets/images/hero-medical.png'} alt="Medical Hero" /> */}

          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section">
          <h2>Our Services</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-prescription"></i>
              </div>
              <h3>Prescription Analysis</h3>
              <p>Upload your prescriptions and get detailed explanations and recommendations</p>
              <a href="/prescription" className="feature-link">Try Now →</a>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-lungs"></i>
              </div>
              <h3>3D Organ Models</h3>
              <p>Explore interactive 3D models of human anatomy for better understanding</p>
              <a href="/organs" className="feature-link">Explore →</a>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-pills"></i>
              </div>
              <h3>Medicine Scanner</h3>
              <p>Scan medicine packaging to get detailed information about your medications</p>
              <a href="/medicine" className="feature-link">Scan Now →</a>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about-section">
          <div className="about-content">
            <h2>About Mediverse</h2>
            <p>
              Mediverse is revolutionizing healthcare education by combining AI technology with 
              intuitive interfaces to make medical information accessible to everyone.
            </p>
            <p>
              Our mission is to bridge the gap between complex medical data and patient 
              understanding, empowering individuals to take control of their health journey.
            </p>
            <div className="stats-grid">
              <div className="stat-item">
                <h3>10,000+</h3>
                <p>Prescriptions Analyzed</p>
              </div>
              <div className="stat-item">
                <h3>50+</h3>
                <p>3D Organ Models</p>
              </div>
              <div className="stat-item">
                <h3>5,000+</h3>
                <p>Medicines in Database</p>
              </div>
            </div>
          </div>
          <div className="about-image">
            <img src="/assets/images/about-medical.png" alt="About Mediverse" />
          </div>
        </section>
<Testimonials />
        {/* Testimonials Section */}
        {/* Contact Section */}
        <section id="contact" className="contact-section">
          <h2>Get In Touch</h2>
          <div className="contact-container">
            <div className="contact-info">
              <h3>Contact Information</h3>
              <p><i className="fas fa-envelope"></i> contact@mediverse.com</p>
              <p><i className="fas fa-phone"></i> +1 (123) 456-7890</p>
              <p><i className="fas fa-map-marker-alt"></i> 123 Healthcare Blvd, San Francisco, CA</p>
              
              <div className="social-links">
                <a href="#"><i className="fab fa-facebook"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
            <form className="contact-form">
              <div className="form-group">
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Your Email" required />
              </div>
              <div className="form-group">
                <textarea placeholder="Your Message" rows="5" required></textarea>
              </div>
              <button type="submit" className="btn-primary">Send Message</button>
            </form>
          </div>
        </section>
      </main>
      <Chatbot />
      <Footer />
    </div>
  );
};

export default Home;