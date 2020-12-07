import { Canvas } from 'leaflet';
import * as cam from './camera';
import * as math from './math';
import * as rect from './rect';

export class Scene {
  camera: cam.Camera;
  ctx: CanvasRenderingContext2D;
  moveCoef: math.Point2d;
  scaleCoef: math.Point2d;
  width: number;
  height: number;
  center: math.Point2d;

  constructor(
    _camera: cam.Camera,
    _ctx: CanvasRenderingContext2D,
    _moveCoef: math.Point2d,
    _scaleCoef: math.Point2d,
    _width: number,
    _height: number
  ) {
    this.camera = _camera;
    this.ctx = _ctx;
    this.moveCoef = _moveCoef;
    this.scaleCoef = _scaleCoef;
    this.width = _width;
    this.height = _height;
    this.center = new math.Point2d(_width / 2, _height / 2);
  }

  drawCollection(collection: {"rect": rect.Rect3d, "style": string}[]) {
    collection.forEach(element => {
        element.rect.draw(this.ctx, this.camera, this.center, this.scaleCoef, this.moveCoef, element.style);
    });
  }

  clearScene() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
