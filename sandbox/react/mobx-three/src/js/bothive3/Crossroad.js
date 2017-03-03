import { Vector2, Vector3, LineCurve, EllipseCurve, Object3D } from 'three'

import BaseModule from './BaseModule.js';
import PointMark from './PointMark.js';
import CurvePath from './CurvePath.js';
import PathTag from './PathTag.js';

import * as CONSTANTS from './Constants'
import { FillVertices } from './Utils'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function Crossroad(crossroadJsonObj, options) {
  BaseModule.call(this, crossroadJsonObj, options);

  this.type = crossroadJsonObj.type || CONSTANTS.CROSSROAD;
  this.name = crossroadJsonObj.crossroadSeq;
}

Crossroad.prototype = Object.create(BaseModule.prototype);
Crossroad.prototype.constructor = Crossroad;

Crossroad.prototype.getReferenceByDirection = function(direction) {
  var reference;

  switch (direction) {
    case "BA":
      reference = this.getPointA();
      break;

    case "CA":
      reference = this.getPointA();
      break;

    case "AD":
      reference = this.getPointA();
      break;
    default:
  }

  return reference;
}

Crossroad.prototype.getReversedByDirection = function(direction) {
  var reversed;

  switch (direction) {
    case "BA":
      reversed = true;
      break;

    case "CA":
      reversed = true;
      break;

    case "AD":
      reversed = false;
      break;
    default:

  }

  return reversed;
}

Crossroad.prototype.getCurvePathByDirection = function(direction) {
  var curve;

  switch (direction) {
    case "BA":
      curve = this.curvePathAB;
      break;

    case "CA":
      curve = this.curvePathAC;
      break;

    case "AD":
      curve = this.curvePathAD;
      break;
    default:
  }

  return curve;
}

Crossroad.prototype.setCurvePath = function() {
  var trackA = this.getTrackA(),
    trackB = this.getTrackB(),
    trackC = this.getTrackC(),
    trackD = this.getTrackD(),
    trackE = this.getTrackE(),
    trackF = this.getTrackF(),
    trackG = this.getTrackG();

  var tagA = this.getTagA(),
    tagB = this.getTagB(),
    tagC = this.getTagC(),
    tagD = this.getTagD();

  // AB
  this.curvePathAB = new CurvePath();
  var refPointAB = trackA.pointA;

  var curveAB_A = trackA.curve.curves[0];

  var pointAB_B_C = new Vector3();
  pointAB_B_C.subVectors(trackC.center, refPointAB);

  var curveAB_B = new EllipseCurve(
    pointAB_B_C.x, pointAB_B_C.y,
    trackC.radius, trackC.radius,
    trackC.startAngle, trackC.endAngle,
    trackC.clockwise, 0
  );

  var pointAB_C_A = new Vector3();
  pointAB_C_A.subVectors(trackD.pointA, refPointAB);

  var curveAB_C = new LineCurve(
    new Vector2(pointAB_C_A.x, pointAB_C_A.y),
    new Vector2(pointAB_C_A.x + trackD.vector.x, pointAB_C_A.y + trackD.vector.y)
  )

  this.curvePathAB.curve.curves = [curveAB_A, curveAB_B, curveAB_C];


  var pathTagAB_A = new PathTag(tagA.name, tagA.distanceFromPointA),
    pathTagAB_B = new PathTag(tagB.name, trackA.length + trackC.length + tagB.distanceFromPointA);

  this.curvePathAB.add(pathTagAB_A);
  this.curvePathAB.add(pathTagAB_B);

  // AC
  this.curvePathAC = new CurvePath();
  var refPointAC = trackA.pointA;

  var curveAC_A = trackA.curve.curves[0];

  var pointAC_B_A = new Vector3();
  pointAC_B_A.subVectors(trackB.pointA, refPointAC);

  var curveAC_B = new LineCurve(
    new Vector2(pointAC_B_A.x, pointAC_B_A.y),
    new Vector2(pointAC_B_A.x + trackB.vector.x, pointAC_B_A.y + trackB.vector.y)
  )

  var pointAC_C_C = new Vector3();
  pointAC_C_C.subVectors(trackF.center, refPointAC);

  var curveAC_C = new EllipseCurve(
    pointAC_C_C.x, pointAC_C_C.y,
    trackF.radius, trackF.radius,
    trackF.startAngle, trackF.endAngle,
    trackF.clockwise, 0
  );

  var pointAC_D_A = new Vector3();
  pointAC_D_A.subVectors(trackG.pointA, refPointAC);

  var curveAC_D = new LineCurve(
    new Vector2(pointAC_D_A.x, pointAC_D_A.y),
    new Vector2(pointAC_D_A.x + trackG.vector.x, pointAC_D_A.y + trackG.vector.y)
  );

  this.curvePathAC.curve.curves = [curveAC_A, curveAC_B, curveAC_C, curveAC_D];

  var pathTagAC_A = new PathTag(tagA.name, tagA.distanceFromPointA),
    pathTagAC_B = new PathTag(tagC.name, trackA.length + trackB.length + trackF.length + tagC.distanceFromPointA);

  this.curvePathAC.add(pathTagAC_A);
  this.curvePathAC.add(pathTagAC_B);

  // AD
  this.curvePathAD = new CurvePath();
  var refPointAD = trackA.pointA;

  var curveAD_A = trackA.curve;

  var pointAD_B_A = new Vector3();
  pointAD_B_A.subVectors(trackB.pointA, refPointAD);

  var curveAD_B = new LineCurve(
    new Vector2(pointAD_B_A.x, pointAD_B_A.y),
    new Vector2(pointAD_B_A.x + trackB.vector.x, pointAD_B_A.y + trackB.vector.y)
  )

  var pointAD_C_A = new Vector3();
  pointAD_C_A.subVectors(trackE.pointA, refPointAD);

  var curveAD_C = new LineCurve(
    new Vector2(pointAD_C_A.x, pointAD_C_A.y),
    new Vector2(pointAD_C_A.x + trackE.vector.x, pointAD_C_A.y + trackE.vector.y)
  )

  this.curvePathAD.curve.curves = [curveAD_A, curveAD_B, curveAD_C];

  var pathTagAD_A = new PathTag(tagA.name, tagA.distanceFromPointA),
    pathTagAD_B = new PathTag(tagD.name, trackA.length + trackB.length + tagD.distanceFromPointA);

  this.curvePathAD.add(pathTagAD_A);
  this.curvePathAD.add(pathTagAD_B);
}

