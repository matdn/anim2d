import * as dat from 'dat.gui';
import './style.css';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Configuration
const config = {
  rows: 4,
  cols: 4,
  a: 3,
  b: 2,
  delta: Math.PI / 2,
  speed: 0.02,
  showPoints: true,
  pointSize: 4,
  lineWidth: 2,
  colorHue: 200,
  animate: true
};

// Setup GUI
const gui = new dat.GUI();
gui.add(config, 'rows', 2, 8, 1).name('Lignes');
gui.add(config, 'cols', 2, 8, 1).name('Colonnes');
gui.add(config, 'a', 1, 10, 1).name('Fréquence A');
gui.add(config, 'b', 1, 10, 1).name('Fréquence B');
gui.add(config, 'delta', 0, Math.PI * 2).name('Phase');
gui.add(config, 'speed', 0.001, 0.1).name('Vitesse');
gui.add(config, 'showPoints').name('Afficher points');
gui.add(config, 'pointSize', 0, 10).name('Taille points');
gui.add(config, 'lineWidth', 0.5, 5).name('Épaisseur ligne');
gui.add(config, 'colorHue', 0, 360).name('Teinte');
gui.add(config, 'animate').name('Animer');

// Resize canvas
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

let time = 0;

function drawLissajous(x, y, size, a, b, delta, phase = 0) {
  const segments = 200;
  const points = [];
  
  // Calculate all points
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    const px = x + Math.sin(a * t + phase) * size / 2;
    const py = y + Math.sin(b * t + delta + phase) * size / 2;
    points.push({ x: px, y: py });
  }
  
  // Draw curve
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.strokeStyle = `hsl(${config.colorHue}, 70%, 60%)`;
  ctx.lineWidth = config.lineWidth;
  ctx.stroke();
  
  // Draw points at nodes
  if (config.showPoints) {
    ctx.fillStyle = '#ff4444';
    
    // Calculate number of nodes
    const numNodes = Math.max(a, b) * 2;
    for (let i = 0; i < numNodes; i++) {
      const nodeIndex = Math.floor((i / numNodes) * points.length);
      if (nodeIndex < points.length) {
        const p = points[nodeIndex];
        ctx.beginPath();
        ctx.arc(p.x, p.y, config.pointSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function animate() {
  // Clear canvas completely (no blur effect)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const margin = 80;
  const availableWidth = canvas.width - margin * 2;
  const availableHeight = canvas.height - margin * 2;
  
  const cellWidth = availableWidth / config.cols;
  const cellHeight = availableHeight / config.rows;
  const size = Math.min(cellWidth, cellHeight) * 0.8;
  
  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.cols; col++) {
      const a = col + 1;
      const b = row + 1;
      
      const x = margin + cellWidth * (col + 0.5);
      const y = margin + cellHeight * (row + 0.5);
      
      const phase = config.animate ? time : 0;
      drawLissajous(x, y, size, a, b, config.delta, phase);
    }
  }
  
  if (config.animate) {
    time += config.speed;
  }
  
  requestAnimationFrame(animate);
}

animate();
