import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import ParticleBackground from '../components/ParticleBackground';
import '../styles/organs.scss';

const OrganModels = () => {
  const mountRef = useRef(null);
  const [selectedOrgan, setSelectedOrgan] = useState('heart');
  
  const organs = [
    { id: 'heart', name: 'Heart' },
    { id: 'brain', name: 'Brain' },
    { id: 'lungs', name: 'Lungs' },
    { id: 'liver', name: 'Liver' },
    { id: 'kidney', name: 'Kidney' },
  ];

  useEffect(() => {
    // Set up Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    let model;
    const loader = new GLTFLoader();
    
    const loadModel = (organ) => {
      if (model) scene.remove(model);
      
      loader.load(
        `/assets/models/${organ}.glb`,
        (gltf) => {
          model = gltf.scene;
          scene.add(model);
          
          // Center the model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);
        },
        undefined,
        (error) => {
          console.error('Error loading model:', error);
        }
      );
    };
    
    loadModel(selectedOrgan);
    
    const handleResize = () => {
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [selectedOrgan]);
  
  return (
    <div className="organs-container">
      <ParticleBackground />
      <div className="content">
        <h2>Interactive 3D Organ Models</h2>
        <p>Explore and interact with detailed 3D models of human organs</p>
        
        <div className="organ-selector">
          {organs.map(organ => (
            <button 
              key={organ.id}
              onClick={() => setSelectedOrgan(organ.id)}
              className={selectedOrgan === organ.id ? 'active' : ''}
            >
              {organ.name}
            </button>
          ))}
        </div>
        
        <div className="model-container" ref={mountRef} />
        
        <div className="organ-info">
          <h3>{organs.find(o => o.id === selectedOrgan).name} Information</h3>
          <p>Detailed information about the selected organ will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default OrganModels;