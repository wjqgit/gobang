import Mover from './Mover.js';
import Rack from './Rack.js';

import * as CONSTANTS from './Constants'
import { MoverGeometry, MoverMaterial, RackGeometry, RackMaterial, PLAY_SPEED, INFO_ENABLED, LOG_ENABLED } from './Configurations'
import * as DISPLAY_CONFIGS from './DisplayConfigurations'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function Player(map) {
    Object.call(this);

    this.type = CONSTANTS.PLAYER;
    this.map = map;

    // this.shipmentAreas = map.getObjectByName('shipmentAreas');
    // this.pushAreas = map.getObjectByName('pushAreas');
    // this.escalators = map.getObjectByName('escalators');

    this.animation = [];

    this.nextEventIndex = 0;
}

Player.prototype = Object.create(Object.prototype);
Player.prototype.constructor = Player;

Player.prototype.addAnimation = function(animationArray) {
  if (this.animation.length <= 0) {
    this.animation = animationArray;
  } else {
    animationArray.forEach(newAnimation => this.animation.push(newAnimation));
  }
}

Player.prototype.initialize = function() {
    this.nextEventIndex = 0;
    if (this.animation.length > 0) this.startTime = this.animation[this.nextEventIndex].currentTime;
    else this.startTime = 0; // Difference between animation time and Player clock
    this.clock = 0; // Player clock
}

Player.prototype.skipToNextEvent = function() {
    if (this.nextEventIndex >= this.animation.length) {
        return;
    }

    var nextEventTime = this.animation[this.nextEventIndex].currentTime;

    this.clock = nextEventTime - this.startTime;
}

Player.prototype.play = function(deltaTime) {
    var finished = false;
    if (this.nextEventIndex >= this.animation.length) {
        finished = true;
    }

    this.clock += deltaTime * KOVAN.PLAY_SPEED;
    // console.log(this.clock);

    if (!finished) {
        var eventExecuted = false;
        do {
            let evnt = this.animation[this.nextEventIndex],
              convertedTime = evnt.currentTime - this.startTime;

            if (convertedTime < this.clock) {
                this.nextEventIndex++;

                if (KOVAN.INFO_ENABLED) console.info(`${evnt.entitySeq}: ${evnt.actionType}`);

                this.execute(evnt);
                eventExecuted = true;
            } else {
                eventExecuted = false;
            }

        } while (eventExecuted && this.nextEventIndex < this.animation.length);
    }

    this.act(deltaTime);

    return this.clock;
}

Player.prototype.act = function(deltaTime) {
  // movers
  for (let i = 0; i < this.map.movers.children.length; i++) {
      let mover = this.map.movers.children[i];
      if (mover) {
        mover.move(deltaTime);
      }
  }

  // pusher
  for (let i = 0; i < this.map.pushers.children.length; i++) {
      let pusher = this.map.pushers.children[i];
      if (pusher) {
          pusher.act(deltaTime);
      }
  }

  // pickers
  for (let i = 0; i < this.map.pickers.children.length; i++) {
    let picker = this.map.pickers.children[i];
    if (picker) {
      picker.act(deltaTime);
    }
  }

  // escalators
  for (let i = 0; i < this.map.escalators.children.length; i++) {
      this.map.escalators.children[i].escalate(deltaTime);
  }

}

Player.prototype.execute = function(evnt) {
    var evntType = evnt.actionType;

    switch (evntType) {
        case "CREATE_MOVER":
            this.onMoverCreate(evnt);
            break;
        case "CREATE_RACKS":
            this.onRacksCreate(evnt);
            break;
        case "TAG_SCAN":
            this.onTagScan(evnt);
            break;
        case "ACCELERATION_CHANGE":
            this.onAccelerationChange(evnt);
            break;
        case "TRACK_CHANGE":
            this.onTrackChange(evnt); // Deprecated
            break;
        case "START_CHANGE":
            this.onStartChange(evnt);
            break;
        case "END_CHANGE":
            this.onEndChange(evnt);
            break;
        case "PATH_END":
            this.onPathEnd(evnt);
            break;
        case "START_RETRIEVE":
            this.onStartRetrive(evnt);
            break;
        case "START_PICK":
            this.onStartPick(evnt);
            break;
        case "START_RETURN":
            this.onStartReturn(evnt);
            break;
        case "START_DROPOFF":
            this.onStartDropoff(evnt);
            break;
        case "START_LEAVE":
            this.onStartLeave(evnt);
            break;
        case "RACK_GRABBED":
            this.onRackGrabbed(evnt);
            break;
        case "RACK_RELEASED":
            this.onRackReleased(evnt);
            break;
        case "START_PUSH_RACK":
            this.onStartPushRack(evnt);
            break;
        case "START_RESUME":
            this.onStartResume(evnt);
            break;
        case "START_CLEAR":
            this.onStartClear(evnt);
            break;
        case "START_ESCALATE":
            this.onStartEscalate(evnt);
            break;
        case "LEVEL_ALIGNED":
            this.onLevelAligned(evnt);
            break;

            // Temp: for test purpose only
        case "ADD_RACK":
            this.addRackToMover(evnt);
            break;
        default:
            console.log("Invalid Event Type: " + evntType);
    }
}

