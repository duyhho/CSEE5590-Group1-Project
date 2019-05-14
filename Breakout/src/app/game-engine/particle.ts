import {Drawable} from './drawable';

export class Particle implements Drawable {
  constructor(public x: number, public y: number, public hue: number) {}
  status = 1;
  vx = 0.5 - Math.random();
  v = Math.random() * 5;
  g = 1 + Math.random() * 3;
  down = false;

  draw(ctx) {
    ctx.fillStyle = 'hsla(' + this.hue + ', 100%, 40%, 1)';

    const size = Math.random() * 3;
    // console.log(bar.barX);
    ctx.fillRect(this.x, this.y, size, size);
  }
}
