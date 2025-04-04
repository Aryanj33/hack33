import * as THREE from 'three';

export const setupScene = (container) => {
  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0f172a);

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Lights
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  return { scene, camera, renderer };
};

export const loadModel = (scene, modelPath, onLoad, onProgress, onError) => {
  const loader = new THREE.GLTFLoader();
  loader.load(
    modelPath,
    (gltf) => {
      const model = gltf.scene;
      
      // Center the model
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
      
      scene.add(model);
      if (onLoad) onLoad(model);
    },
    onProgress,
    onError
  );
};

export const setupControls = (camera, rendererDomElement) => {
  const controls = new THREE.OrbitControls(camera, rendererDomElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  return controls;
};