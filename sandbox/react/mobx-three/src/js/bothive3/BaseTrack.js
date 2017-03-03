import { Line } from 'three'

import Annotation from './Annotation'
import Point from './Point';

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function BaseTrack(trackJsonObj) {
  Line.call(this);
  this.castShadow = false;

  this.jsonObj = trackJsonObj;

  this.type = 'BASE_TRACK';
  this.name = this.jsonObj.trackSeq;
  this.index = this.jsonObj.trackIndex

  this.nodeSeq = this.jsonObj.nodeSeq;
  this.nodeType = this.jsonObj.nodeType;

  this.speedLimit = 1500;

  this.material = KOVAN.BaseTrackMaterial;

  this.initialize();

};

BaseTrack.prototype = Object.create(Line.prototype);
BaseTrack.prototype.constructor = BaseTrack;

BaseTrack.prototype.initialize = function() {
  this.pointA = new Point(0, 0, 0);
  this.pointB = new Point(0, 0, 0);
  this.reference = new Point(0, 0, 0);
  this.length = 0;

  this.createGeometry();
  // this.generateAnnotation();


}

BaseTrack.prototype.createGeometry = function() {
  console.log('adding geometry...');
}

BaseTrack.prototype.addAnnotation = function() {
  if (typeof document != 'undefined' && document) {
    if (!this.annotation) this.generateAnnotation();

    this.add(this.annotation);
  } else {
    if (KOVAN.LOG_ENABLED) console.log(`${this.name}: not running in browser environment, annotation will not be created.`);
  }
}

BaseTrack.prototype.generateAnnotation = function() {
  this.annotation = new Annotation(this.name + ': ' + KOVAN.RoundTo(this.length, 0), {fontsize: 24, scaleX: 500, scaleY: 250, offsetZ: 150});
  this.annotation.name = 'annotation';
}

BaseTrack.prototype.getLength = function() {
  return this.length;
};

BaseTrack.prototype.modifyPointSeq = function(pointSeq, modifier) {
  console.log(pointSeq + " " + this.pointA.name + " " + this.pointB.name);
  if (this.pointA.name == pointSeq) {
    this.pointA.name += modifier;
  }

  if (this.pointB.name == pointSeq) {
    this.pointB.name += modifier;
  }
}

BaseTrack.prototype.setZ = function(z) {
  this.position.z = z;
  this.pointA.z = z;
  this.pointB.z = z;
}

BaseTrack.prototype.shift = function(vector) {
  this.position.x += vector.x
  this.position.y += vector.y

  this.pointA.x += vector.x
  this.pointA.y += vector.y

  this.pointB.x += vector.x
  this.pointB.y += vector.y
}

export default BaseTrack;
