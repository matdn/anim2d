import * as dat from 'dat.gui';
import './style.css';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Configuration
const config = {
  waveCount: 3,
  amplitude: 100,
  frequency: 0.01,
  speed: 0.05,
  lineWidth: 3,
  colorHue: 280,
  fill: true,
  fillOpacity: 0.1
};

// Setup GUI
const gui = new dat.GUI();
gui.add(config, 'waveCount', 1, 8, 1).name('Nombre d\'ondes');
gui.add(config, 'amplitude', 20, 300).name('Amplitude');
gui.add(config, 'frequency', 0.001, 0.05).name('Fréquence');
gui.add(config, 'speed', 0.01, 0.2).name('Vitesse');
gui.add(config, 'lineWidth', 1, 10).name('Épaisseur ligne');
gui.add(config, 'colorHue', 0, 360).name('Teinte');
gui.add(config, 'fill').name('Remplissage');
gui.add(config, 'fillOpacity', 0, 0.5).name('Opacité remplissage');

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
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const centerY = canvas.height / 2;

  for (let w = 0; w < config.waveCount; w++) {
    const offset = (w / config.waveCount) * Math.PI * 2;
    const hue = (config.colorHue + w * 40) % 360;

    ctx.beginPath();
    ctx.moveTo(0, centerY);

    for (let x = 0; x <= canvas.width; x += 5) {
      const y = centerY + 
        Math.sin(x * config.frequency + time + offset) * config.amplitude +
        Math.sin(x * config.frequency * 2 + time * 1.5 + offset) * (config.amplitude / 2);
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    if (config.fill) {
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fillStyle = `hsla(${hue}, 70%, 50%, ${config.fillOpacity})`;
      ctx.fill();
    }

    ctx.strokeStyle = `hsl(${hue}, 70%, 50%)`;
    ctx.lineWidth = config.lineWidth;
    ctx.stroke();
  }

  time += config.speed;
  requestAnimationFrame(animate);
}

animate();
