// THREE.js setup and other code from previous steps (sphere, modal, interactivity)...

let scene, camera, renderer, sphereMesh;
const container = document.getElementById('three-container');

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(40, container.offsetWidth / container.offsetHeight, 0.1, 1000);
camera.position.z = 4; 

renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild(renderer.domElement);

// Sphere geometry
let geometry = new THREE.SphereGeometry(1, 16, 16);
let wireframe = new THREE.WireframeGeometry(geometry);
let lineMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
sphereMesh = new THREE.LineSegments(wireframe, lineMaterial);
scene.add(sphereMesh);

sphereMesh.scale.set(1, 1, 1);

let mouseX = 0;
let mouseY = 0;
let rotationSpeed = 0.01;
let driftSensitivity = 0.1;
let pulsing = false;
let pulseScale = 1;

document.addEventListener('mousemove', (event) => {
  const overlay = document.querySelector('.overlay');
  const rect = overlay.getBoundingClientRect();
  const x = event.clientX - rect.left; 
  const y = event.clientY - rect.top; 

  const normalizedX = (x / rect.width) * 2 - 1;
  const normalizedY = (y / rect.height) * 2 - 1;

  mouseX = normalizedX;
  mouseY = -normalizedY;
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'c' || e.key === 'C') {
    const hues = [0xFFFFFF];
    const randomColor = hues[Math.floor(Math.random() * hues.length)];
    sphereMesh.material.color.setHex(randomColor);
  }

  if (e.key === 'ArrowLeft') {
    rotationSpeed = Math.max(rotationSpeed - 0.005, 0);
  }
  if (e.key === 'ArrowRight') {
    rotationSpeed += 0.005;
  }
  if (e.key === 'ArrowUp') {
    driftSensitivity = Math.min(driftSensitivity + 0.01, 0.5);
  }
  if (e.key === 'ArrowDown') {
    driftSensitivity = Math.max(driftSensitivity - 0.01, 0.01);
  }
});

container.addEventListener('click', () => {
  pulsing = !pulsing;
});

function animate() {
  requestAnimationFrame(animate);

  sphereMesh.rotation.y += rotationSpeed;
  sphereMesh.rotation.x += rotationSpeed * 0.5;

  const targetX = driftSensitivity * mouseX;
  const targetY = driftSensitivity * mouseY;
  sphereMesh.position.x += (targetX - sphereMesh.position.x) * 0.05;
  sphereMesh.position.y += (targetY - sphereMesh.position.y) * 0.05;

  if (pulsing) {
    pulseScale = 1 + Math.sin(Date.now() * 0.005) * 0.05;
    sphereMesh.scale.set(pulseScale, pulseScale, pulseScale);
  } else {
    sphereMesh.scale.set(1, 1, 1);
  }

  renderer.render(scene, camera);
}
animate();

// Modal interactivity
const infoBtn = document.getElementById('infoBtn');
const modal = document.getElementById('infoModal');
const closeBtn = document.querySelector('.modal .close');

infoBtn.addEventListener('click', () => {
  modal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = container.offsetWidth / container.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.offsetWidth, container.offsetHeight);
});

// Loading overlay fade out after page load
window.onload = () => {
  const loadingOverlay = document.getElementById('loadingOverlay');
  loadingOverlay.classList.add('fade-out');
  setTimeout(() => {
    loadingOverlay.remove();
  }, 1000); // matches the transition duration
};
