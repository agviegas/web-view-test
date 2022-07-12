import {
  Scene,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  PerspectiveCamera,
  WebGLRenderer,
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Matrix4,
  Spherical,
  Box3,
  Sphere,
  Raycaster,
  MathUtils,
  DirectionalLight,
  AmbientLight,
  MOUSE,
  Clock
} from "three";

import CameraControls from 'camera-controls';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import Stats from 'stats.js/src/Stats'

const subsetOfTHREE = {
  MOUSE,
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Matrix4,
  Spherical,
  Box3,
  Sphere,
  Raycaster,
  MathUtils: {
    DEG2RAD: MathUtils.DEG2RAD,
    clamp: MathUtils.clamp
  }
};

const canvas = document.getElementById("three-canvas");

// The scene
const scene = new Scene();

// The Camera

const camera = new PerspectiveCamera(
  75,
  canvas.clientWidth / canvas.clientHeight
);
scene.add(camera);

// The Renderer

const renderer = new WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

window.addEventListener("resize", () => {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
});

// Lights

const light = new DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 0.5);
const baseLight = new AmbientLight(0xffffff, 1);
scene.add(light, baseLight);

// Controls

CameraControls.install( { THREE: subsetOfTHREE } ); 
const clock = new Clock();
const cameraControls = new CameraControls(camera, canvas);

cameraControls.setLookAt(15, 15, 15, 0, 10, 0);

const stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

function animate() {

  stats.begin();

  const delta = clock.getDelta();
	cameraControls.update( delta );
	renderer.render( scene, camera );

  stats.end();

  requestAnimationFrame(animate);
}

animate();

// Load 3D scan
const loader = new GLTFLoader();
loadModels();

async function loadModels() {
  await addModelToScene('./1.gltf');
  await addModelToScene('./2.gltf');
}

async function addModelToScene(url) {
  const result = await loader.loadAsync(url);
  scene.add(result.scene);
}

