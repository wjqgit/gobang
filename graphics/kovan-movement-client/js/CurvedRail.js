/**
 * @author wjq / http://wangjiaqi.xyz
 */

 THREE.CurvedRail = function ( center, radius, startAngle, endAngle, clockwise ) {
 	THREE.BaseRail.call(this);

 	this.type = 'CurvedRail';

 	this.center = center.clone();
 	this.radius = radius || 1400;
 	this.clockwise = clockwise || false;
 	this.startAngle = startAngle || 0;
 	if( endAngle === undefined ){
 		this.endAngle = this.clockwise ? this.startAngle - Math.PI / 4 : this.startAngle + Math.PI / 4;
 	} else {
 		this.endAngle = endAngle;
 	}

 	this.pointA = new THREE.Vector3( 
 		this.center.x + this.radius * Math.cos(this.startAngle), 
 		this.center.y + this.radius * Math.sin(this.startAngle), 
 		this.center.z );
 	this.pointB = new THREE.Vector3( 
 		this.center.x + this.radius * Math.cos(this.endAngle), 
 		this.center.y + this.radius * Math.sin(this.endAngle), 
 		this.center.z );
 	this.reference = this.center;

 	this.angle = this.clockwise ? this.startAngle - this.endAngle : this.endAngle - this.startAngle;
 	if ( this.angle < 0 ) this.angle += 2 * Math.PI;
 	this.length = this.radius * this.angle;

 	var resolution = Math.floor(this.length / 10);

 	this.curve = new THREE.CurvePath();
 	this.curve.add(new THREE.EllipseCurve(
 		0, 0,
 		this.radius, this.radius,
 		this.startAngle, this.endAngle,
 		this.clockwise,
 		0));

 	this.geometry =  this.curve.createPointsGeometry(resolution);

 	this.position.set(this.center.x, this.center.y, this.center.z);
 };

THREE.CurvedRail.prototype = Object.create(THREE.BaseRail.prototype);
THREE.CurvedRail.prototype.constructor = THREE.CurvedRail;