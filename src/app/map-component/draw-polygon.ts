import {
  LatLng,
  Polygon,
  Map,
  marker,
  Marker,
  divIcon,
  polyline,
  Polyline,
  latLng,
  polygon,
} from 'leaflet';

const pointHtmlStyles = `
    background-color: #FF8C00;
    width: 2rem;
    height: 2rem;
    display: block;
    left: -0.5rem;
    top: -0.5rem;
    position: relative;
    border-radius: 2rem 2rem 2rem 2rem;
    border: 1px solid #FFFFFF`;

const icon = divIcon({
  className: 'my-custom-pin',
  html: `<span style="${pointHtmlStyles}" />`,
});

export class DrawPolygon {
  startPoint: LatLng;
  finishPoint: LatLng;
  latlngArr: LatLng[];
  polylines: Polygon[];
  points: Marker[];
  startDrawing: boolean;
  map: Map;

  constructor(map: Map) {
    this.latlngArr = [];
    this.polylines = [];
    this.points = [];
    this.map = map;
    this.startDrawing = false;
  }

  reset() {
    this.polylines.forEach((p) => {
      this.map.removeLayer(p);
    });
    this.polylines = [];
    this.points.forEach((p) => {
      this.map.removeLayer(p);
    });
  }

  drawEventHandler(e): number[][] | null {
    if (e.type === 'mousemove') {
      console.log(this.startDrawing);
      if (this.startDrawing === true) {
        this.finishPoint = e.latlng;
        this.draw();
        return null;
      } else {
        return null;
      }
    } else if (e.type === 'contextmenu') {
      if (!this.startDrawing) {
        this.points = [];
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
        return this.closePolygon();
      }
    }
  }

  draw() {
    this.points.slice(1);
    this.reset();
    let newPoint = marker(this.finishPoint, { icon: icon });
    newPoint.addTo(this.map);
    this.points.push(newPoint);
    newPoint = marker([this.startPoint.lat, this.finishPoint.lng], {
      icon: icon,
    });
    newPoint.addTo(this.map);
    this.points.push(newPoint);
    newPoint = marker([this.finishPoint.lat, this.startPoint.lng], {
      icon: icon,
    });
    newPoint.addTo(this.map);
    this.points.push(newPoint);

    const newLine = polygon(
      this.points.map((p) => p.getLatLng()),
      { color: 'orange' }
    );
    newLine.addTo(this.map);
    this.polylines.push(newLine);
  }

  closePolygon(): number[][] {
    for (const line of this.polylines) {
      line.remove();
    }
    for (const point of this.points) {
      point.remove();
    }
    const res = this.points.map((p) => [p.getLatLng().lat, p.getLatLng().lng]);
    res.push([this.points[0].getLatLng().lat, this.points[0].getLatLng().lng]);
    this.points = [];
    this.polylines = [];
    return res;
  }
}
