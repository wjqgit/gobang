import { BoxGeometry } from 'three'

import BaseBox from './BaseBox.js';
import Annotation from './Annotation.js';

import * as CONSTANTS from './Constants'
import { RackLength, RackWidth, RackHeight, RackMaterial } from './Configurations'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function Rack( geometry, material, options ) {
	BaseBox.call(this);

	this.type = CONSTANTS.RACK;

	var options = options || {};

	this.length = options.length || RackLength;
	this.width = options.width || RackWidth;
	this.height = options.height || RackHeight;

	this.geometry = geometry !== undefined ? geometry : new BoxGeometry(this.length, this.width, this.height);
	this.material = material !== undefined ? material : RackMaterial;

};

Rack.prototype = Object.create(BaseBox.prototype);
Rack.prototype.constructor = Rack;

Rack.prototype.setCarrier = function(carrier) {
	this.carrier = carrier;
}

Rack.prototype.getStatus = function() {
	let status = {};

	status.rackSeq = this.name;

	status.position = this.position;

	status.rotationZ = this.rotation.z;

	status.carrierSeq = this.carrier.name;
	status.carrierType = this.carrier.type;

	return status;
}

Rack.prototype.setStatus = function(status) {
	this.position.copy(status.position);

	this.rotation.z = status.rotationZ;
}

Rack.prototype.generateAnnotation = function() {
    this.annotation = new Annotation(this.name);
    this.annotation.name = "annotation";
}

export default Rack;
