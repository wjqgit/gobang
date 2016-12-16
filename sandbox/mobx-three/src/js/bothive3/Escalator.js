import { Vector2, Object3D, CurvePath, LineCurve } from 'three'

import EscalatorPort from './EscalatorPort.js';
import EscalatorCar from './EscalatorCar.js';


import * as CONSTANTS from './Constants'
import { PLAY_SPEED, LOG_ENABLED } from './Configurations'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function Escalator(escalatorObj) {
    Object3D.call(this);

    this.jsonObj = escalatorObj;

    this.type = this.jsonObj.type || CONSTANTS.ESCALATOR;
    this.name = this.jsonObj.escalatorSeq;

    this.numOfFloors = this.jsonObj.numOfFloors;
    this.floorHeight = this.jsonObj.floorHeight || 2000;
    if (this.jsonObj.up != null) {
        this.up = this.jsonObj.up;
    } else {
        this.up = true;
    }

    this.reversed = !this.up; // default direction is up.

    this.numOfCars = this.jsonObj.numOfCars || this.numOfFloors + 2;
    this.carNumOnFirstFloor = 1;

    this.portLength = this.jsonObj.portLength || 2000;
    this.carLength = this.jsonObj.carLength || 1000;

    this.carPathExtension = 0.2; // buffer path at each end
    this.tMin = (1 - 0.2) / (this.numOfFloors + 2);
    this.tMax = 1 - this.tMin;

    this.centerDatumZ = this.getChannelObjByNum(1).trackList[0].pointA.z - this.floorHeight;

    this.addPorts();
    this.addCars();
    this.setCarPath();

    // movement
    this.escalating = false; // use this flag instead of acceleration to control the movement.

    this.speed = 500; // ignore acceleration and deceleration, use constant speed
    this.acceleration = 200; // NOT used
    this.speedLimit = 500;

    this.division = Math.floor(this.floorHeight * 10);

    this.stopwatch;
    this.resetStopwatch();
    this.alignCars(this.carNumOnFirstFloor);
}

Escalator.prototype = Object.create(Object3D.prototype);
Escalator.prototype.constructor = Escalator;

Escalator.prototype.addPorts = function() {
    var portList = this.jsonObj.portList;

    this.ports = new Object3D();
    this.ports.name = 'ports';
    this.add(this.ports);

    for (var i in portList) {
        var portObj = portList[i];

        this.ports.add(new EscalatorPort(portObj));
    }
}

Escalator.prototype.addCars = function() {
    var carList = this.jsonObj.carList;

    this.cars = new Object3D();
    this.cars.name = 'cars';
    this.add(this.cars);

    // add all cars
    for (var i in carList) {
        var carObj = carList[i];

        var car = new EscalatorCar(carObj);

        this.cars.add(car);
    }
}

Escalator.prototype.setCarPath = function() {
    this.carPath = new CurvePath();

    for (let i = 1; i <= this.numOfFloors; i++) {
        var channelObj = this.getChannelObjByNum(i);

        var absPointA = channelObj.trackList[0].pointA,
            absPointB = channelObj.trackList[0].pointB;

        var pointAOffset = absPointA.z - this.centerDatumZ,
            pointBOffset = absPointB.z - this.centerDatumZ;

        // add buffer curve at bottom
        if (i == 1) {
            var bottomBufferCurve = new LineCurve(
                new Vector2(0, 0),
                new Vector2(0, pointAOffset)
            );

            this.carPath.add(bottomBufferCurve);
        }

        // add curve of each channel
        var curve = new LineCurve(
            new Vector2(0, pointAOffset),
            new Vector2(0, pointBOffset)
        );

        this.carPath.add(curve);

        // add buffer curve at top
        if (i == this.numOfFloors) {
            var topOffset = pointBOffset + this.floorHeight;

            var topBufferCurve = new LineCurve(
                new Vector2(0, pointBOffset),
                new Vector2(0, topOffset)
            )

            this.carPath.add(topBufferCurve);
        }
    }

}

Escalator.prototype.alignCars = function(carNumOnFirstFloor) {
    this.carNumOnFirstFloor = carNumOnFirstFloor;

    for (let i = 0; i <= this.numOfFloors + 1; i++) {

        var car = this.getCarByNum(this.rectifyCarNum(i - 1 + carNumOnFirstFloor));

        car.setFloorNum(i);
        car.setVisible(true);
    }

    this.updateCarPosition();
}

Escalator.prototype.escalate = function(deltaTime) {
    if (CONSTANTS.SECOND / deltaTime <= 10 || !this.escalating) return false;
    // accelerate
    // this.accelerate(deltaTime);

    // run stopwatch
    var increment = this.division * this.speed * deltaTime * PLAY_SPEED / (this.floorHeight * CONSTANTS.SECOND);

    this.stopwatch += increment;

    if (this.stopwatch / this.division > 1) {
        this.proceedToNextFloor();
    }

    // escalate cars
    this.updateCarPosition();

}

