import { Component, OnInit } from '@angular/core';
import { latLng, tileLayer, Map, polygon, LatLng } from 'leaflet';
import { DrawPolygon } from './draw-polygon';
import { BotherService } from '../bother/bother-service'

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
        console.log(newPolygon[0], newPolygon[2]);
        this.BotherService.runBother();
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
