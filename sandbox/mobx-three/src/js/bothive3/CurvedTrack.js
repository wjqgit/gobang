import BaseTrack from './BaseTrack';
import Point from './Point';

import { CurveGeometryResolution } from './Configurations'
import { GetEllipseCurvePath, GetEllipseCurveGeometry } from './Utils'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function CurvedTrack(trackJsonObj) {
  BaseTrack.call(this, trackJsonObj);

  this.type = this.jsonObj.trackType || 'CURVED_TRACK';

}

CurvedTrack.prototype = Object.create(BaseTrack.prototype);
CurvedTrack.prototype.constructor = CurvedTrack;

CurvedTrack.prototype.initialize = function() {
  this.radius = this.jsonObj.radius || 140;

  this.pointA = new Point(this.jsonObj.pointA);
  this.pointB = new Point(this.jsonObj.pointB);
  this.center = new Point(this.jsonObj.center);

  this.reference = this.center

  this.startAngle = this.jsonObj.startAngle;
  this.endAngle = this.jsonObj.endAngle;

  this.clockwise = this.jsonObj.clockwise || false;

  this.angle = this.clockwise ? this.startAngle - this.endAngle : this.endAngle - this.startAngle;
  this.angle = this.angle < 0 ? this.angle + 2 * Math.PI : this.angle;

  this.length = this.jsonObj.lenght || this.radius * this.angle;

  this.createGeometry();
}

CurvedTrack.prototype.createGeometry = function() {
  // var resolution = Math.floor(this.length / 30); // CM Accuracy
  var resolution = CurveGeometryResolution;

  // this.curve = new THREE.CurvePath();
  // this.curve.add(new THREE.EllipseCurve(
  //   0, 0,
  //   this.radius, this.radius,
  //   this.startAngle, this.endAngle,
  //   this.clockwise,
  // 0));
  //
  // this.geometry = this.curve.createPointsGeometry(resolution);

  this.curve = GetEllipseCurvePath(this.radius, this.radius, this.startAngle, this.endAngle, this.clockwise);
  this.geometry = GetEllipseCurveGeometry(this.radius, this.radius, this.startAngle, this.endAngle, this.clockwise, resolution);

  this.position.set(this.center.x, this.center.y, this.center.z);

}

export default CurvedTrack;
