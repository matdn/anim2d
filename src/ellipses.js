import * as dat from 'dat.gui';
import './style.css';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Configuration
const config = {
  count: 6,
  speed: 0.01,
  baseRadius: 50,
  deformation: 30,
  strokeWidth: 1
};

// Setup GUI
const gui = new dat.GUI();
gui.add(config, 'count', 1, 20, 1).name('Nombre d\'ellipses');
gui.add(config, 'speed', 0.001, 0.1).name('Vitesse');
gui.add(config, 'baseRadius', 0, 150).name('Rayon de base');
gui.add(config, 'deformation', 0, 100).name('Déformation');
gui.add(config, 'strokeWidth', 1, 10).name('Épaisseur trait');

// Resize canvas
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Animation
let time = 0;

function animate() {
  ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  for (let i = 0; i < config.count; i++) {
    const angle = (i / config.count) * Math.PI * 2 + time;
    const x = centerX + Math.cos(angle) * 100;
    const y = centerY + Math.sin(angle) * 100;

    const radiusX = config.baseRadius + Math.sin(time * 2 + i) * config.deformation;
    const radiusY = config.baseRadius + Math.cos(time * 3 + i) * config.deformation;

    const minRadius = 0.1;
    const safeRadiusX = Math.max(minRadius, radiusX);
    const safeRadiusY = Math.max(minRadius, radiusY);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(time + i);
    
    ctx.beginPath();
    ctx.ellipse(0, 0, safeRadiusX, safeRadiusY, 0, 0, Math.PI * 2);

    
    ctx.strokeStyle = `hsl(0%, 0%, 0%)`;
    ctx.lineWidth = config.strokeWidth;
    ctx.stroke();
    
    ctx.restore();
  }

  time += config.speed;
  requestAnimationFrame(animate);
}

animate();
