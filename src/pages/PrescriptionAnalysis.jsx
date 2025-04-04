import React, { useState } from 'react';
import ParticleBackground from '../components/ParticleBackground';
import { analyzePrescription } from '../services/geminiService';
import '../styles/prescription.scss';

const PrescriptionAnalysis = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('prescription', file);
      
      const result = await analyzePrescription(formData);
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing prescription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="prescription-container">
      <ParticleBackground />
      <div className="content">
        <h2>Prescription Analysis</h2>
        <p>Upload your prescription (handwritten or typed) for detailed analysis</p>
        
        <form onSubmit={handleSubmit} className="upload-form">
          <input 
            type="file" 
            accept="image/*,.pdf" 
            onChange={handleFileChange} 
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Analyze Prescription'}
          </button>
        </form>
        
        {analysis && (
          <div className="analysis-result">
            <h3>Analysis Results</h3>
            <div className="summary">
              <h4>Summary</h4>
              <p>{analysis.summary}</p>
            </div>
            <div className="precautions">
              <h4>Precautions</h4>
              <ul>
                {analysis.precautions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="diet">
              <h4>Recommended Diet</h4>
              <ul>
                {analysis.dietRecommendations.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionAnalysis;