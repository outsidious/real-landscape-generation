import * as math from './math';
import { Camera } from './camera';

export class Rect2d {
  p1: math.Point2d;
  p2: math.Point2d;
  p3: math.Point2d;
  p4: math.Point2d;

  constructor(
    p1_i: math.Point2d,
    p2_i: math.Point2d,
    p3_i: math.Point2d,
    p4_i: math.Point2d
  ) {
    this.p1 = p1_i;
    this.p2 = p2_i;
    this.p3 = p3_i;
    this.p4 = p4_i;
  }

  draw(ctx: any, scale_coef: math.Point2d) {
    //need to add here centerof scaling as param
    let center = new math.Point2d(0, 0);
    center.x = (this.p1.x + this.p2.x + this.p3.x + this.p4.x) / 4;
    center.y = (this.p1.y + this.p2.y + this.p3.y + this.p4.y) / 4;
    this.p1.scalePoint(center, scale_coef);
    this.p2.scalePoint(center, scale_coef);
    this.p3.scalePoint(center, scale_coef);
    this.p4.scalePoint(center, scale_coef);
    ctx.beginPath();
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.lineTo(this.p3.x, this.p3.y);
    ctx.lineTo(this.p4.x, this.p4.y);
    ctx.lineTo(this.p1.x, this.p1.y);
    ctx.strokeStyle = 'white';
    ctx.stroke();
  }
}

export class Rect3d {
  p1: math.Point3d;
  p2: math.Point3d;
  p3: math.Point3d;
  p4: math.Point3d;

  constructor(
    p1_i: math.Point3d,
    p2_i: math.Point3d,
    p3_i: math.Point3d,
    p4_i: math.Point3d
  ) {
    this.p1 = p1_i;
    this.p2 = p2_i;
    this.p3 = p3_i;
    this.p4 = p4_i;
  }

  draw(ctx: any, cam: Camera, scale_coef: math.Point2d) {
    let rect2d = cam.projectRect(this);
    rect2d.draw(ctx, scale_coef);
  }
}
