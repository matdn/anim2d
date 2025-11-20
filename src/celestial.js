import * as dat from 'dat.gui';
import './style.css';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Configuration
const config = {
  rotationX: 0.3,
  rotationY: 0.5,
  rotationZ: 0,
  lockX: false,
  lockY: false,
  autoRotate: true,
  rotationSpeed: 0.002,
  showLatitude: true,
  showLongitude: true,
  radius: 250,
  lineWidth: 1.5
};

// Setup GUI
const gui = new dat.GUI();
gui.add(config, 'autoRotate').name('Rotation auto');
gui.add(config, 'rotationSpeed', 0.001, 0.01).name('Vitesse rotation');
gui.add(config, 'rotationX', 0, Math.PI * 2).name('Rotation X').listen();
gui.add(config, 'rotationY', 0, Math.PI * 2).name('Rotation Y').listen();
gui.add(config, 'rotationZ', 0, Math.PI * 2).name('Rotation Z').listen();
gui.add(config, 'lockX').name('Verrouiller X')
gui.add(config, 'lockY').name('Verrouiller Y')
gui.add(config, 'showLatitude').name('Latitude');
gui.add(config, 'showLongitude').name('Longitude');
gui.add(config, 'radius', 100, 400).name('Rayon');
gui.add(config, 'lineWidth', 0.5, 5).name('Épaisseur ligne');

// Resize canvas
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// 3D rotation matrices
function rotateX(point, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x,
    y: point.y * cos - point.z * sin,
    z: point.y * sin + point.z * cos
  };
}

function rotateY(point, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x * cos + point.z * sin,
    y: point.y,
    z: -point.x * sin + point.z * cos
  };
}

function rotateZ(point, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x * cos - point.y * sin,
    y: point.x * sin + point.y * cos,
    z: point.z
  };
}

function project(point) {
  const scale = 500 / (500 + point.z);
  return {
    x: point.x * scale + canvas.width / 2,
    y: point.y * scale + canvas.height / 2,
    scale: scale
  };
}

function rotate3D(point) {
  let p = rotateX(point, config.rotationX);
  p = rotateY(p, config.rotationY);
  p = rotateZ(p, config.rotationZ);
  return p;
}

function drawCircle3D(radius, tilt, rotation, color, dashed = false) {
  ctx.beginPath();
  const segments = 100;
  let firstPoint = null;
  
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * Math.cos(tilt);
    const z = Math.sin(angle) * radius * Math.sin(tilt);
    
    let point = { x, y, z };
    point = rotateZ(point, rotation);
    point = rotate3D(point);
    const proj = project(point);
    
    if (i === 0) {
      ctx.moveTo(proj.x, proj.y);
      firstPoint = proj;
    } else {
      ctx.lineTo(proj.x, proj.y);
    }
  }
  
  ctx.strokeStyle = color;
  ctx.lineWidth = config.lineWidth;
  if (dashed) {
    ctx.setLineDash([5, 5]);
  } else {
    ctx.setLineDash([]);
  }
  ctx.stroke();
}

function animate() {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const r = config.radius;
  
  // Auto rotation
  if (config.autoRotate) {
    config.rotationY += config.lockY ? 0 : config.rotationSpeed;
    config.rotationX += config.lockX ? 0 : config.rotationSpeed * 0.3;
  }
  
  // Longitude circles
  if (config.showLongitude) {
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI;
      drawCircle3D(r, Math.PI / 2, angle, 'rgba(0, 0, 0, 1)');
    }
  }
  
  // Latitude circles
  if (config.showLatitude) {
    for (let i = 1; i < 4; i++) {
      const lat = (i / 4) * Math.PI / 2;
      const latRadius = r * Math.cos(lat);
      drawCircle3D(latRadius, 0, 0, 'rgba(0, 0, 0, 1)');
    }
  }
  
  requestAnimationFrame(animate);
}

animate();
