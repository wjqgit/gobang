import BaseRail from './BaseRail.js';
import CurvePath from './CurvePath.js';
import PathTag from './PathTag.js';

import * as CONSTANTS from './Constants'
import { RenderTrackMaterial } from './Configurations'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function EscalatorCar(carJsonObj, options) {
  BaseRail.call(this, carJsonObj, options);

  this.type = this.jsonObj.type || CONSTANTS.ESCALATOR_CAR;
  this.name = this.jsonObj.carSeq;

  this.carNum = this.jsonObj.carNum;
  this.length = this.jsonObj.length;

  this.escalatorSeq = this.jsonObj.escalatorSeq;
  this.floorNum;

  this.mover;

  this.setTrackMaterial();

  this.setVisible(false);
}

EscalatorCar.prototype = Object.create(BaseRail.prototype);
EscalatorCar.prototype.constructor = EscalatorCar;

EscalatorCar.prototype.initialize = function() {
  this.addTracks();
  this.addTags();
  this.addPointMarks();
  this.setCurvePath();
}

EscalatorCar.prototype.setCurvePath = function() {
  var track = this.getTrack();

  this.curvePath = new CurvePath();

  this.curvePath.curve = track.curve;

  var tag = this.getTagA();

  var pathTag = new PathTag(tag.name, tag.distanceFromPointA);

  this.curvePath.add(pathTag);
}

EscalatorCar.prototype.setTrackMaterial = function() {
  var track = this.getTrack();

  track.material = RenderTrackMaterial;
}

EscalatorCar.prototype.setFloorNum = function(floorNum) {
  this.floorNum = floorNum;
}

EscalatorCar.prototype.getVisible = function() {
  var track = this.getTrack();

  return track.visbile;
}

EscalatorCar.prototype.setVisible = function(visible) {
  // for (var i in this.tracks.children) {
  //   this.tracks.children[i].visible = visible;
  // }
  this.visible = visible;
}

EscalatorCar.prototype.setZ = function(z) {
  // track
  var track = this.getTrack();

  track.setZ(z);

  // point mark
  var pointAMark = this.getObjectByName(this.getPointA().name),
    pointBMark = this.getObjectByName(this.getPointB().name);

  pointAMark.position.z = z;
  pointBMark.position.z = z;

  // tag
  var tag = this.getTagA();
  tag.position.z = z;
}

export default EscalatorCar;
