export class Point2d {
  x: number;
  y: number;

  constructor(x_i: number, y_i: number) {
    this.x = x_i;
    this.y = y_i;
  }

  scalePoint(center: Point2d, coef: Point2d) {
    this.x = center.x + coef.x * (this.x - center.x);
    this.y = center.y + coef.y * (this.y - center.y);
  }

  movePoint(coef: Point2d) {
    this.x += coef.x;
    this.y += coef.y;
  }

  iso(size: number) {
    this.x = 0.5 * (size + this.x - this.y);
    this.y =  0.5 * (this.x + this.y);
    return this;
  }
}


export class Point3d {
  x: number;
  y: number;
  z: number;

  constructor(x_i: number, y_i: number, z_i: number) {
    this.x = x_i;
    this.y = y_i;
    this.z = z_i;
  }

  project(img_size: number, width: number, height: number) {
    var proj_point = new Point2d(this.x, this.y);
    proj_point.iso(img_size);
    var x0 = width * 0.5;
    var y0 = height * 0.2;
    var z = img_size * 0.5 - this.z + proj_point.y * 0.75;
    var x = (proj_point.x - img_size * 0.5) * 6;
    var y = (img_size - proj_point.y) * 0.005 + 1;
    proj_point.x = x0 + x / y;
    proj_point.y = y0 + z / y;
    return proj_point
  }

  getDist(point: Point3d) {
    return Math.hypot(this.x - point.x, this.y - point.y, this.z - point.z);
  }

  projectPointVec(p1: Point3d, p2: Point3d) {
    let vec_on = new Point3d(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
    let vec = new Point3d(this.x - p1.x, this.y - p1.y, this.z - p1.z);
    var mult = vec.x * vec_on.x + vec.y * vec_on.y + vec.z * vec_on.z;
    return (
      mult /
      Math.sqrt(vec_on.x * vec_on.x + vec_on.y * vec_on.y + vec_on.z * vec_on.z)
    );
  }
}

