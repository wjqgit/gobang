/**
 * @author wjq / http://wangjiaqi.xyz
 */

 THREE.LiftChannel = function ( pointA, pointB ) {
   THREE.BaseRail.call(this);

   this.type = 'LiftChannel';

   this.pointA = pointA.clone();
   this.pointB = pointB.clone();
   this.reference = this.pointA;
   this.vector = new THREE.Vector3();
   this.vector.subVectors(pointB, pointA);
   this.length = this.pointA.distanceTo(this.pointB);
   var resolution = Math.floor(this.lenght/10); // CM Accuracy

   this.curve = new THREE.CurvePath();
   this.curve.add(new THREE.LineCurve(
     new THREE.Vector2(0, 0),
     new THREE.Vector2(this.vector.z, 0)
   ));

   this.geometry =  this.curve.createPointsGeometry(resolution);

   this.rotateY( - Math.PI / 2);
   this.position.set(pointA.x, pointA.y, pointA.z);
 }

 THREE.LiftChannel.prototype = Object.create(THREE.BaseRail.prototype);
 THREE.LiftChannel.prototype.constructor = THREE.LiftChannel;
