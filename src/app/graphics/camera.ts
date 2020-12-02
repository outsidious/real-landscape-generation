import * as math from './math';
import * as rect from './rect';

export class Camera {
  position: math.Point3d;
  p1: math.Point3d;
  p2: math.Point3d;
  viewPoint: math.Point3d;

  constructor(
    pos: math.Point3d,
    p1_i: math.Point3d,
    p2_i: math.Point3d,
    view: math.Point3d
  ) {
    this.position = pos;
    this.p1 = p1_i;
    this.p2 = p2_i;
    this.viewPoint = view;
  }

  rotateAroundZ(angle) {
    let matrix = new math.Matrix();
    matrix.setMoveMatrix(
      -this.viewPoint.x,
      -this.viewPoint.y,
      -this.viewPoint.z
    );
    this.position.pointTransform(matrix);
    this.p1.pointTransform(matrix);
    this.p2.pointTransform(matrix);
    matrix.setRotateOzMatrix(angle);
    this.position.pointTransform(matrix);
    this.p1.pointTransform(matrix);
    this.p2.pointTransform(matrix);
    matrix.setMoveMatrix(this.viewPoint.x, this.viewPoint.y, this.viewPoint.z);
    this.position.pointTransform(matrix);
    this.p1.pointTransform(matrix);
    this.p2.pointTransform(matrix);
  }

  rotateAroundX(angle) {
    let matrix = new math.Matrix();
    matrix.setMoveMatrix(
      -this.viewPoint.x,
      -this.viewPoint.y,
      -this.viewPoint.z
    );
    this.position.pointTransform(matrix);
    this.p1.pointTransform(matrix);
    this.p2.pointTransform(matrix);
    matrix.setRotateOxMatrix(angle);
    this.position.pointTransform(matrix);
    this.p1.pointTransform(matrix);
    this.p2.pointTransform(matrix);
    matrix.setMoveMatrix(this.viewPoint.x, this.viewPoint.y, this.viewPoint.z);
    this.position.pointTransform(matrix);
    this.p1.pointTransform(matrix);
    this.p2.pointTransform(matrix);
  }

  projectPoint(p_i: math.Point3d) {
    let x = p_i.projectPointVec(this.position, this.p1);
    let y = p_i.projectPointVec(this.position, this.p2);
    let projPoint = new math.Point2d(x, y);
    var eps = 1e-10;
    var znam = p_i.z + this.position.z;
    if (znam < eps && znam > -eps) {
        znam = eps;
    }
    var distCoef = this.position.z / znam;
    projPoint.x *= distCoef;
    projPoint.y *= distCoef;
    return projPoint;
  }

  projectRect(rect_: rect.Rect3d) {
    var rect2d = new rect.Rect2d(
        this.projectPoint(rect_.p1),
        this.projectPoint(rect_.p2),
        this.projectPoint(rect_.p3),
        this.projectPoint(rect_.p4)
    );
    return rect2d;
  }
}
