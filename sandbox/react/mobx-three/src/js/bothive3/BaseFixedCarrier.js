import { Vector3 } from 'three'
import BaseCarrier from './BaseCarrier.js';

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function BaseFixedCarrier() {
    BaseCarrier.call(this);
}

BaseFixedCarrier.prototype = Object.create(BaseCarrier.prototype);
BaseFixedCarrier.prototype.constructor = BaseFixedCarrier;

BaseFixedCarrier.prototype.setStopwatch = function(t, reversed) {
    let division = Math.floor(this.trackLength * 10);

    this.stopwatch = Math.floor(reversed ? (1 - t) * division : t * division);
}

BaseFixedCarrier.prototype.move = function(deltaTime, reversed, targetLocation) {

    if (this.lastPosition == null) {
        this.lastPosition = this.position.clone();
    }

    let division = Math.floor(this.trackLength * 10),
        increment = division * this.speed * deltaTime * KOVAN.PLAY_SPEED / (this.trackLength * KOVAN.SECOND);

    let t = this.stopwatch / division;

    t = reversed ? 1 - t : t;

    if ((!reversed && t < targetLocation) || (reversed && t > targetLocation)) {
        this.position.copy(this.reference);
        let point = this.curve.getPointAt(t);
        this.position.x += point.x;
        this.position.y += point.y;

        this.stopwatch += increment;

        let vector = new Vector3();
        vector.subVectors(this.position, this.lastPosition);

        this.onMove(vector);

        this.lastPosition = this.position.clone();

        return true;
    } else {
        this.updatePosition(targetLocation);

        return false;
    }
}

BaseFixedCarrier.prototype.onMove = function(vector) {
  console.log('BaseFixedCarrier: onMove().');
}

export default BaseFixedCarrier
