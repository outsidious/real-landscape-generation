import { Component, OnInit, NgZone } from '@angular/core';
import { latLng, tileLayer, Map, polygon, LatLng } from 'leaflet';
import { DrawPolygon } from './draw-polygon';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog-component/dialog-component';

@Component({
  selector: 'leaflet-map',
  templateUrl: './map-component.html',
  styleUrls: ['./map-component.css'],
})
export class MapComponent {
  map: Map;
  drawPolygon: DrawPolygon;
  drawPolygonState: Boolean = true;

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
      }),
    ],
    zoom: 6,
    center: latLng([50, -10]),
  };

  constructor(private dialog: MatDialog, private ngZone: NgZone) {}

  private openDialog(height_map: string[], _bounds: string) {
    this.ngZone.run(() => {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          bounds: _bounds,
        },
        maxWidth: '100%',
        maxHeight: '100%',
        width: '100%',
        height: '100%',
      });
    });
  }

  mapEventHandler(e) {
    if (this.drawPolygonState) {
      const newPolygon = this.drawPolygon.drawEventHandler(e);
      if (newPolygon !== null) {
        const leafletPolygon = polygon(newPolygon, { color: 'orange' });
        leafletPolygon.addTo(this.map);
        let indMin = 0;
        let indMax = 0;
        for (let i = 1; i < 4; ++i) {
          if (
            newPolygon[i].lat <= newPolygon[indMin].lat &&
            newPolygon[i].lng <= newPolygon[indMin].lng
          ) {
            indMin = i;
          }
          if (
            newPolygon[i].lat >= newPolygon[indMax].lat &&
            newPolygon[i].lng >= newPolygon[indMax].lng
          ) {
            indMax = i;
          }
        }
        let dif = Math.max(
          newPolygon[indMax].lat - newPolygon[indMin].lat,
          newPolygon[indMax].lng - newPolygon[indMin].lng
        );
        let arr1: number[] = [newPolygon[indMin].lat, newPolygon[indMin].lng];
        let arr2: number[] = [
          newPolygon[indMin].lat + dif,
          newPolygon[indMin].lng + dif,
        ];
        let arr: number[][] = [arr1, arr2];
        const bounds: string = JSON.stringify(arr);
        //console.log(bounds);
        this.openDialog([], bounds);
        leafletPolygon.remove();
      }
    }
  }

  onMapReady(map: Map) {
    this.map = map;
    this.drawPolygonState = true;
    this.drawPolygon = new DrawPolygon(map);
    this.map.on('contextmenu', this.mapEventHandler, this);
    this.map.on('mousemove', this.mapEventHandler, this);
  }
}
