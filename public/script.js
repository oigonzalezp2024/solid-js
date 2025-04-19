import * as THREE from 'three';

// =======================
// Configuración inicial
// =======================

let angle = 0;
let speed = 0.01;
const baseSpeed = 0.01;
const maxSpeed = 0.07;
const speedDecay = 0.0005;
let lastMouseX = null;
let lastMouseMoveTime = Date.now();

let scene, camera, renderer, tren;

// =======================
// Funciones de creación
// =======================

function crearEscena() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaee2ff);
}

function crearCamara() {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 8, 20);
}

function crearRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function crearIluminacion() {
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);
}

function crearOficina() {
  const oficina = new THREE.Group();

  const paredes = new THREE.Mesh(
    new THREE.BoxGeometry(10, 5, 10),
    new THREE.MeshLambertMaterial({ color: 0xffffff })
  );
  paredes.position.y = 2.5;

  const techo = new THREE.Mesh(
    new THREE.BoxGeometry(10.2, 0.5, 10.2),
    new THREE.MeshLambertMaterial({ color: 0xff0000 })
  );
  techo.position.y = 5.25;

  oficina.add(paredes);
  oficina.add(techo);
  scene.add(oficina);
}

function crearTren() {
  tren = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 2),
    new THREE.MeshLambertMaterial({ color: 0x3333ff })
  );
  tren.position.set(8, 0.5, 0);
  scene.add(tren);
}

function manejarMouse() {
  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (lastMouseX !== null) {
      const deltaX = e.clientX - lastMouseX;
      const deltaTime = now - lastMouseMoveTime;

      if (deltaTime < 50) {
        const acceleration = deltaX * 0.0005;
        speed += acceleration;
        speed = Math.max(baseSpeed, Math.min(maxSpeed, speed));
      }
    }
    lastMouseX = e.clientX;
    lastMouseMoveTime = Date.now();
  });
}

function loopAnimacion() {
  requestAnimationFrame(loopAnimacion);

  const tiempoSinMovimiento = Date.now() - lastMouseMoveTime;
  if (tiempoSinMovimiento > 100 && speed > baseSpeed) {
    speed -= speedDecay;
    if (speed < baseSpeed) speed = baseSpeed;
  }

  angle -= speed;
  tren.position.x = Math.cos(angle) * 8;
  tren.position.z = Math.sin(angle) * 8;
  tren.rotation.y = -angle + Math.PI / 2;

  renderer.render(scene, camera);
}

// =======================
// Inicialización
// =======================

function inicializar() {
  crearEscena();
  crearCamara();
  crearRenderer();
  crearIluminacion();
  crearOficina();
  crearTren();
  manejarMouse();
  loopAnimacion();
}

inicializar();

// Ajuste de pantalla
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
