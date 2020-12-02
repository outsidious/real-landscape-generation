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
}

export class Matrix {
  data: number[][];

  constructor() {
    this.data = [];
    for (let i = 0; i < 4; ++i) {
      this.data.push([0, 0, 0, 0]);
    }
  }

  resetMatrix() {
    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        this.data[i][j] = 0;
      }
    }
  }

  setMoveMatrix(x: number, y: number, z: number) {
    this.resetMatrix();
    this.data[0][0] = 1;
    this.data[1][1] = 1;
    this.data[2][2] = 1;
    this.data[3][3] = 1;
    this.data[0][3] = x;
    this.data[1][3] = y;
    this.data[2][3] = z;
  }

  setScaleMatrix(x: number, y: number, z: number) {
    this.resetMatrix();
    this.data[0][0] = x;
    this.data[1][1] = y;
    this.data[2][2] = z;
    this.data[3][3] = 1;
  }

  setRotateOxMatrix(angle: number) {
    this.resetMatrix();
    this.data[0][0] = 1;
    this.data[1][1] = Math.cos(angle);
    this.data[1][2] = -Math.sin(angle);
    this.data[2][1] = Math.sin(angle);
    this.data[2][2] = Math.cos(angle);
    this.data[3][3] = 1;
  }

  setRotateOyMatrix(angle: number) {
    this.resetMatrix();
    this.data[0][0] = Math.cos(angle);
    this.data[1][1] = 1;
    this.data[2][0] = -Math.sin(angle);
    this.data[0][2] = Math.sin(angle);
    this.data[2][2] = Math.cos(angle);
    this.data[3][3] = 1;
  }

  setRotateOzMatrix(angle: number) {
    this.resetMatrix();
    this.data[0][0] = Math.cos(angle);
    this.data[0][1] = -Math.sin(angle);
    this.data[1][0] = Math.sin(angle);
    this.data[1][1] = Math.cos(angle);
    this.data[2][2] = 1;
    this.data[3][3] = 1;
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

  pointTransform(matrix: Matrix) {
    let result = [0, 0, 0, 0];
    let data = [this.x, this.y, this.z, 1];
    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        result[i] += data[j] * matrix.data[i][j];
      }
    }
    this.x = result[0];
    this.y = result[1];
    this.z = result[2];
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