Player.prototype.onMoverCreate = function(evnt) {
    this.createMover(evnt);
}

Player.prototype.onRacksCreate = function(evnt) {
    let storageUnit = this.map.nodes[evnt.entitySeq];

    storageUnit.createStorageRacks(evnt.currentLeftStorageCount, evnt.currentRightStorageCount);
}

Player.prototype.onTagScan = function(evnt) {
    var mover = this.map.movers.getObjectByName(evnt.entitySeq);

    if (mover == undefined) {
        this.createMover(evnt);
        // console.warn("WARN: TAG SCAN event pointing to a non-existent mover: " + evnt.entitySeq);
    } else {
        this.setMoverStatus(mover, evnt);
    }
}

Player.prototype.onAccelerationChange = function(evnt) {
    var mover = this.map.movers.getObjectByName(evnt.entitySeq);

    if (mover == undefined) {
        console.warn("WARN: ACCELERATION CHANGE event pointing to a non-existent mover: " + evnt.entitySeq);
    } else {
        if (evnt.currentAcceleration != null) {
            mover.acceleration = evnt.currentAcceleration
        }
        if (evnt.currentSpeed != null) {
            mover.speed = evnt.currentSpeed;
        }
        if (evnt.targetSpeed != null) {
            mover.targetSpeed = evnt.targetSpeed;
        }
        if (evnt.direction != null) {
            if (evnt.nodeSeq != null) {
                var node = mover.node;
                if (node.name == evnt.nodeSeq) {
                    mover.setReversed(node.getReversedByDirection(evnt.direction));
                }
            }
        }
    }
}

Player.prototype.onTrackChange = function(evnt) {
    var mover = this.map.movers.getObjectByName(evnt.entitySeq);

    var reversed = evnt.direction == "AB" ? false : true;

    if (mover == undefined) {
        console.warn("WARN: TRACK CHANGE event pointing to a non-existent mover: " + evnt.entitySeq);
    } else {
        mover.setTrack(this.map.getObjectByName(evnt.trackSeq), {
            reversed: reversed
        });
    }
}

Player.prototype.onStartChange = function(evnt) {
    // var sw = this.map.getObjectByName(evnt.entitySeq);
    let sw = this.map.switchRobots.getObjectByName(evnt.entitySeq);

    if (sw == undefined) {
        console.warn("WARN: SWITCH START CHANGE event pointing to non-existent switch: " + evnt.entitySeq);
    } else {
        if (KOVAN.LOG_ENABLED) console.log(sw.name + " start changing position.");
    }
}

Player.prototype.onEndChange = function(evnt) {
    // var sw = this.map.getObjectByName(evnt.entitySeq);
    let sw = this.map.switchRobots.getObjectByName(evnt.entitySeq);

    if (sw == undefined) {
        console.warn("WARN: SWITCH END CHANGE event pointing to non-existent switch: " + evnt.entitySeq);
    } else {
        // console.log(sw.name + " end changing position.");
        var position = evnt.currentStatus;
        sw.switchPosition(position);
    }
}

Player.prototype.onPathEnd = function(evnt) {
    var mover = this.map.movers.getObjectByName(evnt.entitySeq);

    if (mover) {
        movers.remove(mover);
    } else {
        console.warn("WARN: PATH END event pointing to non-existent mover: " + evnt.entitySeq());
    }
}

Player.prototype.onStartRetrive = function(evnt) {
    let picker = this.map.pickers.getObjectByName(evnt.entitySeq);

    if (picker) {
        picker.onStartRetrive(evnt.rackSeq, evnt.rackSide, evnt.rackIndex, evnt.speed);
    } else {
        console.warn(`${evnt.actionType} evnt pointing to non-existent picker: ${evnt.entitySeq}`);
    }
}

