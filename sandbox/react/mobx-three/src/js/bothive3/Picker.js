import { BoxGeometry } from 'three'

import BaseFixedCarrier from './BaseFixedCarrier.js';
import StraightTrack from './StraightTrack.js';

import * as CONSTANTS from './Constants'
import { PickerLength, PickerWidth, PickerHeight, PickerStandbyDistance, PickerDropoffDistances, PickingSpeed, PLAY_SPEED, LOG_ENABLED } from './Configurations'
import { RectifyAngle } from './Utils'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

// TODO
function Picker(storageUnit, options) {
    BaseFixedCarrier.call(this);

    this.type = CONSTANTS.PICKER;

    this.storageUnit = storageUnit;
    this.shipmentArea;

    var options = options || {};

    this.name = options.name || 'PK-UNKNOWN';

    this.length = options.length || PickerLength;
    this.width = options.width || PickerWidth;
    this.height = options.height || PickerHeight;

    // DEPRECATED: Use constant speed
    //  this.speedLimit = options.speedLimit || 2000;
    //  this.acceleration = options.acceleration || 10000;

    this.trackLength = this.storageUnit.getPickerTrack().length;
    this.reference = this.storageUnit.getPickerTrack().pointA;
    this.storageUnitWidth = this.storageUnit.getWidth();
    // this.leftStorageTrackLength = this.storageUnit.getLeftStorageTrack().length;
    // this.rightStorageTrackLength = this.storageUnit.getRightStorageTrack().length;

    this.standbyLocation = options.standybyLocation || PickerStandbyDistance / this.trackLength;
    this.dropoffLocations = options.dropoffLocations || PickerDropoffDistances.map((a) => {
        return a / this.trackLength
    });

    this.pickInfo = {};

    this.retrieving = false;
    this.picking = false;
    this.returning = false;
    this.dropping = false;
    this.leaving = false;

    this.armLength = options.armLength || this.length / 2;

    this.pickingSpeed = options.pickingSpeed || PickingSpeed;

    this.geometry = options.geometry !== undefined ? options.geometry : new BoxGeometry(this.length, this.width, this.height);
    if (options.material !== undefined) this.material = options.material;

}

Picker.prototype = Object.create(BaseFixedCarrier.prototype);
Picker.prototype.constructor = Picker;

Picker.prototype.act = function(deltaTime) {
    if (this.retrieving) this.retrieve(deltaTime);
    else if (this.picking) this.pick(deltaTime);
    else if (this.returning) this.return(deltaTime);
    else if (this.dropping) this.dropoff(deltaTime);
    else if (this.leaving) this.leave(deltaTime);
}

Picker.prototype.retrieve = function(deltaTime) {
    if (!this.retrieving) return false;

    if (LOG_ENABLED) console.log(`${this.name} is retrieving.`);

    this.retrieving = this.move(deltaTime, false, this.pickInfo.pickLocation);
}

Picker.prototype.pick = function(deltaTime, _t) {
    if (!this.picking) return false;

    if (LOG_ENABLED) console.log(`${this.name} is picking.`);

    let division = Math.floor(this.currentPickingLength * 10),
        increment = division * this.pickingSpeed * deltaTime * PLAY_SPEED / (this.currentPickingLength * CONSTANTS.SECOND);

    let t = _t || this.pickStopwatch / division;

    if (t <= 1) {
        this.rack.position.copy(this.currentPickingReference);
        let point = this.currentPickingCurve.getPointAt(t);
        this.rack.position.x += point.x;
        this.rack.position.y += point.y;

        if (t == 1) {
            this.picking = false;
        } else {
            this.pickStopwatch += increment;
        }
    } else {
        this.pickStopwatch = division;
    }
}

Picker.prototype.return = function(deltaTime) {
    if (!this.returning) return false;

    if (LOG_ENABLED) console.log(`${this.name} is returning.`);

    this.returning = this.move(deltaTime, true, this.standbyLocation);
}

Picker.prototype.dropoff = function(deltaTime) {
    if (!this.dropping) return false;

    if (LOG_ENABLED) console.log(`${this.name} is dropping off.`);

    this.dropping = this.move(deltaTime, true, this.pickInfo.dropoffLocation);
}

Picker.prototype.leave = function(deltaTime) {
    if (!this.leaving) return false;

    if (LOG_ENABLED) console.log(`${this.name} is leaving.`);

    this.leaving = this.move(deltaTime, false, this.standbyLocation);
}

