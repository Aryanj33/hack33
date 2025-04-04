import React from 'react';
import ParticleBackground from '../components/ParticleBackground';
import '../styles/about.scss';

const About = () => {
  return (
    <div className="about-container">
      <ParticleBackground />
      <div className="content">
        <h2>About Mediverse</h2>
        <div className="about-section">
          <h3>Our Mission</h3>
          <p>
            Mediverse aims to bridge the gap between patients and medical information through 
            intuitive technology. We provide tools to help you understand your prescriptions, 
            learn about human anatomy, and get detailed medicine information.
          </p>
        </div>
        <div className="about-section">
          <h3>Our Technology</h3>
          <p>
            Using advanced AI and 3D visualization, Mediverse transforms complex medical 
            information into easy-to-understand formats. Our prescription analyzer uses 
            Gemini AI, while our organ models leverage Three.js for realistic interactions.
          </p>
        </div>
        <div className="team-section">
          <h3>The Team</h3>
          <div className="team-members">
            <div className="member-card">
              <div className="member-avatar"></div>
              <h4>Dr. Sarah Johnson</h4>
              <p>Medical Director</p>
            </div>
            <div className="member-card">
              <div className="member-avatar"></div>
              <h4>Alex Chen</h4>
              <p>Lead Developer</p>
            </div>
            <div className="member-card">
              <div className="member-avatar"></div>
              <h4>Maria Garcia</h4>
              <p>UI/UX Designer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;