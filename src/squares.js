import * as dat from 'dat.gui';
import gsap from 'gsap';
import './style.css';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Configuration
const config = {
  squareCount: 5,
  baseSize: 80,
  spacing: 20,
  rotationSpeed: 2,
  scaleAmount: 1.5,
  strokeWidth: 3,
  animationType: 'rotation',
  duration: 2,
  ease: 'power2.inOut'
};

// Animation states
const squares = [];

// Setup GUI
const gui = new dat.GUI();
gui.add(config, 'squareCount', 1, 10, 1).name('Nombre de carrés').onChange(initSquares);
gui.add(config, 'baseSize', 30, 200).name('Taille base');
gui.add(config, 'spacing', 0, 100).name('Espacement');
gui.add(config, 'rotationSpeed', 0.5, 5).name('Vitesse rotation');
gui.add(config, 'scaleAmount', 1, 3).name('Scale max');
gui.add(config, 'strokeWidth', 1, 10).name('Épaisseur');
gui.add(config, 'animationType', ['rotation', 'scale', 'pulse', 'wave', 'morph']).name('Type animation').onChange(restartAnimations);
gui.add(config, 'duration', 0.5, 5).name('Durée');
gui.add(config, 'ease', ['power1.inOut', 'power2.inOut', 'power3.inOut', 'elastic.inOut', 'bounce.inOut', 'back.inOut']).name('Easing');

// Resize canvas
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Initialize squares
function initSquares() {
  squares.length = 0;
  for (let i = 0; i < config.squareCount; i++) {
    squares.push({
      rotation: 0,
      scale: 3,
      opacity: 1,
      x: 0,
      y: 0,
      size: config.baseSize - (i * 10)
    });
  }
  restartAnimations();
}

// Start GSAP animations
function restartAnimations() {
  gsap.killTweensOf(squares);
  
  squares.forEach((square, i) => {
    const delay = i * 0.1;
    
    switch(config.animationType) {
      case 'rotation':
        gsap.to(square, {
          rotation: 360,
          duration: config.duration * config.rotationSpeed,
          repeat: -1,
          ease: config.ease,
          delay: delay
        });
        break;
        
      case 'scale':
        gsap.to(square, {
          scale: config.scaleAmount,
          duration: config.duration,
          repeat: -1,
          yoyo: true,
          ease: config.ease,
          delay: delay
        });
        break;
        
      case 'pulse':
        gsap.to(square, {
          scale: config.scaleAmount,
          opacity: 0.3,
          duration: config.duration,
          repeat: -1,
          yoyo: true,
          ease: config.ease,
          delay: delay
        });
        break;
        
      case 'wave':
        gsap.to(square, {
          y: -50,
          duration: config.duration,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: delay
        });
        break;
        
      case 'morph':
        const timeline = gsap.timeline({ repeat: -1, delay: delay });
        timeline.to(square, {
          rotation: 45,
          scale: config.scaleAmount,
          duration: config.duration / 2,
          ease: config.ease
        });
        timeline.to(square, {
          rotation: 90,
          scale: 1,
          duration: config.duration / 2,
          ease: config.ease
        });
        timeline.to(square, {
          rotation: 135,
          scale: config.scaleAmount,
          duration: config.duration / 2,
          ease: config.ease
        });
        timeline.to(square, {
          rotation: 180,
          scale: 1,
          duration: config.duration / 2,
          ease: config.ease
        });
        break;
    }
  });
}

// Draw function
function draw() {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  squares.forEach((square, i) => {
    ctx.save();
    
    // Position
    ctx.translate(centerX + square.x, centerY + square.y);
    
    // Rotation
    ctx.rotate((square.rotation * Math.PI) / 180);
    
    // Scale
    ctx.scale(square.scale, square.scale);
    
    // Draw square
    const size = square.size;
    
    // Stroke (noir)
    ctx.strokeStyle = `rgba(0, 0, 0, ${square.opacity})`;
    ctx.lineWidth = config.strokeWidth;
    ctx.strokeRect(-size / 2, -size / 2, size, size);
    
    ctx.restore();
  });
  
  requestAnimationFrame(draw);
}

// Initialize
initSquares();
draw();
