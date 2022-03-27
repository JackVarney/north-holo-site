import './style.css';
import northRenderer from './north-logo/north-holo';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <canvas id="canvas" />
`;

const canvas = document.getElementById('canvas')! as HTMLCanvasElement;
northRenderer(canvas, 12);
