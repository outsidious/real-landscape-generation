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

  draw(ctx: any, scale_center: math.Point2d, scale_coef: math.Point2d, moveCoef: math.Point2d, style: string) {
    //need to add here centerof scaling as param
    this.p1.movePoint(moveCoef);
    this.p2.movePoint(moveCoef);
    this.p3.movePoint(moveCoef);
    this.p4.movePoint(moveCoef);
    this.p1.scalePoint(scale_center, scale_coef);
    this.p2.scalePoint(scale_center, scale_coef);
    this.p3.scalePoint(scale_center, scale_coef);
    this.p4.scalePoint(scale_center, scale_coef);
    ctx.beginPath();
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.lineTo(this.p3.x, this.p3.y);
    ctx.lineTo(this.p4.x, this.p4.y);
    ctx.lineTo(this.p1.x, this.p1.y);
    ctx.strokeStyle = style;
    ctx.fillStyle = style;
    ctx.fill();
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

  createRectByPoint(p1: math.Point3d) {
    let p2 = new math.Point3d(p1.x, p1.y, 0);
    let p3 = new math.Point3d(p1.x + 1, p1.y, 0);
    let p4 = new math.Point3d(p1.x + 1, p1.y, p1.z);
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.p4 = p4;
  }

  draw(ctx: any, cam: Camera, scale_center: math.Point2d, scale_coef: math.Point2d, moveCoef: math.Point2d, style: string) {
    let rect2d = cam.projectRect(this);
    rect2d.draw(ctx, scale_center, scale_coef, moveCoef, style);
  }
}