Picker.prototype.onStartRetrive = function(rackSeq, rackSide, rackIndex, speed) {
    if (INFO_ENABLED) console.info(`${this.name} starts retrieving.`);

    this.pickInfo.rackSeq = rackSeq;
    this.pickInfo.rackSide = rackSide;
    this.pickInfo.rackIndex = rackIndex;
    this.speed = speed;

    let rackPosition = this.storageUnit.getRackPosition(rackSide, rackIndex);

    if (rackPosition) {
      this.pickInfo.rackLocationIndex = rackPosition.rackLocationIndex;
      this.pickInfo.pickLocation = (rackPosition.rackDistance + this.trackLength - this.storageUnit.getStorageTrackBySide(rackSide).length + this.armLength) / this.trackLength;

      this.setStopwatch(this.standbyLocation, false);

      this.retrieving = true;
    } else {
      console.error(`${this.name}: there are no enough racks in its storage (storage unit: ${this.storageUnit.name}, rackSeq: ${rackSeq}, side: ${rackSide}, rackIndex: ${rackIndex}).`);
    }

}

Picker.prototype.onStartPick = function() {
    if (INFO_ENABLED) console.info(`${this.name} starts picking.`);

    if (this.retrieving) {
        this.updatePosition(this.pickInfo.pickLocation);
        this.retrieving = false;
    }

    // setTimeout(() => {
    if (INFO_ENABLED) console.info(`${this.name} actually starts picking.`);

    let rack = this.storageUnit.pickRack(this.pickInfo.rackSide, this.pickInfo.rackLocationIndex, this.pickInfo.rackSeq);

    if (rack) {
      this.setRack(rack);

      this.pickStopwatch = 0;
      this.picking = true;

      this.setPickingTrack();
    } else {
      console.error(`${this.name} failed to pick rack from storage unit.`);
    }

    // }, PickingDelay);

}

Picker.prototype.onStartReturn = function(speed) {
    if (INFO_ENABLED) console.info(`${this.name} starts returning.`);

    if (this.picking) this.pick(0, 1);

    this.speed = speed;

    this.setStopwatch(this.pickInfo.pickLocation, true);

    this.returning = true;
}

Picker.prototype.onStartDropoff = function(dropoffLocationIndex, speed) {
    if (INFO_ENABLED) console.info(`${this.name} starts dropping off.`);

    if (this.returning) {
        this.updatePosition(this.standbyLocation);
        this.returning = false;
    }

    this.pickInfo.dropoffLocation = this.dropoffLocations[dropoffLocationIndex];
    this.speed = speed;

    this.setStopwatch(this.standbyLocation, true);

    this.dropping = true;
}

Picker.prototype.onStartLeave = function(speed) {
    if (INFO_ENABLED) console.info(`${this.name} starts leaving.`);

    if (this.dropping) {
        this.updatePosition(this.pickInfo.dropoffLocation);
        this.dropping = false;
    }


    if (speed) this.speed = speed;

    this.setStopwatch(this.pickInfo.dropoffLocation, false);

    //reset pick info
    this.pickInfo = {};

    this.leaving = true;
}

Picker.prototype.setPickingTrack = function() {
  switch (this.pickInfo.rackSide) {
      case CONSTANTS.LEFT:
          this.currentPickingTrack = this.leftPickingTrack;
          break;
      case CONSTANTS.RIGHT:
          this.currentPickingTrack = this.rightPickingTrack;
          break;
      default:
          console.error(`${this.name}: invalid side (${this.pickInfo.rackSide})`);
  }
  this.currentPickingCurve = this.currentPickingTrack.curve;
  this.currentPickingLength = this.currentPickingTrack.length;
  this.currentPickingReference = this.currentPickingTrack.pointA;
}

Picker.prototype.onMove = function(vector) {
  this.updatePickingTracksPosition(vector);

  if (this.returning || this.dropping) this.updateRackPosition(vector);
}

Picker.prototype.updatePickingTracksPosition = function(vector) {
    this.leftPickingTrack.shift(vector);
    this.rightPickingTrack.shift(vector);
}

Picker.prototype.updateRackPosition = function(vector) {
    if (!this.rack) {
        console.error(`${this.name} is returning/dropping off with no rack.`);
    } else {
        this.rack.shift(vector);
    }
}

