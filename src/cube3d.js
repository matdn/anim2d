import * as dat from 'dat.gui';
import './style.css';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Configuration
const config = {
  rotationX: 0.5,
  rotationY: 0.5,
  rotationZ: 0,
  autoRotate: true,
  rotationSpeed: 0.005,
  perspective: 600,
  cubeSize: 200,
  showInnerSquare: true,
  showDiagonals: true,
  lineWidth: 2,
  innerSquareSize: 0.5
};

// Setup GUI
const gui = new dat.GUI();
gui.add(config, 'autoRotate').name('Rotation auto');
gui.add(config, 'rotationSpeed', 0.001, 0.02).name('Vitesse');
gui.add(config, 'rotationX', 0, Math.PI * 2).name('Rotation X').listen();
gui.add(config, 'rotationY', 0, Math.PI * 2).name('Rotation Y').listen();
gui.add(config, 'rotationZ', 0, Math.PI * 2).name('Rotation Z').listen();
gui.add(config, 'perspective', 300, 1500).name('Perspective');
gui.add(config, 'cubeSize', 100, 400).name('Taille cube');
gui.add(config, 'showInnerSquare').name('Carré intérieur');
gui.add(config, 'showDiagonals').name('Diagonales');
gui.add(config, 'innerSquareSize', 0.2, 0.8).name('Taille intérieure');
gui.add(config, 'lineWidth', 0.5, 5).name('Épaisseur');

// Resize canvas
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// 3D rotation
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
  const scale = config.perspective / (config.perspective + point.z);
  return {
    x: point.x * scale + canvas.width / 2,
    y: point.y * scale + canvas.height / 2,
    z: point.z
  };
}

function rotate3D(point) {
  let p = rotateX(point, config.rotationX);
  p = rotateY(p, config.rotationY);
  p = rotateZ(p, config.rotationZ);
  return p;
}

function drawLine(p1, p2, color = '#000000', width = config.lineWidth) {
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function animate() {
  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  if (config.autoRotate) {
    config.rotationY += config.rotationSpeed;
    config.rotationX += config.rotationSpeed * 0.3;
  }
  
  const s = config.cubeSize / 2;
  const innerSize = s * config.innerSquareSize;
  
  // Define outer cube vertices
  const outerVertices = [
    { x: -s, y: -s, z: -s }, // 0: front-top-left
    { x: s, y: -s, z: -s },  // 1: front-top-right
    { x: s, y: s, z: -s },   // 2: front-bottom-right
    { x: -s, y: s, z: -s },  // 3: front-bottom-left
    { x: -s, y: -s, z: s },  // 4: back-top-left
    { x: s, y: -s, z: s },   // 5: back-top-right
    { x: s, y: s, z: s },    // 6: back-bottom-right
    { x: -s, y: s, z: s }    // 7: back-bottom-left
  ];
  
  // Define inner square vertices (centered)
  const innerVertices = [
    { x: -innerSize, y: -innerSize, z: 0 },
    { x: innerSize, y: -innerSize, z: 0 },
    { x: innerSize, y: innerSize, z: 0 },
    { x: -innerSize, y: innerSize, z: 0 }
  ];
  
  // Project all vertices
  const projectedOuter = outerVertices.map(v => project(rotate3D(v)));
  const projectedInner = innerVertices.map(v => project(rotate3D(v)));
  
  // Draw outer square (front face)
  const outerColor = '#ffffff';
  drawLine(projectedOuter[0], projectedOuter[1], outerColor);
  drawLine(projectedOuter[1], projectedOuter[2], outerColor);
  drawLine(projectedOuter[2], projectedOuter[3], outerColor);
  drawLine(projectedOuter[3], projectedOuter[0], outerColor);
  
  // Draw outer square (back face)
  drawLine(projectedOuter[4], projectedOuter[5], outerColor);
  drawLine(projectedOuter[5], projectedOuter[6], outerColor);
  drawLine(projectedOuter[6], projectedOuter[7], outerColor);
  drawLine(projectedOuter[7], projectedOuter[4], outerColor);
  
  // Draw connecting edges
  drawLine(projectedOuter[0], projectedOuter[4], outerColor);
  drawLine(projectedOuter[1], projectedOuter[5], outerColor);
  drawLine(projectedOuter[2], projectedOuter[6], outerColor);
  drawLine(projectedOuter[3], projectedOuter[7], outerColor);
  
  // Draw inner square
  if (config.showInnerSquare) {
    const innerColor = '#ffffff';
    drawLine(projectedInner[0], projectedInner[1], innerColor);
    drawLine(projectedInner[1], projectedInner[2], innerColor);
    drawLine(projectedInner[2], projectedInner[3], innerColor);
    drawLine(projectedInner[3], projectedInner[0], innerColor);
  }
  
  // Draw diagonals from outer corners to inner square
  if (config.showDiagonals && config.showInnerSquare) {
    const diagColor = '#ffffff';
    // Front face corners to inner square
    drawLine(projectedOuter[0], projectedInner[0], diagColor);
    drawLine(projectedOuter[1], projectedInner[1], diagColor);
    drawLine(projectedOuter[2], projectedInner[2], diagColor);
    drawLine(projectedOuter[3], projectedInner[3], diagColor);
    
    // Back face corners to inner square
    drawLine(projectedOuter[4], projectedInner[0], diagColor);
    drawLine(projectedOuter[5], projectedInner[1], diagColor);
    drawLine(projectedOuter[6], projectedInner[2], diagColor);
    drawLine(projectedOuter[7], projectedInner[3], diagColor);
  }
  
  requestAnimationFrame(animate);
}

animate();
