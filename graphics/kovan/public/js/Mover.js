/**
 * @author wjq / http://wangjiaqi.xyz
 */

THREE.Mover = function ( geometry, material ) {
	THREE.BaseBox.call(this);

	this.type = 'Mover';

	this.length = 1000;
	this.width = 500;
	this.height = 500;

	this.speed = 0;
	this.acceleration = 500;
	this.speedLimit = 2000;
	// this.braking = false;
	this.path;
	this.pathIndex = 0;
	this.rail;
	this.reversed = false;
	this.finished = true;

	this.locationX = this.position.x;
	this.locationY = this.position.y;
	this.locationZ = this.position.z;
	this.currentNode = "";

	this.stopwatch = 0;



	this.geometry = geometry !== undefined ? geometry : new THREE.BoxGeometry(this.length, this.width, this.height);
	if( material !== undefined ) this.material = material;

};

THREE.Mover.prototype = Object.create(THREE.BaseBox.prototype);
THREE.Mover.prototype.constructor = THREE.Mover;

THREE.Mover.prototype.getDimension = function () {
	return new THREE.Vector3( this.length, this.width, this.height);
};

// MOVE
THREE.Mover.prototype.move = function ( fps, rail ) {
	if ( fps <= 10 ) return false;

	var distance = rail.getLength(),
		division = Math.floor(distance * 10), // 1/10 mm resolutionm
		increment = division * this.speed / (distance * fps);

	var t = (this.stopwatch % division) / division;
	t = this.reversed ? 1 - t : t;

	// LOCATION
	this.position.copy(rail.reference);
	var point = rail.curve.getPointAt(t);
	this.position.x += point.x;
	this.position.y += point.y;

	// DIRECTION
	var direction = rail.curve.getTangentAt(t);
	var angle = Math.atan(direction.y / direction.x);
	this.rotation.z = angle;

	// ACCELERATE
	if ( this.speed < rail.speedLimit && this.speed < this.speedLimit ) this.accelerate(fps);
	if ( this.speed > rail.speedLimit || this.speed > this.speedLimit ) this.accelerate(fps, - this.acceleration);

	// RUN STOPWATCH
	if (this.stopwatch + increment > division) {
		return true;
	}

	this.stopwatch += increment;
	return false;
};

THREE.Mover.prototype.moveAndStop = function ( fps, rail ) {
	if ( fps <= 10 ) return false;
	if (this.finished) return true;

	var distance = rail.getLength(),
		division = Math.floor(distance * 10), // 1/10 mm resolution
		increment = division * this.speed / (distance * fps);

	var brakingT = 0;

	var brakingTime = this.speed / this.acceleration,
		brakingDistance = this.speed * brakingTime / 2;

	brakingT = 1 - (brakingDistance / distance);

	var t = (this.stopwatch % division) / division;
	t = this.reversed ? 1 - t : t;

	// LOCATION COPIED CODE
	this.position.copy(rail.reference);
	var point = rail.curve.getPointAt(t);
	this.position.x += point.x;
	this.position.y += point.y;

	// DIRECTION
	var direction = rail.curve.getTangentAt(t);
	var angle = Math.atan(direction.y / direction.x);
	this.rotation.z = angle;

	// ACCELERATE
	if ( (t < brakingT && ! this.reversed) || ( (1 - t) < brakingT && this.reversed) ) {
		if ( this.speed < rail.speedLimit && this.speed < this.speedLimit ) this.accelerate(fps);
		if ( this.speed > rail.speedLimit || this.speed > this.speedLimit ) this.accelerate(fps, - this.acceleration);
	} else {
		if (this.speed > 0) this.accelerate(fps, - this.acceleration);
		if (this.speed < 50) {
			this.speed = 0;
			this.finished = true;
		}
	}

	// RUN STOPWATCH
	if (this.stopwatch + increment > division) {
		return true;
	}

	this.stopwatch += increment;
	return false;
};

THREE.Mover.prototype.accelerate = function ( fps, acceleration ) {
	var convertedAcceleration = acceleration / fps || this.acceleration / fps;

	this.speed += convertedAcceleration;
};

THREE.Mover.prototype.executePath = function ( fps, path) {
	if ( this.pathIndex < path.numOfRails - 1) {
		var finished = this.move(fps, path.rails[this.pathIndex]);
		if ( finished ) {
			this.stopwatch = 0;
			this.pathIndex ++;
		}
	} else {
		this.moveAndStop(fps, path.rails[this.pathIndex]);
	}
};

THREE.Mover.prototype.executePath = function (fps) {
	if (this.path == undefined) return;

	this.rail = this.path.rails[this.pathIndex];
	this.reversed = this.path.reversed[this.pathIndex];

	if ( this.pathIndex < this.path.numOfRails - 1) {
		var finished = this.move(fps, this.rail);
		if ( finished ) {
			this.stopwatch = 0;
			this.pathIndex ++;
		}
	} else {
		this.moveAndStop(fps, this.rail);
	}
};

THREE.Mover.prototype.drag = function () {
	// TODO
};

THREE.Mover.prototype.reset = function () {
	this.speed = 0;
	this.pathIndex = 0;
	this.stopwatch = 0;
	this.finished = false;
	this.path = undefined;
	this.rail = undefined;
	this.reserved = false;
}

THREE.Mover.prototype.updateLocation = function () {
	this.locationX = this.position.x;
	this.locationY = this.position.y;
	this.locationZ = this.position.z;
	this.currentNode = this.path.rails[this.pathIndex].name;

}
