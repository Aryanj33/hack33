import React from 'react';
import ParticleBackground from '../components/ParticleBackground';
import '../styles/home.scss';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <ParticleBackground />
      <div className="content">
        <h1>Welcome to <span className="brand">Mediverse</span></h1>
        <p className="tagline">Your comprehensive healthcare companion</p>
        
        <div className="feature-cards">
          <Link to="/prescription" className="card">
            <h3>Prescription Analysis</h3>
            <p>Upload your prescription for detailed insights</p>
          </Link>
          
          <Link to="/organs" className="card">
            <h3>3D Organ Models</h3>
            <p>Explore human anatomy interactively</p>
          </Link>
          
          <Link to="/medicine" className="card">
            <h3>Medicine Scanner</h3>
            <p>Scan medicine strips for information</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;