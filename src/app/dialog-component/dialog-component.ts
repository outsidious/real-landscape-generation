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
import { Subscription }  from 'rxjs'
import * as tile from '../graphics/tile';

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
  botherSubscription: Subscription;

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
      this.createScene();
      this.draw();
    }
  }

  loadInfo() {
    this.botherSubscription = this.BotherService.botherSubject.subscribe((data) => {
      this.picInfo = JSON.parse(data);
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

  createScene() {
    this.ctx = (this.canvas.nativeElement as HTMLCanvasElement).getContext(
      '2d'
    );
    this.wasDrawed = true;
  }

  draw() {
    var waterVal = 5;
    var picInfo = this.picInfo;
    let width = (this.canvas.nativeElement.width = window.innerWidth - 10);
    let height = (this.canvas.nativeElement.height = window.innerHeight - 50);
    for (var y = 0; y < this.picInfo.height; y++) {
      for (var x = 0; x < this.picInfo.width; x++) {
        var val = this.getHeight(x, y);
        var p1 = new math.Point3d(x, y, val);
        var p2 = new math.Point3d(x + 1, y, 0);
        var water_p = new math.Point3d(x, y, waterVal); 
        var top = p1.project(this.picInfo.width, width, height);
        var bottom = p2.project(this.picInfo.width, width, height);
        var water_proj = water_p.project(this.picInfo.width, width, height);
        var land = new tile.Tile(top, bottom);
        var water = new tile.Tile(water_proj, bottom);
        var style = brightness(x, y, this.getHeight(x + 1, y) - val);
        land.draw(this.ctx, style);
        water.draw(this.ctx, 'rgba(50, 150, 200, 0.15)')
      }
    }

    function brightness(x: number, y: number, slope: number) {
      if (y === picInfo.height || x === picInfo.width) return '#000';
      var b = ~~(slope * 50) + 128;
      return ['rgba(', b, ',', b, ',', b, ',1)'].join('');
    }
  }

  public close() {
    this.dialogRef.close();
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.botherSubscription) {
      this.botherSubscription.unsubscribe;
    }
  }
}
