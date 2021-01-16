import * as math from './math';


export class Tile {
  top: math.Point2d;
  bottom: math.Point2d;

  constructor(
    top_: math.Point2d,
    bottom_: math.Point2d,
  ) {
    this.top = top_;
    this.bottom = bottom_;
  }

  draw(ctx: CanvasRenderingContext2D, style: string) {
    if (this.top.y > this.bottom.y) return;
    ctx.fillStyle = style;
    ctx.fillRect(this.top.x, this.top.y, this.bottom.x - this.top.x, this.bottom.y - this.top.y);
  }

}