Player.prototype.onStartPick = function(evnt) {
    let picker = this.map.pickers.getObjectByName(evnt.entitySeq);

    if (picker) {
        picker.onStartPick();
    } else {
        console.warn(`${evnt.actionType} evnt pointing to non-existent picker: ${evnt.entitySeq}`);
    }
}

Player.prototype.onStartReturn = function(evnt) {
    let picker = this.map.pickers.getObjectByName(evnt.entitySeq);

    if (picker) {
        picker.onStartReturn(evnt.speed);
    } else {
        console.warn(`${evnt.actionType} evnt pointing to non-existent picker: ${evnt.entitySeq}`);
    }
}

Player.prototype.onStartDropoff = function(evnt) {
    let picker = this.map.pickers.getObjectByName(evnt.entitySeq);

    if (picker) {
        picker.onStartDropoff(evnt.dropoffLocation, evnt.speed);
    } else {
        console.warn(`${evnt.actionType} evnt pointing to non-existent picker: ${evnt.entitySeq}`);
    }
}

Player.prototype.onStartLeave = function(evnt) {
    let picker = this.map.pickers.getObjectByName(evnt.entitySeq);

    if (picker) {
        picker.onStartLeave(evnt.speed);
    } else {
        console.warn(`${evnt.actionType} evnt pointing to non-existent picker: ${evnt.entitySeq}`);
    }
}

Player.prototype.onRackGrabbed = function(evnt) {
    var mover = this.map.movers.getObjectByName(evnt.entitySeq);
    var rack = this.map.racks.getObjectByName(evnt.rackSeq);

    if (mover) {
      if (rack) {
        mover.setRack(rack);
      } else {
        console.warn(`${evnt.actionType} evnt pointing to non-existent rack: ${evnt.rackSeq}`);
      }
    } else {
      console.warn(`${evnt.actionType} evnt pointing to non-existent mover: ${evnt.entitySeq}`);
    }
}

Player.prototype.onRackReleased = function(evnt) {
    var mover = this.map.movers.getObjectByName(evnt.entitySeq);

    mover.releaseRack();
}

Player.prototype.onStartPushRack = function(evnt) {
    var pusher = this.map.pushers.getObjectByName(evnt.entitySeq);
    var rack = this.map.racks.getObjectByName(evnt.rackSeq);

    if (pusher) {
      pusher.onStartPushRack(rack, evnt.speed);
    } else {
      console.warn(`${evnt.actionType} evnt pointing to non-existent pusher: ${evnt.entitySeq}`);
    }

}

Player.prototype.onStartResume = function(evnt) {
    var pusher = this.map.pushers.getObjectByName(evnt.entitySeq);

    if (pusher) {
      pusher.onStartResume(evnt.speed);
    } else {
      console.warn(`${evnt.actionType} evnt pointing to non-existent pusher: ${evnt.entitySeq}`);
    }

}

Player.prototype.onStartClear = function(evnt) {
    var pusher = this.map.pushers.getObjectByName(evnt.entitySeq);

    pusher.stopwatch = 0;
    pusher.clearing = true;
}

Player.prototype.onStartEscalate = function(evnt) {
    var escalator = this.map.escalators.getObjectByName(evnt.entitySeq);

    escalator.setUp(evnt.up);
    escalator.escalating = true;
}

Player.prototype.onLevelAligned = function(evnt) {
    var escalator = this.map.escalators.getObjectByName(evnt.entitySeq);

    escalator.onAligned(evnt.carNum);
}

Player.prototype.createMover = function(evnt) {
    var mover = new Mover(KOVAN.MoverGeometry, KOVAN.MoverMaterial);
    mover.name = evnt.entitySeq;
    // mover.generateAnnotation();
    if (DISPLAY_CONFIGS.ShowMoverAnnotation) mover.toggleAnnotationDisplay(DISPLAY_CONFIGS.ShowMoverAnnotation);

    mover.acceleration = evnt.currentAcceleration || 0;

    this.setMoverStatus(mover, evnt);

    /*
  var reversed = evnt.direction == "AB" ? false : true,
    offset = evnt.initDistance,
    trackSeq = evnt.trackSeq,
    track = this.map.getObjectByName(trackSeq);

  mover.setTrack(track, {reversed: reversed, offset: offset});
 */
    this.map.movers.add(mover);

    return mover;
}

