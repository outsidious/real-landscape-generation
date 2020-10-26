import { Component, OnInit } from '@angular/core';
import { latLng, tileLayer, Map, polygon, LatLng } from 'leaflet';
import { DrawPolygon } from './draw-polygon';
import { BotherService } from '../bother/bother-service'
import { stringify } from '@angular/compiler/src/util';

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
        attribution: '&copy; OpenStreetMap contributors',
      }),
    ],
    zoom: 6,
    center: latLng([46.879966, -121.726909]),
  };

  constructor(
    private BotherService: BotherService,
  ) {
    console.log("ok");
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
          if (newPolygon[i].lat <= newPolygon[indMin].lat && newPolygon[i].lng <= newPolygon[indMin].lng) {
            indMin = i;
          }
          if (newPolygon[i].lat >= newPolygon[indMax].lat && newPolygon[i].lng >= newPolygon[indMax].lng) {
            indMax = i;
          }
        }
        let arr1: number[] = [(newPolygon[indMin].lat), (newPolygon[indMin].lng)];
        let arr2: number[] = [(newPolygon[indMax].lat), (newPolygon[indMax].lng)];
        let arr: number[][] = [arr1, arr2];
        const bounds: string = JSON.stringify(arr);
        console.log(bounds);
        this.BotherService.runBother(bounds);
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
