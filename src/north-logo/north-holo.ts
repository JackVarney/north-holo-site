import north from './north';
import SimplexNoise from 'simplex-noise';
import { ensureIsProductOf, hsla, lerp, range } from '../utils';

export default (canvas: HTMLCanvasElement, square_size = 12) => {
  const simplex = new SimplexNoise();

  const row_size = Math.sqrt(north.length);
  const col_size = Math.sqrt(north.length);
  console.log({ square_size });
  const height = col_size * square_size;
  const width = row_size * square_size;

  canvas.width = width;
  canvas.height = height;

  const instructions: {
    x: number;
    y: number;
    colourPicker: ReturnType<typeof createColourPicker>;
  }[] = [];

  for (const x of range(row_size)) {
    for (const y of range(col_size)) {
      const col = north.split('\n')[y];
      const char = col[x];

      if (char === '-') {
        continue;
      }

      instructions.push({
        x,
        y,
        colourPicker: createColourPicker(x, y),
      });
    }
  }

  const ctx = canvas.getContext('2d')!;

  function render() {
    for (const { x, y, colourPicker } of instructions) {
      const xPos = x * square_size;
      const yPos = y * square_size;

      ctx.fillStyle = colourPicker.getFill();
      ctx.fillRect(xPos, yPos, square_size, square_size);
    }

    window.requestAnimationFrame(render);
  }

  function createColourPicker(x: number, y: number) {
    const hue_min = 190;
    const hue_max = 280;
    const alpha_min = 0;
    const alpha_max = 1000;
    const hue_increment = 5;
    const base_hue = hue_max - x - y;

    let hue = ensureIsProductOf(base_hue, hue_increment);
    let alpha = Number(Math.abs(simplex.noise2D(x, y)).toFixed(2)) * 1000;
    let hueInReverse = false;
    let alphaInReverse = false;

    return {
      setHue() {
        if (hue <= hue_min) {
          hueInReverse = false;
        }

        if (hue >= hue_max) {
          hueInReverse = true;
        }

        hue += hueInReverse ? -5 : 5;
      },
      setAlpha() {
        if (alpha <= alpha_min) {
          alphaInReverse = false;
        }

        if (alpha >= alpha_max) {
          alphaInReverse = true;
        }

        alpha += alphaInReverse ? -10 : 10;
      },
      getFill() {
        return hsla(hue, 100, 80, lerp(0.7, 1, alpha / 1000));
      },
    };
  }

  function initialiseColourPickers() {
    setInterval(() => {
      for (const { colourPicker } of instructions) {
        colourPicker.setHue();
        colourPicker.setAlpha();
      }
    }, 50);
  }

  window.requestAnimationFrame(render);
  initialiseColourPickers();
};
