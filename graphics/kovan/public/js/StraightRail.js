/**
 * @author wjq / http://wangjiaqi.xyz
 */

 THREE.StraightRail = function ( pointA, pointB ) {
 	THREE.Line.call(this);

 	this.type = 'StraightRail';

 	this.pointA = pointA;
 	this.pointB = pointB;
 	this.vector = pointB.sub(pointA);
 	this.length = this.pointA.distanceTo(this.pointB);
 	var resolution = Math.floor(this.lenght/10); // CM Accuracy

 	this.curve = new THREE.CurvePath();
 	this.curve.add( new THREE.LineCurve(
 		new THREE.Vector2( 0, 0 ),
 		new THREE.Vector2( this.vector.x, this.vector.y)));

 	
 	this.geometry =  this.curve.createPointsGeometry(resolution);
 	this.material = new THREE.LineBasicMaterial( { color : 0xffffff, opacity: 0.8, transparent: true}  );

 	this.position.set(pointA.x, pointA.y, pointA.z);
 };

 THREE.StraightRail.prototype = Object.create(THREE.Line.prototype);
 THREE.StraightRail.prototype.constructor = THREE.StraightRail;