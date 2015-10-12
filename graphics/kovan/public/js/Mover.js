/**
 * @author wjq / http://wangjiaqi.xyz
 */

THREE.Mover = function ( geometry, material ) {
	var MOVER_LENGTH = 1000,
		MOVER_HEIGHT = 500,
		MOVER_WIDTH = 500;

	THREE.Mesh.call(this);

	this.type = 'Mover';

	this.geometry = geometry !== undefined ? geometry : new THREE.BoxGeometry(MOVER_LENGTH, MOVER_HEIGHT, MOVER_WIDTH);
	this.material = material !== undefined ? material : new THREE.MeshLambertMaterial( {color: 0x666666} );

};

THREE.Mover.prototype = Object.create(THREE.Mesh.prototype);
THREE.Mover.prototype.constructor = THREE.Mover;

THREE.Mover.prototype.move = function ( path, pointA, fps ) {
	
};