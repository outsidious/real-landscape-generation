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

export interface DialogData {
  bounds: string;
  height: string[];
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
      this.draw();
    }
  }

  loadInfo() {
    this.BotherService.botherSubject.subscribe((data) => {
      this.data.height = data;
      this.isLoaded = true;
    });
    this.isLoaded = false;
    this.wasDrawed = false;
  }

  draw() {
    var width = (this.canvas.nativeElement.width = window.innerWidth - 10);
    var height = (this.canvas.nativeElement.height = window.innerHeight - 50);
    let ctx = this.ctx;
    let p1 = new math.Point3d(300, 300, 0);
    let p2 = new math.Point3d(500, 300, 0);
    let p3 = new math.Point3d(500, 500, 0);
    let p4 = new math.Point3d(300, 500, 0);
    let rect = new rectl.Rect3d(p1, p2, p3, p4);
    let scale_coef = new math.Point2d(1, 1);
    let cam_pos = new math.Point3d(0, 0, 300);
    let cam_p1 = new math.Point3d(1, 0, 300);
    let cam_p2 = new math.Point3d(0, 1, 300);
    let cam_view_p = new math.Point3d(400, 400, 0);
    let cam = new caml.Camera(cam_pos, cam_p1, cam_p2, cam_view_p);
    rect.draw(ctx, cam, scale_coef);

    let cameraRotating = false;
    let x = 0;
    let y = 0;

    window.onmousedown = function (e) {
      x = e.offsetX;
      y = e.offsetY;
      cameraRotating = true;
    };
    window.onmousemove = function (e) {
      if (cameraRotating) {
        var xDif = e.offsetX - x;
        var yDif = e.offsetY - y;
        cam.rotateAroundZ(xDif * 0.004);
        cam.rotateAroundX(yDif * 0.003);
        console.log(cam.position.getDist(cam_view_p));
        ctx.clearRect(0, 0, width, height);
        rect.draw(ctx, cam, scale_coef);
        x = e.offsetX;
        y = e.offsetY;
      }
    };
    window.onmouseup = function (e) {
      cameraRotating = false;
    };

    window.onmousewheel = function (e: any) {
      /*
      if (e.target.id === "slider-'.$question_id.'") {
        if (!e) {
          e = window.event;
        } 
        if (e.preventDefault) {
          e.preventDefault();
        } 
        e.returnValue = false; 
      }*/
      if (e.wheelDelta > 0) {
        scale_coef.x *= 1.1;
        scale_coef.y *= 1.1;
      } else {
        scale_coef.x /= 1.1;
        scale_coef.y /= 1.1;
      }
      //console.log(scale_coef);
      ctx.clearRect(0, 0, width, height);
      rect.draw(ctx, cam, scale_coef);
    };
  }

  public close() {
    this.dialogRef.close();
  }

  ngOnInit() {}

  ngOnDestroy() {}
}
