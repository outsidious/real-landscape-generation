import {
  Component,
  OnDestroy,
  Inject,
  ViewChild,
  OnInit,
  ElementRef,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BotherService } from '../bother/bother-service';
import * as math from '../graphics/math';
import * as rectl from '../graphics/rect';
import * as caml from '../graphics/camera';
import * as scene from '../graphics/scene';

export interface DialogData {
  bounds: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog-component.html',
  styleUrls: ['./dialog-component.css'],
})
export class DialogComponent implements OnDestroy, OnInit {
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  private ctx: CanvasRenderingContext2D;
  isLoaded: boolean;
  wasDrawed: boolean;
  picInfo: { width: number; height: number; heightMap: number[] } = null;
  rectCollection: { rect: rectl.Rect3d; style: string }[] = [];
  scene: scene.Scene = null;

  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    private BotherService: BotherService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.loadInfo();
    this.BotherService.runBother(this.data.bounds);
  }

  ngAfterViewChecked() {
    if (this.isLoaded && !this.wasDrawed) {
      this.ctx = (this.canvas.nativeElement as HTMLCanvasElement).getContext(
        '2d'
      );
      this.wasDrawed = true;
      //this.processHeughtMap();
      this.createScene();
      this.draw();
    }
  }

  loadInfo() {
    this.BotherService.botherSubject.subscribe((data) => {
      this.picInfo = JSON.parse(data);
      //console.log(this.picInfo);
      this.isLoaded = true;
    });
    this.isLoaded = false;
    this.wasDrawed = false;
  }

  getHeight(x: number, y: number) {
    if (this.picInfo == null) {
      return -1;
    }
    if (x < 0 || y < 0) {
      return -1;
    }
    if (x >= this.picInfo.width || y >= this.picInfo.height) {
      return -1;
    }
    return this.picInfo.heightMap[y * this.picInfo.width + x];
  }

  /*brightness(x: number, y: number, slope: number) {
    if (y === this.picInfo.height || x === this.picInfo.width) return '#000';
    var b = ~~(slope * 50) + 128;
    return ['rgba(', b, ',', b, ',', b, ',1)'].join('');
  }*/

  processHeughtMap() {
    this.rectCollection = [];
    for (let j = 0; j < this.picInfo.height; ++j) {
      for (let i = 0; i < this.picInfo.width; ++i) {
        let point = new math.Point3d(i, j, this.getHeight(i, j));
        let newRect = new rectl.Rect3d(point, point, point, point);
        //newRect.createRectByPoint(point);
        //let style = this.brightness(i, j, this.getHeight(i + 1, j));
        //this.rectCollection.push({ rect: newRect, style: style });
      }
    }
  }

  createScene() {
    let width = (this.canvas.nativeElement.width = window.innerWidth - 10);
    let height = (this.canvas.nativeElement.height = window.innerHeight - 50);
    let moveX = width / 2 - this.picInfo.width / 2;
    let moveY = height / 2 - this.picInfo.height / 2;
    let moveCoef = new math.Point2d(moveX, moveY);
    let scale_coef = new math.Point2d(1, 1);
    let cam_pos = new math.Point3d(0, 0, 300);
    let cam_p1 = new math.Point3d(1, 0, 300);
    let cam_p2 = new math.Point3d(0, 1, 300);
    let cam_view_p = new math.Point3d(
      this.picInfo.width / 2,
      this.picInfo.height / 2,
      0
    );
    let cam = new caml.Camera(cam_pos, cam_p1, cam_p2, cam_view_p);
    let _scene = new scene.Scene(
      cam,
      this.ctx,
      moveCoef,
      scale_coef,
      width,
      height
    );
    this.scene = _scene;
  }

  draw() {
    var waterVal = 5;
    var ctx = this.ctx;
    var picInfo = this.picInfo;
    let width = (this.canvas.nativeElement.width = window.innerWidth - 10);
    let height = (this.canvas.nativeElement.height = window.innerHeight - 50);
    for (var y = 0; y < this.picInfo.height; y++) {
      for (var x = 0; x < this.picInfo.width; x++) {
        var val = this.getHeight(x, y);
        var top = project(x, y, val);
        var bottom = project(x + 1, y, 0);
        var water = project(x, y, waterVal);
        var style = brightness(x, y, this.getHeight(x + 1, y) - val);

        rect(top, bottom, style);
        rect(water, bottom, 'rgba(50, 150, 200, 0.15)');
      }
    }

    function rect(a, b, style) {
      if (b.y < a.y) return;
      ctx.fillStyle = style;
      ctx.fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
    }

    function brightness(x: number, y: number, slope: number) {
      if (y === picInfo.height || x === picInfo.width) return '#000';
      var b = ~~(slope * 50) + 128;
      return ['rgba(', b, ',', b, ',', b, ',1)'].join('');
    }

    function iso(x, y) {
      return {
        x: 0.5 * (picInfo.height + x - y),    //?????????????
        y: 0.5 * (x + y)
      };
    }

    function project(flatX, flatY, flatZ) {
      var point = iso(flatX, flatY);
      var x0 = width * 0.5;
      var y0 = height * 0.2;
      var z = picInfo.height * 0.5 - flatZ + point.y * 0.75;
      var x = (point.x - picInfo.height * 0.5) * 6;
      var y = (picInfo.height - point.y) * 0.005 + 1;

      return {
        x: x0 + x / y,
        y: y0 + z / y
      };
    }
    /*
    let cameraRotating = false;
    let x = 0;
    let y = 0;
    this.scene.drawCollection(this.rectCollection);
    let scene = this.scene;
    let collection = this.rectCollection;

    window.onmousedown = function (e) {
      x = e.offsetX;
      y = e.offsetY;
      cameraRotating = true;
    };
    window.onmousemove = function (e) {
      if (cameraRotating) {
        var xDif = e.offsetX - x;
        var yDif = e.offsetY - y;
        scene.camera.rotateAroundZ(xDif * 0.004);
        scene.camera.rotateAroundX(yDif * 0.003);
        //console.log(cam.position.getDist(cam_view_p));
        scene.clearScene();
        scene.drawCollection(collection);
        x = e.offsetX;
        y = e.offsetY;
      }
    };
    window.onmouseup = function (e) {
      cameraRotating = false;
    };
    
  
    window.onmousewheel = function (e: any) {
      if (e.wheelDelta > 0) {
        scene.scaleCoef.x *= 1.1;
        scene.scaleCoef.y *= 1.1;
      } else {
        scene.scaleCoef.x /= 1.1;
        scene.scaleCoef.y /= 1.1;
      }
      //console.log(scale_coef);
      scene.clearScene();
      scene.drawCollection(collection);
    };*/
  }

  public close() {
    this.dialogRef.close();
  }

  ngOnInit() {}

  ngOnDestroy() {}
}
