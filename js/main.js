import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/* =========================
   DEVICE CHECK
========================= */

const hintEl = document.getElementById('hintText');

const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

if (hintEl) {
  hintEl.innerHTML = isMobile
    ? 'Tap the button to play animation'
    : 'Press <b>D</b> to play animation';
}

/* =========================
   BASIC SETUP
========================= */

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x141414);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 2.2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, isMobile ? 1.25 : 2)
);
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;

document.body.appendChild(renderer.domElement);

/* =========================
   ENVIRONMENT
========================= */

const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator
  .fromScene(new RoomEnvironment(), 0.04)
  .texture;

/* =========================
   LIGHTING
========================= */

scene.add(new THREE.HemisphereLight(0xffffff, 0x222222, 0.5));

const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
keyLight.position.set(4, 6, 4);
keyLight.castShadow = true;
scene.add(keyLight);

scene.add(new THREE.DirectionalLight(0xffffff, 0.6).position.set(-4, 3, 2));
scene.add(new THREE.DirectionalLight(0xffffff, 0.8).position.set(0, 5, -5));

/* =========================
   FLOOR
========================= */

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(6, 32),
  new THREE.MeshStandardMaterial({
    color: 0x2a2a2a,
    roughness: 0.8,
    metalness: 0.1
  })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

/* =========================
   CONTROLS
========================= */

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1.1, 0);

if (isMobile) {
  controls.enablePan = false;
  controls.rotateSpeed = 0.6;
}

/* =========================
   MODEL & ANIMATIONS
========================= */

const clock = new THREE.Clock();
const loader = new GLTFLoader();

let mixer;
const actions = {};
let activeAction = null;
let isPlaying = false;

loader.load(
  'assets/character.glb',
  (gltf) => {
    const model = gltf.scene;

    if (isMobile) {
      model.scale.set(0.85, 0.85, 0.85);
    }

    scene.add(model);

    mixer = new THREE.AnimationMixer(model);

    gltf.animations.forEach((clip) => {
      actions[clip.name.toLowerCase()] = mixer.clipAction(clip);
    });

    playAction('idle', 0.3);
  },
  undefined,
  (error) => {
    console.error('GLB load error:', error);
  }
);

/* =========================
   ANIMATION CONTROL
========================= */

function playAction(name, fade = 0.4) {
  const action = actions[name];
  if (!action || action === activeAction) return;

  if (activeAction) activeAction.fadeOut(fade);

  activeAction = action;
  activeAction.reset().fadeIn(fade).play();
}

/* =========================
   DESKTOP INPUT
========================= */

window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyD') triggerDance();
});

/* =========================
   MOBILE BUTTON
========================= */

const playBtn = document.getElementById('playAnim');
if (playBtn) {
  playBtn.addEventListener('click', triggerDance);
}

function triggerDance() {
  if (!isPlaying && actions['dance']) {
    isPlaying = true;

    const dance = actions['dance'];
    playAction('dance', 0.5);

    dance.setLoop(THREE.LoopOnce, 1);
    dance.clampWhenFinished = true;

    setTimeout(() => {
      playAction('idle', 0.4);
      isPlaying = false;
    }, dance.getClip().duration * 1000);
  }
}

/* =========================
   RENDER LOOP
========================= */

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  controls.update();
  renderer.render(scene, camera);
}

animate();

/* =========================
   RESIZE
========================= */

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

