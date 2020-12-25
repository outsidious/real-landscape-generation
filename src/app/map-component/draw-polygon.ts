import {
  LatLng,
  Polygon,
  Map,
  marker,
  Marker,
  divIcon,
  polygon,
} from 'leaflet';

const pointHtmlStyles = `
    background-color: #FF8C00;
    width: 1rem;
    height: 1rem;
    display: block;
    left: -0.25rem;
    top: -0.25rem;
    position: relative;
    border-radius: 1rem 1rem 1rem 1rem;
    border: 1px solid #FFFFFF`;

const icon = divIcon({
  className: 'my-custom-pin',
  html: `<span style="${pointHtmlStyles}" />`,
});

export class DrawPolygon {
  startPoint: LatLng;
  finishPoint: LatLng;
  latlngArr: LatLng[];
  polygon: Polygon;
  points: Marker[];
  startDrawing: boolean;
  map: Map;

  constructor(map: Map) {
    this.latlngArr = [];
    this.polygon = null;
    this.points = [];
    this.map = map;
    this.startDrawing = false;
  }

  reset() {
    if (this.polygon) {
      this.map.removeLayer(this.polygon);
    }
    this.polygon = null;
    this.points.forEach((p) => {
      this.map.removeLayer (p);
    });
    this.points = [];
  }

  drawEventHandler(e): LatLng[] | null {
    if (e.type === 'mousemove') {
      if (this.startDrawing === true) {
        this.finishPoint = e.latlng;
        //console.log(e);
        this.draw();
        return null;
      } else {
        return null;
      }
    } else if (e.type === 'contextmenu') {
      if (!this.startDrawing) {
        this.reset();
        this.startPoint = e.latlng;
        this.finishPoint = this.startPoint;
        const newPoint = marker(this.startPoint, { icon: icon });
        newPoint.addTo(this.map);
        this.points.push(newPoint);
        this.startDrawing = true;
        return null;
      } else {
        this.startDrawing = false;
        this.finishPoint = e.latLng;
        return this.closePolygon();
      }
    }
  }

  draw() {
    this.reset();
    let newPoint = marker(this.startPoint, { icon: icon });
    newPoint.addTo(this.map);
    this.points.push(newPoint);
    //let dif = this.finishPoint.lat - this.startPoint.lat;
    //this.finishPoint.lat = this.startPoint.lat + dif;
    //this.finishPoint.lng = this.startPoint.lng + dif;
    newPoint = marker([this.startPoint.lat, this.finishPoint.lng], {
      icon: icon,
    });
    newPoint.addTo(this.map);
    this.points.push(newPoint);
    newPoint = marker(this.finishPoint, { icon: icon });
    newPoint.addTo(this.map);
    this.points.push(newPoint);
    newPoint = marker([this.finishPoint.lat, this.startPoint.lng], {
      icon: icon,
    });
    newPoint.addTo(this.map);
    this.points.push(newPoint);

    const newPolygon = polygon(
      this.points.map((p) => p.getLatLng()),
      { color: 'orange' }
    );
    newPolygon.addTo(this.map);
    this.polygon = newPolygon;
  }

  closePolygon(): LatLng[]{
    if (this.polygon) {
      this.map.removeLayer(this.polygon);
    }
    for (const point of this.points) {
      point.remove();
    }
    const res = this.points.map((p) => p.getLatLng());
    this.points = [];
    this.polygon = null;
    return res;
  }
}
