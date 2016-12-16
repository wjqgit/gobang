import { BoxGeometry } from 'three'
import BaseFixedCarrier from './BaseFixedCarrier.js';

import * as CONSTANTS from './Constants'
import { PusherLength, PusherWidth, PusherHeight, PusherStartDistance, PusherEndDistance, INFO_ENABLED } from './Configurations'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function Pusher(pushArea, options) {
    BaseFixedCarrier.call(this);

    this.type = CONSTANTS.PUSHER;

    this.pushArea = pushArea;

    this.storageUnit;
    this.side;

    var options = options || {};

    this.name = options.name || 'PS-UNKNOWN';

    this.side = options.side;

    this.length = options.length || PusherLength;
    this.width = options.width || PusherWidth;
    this.height = options.height || PusherHeight;

    this.speedLimit = options.speedLimit || 2000;
    this.acceleration = options.acceleration || 10000;

    this.trackLength = this.pushArea.getCurvePathByDirection('AE').curve.getLength();

    this.startLocation = options.startLocation || PusherStartDistance / this.trackLength;
    this.endLocation = options.endLocation || PusherEndDistance / this.trackLength;

    this.pushing = false;
    this.resuming = false;
    this.clearing = false;

    this.armLength = options.armLength || this.length / 2;

    this.geometry = options.geometry !== undefined ? options.geometry : new BoxGeometry(this.length, this.width, this.height);
    if (options.material !== undefined) this.material = options.material;

}

Pusher.prototype = Object.create(BaseFixedCarrier.prototype);
Pusher.prototype.constructor = Pusher;

Pusher.prototype.push = function(deltaTime) {
    if (!this.pushing) return false;

    this.pushing = this.move(deltaTime, false, this.endLocation);

    // Unbind Rack
    // if (!this.pushing && this.rack) {
    if (!this.pushing) this.onPushEnded();
}

Pusher.prototype.resume = function(deltaTime) {
    if (!this.resuming) return false;

    this.resuming = this.move(deltaTime, true, this.startLocation);
}

Pusher.prototype.clear = function(deltaTime) {
    if (!this.clearing) return false;

    this.clearing = this.move(deltaTime, false);
}

Pusher.prototype.act = function(deltaTime) {
    if (this.pushing) {
        this.push(deltaTime);
    } else if (this.resuming) {
        this.resume(deltaTime);
    } else if (this.clearing) {
        this.clear(deltaTime);
    }
}

Pusher.prototype.onStartPushRack = function(rack, speed) {
    if (INFO_ENABLED) console.info(`${this.name} starts pushing rack.`);

    if (this.resuming) {
        this.updatePosition(this.startLocation);
        this.resuming = false;
    }

    this.setRack(rack);
    this.speed = speed;

    this.setStopwatch(this.startLocation, false)

    this.pushing = true;
}

Pusher.prototype.onStartResume = function(speed) {
    if (INFO_ENABLED) console.info(`${this.name} starts returning.`);

    if (this.pushing) {
        this.updatePosition(this.endLocation);
        this.pushing = false;
        this.onPushEnded();
    }

    this.speed = speed;

    this.setStopwatch(this.endLocation, true);

    this.resuming = true;
}

Pusher.prototype.onPushEnded = function() {
    this.storageUnit.removeRack(this.rack); // remove the rack from scene
    this.rack = null;
    this.storageUnit.storeRack(this.side);
}

Pusher.prototype.onMove = function(vector) {
    if (this.pushing) this.updateRackPosition(vector);
}

Pusher.prototype.updateRackPosition = function(vector) {
    if (!this.rack) console.error(`${this.name} is pushing with no rack `);
    else this.rack.shift(vector);
}

Pusher.prototype.getStatus = function() {
    let status = {};

    status.pusherSeq = this.name;

    status.pushing = this.pushing;
    status.resuming = this.resuming;

    status.stopwatch = this.stopwatch;

    return status;
}

Pusher.prototype.setStatus = function(status) {
    for (let i in status) {
        if (i != 'pusherSeq') {
            this[i] = status[i];
        }
    }

}

export default Pusher