Player.prototype.createRack = function(evnt) {
    var rack = new Rack(KOVAN.RackGeometry, KOVAN.RackMaterial);
    rack.name = evnt.rackSeq;
    // rack.generateAnnotation();

    this.map.racks.add(rack);

    return rack;
}

Player.prototype.setMoverStatus = function(mover, evnt) {
    var node = this.map.getNodeByName(evnt.nodeSeq);

    mover.speed = evnt.currentSpeed || 0;

    if (node != mover.node) {
        mover.node = node;
    }

    var direction = evnt.direction;
    mover.direction = direction;

    var reversed = node.getReversedByDirection(direction),
        curvePath = node.getCurvePathByDirection(direction),
        curve = curvePath.curve,
        pathTag = curvePath.getObjectByName(evnt.tagSeq),
        offset = pathTag.distanceFromReference;

    offset = reversed ? curve.getLength() - offset : offset;

    if (evnt.initDistance != null) {
        offset += evnt.initDistance;
    }

    mover.setCurve(curve, node.getReferenceByDirection(direction), {
        reversed: reversed,
        offset: offset
    })
}

Player.prototype.addRackToMover = function(evnt) {
    var mover = this.map.movers.getObjectByName(evnt.entitySeq);

    var rack = new Rack(KOVAN.RackGeometry, KOVAN.RackMaterial);
    rack.name = evnt.rackSeq;
    // rack.generateAnnotation();

    this.map.racks.add(rack);

    mover.setRack(rack);

    rack.position.copy(mover.position);
    rack.rotation.copy(mover.rotation);
}

Player.prototype.getStatus = function(indexRequired) {
  let status = {};

  status.startTime = this.startTime;
  status.clock = this.clock;

  if (indexRequired) status.nextEventIndex = this.nextEventIndex;

  return status;
}

Player.prototype.setStatus = function(status) {
  this.startTime = status.startTime;
  this.clock = status.clock;

  this.nextEventIndex = status.nextEventIndex || this.nextEventIndex;
}

Player.prototype.snapshotStatus = function(options) {
  var options = options || {};

  let status = {};

  // player
  status.playerStatus = this.getStatus(options.indexRequired);

  // movers
  status.moverStatusList = [];
  for(let i = 0; i < this.map.movers.children.length; i++) {
    status.moverStatusList.push(this.map.movers.children[i].getStatus());
  }

  // pickers
  status.pickerStatusList = [];
  for(let i = 0; i < this.map.pickers.children.length; i++) {
    status.pickerStatusList.push(this.map.pickers.children[i].getStatus());
  }

  // pushers
  status.pusherStatusList = [];
  for(let i = 0; i < this.map.pushers.children.length; i++) {
    status.pusherStatusList.push(this.map.pushers.children[i].getStatus());
  }
  // racks
  status.rackStatusList = [];
  for(let i = 0; i < this.map.racks.children.length; i++) {
    status.rackStatusList.push(this.map.racks.children[i].getStatus());
  }

  // escalators
  status.escalatorStatusList = [];
  for(let i = 0; i < this.map.escalators.children.length; i++) {
    status.escalatorStatusList.push(this.map.escalators.children[i].getStatus());
  }

  // switches
  status.switchStatusList = [];
  for(let i = 0; i < this.map.switchRobots.children.length; i++) {
    status.switchStatusList.push(this.map.switchRobots.children[i].getStatus());
  }

  // storage unit
  status.storageUnitStatusList = [];
  for(let i = 0; i < this.map.storageUnits.children.length; i++) {
    status.storageUnitStatusList.push(this.map.storageUnits.children[i].getStatus());
  }

  return status;
}

Player.prototype.reconstructStatus = function(status) {
  if (KOVAN.INFO_ENABLED) console.info('Reconstructing status...');
  if (KOVAN.LOG_ENABLED) console.log(status);

  //player
  this.setStatus(status.playerStatus);

  // movers
  for (let i = 0; i < status.moverStatusList.length; i++) {
    this.reconstructMoverStatus(status.moverStatusList[i]);
  }

  // pickers
  for (let i = 0; i < status.pickerStatusList.length; i++) {
    this.reconstructPickerStatus(status.pickerStatusList[i]);
  }

  // pushers
  for (let i = 0; i < status.pusherStatusList.length; i++) {
    this.reconstructPusherStatus(status.pusherStatusList[i]);
  }

  // racks
  for (let i = 0; i < status.rackStatusList.length; i++) {
    this.reconstructRackStatus(status.rackStatusList[i]);
  }

  // escalators
  for (let i = 0; i < status.escalatorStatusList.length; i++) {
    this.reconstructEscalatorStatus(status.escalatorStatusList[i]);
  }

  // switches
  for (let i = 0; i < status.switchStatusList.length; i++) {
    this.reconstructSwitchStatus(status.switchStatusList[i]);
  }

  // storage unit
  for (let i = 0; i < status.storageUnitStatusList.length; i++) {
    this.reconstructStorageUnitStatus(status.storageUnitStatusList[i]);
  }

  this.act(0);
}

