import './style.css';
import createNorthRenderer from './north-logo/north-holo';
import createImageRenderer from './images/image-renderer';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <canvas id="canvas" />
`;

const canvas = document.getElementById('canvas')! as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const render = async () => {
  const imageRenderer = await createImageRenderer(canvas);
  const northRenderer = await createNorthRenderer(canvas);

  window.requestAnimationFrame(() => {
    northRenderer();
    imageRenderer();
  });
};

window.requestAnimationFrame(render);
