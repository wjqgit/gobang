/**
 * @author wjq / http://wangjiaqi.xyz
 */

 THREE.BaseRail = function () {
	THREE.Line.call(this);

 	this.type = 'BaseRail';

 	this.pointA = new THREE.Vector3( 0, 0, 0 );
 	this.pointB = new THREE.Vector3( 0, 0, 0 );
 	this.reference = new THREE.Vector3( 0, 0, 0 );
 	this.length = 0;
 	this.speedLimit = 1500;

	this.material = new THREE.LineBasicMaterial( { color : 0xffffff, opacity: 0.8, transparent: true}  );

 };

 THREE.BaseRail.prototype = Object.create(THREE.Line.prototype);
 THREE.BaseRail.prototype.constructor = THREE.BaseRail;

THREE.BaseRail.prototype.getLength = function () {
	return this.length;
};