Escalator.prototype.setUp = function(up) {
    this.up = up;
    this.reversed = !this.up;

    this.resetStopwatch();
}

Escalator.prototype.resetStopwatch = function() {
  this.stopwatch = this.up ? this.division : 0;
}

Escalator.prototype.onAligned = function(carNum) {
    if (this.stopwatch / this.division > 1) {
        this.proceedToNextFloor();
      }

    this.stopwatch = this.stopwatch / this.division > 0.5 ? this.division : 0;

    if (this.carNumOnFirstFloor != carNum) {
      this.resetStopwatch();
      this.alignCars(carNum);
    }

    this.escalating = false;

    this.updateCarPosition();
}

Escalator.prototype.proceedToNextFloor = function() {
    if (INFO_ENABLED) console.info('proceeding to next floor...');
    var change = this.reversed ? -1 : 1;

    var nextCarNum = null;

    for (let i = 1; i <= this.numOfCars; i++) {
        var car = this.getCarByNum(i);

        var floorNum = car.floorNum;
        if (floorNum != null) {
            if (car.carNum != nextCarNum) {
                car.setFloorNum(floorNum + change);
            }

            if (nextCarNum == null) {
                var carNum = car.carNum,
                    nextCar;

                if (car.floorNum == 1 && !this.reversed) {
                    if (carNum > 1) {
                        nextCar = this.getCarByNum(carNum - 1);
                    } else {
                        nextCar = this.getCarByNum(this.numOfCars);
                    }

                    nextCar.setFloorNum(0);
                    nextCarNum = nextCar.carNum;

                } else if (car.floorNum == this.numOfFloors && this.reversed) {
                    if (carNum < this.numOfCars) {
                        nextCar = this.getCarByNum(carNum + 1);
                    } else {
                        nextCar = this.getCarByNum(1);
                    }

                    nextCar.setFloorNum(this.numOfFloors + 1);
                    nextCarNum = nextCar.carNum;
                }
            }
        }
    }

    this.stopwatch = 0;
    this.carNumOnFirstFloor = this.rectifyCarNum(this.carNumOnFirstFloor - change);
    if (LOG_ENABLED) console.log(this.carNumOnFirstFloor);
}

Escalator.prototype.updateCarPosition = function() {
    var tempT = this.stopwatch / this.division;
    tempT = this.reversed ? 1 - tempT : tempT;

    for (let i = 1; i <= this.numOfCars; i++) {
        var car = this.getCarByNum(i);

        var floorNum = car.floorNum;
        if (floorNum != null) {
            var t = (floorNum + tempT) / (this.numOfFloors + 2);

            if (this.tMin <= t && t <= this.tMax) {
                var z = this.carPath.getPointAt(t).y;

                car.setZ(z + this.centerDatumZ);

                if (!car.getVisible()) {
                    car.setVisible(true);
                }
            } else if (0 <= t && t <= 1) {
                car.setVisible(false);
            } else {
                car.setFloorNum(null);
            }
        }
    }
}

Escalator.prototype.getPortByFloorNum = function(floorNum) {
    for (let i = 0; i < this.ports.children.length; i++) {
        let port = this.ports.children[i];

        if (floorNum == port.floorNum) {
            return port;
        }
    }
}

Escalator.prototype.getCarByNum = function(carNum) {
    for (let i = 0; i < this.cars.children.length; i++) {
        let car = this.cars.children[i];

        if (carNum == car.carNum) {
            return car;
        }
    }
}

Escalator.prototype.getChannelObjByNum = function(floorNum) {
    var channelList = this.jsonObj.channelList;

    for (var i in channelList) {
        var channelObj = channelList[i];

        if (floorNum == channelObj.floorNum) {
            return channelObj;
        }
    }
}

Escalator.prototype.getStatus = function() {
  let status = {}

  status.escalatorSeq = this.name;

  status.up = this.up;
  status.escalating = this.escalating;
  status.stopwatch = this.stopwatch;

  status.carNumOnFirstFloor =  this.carNumOnFirstFloor;

  return status;
}

Escalator.prototype.setStatus = function(status) {
  this.escalating = status.escalating;
  this.stopwatch = status.stopwatch;

  this.setUp(status.up);

  this.alignCars(status.carNumOnFirstFloor);
}

Escalator.prototype.rectifyCarNum = function(carNum) {
    return carNum % this.numOfCars <= 0 ? (carNum % this.numOfCars + this.numOfCars) % (this.numOfCars + 1) : carNum % this.numOfCars;
}

export { Escalator };
