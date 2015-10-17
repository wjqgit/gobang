/**
 * @author wjq / http://wangjiaqi.xyz
 */

THREE.Rack = function ( geometry, material ) {
	THREE.BaseBox.call(this);

	this.type = 'Rack';

	this.length = 1000;
	this.width = 500;
	this.height = 1800;

	this.geometry = geometry !== undefined ? geometry : new THREE.BoxGeometry(this.length, this.width, this.height);
	if( material !== undefined ) this.material = material;

};

THREE.Rack.prototype = Object.create(THREE.BaseBox.prototype);
THREE.Rack.prototype.constructor = THREE.Rack;