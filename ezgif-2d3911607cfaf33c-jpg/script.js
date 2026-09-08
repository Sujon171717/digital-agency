const frameCount = 209;
const frameWidth = 1920;
const frameHeight = 1080;
const canvas = document.querySelector('#frame-canvas');
const context = canvas.getContext('2d');
const frames = [];

let targetProgress = 0;
let displayedProgress = 0;
let activeFrame = -1;
let loadedFrames = 0;
let animationFrame;

function framePath(index) {
  return `ezgif-frame-${String(index).padStart(3, '0')}.jpg`;
}

function resizeCanvas() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(window.innerWidth * pixelRatio);
  canvas.height = Math.round(window.innerHeight * pixelRatio);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  drawFrame(activeFrame < 0 ? 0 : activeFrame);
}

function drawFrame(index) {
  const frame = frames[index];
  if (!frame || !frame.complete || !frame.naturalWidth) return;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const scale = Math.max(viewportWidth / frameWidth, viewportHeight / frameHeight);
  const width = frameWidth * scale;
  const height = frameHeight * scale;

  context.clearRect(0, 0, viewportWidth, viewportHeight);
  context.drawImage(frame, (viewportWidth - width) / 2, (viewportHeight - height) / 2, width, height);
}

function render() {
  displayedProgress += (targetProgress - displayedProgress) * 0.1;
  const nextFrame = Math.min(frameCount - 1, Math.round(displayedProgress * (frameCount - 1)));

  if (nextFrame !== activeFrame) {
    activeFrame = nextFrame;
    drawFrame(activeFrame);
  }

  animationFrame = requestAnimationFrame(render);
}

function updateTarget() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  targetProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
}

for (let index = 1; index <= frameCount; index += 1) {
  const frame = new Image();
  frame.src = framePath(index);
  frame.onload = () => {
    loadedFrames += 1;
    if (loadedFrames === 1) drawFrame(0);
  };
  frames.push(frame);
}

window.addEventListener('resize', resizeCanvas, { passive: true });
window.addEventListener('scroll', updateTarget, { passive: true });

resizeCanvas();
updateTarget();
render();

window.addEventListener('pagehide', () => cancelAnimationFrame(animationFrame));