Picker.prototype.addPickingTracks = function() {
    // point B
    let tangent = this.curve.getTangentAt(0),
        angle = Math.atan(tangent.y / tangent.x);

    let direction = RectifyAngle(angle + Math.PI);

    let pointBObj = {
        x: this.position.x + this.armLength * Math.cos(direction),
        y: this.position.y + this.armLength * Math.sin(direction),
        z: this.position.z
    }

    // left picking track
    let leftPickingTrackSeq = `LPT${this.name}`,
        leftPickingTrackDirection = RectifyAngle(angle + Math.PI / 2);

    let leftPickingTrackObj = this.generatePickingTrackObj(leftPickingTrackSeq, pointBObj, leftPickingTrackDirection);

    // right picking track
    let rightPickingTrackSeq = `RPT${this.name}`,
        rightPickingTrackDirection = RectifyAngle(angle - Math.PI / 2);

    let rightPickingTrackObj = this.generatePickingTrackObj(rightPickingTrackSeq, pointBObj, rightPickingTrackDirection);

    this.leftPickingTrack = new StraightTrack(leftPickingTrackObj);
    this.rightPickingTrack = new StraightTrack(rightPickingTrackObj);
}

Picker.prototype.generatePickingTrackObj = function(trackSeq, pointBObj, direction) {
    let length = this.storageUnitWidth / 2;

    let trackObj = {};

    let trackPointBObj = JSON.parse(JSON.stringify(pointBObj));
    trackPointBObj.pointSeq = `PTB${trackSeq}`;

    let trackPointAObj = {
        x: trackPointBObj.x + length * Math.cos(direction),
        y: trackPointBObj.y + length * Math.sin(direction),
        z: trackPointBObj.z
    }
    trackPointAObj.pointSeq = `PTA${trackSeq}`;

    trackObj.trackSeq = trackSeq;
    trackObj.trackType = "STRAIGHT_TRACK";
    trackObj.nodeSeq = this.name;
    trackObj.nodeType = "PICKER";
    trackObj.pointA = trackPointAObj;
    trackObj.pointB = trackPointBObj;
    trackObj.length = length;

    return trackObj;
}

Picker.prototype.getStatus = function() {
  let status = {};

  status.pickerSeq = this.name;

  status.pickInfo = this.pickInfo;

  status.retrieving = this.retrieving;
  status.picking = this.picking;
  status.returning = this.returning;
  status.dropping = this.dropping;
  status.leaving = this.leaving;

  status.speed = this.speed;

  status.pickStopwatch = this.pickStopwatch;
  status.stopwatch = this.stopwatch;

  status.lastPosition = this.lastPosition;

  return status;
}

Picker.prototype.setStatus = function(status) {
  // if (status.rackSeq) this.pickInfo.rackSeq = status.rackSeq;
  // if (status.rackSide) this.pickInfo.rackSide = status.rackSide;
  // if (status.rackIndex) this.pickInfo.rackIndex = status.rackIndex;
  // if (status.rackLocationIndex) this.pickInfo.rackLocationIndex = status.rackLocationIndex;
  //
  // if (status.pickLocation) this.pickInfo.pickLocation = status.pickLocation;
  // if (status.dropoffLocation) this.pickInfo.dropoffLocation = status.dropoffLocation;
  //
  // this.retrieving = this.retrieving;
  // this.picking = this.picking;
  // this.returning = this.returning;
  // this.dropping = this.dropping;
  // this.leaving = this.leaving;
  //
  // this.speed = this.speed;
  //
  // this.pickStopwatch = this.pickStopwatch;
  // this.stopwatch = this.stopwatch;
  for (let i in status) {
    if (i != 'pickerSeq') {
      this[i] = status[i];
    }
  }

  if (this.picking) {
    this.setPickingTrack();
  }

}

// DEPRECATED
Picker.prototype.pickRack = function(rack) {
    this.rack = rack;

    this.rack.setCurve(this.storageUnit.getCurvePathByDirection('BA').curve, this.storageUnit.getReferenceByDirection('BA'), {
        t: 0.75
    });
}

// DEPRECATED
Picker.prototype.dropoffRack = function() {
    this.rack.setCurve(this.shipmentArea.getCurvePathByDirection('BA').curve, this.shipmentArea.getReferenceByDirection('BA'), {
        t: this.shipmentArea.dropoffLocation
    });

    this.rack = null;
}

export default Picker;
