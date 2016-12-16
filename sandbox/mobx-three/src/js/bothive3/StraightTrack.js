import BaseTrack from './BaseTrack';
import Point from './Point';
import { GetLineCurvePath, GetLineCurveGeometry } from './Utils'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function StraightTrack(trackJsonObj) {
  BaseTrack.call(this, trackJsonObj);

  this.type = this.jsonObj.trackType || 'STRAIGHT_TRACK';

}

StraightTrack.prototype = Object.create(BaseTrack.prototype);
StraightTrack.prototype.constructor = StraightTrack;

StraightTrack.prototype.initialize = function() {
  this.pointA = new Point(this.jsonObj.pointA);
  this.pointB = new Point(this.jsonObj.pointB);
  this.reference = this.pointA;
  this.vector = new THREE.Vector3();
  this.vector.subVectors(this.pointB, this.pointA);
  // this.length = this.pointA.distanceTo(this.pointB);
  this.length = this.jsonObj.length ? this.jsonObj.length : this.pointA.distanceTo(this.pointB);

  this.createGeometry();
}

StraightTrack.prototype.createGeometry = function() {
  var resolution = Math.floor(this.length / 100); // DM Accuracy

  // this.curve = new THREE.CurvePath();
  // this.curve.add(new THREE.LineCurve(
  //   new THREE.Vector2(0, 0),
  //   new THREE.Vector2(this.vector.x, this.vector.y)));
  //
  // this.geometry = this.curve.createPointsGeometry(resolution);

  this.curve = GetLineCurvePath(this.vector);
  this.geometry = GetLineCurveGeometry(this.vector, resolution)

  this.position.set(this.pointA.x, this.pointA.y, this.pointA.z);
}

export default StraightTrack;
