const ensureIsProductOf = (n: number, p: number) => n - (n % p);
const hsla = (h: number, s: number, l: number, a: number) =>
  `hsl(${h}, ${s}%, ${l}%, ${a})`;
const rgba = (r: number, g: number, b: number, a: number) =>
  `rgba(${r}, ${g}, ${b}, ${a})`;
const lerp = (v0: number, v1: number, t: number) => v0 * (1 - t) + v1 * t;
const fiftyFifty = <A, B>(a: A, b: B) => (Boolean(Math.random() > 0.5) ? a : b);
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const log = (...toLog: any[]) => {
  if (Math.random() > 0.999) {
    console.log(...toLog);
  }
};

const createMouseTracker = (canvas: HTMLCanvasElement) => {
  let x = 0;
  let y = 0;
  let intersecting = false;

  document.onmousemove = function handleMouseMove(event) {
    x = event.pageX;
    y = event.pageY;
  };

  canvas.onmouseenter = () => {
    intersecting = true;
  };

  canvas.onmouseleave = () => {
    intersecting = false;
  };

  return {
    get() {
      var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width, // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y
      const mouseX = (x - rect.left) * scaleX;
      const mouseY = (y - rect.top) * scaleY;

      return { mouseX, mouseY, x, y, intersecting };
    },
  };
};

export {
  ensureIsProductOf,
  hsla,
  rgba,
  lerp,
  fiftyFifty,
  range,
  log,
  createMouseTracker,
};
