import * as dat from 'dat.gui';
import './style.css';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Configuration
const config = {
  count: 10,
  speed: 0.03,
  minSize: 20,
  maxSize: 80,
  rotation: true,
  rotationSpeed: 0.01,
  strokeWidth: 2
};

// Setup GUI
const gui = new dat.GUI();
gui.add(config, 'count', 1, 30, 1).name('Nombre de rectangles');
gui.add(config, 'speed', 0.001, 0.1).name('Vitesse');
gui.add(config, 'minSize', 10, 50).name('Taille min');
gui.add(config, 'maxSize', 50, 200).name('Taille max');
gui.add(config, 'rotation').name('Rotation');
gui.add(config, 'rotationSpeed', 0.001, 0.05).name('Vitesse rotation');
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
  ctx.fillStyle = 'rgba(255, 255, 255, 1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  for (let i = 0; i < config.count; i++) {
    const angle = (i / config.count) * Math.PI * 2;
    const radius = 150 + Math.sin(time + i * 0.5) * 50;
    const x = centerX + Math.cos(angle + time * 0.5) * radius;
    const y = centerY + Math.sin(angle + time * 0.5) * radius;

    const size = config.minSize + Math.sin(time * 2 + i) * (config.maxSize - config.minSize) / 2 + (config.maxSize - config.minSize) / 2;

    ctx.save();
    ctx.translate(x, y);
    
    if (config.rotation) {
      ctx.rotate(time * config.rotationSpeed * (i % 2 === 0 ? 1 : -1) + i);
    }
    
    ctx.strokeStyle = `hsl(0%, 0%, 0%)`;
    ctx.lineWidth = config.strokeWidth;
    ctx.strokeRect(-size / 2, -size / 2, size, size);
    
    
    ctx.restore();
  }

  time += config.speed;
  requestAnimationFrame(animate);
}

animate();
