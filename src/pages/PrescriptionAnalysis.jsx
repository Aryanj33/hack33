import React, { useState } from 'react';
import ParticleBackground from '../components/ParticleBackground';
import { analyzePrescription } from '../services/geminiService';
import '../styles/prescription.scss';

const PrescriptionAnalysis = () => {
    const [file, setFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);
  
    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        setFile(selectedFile);
        setAnalysis(null);
        setError(null);
        setProgress(0);
      }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
          setError("Please select a prescription file");
          return;
        }
    
        setIsLoading(true);
        setError(null);
        setProgress(10); // Started
        
        try {
          const result = await analyzePrescription(file);
          setProgress(100);
          
          if (result.summary.includes('Error') || result.summary.includes('fail')) {
            throw new Error(result.summary);
          }
          
          setAnalysis(result);
        } catch (err) {
          setError(err.message);
          setProgress(0);
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
        <div className="upload-form">
        <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          disabled={isLoading}
        />
        {isLoading && (
          <div className="progress-bar">
            <div style={{ width: `${progress}%` }}></div>
          </div>
        )}
        <center>
        <button type="submit" disabled={!file || isLoading}>
          {isLoading ? "Analyzing..." : "Analyze Prescription"}
        </button>
        </center>
      </form>
      </div>
        
        {analysis && (
          <div className="analysis-result">
            <h3>Analysis Results</h3>
            <div className="summary">
              <h4>Summary</h4>
              {analysis.summary}
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
            <div className="uses">
              <h4>Uses of the medicine(s)</h4>
              <ul>
                {analysis.uses.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="side-effects">
              <h4>Possible sideeffects</h4>
              <ul>
                {analysis.sideEffects.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="adverse-reactions">
              <h4>Adverse Reactions</h4>
              <ul>
                {analysis.adverseReactions.map((item, index) => (
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