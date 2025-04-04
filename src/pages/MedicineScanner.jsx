import React, { useState, useRef } from 'react';
import ParticleBackground from '../components/ParticleBackground';
import { analyzeMedicineImage } from '../services/medicineService'; // Correct import
import '../styles/medicine.scss';
import { Chatbot } from '../components/ChatBot';

const MedicineScanner = () => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [medicineInfo, setMedicineInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImage(URL.createObjectURL(file));
    setCameraActive(false);
    setMedicineInfo(null);
    setError(null);
  };

  const startCamera = async () => {
    setImage(null);
    setImageFile(null);
    setMedicineInfo(null);
    setError(null);
    setCameraActive(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
      setImageFile(file);
      const imageUrl = URL.createObjectURL(blob);
      setImage(imageUrl);
      stopCamera();
    }, 'image/jpeg', 0.95);
  };

  const analyzeMedicine = async () => {
    if (!imageFile) {
      setError("Please select or capture an image first");
      return;
    }

    setIsLoading(true);
    setError(null);
    setMedicineInfo(null);

    try {
      const result = await analyzeMedicineImage(imageFile);
      
      if (result.error || !result.summary) {
        throw new Error(result.message || "Invalid medicine data received");
      }
      
      setMedicineInfo(result);
    } catch (err) {
      setError(err.message || "Failed to analyze the medicine. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="medicine-container">
      <ParticleBackground />
      <div className="content">
        <h2>Medicine Scanner</h2>
        <p>Show the back of your medicine to the camera or upload an image</p>

        {error && <div className="error-message">{error}</div>}

        <div className="scanner-options">
          {!cameraActive ? (
            <button onClick={startCamera}>Use Camera</button>
          ) : (
            <>
              <button onClick={captureImage}>Capture Image</button>
              <button onClick={stopCamera}>Cancel</button>
            </>
          )}
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            id="medicine-upload"
          />
          <button onClick={triggerFileInput} className="upload-btn">
            Upload Image
          </button>
        </div>

        <div className="preview-section">
          {cameraActive && (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="camera-feed"
              muted
            />
          )}
          {image && !cameraActive && (
            <div className="image-preview">
              <img src={image} alt="Medicine preview" />
              <button 
                onClick={analyzeMedicine} 
                disabled={isLoading}
                className="analyze-btn"
              >
                {isLoading ? 'Analyzing...' : 'Analyze Medicine'}
              </button>
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        {medicineInfo && (
          <div className="medicine-info">
            <h3>{medicineInfo.summary}</h3>
            <div className="info-grid">
              <div>
                <h4>Uses</h4>
                <ul>
                  {medicineInfo.uses.map((use, index) => (
                    <li key={index}>{use}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Side Effects</h4>
                <ul>
                  {medicineInfo.sideEffects.map((effect, index) => (
                    <li key={index}>{effect}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Precautions</h4>
                <ul>
                  {medicineInfo.precautions.map((precaution, index) => (
                    <li key={index}>{precaution}</li>
                  ))}
                </ul>
              </div>
              {medicineInfo.dietRecommendations && medicineInfo.dietRecommendations.length > 0 && (
                <div>
                  <h4>Diet Recommendations</h4>
                  <ul>
                    {medicineInfo.dietRecommendations.map((recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
                </div>
              )}
              {medicineInfo.adverseReactions && medicineInfo.adverseReactions.length > 0 && (
                <div>
                  <h4>Adverse Reactions</h4>
                  <ul>
                    {medicineInfo.adverseReactions.map((reaction, index) => (
                      <li key={index}>{reaction}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
            <Chatbot />
    </div>
  );
};

export default MedicineScanner;