Player.prototype.reconstructMoverStatus = function(moverStatus) {
  // create mover
  let mover = new Mover(KOVAN.MoverGeometry, KOVAN.MoverMaterial);
  mover.name = moverStatus.moverSeq;
  if (DISPLAY_CONFIGS.ShowMoverAnnotation) mover.toggleAnnotationDisplay(DISPLAY_CONFIGS.ShowMoverAnnotation);

  // set status
  moverStatus.node = this.map.getNodeByName(moverStatus.nodeSeq);

  mover.setStatus(moverStatus);

  this.map.movers.add(mover);
}

Player.prototype.reconstructPickerStatus = function(pickerStatus) {
  // find picker
  let pickerSeq = pickerStatus.pickerSeq;
  let picker = this.map.getCarrierByType(pickerSeq, CONSTANTS.PICKER);

  if (picker) {
    // set status
    picker.setStatus(pickerStatus);
  } else {
    console.error(`Player: picker does NOT exist when reconstructing status (pickerSeq: ${pickerSeq})`);
  }
}

Player.prototype.reconstructPusherStatus = function(pusherStatus) {
  // find pusher
  let pusherSeq = pusherStatus.pusherSeq;
  let pusher = this.map.getCarrierByType(pusherSeq, CONSTANTS.PUSHER);

  if (pusher) {
    // set status
    pusher.setStatus(pusherStatus);
  } else {
    console.error(`Player: pusher does NOT exist when reconstructing status (pusherSeq: ${pusherSeq})`);
  }

}

Player.prototype.reconstructRackStatus = function(rackStatus) {
  // create rack
  let rack = new Rack(KOVAN.RackGeometry, KOVAN.RackMaterial);
  rack.name = rackStatus.rackSeq;
  if (DISPLAY_CONFIGS.ShowRackAnnotation) rack.toggleAnnotationDisplay(DISPLAY_CONFIGS.ShowRackAnnotation);

  // find carrier
  let carrierSeq = rackStatus.carrierSeq,
    carrierType = rackStatus.carrierType;

  let carrier = this.map.getCarrierByType(carrierSeq, carrierType);

  if (carrier) {
    carrier.setRack(rack);
  } else {
    console.error(`Player: carrier does NOT exist when reconstructing rack status (carrierSeq: ${carrierSeq}, carrierType: ${carrierType})`);
  }

  rack.setStatus(rackStatus);

  this.map.racks.add(rack);
}

Player.prototype.reconstructEscalatorStatus = function(escalatorStatus) {
  // find escalator
  let escalatorSeq = escalatorStatus.escalatorSeq;
  let escalator = this.map.escalators.getObjectByName(escalatorSeq);

  if (escalator) {
    escalator.setStatus(escalatorStatus);
  } else {
    console.error(`Player: escalator does NOT exist when reconstructing status (escalatorSeq: ${escalatorSeq})`);
  }
}

Player.prototype.reconstructSwitchStatus = function(switchStatus) {
  // find switch robot
  let switchSeq = switchStatus.switchSeq;
  let switchRobot = this.map.switchRobots.getObjectByName(switchSeq);

  if (switchRobot) {
    switchRobot.setStatus(switchStatus);
  } else {
    console.error(`Player: switch does NOT exist when reconstructing status (switchSeq: ${switchSeq})`);
  }
}

Player.prototype.reconstructStorageUnitStatus = function(storageUnitStatus) {
  // find storage unit
  let storageUnitSeq = storageUnitStatus.storageUnitSeq;
  let storageUnit = this.map.storageUnits.getObjectByName(storageUnitSeq);

  if (storageUnit) {
    storageUnit.setStatus(storageUnitStatus);
  } else {
    console.error(`Player: storageUnit does NOT exist when reconstructing status (storageUnitSeq: ${storageUnitSeq})`);
  }
}

export default Player;