Crossroad.prototype.generatePointMarks = function(options) {
  var options = options || {};

  this.pointMarks = new Object3D();
  this.pointMarks.name = 'pointMarks';

  let pointA = this.getPointA(),
    pointB = this.getPointB(),
    pointC = this.getPointC(),
    pointD = this.getPointD();

  if (pointA) {
    let pointAMark = new PointMark(pointA.name, options);
    pointAMark.setPosition(pointA, options.displayed);
    if (pointAMark) this.pointMarks.add(pointAMark);
  }

  if (pointB) {
    let pointBMark = new PointMark(pointB.name, options);
    pointBMark.setPosition(pointB, options.displayed);
    if (pointBMark) this.pointMarks.add(pointBMark);
  }

  if (pointC) {
    let pointCMark = new PointMark(pointC.name, options);
    pointCMark.setPosition(pointC, options.displayed);
    if (pointCMark) this.pointMarks.add(pointCMark);
  }

  if (pointD) {
    let pointDMark = new PointMark(pointD.name, options);
    pointDMark.setPosition(pointD, options.displayed);
    if (pointDMark) this.pointMarks.add(pointDMark);
  }


}

Crossroad.prototype.getTrackB = function() {
  return this.getTrackByIndex(1);
}

Crossroad.prototype.getTrackC = function() {
  return this.getTrackByIndex(2);
}

Crossroad.prototype.getTrackD = function() {
  return this.getTrackByIndex(3);
}

Crossroad.prototype.getTrackE = function() {
  return this.getTrackByIndex(4);
}

Crossroad.prototype.getTrackF = function() {
  return this.getTrackByIndex(5);
}

Crossroad.prototype.getTrackG = function() {
  return this.getTrackByIndex(6);
}

Crossroad.prototype.getTagC = function() {
  return this.getTagByIndex(2);
}

Crossroad.prototype.getTagD = function() {
  return this.getTagByIndex(3);
}

Crossroad.prototype.getTags = function() {
  let tags = [];

  tags.push(this.getTagA());
  tags.push(this.getTagB());
  tags.push(this.getTagC());
  tags.push(this.getTagD());

  return tags;
}

Crossroad.prototype.getPointA = function() {
  return this.getTrackA().pointA;
}

Crossroad.prototype.getPointB = function() {
  return this.getTrackD().pointB;
}

Crossroad.prototype.getPointC = function() {
  return this.getTrackG().pointB;
}

Crossroad.prototype.getPointD = function() {
  return this.getTrackE().pointB;
}

Crossroad.prototype.getPoints = function() {
  let points = [];

  points.push(this.getPointA());
  points.push(this.getPointB());
  points.push(this.getPointC());
  points.push(this.getPointD());

  return points;
}

Crossroad.prototype.getGeometries = function() {
    let geometries = [];

    geometries.push(this.getTrackA().geometry);
    geometries.push(this.getTrackB().geometry);
    geometries.push(FillVertices(this.getTrackC().geometry));
    geometries.push(this.getTrackD().geometry);
    geometries.push(this.getTrackE().geometry);
    geometries.push(FillVertices(this.getTrackF().geometry));
    geometries.push(this.getTrackG().geometry);

    return geometries;
}

Crossroad.prototype.getLines = function() {
    let lines = [];

    lines.push(this.getTrackA());
    lines.push(this.getTrackB());
    lines.push(this.getTrackC());
    lines.push(this.getTrackD());
    lines.push(this.getTrackE());
    lines.push(this.getTrackF());
    lines.push(this.getTrackG());

    return lines;
}

Crossroad.prototype.getTagGeometries = function() {
  let tagGeometries = [];

  tagGeometries.push(this.getTagA().geometry);
  tagGeometries.push(this.getTagB().geometry);
  tagGeometries.push(this.getTagC().geometry);
  tagGeometries.push(this.getTagD().geometry);

  return tagGeometries;
}

Crossroad.prototype.getTagMeshes = function() {
  let tagMeshes = [];

  tagMeshes.push(this.getTagA());
  tagMeshes.push(this.getTagB());
  tagMeshes.push(this.getTagC());
  tagMeshes.push(this.getTagD());

  return tagMeshes;
}

export default Crossroad;
