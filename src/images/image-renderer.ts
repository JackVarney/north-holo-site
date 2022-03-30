import SimplexNoise from 'simplex-noise';
import images from './images';
import { range } from '../utils';

const loadImages = new Promise<HTMLImageElement[]>((res) => {
  const imagePromisified = (url: string) => {
    const image = new Image();
    image.src = url;
    const p = new Promise<HTMLImageElement>((res) => {
      image.onload = () => res(image);
    });

    return p;
  };

  return Promise.all(images.map(imagePromisified)).then(res);
});

const noise = new SimplexNoise();

export default async (canvas: HTMLCanvasElement) => {
  let width = canvas.width;
  let height = canvas.width;
  const sliceLength = width / 12;

  const ctx = canvas.getContext('2d')!;
  const images = await loadImages;

  function createPoints() {
    const createPoint = (
      x: number,
      y: number,
      w: number,
      h: number,
      t: number
    ) => ({
      x,
      y,
      w,
      h,
      t,
      n: noise.noise2D(x, y),
    });

    const points: ReturnType<typeof createPoint>[] = [];
    const w = width / sliceLength;
    const h = height / sliceLength;

    for (const x of range(w)) {
      for (const y of range(h)) {
        const t = (x * w + y * h) / 3;

        points.push(createPoint(x, y, sliceLength, sliceLength, t));
      }
    }

    const lastPoint = points.reverse()[0];
    for (const n of range(10)) {
      const point = { ...lastPoint };
      point.t = point.t + n * 15;
      points.push(point);
    }

    points.push(createPoint(0, 0, 0, 0, 1000));

    return points;
  }

  const points = createPoints();
  ctx.globalAlpha = 0.25;
  let then = Date.now();
  let index = 0;
  let image = images[index];

  function render() {
    width = canvas.width;
    height = canvas.width;

    const now = Date.now();
    const shouldRender = (t: number) => now - then > t;
    const shouldFlipImages = points.every(({ t }) => shouldRender(t));

    if (shouldFlipImages) {
      then = Date.now();

      index += 1;
      if (index === images.length) {
        index = 0;
      }

      image = images[index];
    }

    for (const { x, y, w, h, t, n } of points) {
      if (shouldRender(t * n)) {
        ctx.drawImage(
          image,
          x * w, // x pos in spritesheet
          y * h, // y pos in spritesheet
          w, // x distance in spritesheet
          h, // y distance in spritesheet
          x * w, // x pos on canvas
          y * h, // y pos on canvas
          w, // x distance on canvas
          h // y distance on canvas
        );
      }
    }

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];

      if (green > 120 && red < 20 && blue < 20) {
        data[i + 3] = 0;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    window.requestAnimationFrame(render);
  }

  return render;
};
