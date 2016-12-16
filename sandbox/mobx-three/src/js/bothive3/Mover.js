import BoxGeometry from 'three'

import BaseCarrier from './BaseCarrier.js'

import * as CONSTANTS from './Constants'
import { MoverLength, MoverWidth, MoverHeight } from './Configurations'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function Mover(geometry, material, options) {
  BaseCarrier.call(this);

  this.type = CONSTANTS.MOVER;

  var options = options || {};

  this.length = options.length || MoverLength;
  this.width = options.width || MoverWidth;
  this.height = options.height || MoverHeight;

  this.acceleration = 0;
  this.speedLimit = options.speedLimit || 5000;
  // this.braking = false;

  this.node;
  this.direction; // node passing direction
  this.armLength = options.armLength || this.length / 2;

  this.escalating = false;

  this.geometry = new BoxGeometry(this.length, this.width, this.height);
  // this.geometry = geometry !== undefined ? geometry : new BoxGeometry(this.length, this.width, this.height);
  if (material !== undefined) this.material = material;

};

Mover.prototype = Object.create(BaseCarrier.prototype);
Mover.prototype.constructor = Mover;

Mover.prototype.turn = function() {
  this.reversed = !this.reversed;

  var distance = this.track.length,
    division = Math.floor(distance * 10);

  this.stopwatch = division - this.stopwatch;
}

Mover.prototype.releaseRack = function() {
  this.rack = null;
}

Mover.prototype.setReversed = function(reversed) {
  if (this.reversed != reversed) {
    this.reversed = reversed;

    var distance = this.curve.getLength(),
      division = Math.floor(distance * 10);

    this.stopwatch = division - this.stopwatch;
  }
}

Mover.prototype.getStatus = function() {
  let status = {};

  status.moverSeq = this.name;

  status.direction = this.direction;
  status.nodeSeq = this.node.name;

  status.speed = this.speed;
  status.acceleration = this.acceleration;
  status.targetSpeed = this.targetSpeed;

  status.stopwatch = this.stopwatch;

  return status;
}

Mover.prototype.setStatus = function(status) {
  this.direction = status.direction;
  this.node = status.node;

  this.reversed = this.node.getReversedByDirection(this.direction);

  let curvePath = this.node.getCurvePathByDirection(this.direction);
  this.curve =  curvePath.curve;

  this.reference = this.node.getReferenceByDirection(this.direction);

  this.speed = status.speed;
  this.acceleration = status.acceleration;
  this.targetSpeed = status.targetSpeed;

  this.stopwatch = status.stopwatch;
}

export default Mover;
