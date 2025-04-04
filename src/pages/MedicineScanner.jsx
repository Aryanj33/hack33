import React, { useState, useRef } from 'react';
import ParticleBackground from '../components/ParticleBackground';
import { analyzePrescription } from '../services/geminiService';
import '../styles/medicine.scss';

const MedicineScanner = () => {
  const [image, setImage] = useState(null);
  const [medicineInfo, setMedicineInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
    setCameraActive(false);
  };

  const startCamera = async () => {
    setImage(null);
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      const imageUrl = URL.createObjectURL(blob);
      setImage(imageUrl);
      stopCamera();
    }, 'image/jpeg', 0.95);
  };

  const analyzeMedicine = async () => {
    setIsLoading(true);
    setError(null);
    setProgress(10); // Started
    
    try {
        const result = await analyzePrescription(image);
        setProgress(100);
        
        if (result.summary.includes('Error') || result.summary.includes('fail')) {
        throw new Error(result.summary);
        }
        
        setMedicineInfo(result);
    } catch (err) {
        setError(err.message);
        setProgress(0);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="medicine-container">
      <ParticleBackground />
      <div className="content">
        <h2>Medicine Scanner</h2>
        <p>Show the back of your medicine to the camera or upload an image</p>

        <div className="scanner-options">
          {!cameraActive ? (
            <button onClick={startCamera}>Use Camera</button>
          ) : (
            <button onClick={captureImage}>Capture Image</button>
          )}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            id="medicine-upload"
          />
          <label htmlFor="medicine-upload" className="upload-btn">
            Upload Image
          </label>
        </div>

        <div className="preview-section">
          {cameraActive && (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="camera-feed"
            />
          )}
          {image && (
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
                <h4>Salts/Active Ingredients</h4>
                <p>{medicineInfo.salts}</p>
              </div>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineScanner;
