/**
 * @author wjq / http://wangjiaqi.xyz
 */

 THREE.BaseBox = function () {
 	THREE.Mesh.call(this);

	this.type = 'BaseBox';

	this.length = 1000; // x axis
	this.width = 500; // y axis
	this.height = 500; // z axis

	this.material = new THREE.MeshLambertMaterial( {color: 0x666666} );

 };

THREE.BaseBox.prototype = Object.create(THREE.Mesh.prototype);
THREE.BaseBox.prototype.constructor = THREE.BaseBox;

THREE.BaseBox.prototype.setPosition = function (position) {
	this.position.set(position.x, position.y, position.z);
};