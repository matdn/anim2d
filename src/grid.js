import * as dat from 'dat.gui';
import gsap from 'gsap';
import './style.css';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const config = {
  gridSize: 5,
  cellSize: 80,
  strokeWidth: 2,
  animationType: 'wave',
  duration: 2,
  ease: 'power2.inOut'
};

const cells = [];

const gui = new dat.GUI();
gui.add(config, 'gridSize', 3, 10, 1).name('Grille').onChange(init);
gui.add(config, 'cellSize', 40, 120).name('Taille cellule');
gui.add(config, 'strokeWidth', 1, 8).name('Épaisseur');
gui.add(config, 'animationType', ['wave', 'random', 'spiral', 'checkerboard', 'explode']).name('Type').onChange(restart);
gui.add(config, 'duration', 0.5, 4).name('Durée');
gui.add(config, 'ease', ['power2.inOut', 'elastic.out', 'bounce.out', 'back.inOut']).name('Easing');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function init() {
  cells.length = 0;
  for (let row = 0; row < config.gridSize; row++) {
    for (let col = 0; col < config.gridSize; col++) {
      cells.push({
        row,
        col,
        scale: 1,
        rotation: 0,
        opacity: 1
      });
    }
  }
  restart();
}

function restart() {
  gsap.killTweensOf(cells);
  
  cells.forEach((cell, i) => {
    const distanceFromCenter = Math.sqrt(
      Math.pow(cell.col - config.gridSize / 2, 2) + 
      Math.pow(cell.row - config.gridSize / 2, 2)
    );
    
    switch(config.animationType) {
      case 'wave':
        gsap.to(cell, {
          scale: 0.3,
          duration: config.duration,
          repeat: -1,
          yoyo: true,
          ease: config.ease,
          delay: (cell.row + cell.col) * 0.1
        });
        break;
        
      case 'random':
        gsap.to(cell, {
          scale: 0.2,
          rotation: 180,
          duration: config.duration,
          repeat: -1,
          yoyo: true,
          ease: config.ease,
          delay: Math.random() * 0.5
        });
        break;
        
      case 'spiral':
        const angle = Math.atan2(cell.row - config.gridSize / 2, cell.col - config.gridSize / 2);
        gsap.to(cell, {
          scale: 0.1,
          rotation: 360,
          duration: config.duration,
          repeat: -1,
          yoyo: true,
          ease: config.ease,
          delay: (angle + Math.PI) / (Math.PI * 2)
        });
        break;
        
      case 'checkerboard':
        if ((cell.row + cell.col) % 2 === 0) {
          gsap.to(cell, {
            scale: 0.5,
            duration: config.duration,
            repeat: -1,
            yoyo: true,
            ease: config.ease
          });
        } else {
          gsap.to(cell, {
            scale: 1.3,
            duration: config.duration,
            repeat: -1,
            yoyo: true,
            ease: config.ease
          });
        }
        break;
        
      case 'explode':
        gsap.to(cell, {
          scale: 0.1,
          opacity: 0.3,
          duration: config.duration,
          repeat: -1,
          yoyo: true,
          ease: config.ease,
          delay: distanceFromCenter * 0.1
        });
        break;
    }
  });
}

function draw() {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const totalWidth = config.gridSize * config.cellSize;
  const totalHeight = config.gridSize * config.cellSize;
  const startX = (canvas.width - totalWidth) / 2;
  const startY = (canvas.height - totalHeight) / 2;
  
  cells.forEach((cell) => {
    const x = startX + cell.col * config.cellSize + config.cellSize / 2;
    const y = startY + cell.row * config.cellSize + config.cellSize / 2;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((cell.rotation * Math.PI) / 180);
    ctx.scale(cell.scale, cell.scale);
    
    const size = config.cellSize * 0.8;
    ctx.strokeStyle = `rgba(0, 0, 0, ${cell.opacity})`;
    ctx.lineWidth = config.strokeWidth;
    ctx.strokeRect(-size / 2, -size / 2, size, size);
    
    ctx.restore();
  });
  
  requestAnimationFrame(draw);
}

init();
draw();
