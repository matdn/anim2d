import * as dat from 'dat.gui';
import gsap from 'gsap';
import './style.css';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const config = {
  sides: 6,
  size: 150,
  strokeWidth: 3,
  animationType: 'morph',
  duration: 3,
  ease: 'elastic.inOut'
};

const polygon = {
  currentSides: 6,
  rotation: 0,
  scale: 1,
  vertices: []
};

const gui = new dat.GUI();
gui.add(config, 'sides', 3, 12, 1).name('Côtés cible');
gui.add(config, 'size', 80, 300).name('Taille');
gui.add(config, 'strokeWidth', 1, 10).name('Épaisseur');
gui.add(config, 'animationType', ['morph', 'rotate', 'breathe', 'spiral']).name('Type').onChange(restart);
gui.add(config, 'duration', 1, 5).name('Durée');
gui.add(config, 'ease', ['power2.inOut', 'elastic.inOut', 'back.inOut', 'bounce.inOut']).name('Easing');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function restart() {
  gsap.killTweensOf(polygon);
  
  switch(config.animationType) {
    case 'morph':
      const timeline = gsap.timeline({ repeat: -1 });
      timeline.to(polygon, {
        currentSides: 3,
        duration: config.duration,
        ease: config.ease,
        onUpdate: updateVertices
      });
      timeline.to(polygon, {
        currentSides: 8,
        duration: config.duration,
        ease: config.ease,
        onUpdate: updateVertices
      });
      timeline.to(polygon, {
        currentSides: 5,
        duration: config.duration,
        ease: config.ease,
        onUpdate: updateVertices
      });
      timeline.to(polygon, {
        currentSides: config.sides,
        duration: config.duration,
        ease: config.ease,
        onUpdate: updateVertices
      });
      break;
      
    case 'rotate':
      gsap.to(polygon, {
        rotation: 360,
        duration: config.duration,
        repeat: -1,
        ease: 'linear'
      });
      break;
      
    case 'breathe':
      gsap.to(polygon, {
        scale: 1.5,
        duration: config.duration,
        repeat: -1,
        yoyo: true,
        ease: config.ease
      });
      break;
      
    case 'spiral':
      gsap.to(polygon, {
        rotation: 360,
        scale: 1.5,
        duration: config.duration,
        repeat: -1,
        yoyo: true,
        ease: config.ease
      });
      break;
  }
}

function updateVertices() {
  polygon.vertices = [];
  const sides = Math.round(polygon.currentSides);
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
    polygon.vertices.push({ x: Math.cos(angle), y: Math.sin(angle) });
  }
}

function draw() {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  if (polygon.vertices.length === 0) {
    updateVertices();
  }
  
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate((polygon.rotation * Math.PI) / 180);
  ctx.scale(polygon.scale, polygon.scale);
  
  ctx.beginPath();
  polygon.vertices.forEach((vertex, i) => {
    const x = vertex.x * config.size;
    const y = vertex.y * config.size;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  
  ctx.strokeStyle = '#000';
  ctx.lineWidth = config.strokeWidth;
  ctx.stroke();
  
  ctx.restore();
  
  requestAnimationFrame(draw);
}

restart();
draw();
