import { ConditionalExpr } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { latLng, tileLayer, Map } from 'leaflet';
import { DrawPolygon } from "./draw-polygon";

@Component({
    selector: 'leaflet-map',
    templateUrl: './map-component.html',
    styleUrls: ['./map-component.css'],
  })
  export class MapComponent implements OnInit{
    map: Map;
    drawPolygon: DrawPolygon;
    drawPolygonState: Boolean = true;

    options = {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }),
      ],
      zoom: 7,
      center: latLng([46.879966, -121.726909]),
    };

    constructor() {}

    ngOnInit() {}

    mapEventHandler(e) {
      if (this.drawPolygonState) {
        const newPolygon = this.drawPolygon.drawEventHandler(e);
        if (newPolygon !== null) {
          console.log("Polygom handler!");
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