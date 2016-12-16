import BaseBox from './BaseBox.js';

import * as CONSTANTS from './Constants'
import { PLAY_SPEED } from './Configurations'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function BaseCarrier() {
    BaseBox.call(this);

    this.speed = 0;
    this.acceleration = 0;
    this.targetSpeed = 0;

    this.reversed = false;
    this.stopwatch = 0;

    this.trace = []; // position and direction history
    this.rack;
    this.armLength;
}

BaseCarrier.prototype = Object.create(BaseBox.prototype);
BaseCarrier.prototype.constructor = BaseCarrier;

BaseCarrier.prototype.setCurve = function(curve, reference, options) {
    this.curve = curve;
    this.reference = reference;

    var options = options || {},
        reversed = options.reversed || false,
        offset = options.offset || 0;

    this.reversed = reversed;

    if (offset > 0) {
        var distance = this.curve.getLength(),
            division = Math.floor(distance * 10);

        this.stopwatch = offset / distance * division;
    } else {
        this.stopwatch = 0;
    }
}

BaseCarrier.prototype.setRack = function(rack) {
  this.rack = rack;
  this.rack.setCarrier(this);
}

BaseCarrier.prototype.move = function(deltaTime) {
    // if ((CONSTANTSSECOND / deltaTime) <= 10) return false;

    var distance = this.curve.getLength(),
        division = Math.floor(distance * 10),
        increment = division * this.speed * deltaTime * PLAY_SPEED / (distance * CONSTANTSSECOND);

    var t = this.stopwatch / division;

    // console.log(t);

    var extension = 0;
    if (t > 1) {
        extension = t - 1;
        t = 1;
    } else if (t < 0) {
        extension = t;
        t = 0;
    }

    var multiplier = this.reversed ? -1 : 1;

    t = this.reversed ? 1 - t : t;

    var direction = this.curve.getTangentAt(t),
        dx = direction.x,
        dy = direction.y;

    // LOCATION
    this.position.copy(this.reference);
    var point = this.curve.getPointAt(t);
    this.position.x += (point.x + extension * multiplier * distance * dx);
    this.position.y += (point.y + extension * multiplier * distance * dy);

    // DIRECTION
    var angle = Math.atan(dy / dx);
    this.rotation.z = angle;

    // ACCELERATION
    if ((this.acceleration > 0 && this.speed >= this.targetSpeed) || (this.acceleration < 0 && this.speed <= this.targetSpeed)) {
      this.speed = this.targetSpeed;
      this.acceleration = 0;
    } else if (this.acceleration != 0) {
        this.accelerate(deltaTime);
    }

    // RUN STOPWATCH
    this.stopwatch += increment;

    if (this.rack) {
        this.drag();
    }

    // console.log('point: ' + point.x + ' ' + point.y);
    // console.log('mover position: ' + this.position.x + ' ' + this.position.y + ' ' + this.position.z);

    return false;
}

BaseCarrier.prototype.accelerate = function(deltaTime) {
    var convertedAcceleration = this.acceleration * deltaTime / CONSTANTSSECOND;

    this.speed += convertedAcceleration;
}

BaseCarrier.prototype.drag = function() {
    // record current position and direction
    var currentTrace = {
        position: this.position.clone(),
        direction: this.rotation.clone()
    };
    this.trace.push(currentTrace);

    var exceededXY = false;

    // get current position and rotation of rack
    // from trace
    for (let i = 0; i < this.trace.length; i++) {
        var trace = this.trace[i],
            position = trace.position;

        var distanceXY = Math.sqrt(Math.pow(this.position.x - position.x, 2) + Math.pow(this.position.y - position.y, 2));

        if (Math.ceil(distanceXY) < this.armLength) {
            if (exceededXY) {
                this.trace.splice(0, i);

                this.rack.position.copy(position);
                this.rack.rotation.copy(trace.direction);
            }

            break;
        }

        if (Math.floor(distanceXY) > this.armLength) {
            exceededXY = true;
            continue;
        }


    }

    // for escalating
    var lastPosition = this.trace[this.trace.length - 2];

    if (lastPosition) {
        if (lastPosition.z != this.position.z) {
            this.rack.position.z = this.position.z;
        }
    }

};

export default BaseCarrier;
