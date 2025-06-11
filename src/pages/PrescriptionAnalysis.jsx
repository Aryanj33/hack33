import React, { useState } from 'react';
import ParticleBackground from '../components/ParticleBackground';
import { analyzePrescription } from '../services/geminiService';
import '../styles/prescription.scss';
import { Chatbot } from '../components/Chatbot';

// Utility function to safely render list items
const SafeList = ({ items, title }) => {
    // Ensure items is an array and has content
    const safeItems = Array.isArray(items) ? items : [];
    if (safeItems.length === 0) return null;
  
    return (
      <div className={title.toLowerCase().replace(/\s+/g, '-')}>
        <h4>{title}</h4>
        <ul>
          {safeItems.map((item, index) => {
            // Ensure item is a string and not empty
            const safeItem = typeof item === 'string' ? item.trim() : '';
            return safeItem ? <li key={index}>{safeItem}</li> : null;
          })}
        </ul>
      </div>
    );
  };
const PrescriptionAnalysis = () => {
    const [file, setFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);
    
    // New state for user details
    const [userDetails, setUserDetails] = useState({
        age: '',
        gender: '',
        allergies: '',
        existingMedicalIssues: '',
        currentMedicalIssues: ''
    });

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setAnalysis(null);
            setError(null);
            setProgress(0);
        }
    };

    const handleUserDetailsChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
          setError("Please select a prescription file");
          return;
        }
      
        // Validate user details
        const requiredFields = ['age', 'gender'];
        const missingFields = requiredFields.filter(field => !userDetails[field]);
        
        if (missingFields.length > 0) {
          setError(`Please fill in: ${missingFields.join(', ')}`);
          return;
        }
      
        setIsLoading(true);
        setError(null);
        setProgress(10);
        
        try {
            const result = await analyzePrescription(file, userDetails);
            setProgress(100);
            
            if (result.error) {
              throw new Error(result.summary);
            }
            
            if (result.needsReview) {
              setAnalysis({
                summary: result.summary,
                needsReview: true,
                rawResponses: result.rawResponses
              });
            } else {
              // Here's the key change - spread result instead of result.result
              setAnalysis({
                ...result,  // Changed from ...result.result
                confidence: result.confidence
              });
            }
          
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
                <p>Upload your prescription (handwritten or typed) for detailed analysis
                    <br/>
          (Because of free render deployement repsonse might sometimes take longer than expected to fetch)
                </p>
                
                {/* User Details Form */}
                <div className="user-details-form">
                    <h3>Patient Information</h3>
                    <form>
                        <div className="form-group">
                            <label>
                                Age*:
                                <input 
                                    type="number" 
                                    name="age"
                                    value={userDetails.age}
                                    onChange={handleUserDetailsChange}
                                    required
                                    min="0"
                                    max="120"
                                />
                            </label>
                        </div>
                        
                        <div className="form-group">
                            <label>
                                Gender*:
                                <select 
                                    name="gender"
                                    value={userDetails.gender}
                                    onChange={handleUserDetailsChange}
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer-not-to-say">Prefer Not to Say</option>
                                </select>
                            </label>
                        </div>
                        
                        <div className="form-group">
                            <label>
                                Allergies:
                                <textarea 
                                    name="allergies"
                                    value={userDetails.allergies}
                                    onChange={handleUserDetailsChange}
                                    placeholder="List any known allergies"
                                />
                            </label>
                        </div>
                        
                        <div className="form-group">
                            <label>
                                Existing Medical Issues:
                                <textarea 
                                    name="existingMedicalIssues"
                                    value={userDetails.existingMedicalIssues}
                                    onChange={handleUserDetailsChange}
                                    placeholder="List any existing medical conditions"
                                />
                            </label>
                        </div>
                        
                        <div className="form-group">
                            <label>
                                Current Medical Issues:
                                <textarea 
                                    name="currentMedicalIssues"
                                    value={userDetails.currentMedicalIssues}
                                    onChange={handleUserDetailsChange}
                                    placeholder="Describe current medical concerns"
                                />
                            </label>
                        </div>
                    </form>
                </div>

                {/* Prescription Upload Form */}
                <div className="upload-form">
                <form onSubmit={handleSubmit}>
                    <div className="file-input-wrapper">
                    <input
                        type="file"
                        id="prescription-upload"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        disabled={isLoading}
                    />
                    <label htmlFor="prescription-upload" className="file-input-label">
                        <div className="upload-icon">
                        {/* Properly formatted JSX for SVG */}
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        </div>
                        <div className="upload-text">
                        {file ? 'File selected' : 'Click to upload prescription'}
                        </div>
                        {file && (
                        <div className="file-name">
                            {file.name}
                        </div>
                        )}
                        <div className="supported-formats">
                        Supports: JPG, PNG, PDF
                        </div>
                    </label>
                    </div>
                    
                    {isLoading && (
                    <div className="progress-bar">
                        <div style={{ width: `${progress}%` }}></div>
                    </div>
                    )}
                    
                    <button type="submit" disabled={!file || isLoading}>
                    {isLoading ? (
                        <>
                        <span className="spinner"></span>
                        Analyzing...
                        </>
                    ) : (
                        'Analyze Prescription'
                    )}
                    </button>
                </form>
                </div>
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {analysis && (
                <div className="analysis-result">
                    <h3>Analysis Results</h3>
                    
                    {analysis.needsReview ? (
                    <div className="review-notice">
                        <h4>⚠️ Expert Review Recommended</h4>
                        <p>{analysis.summary}</p>
                        <button onClick={() => setShowRawResponses(!showRawResponses)}>
                        {showRawResponses ? 'Hide' : 'Show'} Raw Responses
                        </button>
                        
                        {showRawResponses && (
                        <div className="raw-responses">
                            {analysis.rawResponses?.map((response, i) => (
                            <div key={i}>
                                <h5>Response {i+1}</h5>
                                <pre>{JSON.stringify(response, null, 2)}</pre>
                            </div>
                            ))}
                        </div>
                        )}
                    </div>
                    ) : (
                    <>
                        <div className="confidence-badge">
                        Confidence: {Math.round(analysis.confidence * 100)}%
                        </div>
                        
                        <div className="summary">
                        <h4>Summary</h4>
                        <ul>
                        <li><p>{analysis.summary}</p></li>
                        </ul>
                        </div>

                        <SafeList items={analysis.uses} title="Uses" />
                        <SafeList items={analysis.sideEffects} title="Side Effects" />
                        <SafeList items={analysis.precautions} title="Precautions" />
                        <SafeList items={analysis.dietRecommendations} title="Diet" />
                        <SafeList items={analysis.adverseReactions} title="Adverse Reactions" />
                    </>
                    )}
                </div>
                )}
            </div>
            <Chatbot />
        </div>
    );
};

export default PrescriptionAnalysis;