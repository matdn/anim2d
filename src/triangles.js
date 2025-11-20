import * as dat from 'dat.gui';
import gsap from 'gsap';
import './style.css';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const config = {
  triangleCount: 6,
  size: 120,
  strokeWidth: 2,
  animationType: 'spin',
  duration: 2,
  ease: 'power2.inOut'
};

const triangles = [];

const gui = new dat.GUI();
gui.add(config, 'triangleCount', 1, 12, 1).name('Nombre').onChange(init);
gui.add(config, 'size', 50, 200).name('Taille');
gui.add(config, 'strokeWidth', 1, 10).name('Épaisseur');
gui.add(config, 'animationType', ['spin', 'orbit', 'pulse', 'flower']).name('Type').onChange(restart);
gui.add(config, 'duration', 0.5, 5).name('Durée');
gui.add(config, 'ease', ['power1.inOut', 'power2.inOut', 'elastic.inOut', 'back.inOut']).name('Easing');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function init() {
  triangles.length = 0;
  for (let i = 0; i < config.triangleCount; i++) {
    triangles.push({
      rotation: (i / config.triangleCount) * 360,
      scale: 1,
      orbitAngle: (i / config.triangleCount) * 360,
      orbitRadius: 0
    });
  }
  restart();
}

function restart() {
  gsap.killTweensOf(triangles);
  
  triangles.forEach((triangle, i) => {
    const delay = i * 0.1;
    
    switch(config.animationType) {
      case 'spin':
        gsap.to(triangle, {
          rotation: '+=360',
          duration: config.duration,
          repeat: -1,
          ease: 'linear',
          delay: delay
        });
        break;
        
      case 'orbit':
        gsap.to(triangle, {
          orbitAngle: '+=360',
          duration: config.duration * 2,
          repeat: -1,
          ease: 'linear'
        });
        gsap.to(triangle, {
          rotation: '-=360',
          duration: config.duration,
          repeat: -1,
          ease: 'linear'
        });
        triangle.orbitRadius = 100;
        break;
        
      case 'pulse':
        gsap.to(triangle, {
          scale: 1.5,
          duration: config.duration,
          repeat: -1,
          yoyo: true,
          ease: config.ease,
          delay: delay
        });
        break;
        
      case 'flower':
        triangle.orbitRadius = 80;
        gsap.to(triangle, {
          rotation: '+=360',
          duration: config.duration,
          repeat: -1,
          ease: 'linear'
        });
        break;
    }
  });
}

function drawTriangle(x, y, size, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);
  
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
    const px = Math.cos(angle) * size;
    const py = Math.sin(angle) * size;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = config.strokeWidth;
  ctx.stroke();
  
  ctx.restore();
}

function draw() {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  triangles.forEach((triangle) => {
    const orbitX = Math.cos((triangle.orbitAngle * Math.PI) / 180) * triangle.orbitRadius;
    const orbitY = Math.sin((triangle.orbitAngle * Math.PI) / 180) * triangle.orbitRadius;
    
    ctx.save();
    ctx.translate(centerX + orbitX, centerY + orbitY);
    ctx.scale(triangle.scale, triangle.scale);
    ctx.translate(-centerX - orbitX, -centerY - orbitY);
    
    drawTriangle(centerX + orbitX, centerY + orbitY, config.size, triangle.rotation);
    
    ctx.restore();
  });
  
  requestAnimationFrame(draw);
}

init();
draw();
