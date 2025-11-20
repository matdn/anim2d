import * as dat from 'dat.gui';
import gsap from 'gsap';
import './style.css';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const config = {
  circleCount: 8,
  maxRadius: 300,
  strokeWidth: 2,
  animationType: 'breathe',
  duration: 3,
  ease: 'power2.inOut',
  stagger: 0.1
};

const circles = [];

const gui = new dat.GUI();
gui.add(config, 'circleCount', 3, 15, 1).name('Nombre cercles').onChange(init);
gui.add(config, 'maxRadius', 100, 500).name('Rayon max');
gui.add(config, 'strokeWidth', 1, 10).name('Épaisseur');
gui.add(config, 'animationType', ['breathe', 'ripple', 'alternate', 'cascade']).name('Type').onChange(restart);
gui.add(config, 'duration', 0.5, 5).name('Durée');
gui.add(config, 'ease', ['power1.inOut', 'power2.inOut', 'elastic.out', 'bounce.out', 'back.inOut']).name('Easing');
gui.add(config, 'stagger', 0, 0.5).name('Décalage');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function init() {
  circles.length = 0;
  for (let i = 0; i < config.circleCount; i++) {
    circles.push({
      radius: 0,
      targetRadius: config.maxRadius * ((i + 1) / config.circleCount),
      opacity: 1
    });
  }
  restart();
}

function restart() {
  gsap.killTweensOf(circles);
  
  circles.forEach((circle, i) => {
    const delay = i * config.stagger;
    
    switch(config.animationType) {
      case 'breathe':
        gsap.to(circle, {
          radius: circle.targetRadius,
          duration: config.duration,
          repeat: -1,
          yoyo: true,
          ease: config.ease,
          delay: delay
        });
        break;
        
      case 'ripple':
        gsap.fromTo(circle, 
          { radius: 0, opacity: 1 },
          {
            radius: circle.targetRadius,
            opacity: 0.3,
            duration: config.duration,
            repeat: -1,
            ease: 'power1.out',
            delay: delay
          }
        );
        break;
        
      case 'alternate':
        if (i % 2 === 0) {
          gsap.to(circle, {
            radius: circle.targetRadius,
            duration: config.duration,
            repeat: -1,
            yoyo: true,
            ease: config.ease,
            delay: delay
          });
        } else {
          gsap.to(circle, {
            radius: circle.targetRadius * 0.5,
            duration: config.duration,
            repeat: -1,
            yoyo: true,
            ease: config.ease,
            delay: delay
          });
        }
        break;
        
      case 'cascade':
        const timeline = gsap.timeline({ repeat: -1, delay: delay });
        timeline.to(circle, {
          radius: circle.targetRadius * 1.2,
          duration: config.duration / 2,
          ease: config.ease
        });
        timeline.to(circle, {
          radius: circle.targetRadius * 0.3,
          duration: config.duration / 2,
          ease: config.ease
        });
        break;
    }
  });
}

function draw() {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  circles.forEach((circle) => {
    ctx.beginPath();
    ctx.arc(centerX, centerY, circle.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 0, 0, ${circle.opacity})`;
    ctx.lineWidth = config.strokeWidth;
    ctx.stroke();
  });
  
  requestAnimationFrame(draw);
}

init();
draw();
