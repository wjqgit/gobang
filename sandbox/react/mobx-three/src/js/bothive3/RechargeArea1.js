import { Vector2, Vector3, LineCurve, EllipseCurve } from 'three'

import CornerRail from './CornerRail.js';
import CurvePath from './CurvePath.js';
import PathTag from './PathTag.js';

import * as CONSTANTS from './Constants'
import { FillVertices } from './Utils'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function RechargeArea1(rechargeAreaJsonObj, options) {
  CornerRail.call(this, rechargeAreaJsonObj, options);

  this.type = rechargeAreaJsonObj.type || CONSTANTS.RECHARGE_AREA;
  this.name = rechargeAreaJsonObj.rechargeAreaSeq;
}

RechargeArea1.prototype = Object.create(CornerRail.prototype);
RechargeArea1.prototype.constructor = RechargeArea1;

RechargeArea1.prototype.getReversedByDirection = function(direction) {
    var reversed;

    switch (direction) {
        case "AC":
            reversed = false;
            break;

        case "CA":
            reversed = true;
            break;

        case "CB":
            reversed = false;
            break;
        default:

    }

    return reversed;
}

RechargeArea1.prototype.setCurvePath = function() {
  var trackA = this.getTrackA(),
    trackB = this.getTrackB(),
    trackC = this.getTrackC(),
    trackD = this.getTrackD(),
    trackE = this.getTrackE();

  var tagA = this.getTagA(),
    tagB = this.getTagB(),
    tagC = this.getTagC();

  this.curvePath = new CurvePath();

  var refPoint = trackA.pointA;

  var curveA = trackA.curve.curves[0];

  var pointB_C = new Vector3();
  pointB_C.subVectors(trackB.center, refPoint);

  var curveB = new EllipseCurve(
    pointB_C.x, pointB_C.y,
    trackB.radius, trackB.radius,
    trackB.startAngle, trackB.endAngle,
    trackB.clockwise, 0
  );

  var pointC_A = new Vector3();
  pointC_A.subVectors(trackC.pointA, refPoint);

  var curveC = new LineCurve(
    new Vector2(pointC_A.x, pointC_A.y),
    new Vector2(pointC_A.x + trackC.vector.x, pointC_A.y + trackC.vector.y)
  );

  var pointD_C = new Vector3();
  pointD_C.subVectors(trackD.center, refPoint);

  var curveD = new EllipseCurve(
    pointD_C.x, pointD_C.y,
    trackD.radius, trackD.radius,
    trackD.startAngle, trackD.endAngle,
    trackD.clockwise, 0
  );

  var pointE_A = new Vector3();
  pointE_A.subVectors(trackE.pointA, refPoint);

  var curveE = new LineCurve(
    new Vector2(pointE_A.x, pointE_A.y),
    new Vector2(pointE_A.x + trackE.vector.x, pointE_A.y + trackE.vector.y)
  );

  this.curvePath.curve.curves = [curveA, curveB, curveC, curveD, curveE];

  var pathTagA = new PathTag(tagA.name, tagA.distanceFromPointA),
    pathTagB = new PathTag(tagB.name, trackA.length + trackB.length + trackC.length + trackD.length + tagB.distanceFromPointA),
    pathTagC = new PathTag(tagC.name, trackA.length + trackB.length + trackC.length + trackD.length + tagC.distanceFromPointA);

  this.curvePath.add(pathTagA);
  this.curvePath.add(pathTagB);
  this.curvePath.add(pathTagC);
}

RechargeArea1.prototype.getTagC = function() {
  return this.getTagByIndex(2);
}

RechargeArea1.prototype.getTags = function() {
  let tags = [];

  tags.push(this.getTagA());
  tags.push(this.getTagB());
  tags.push(this.getTagC());

  return tags;
}

RechargeArea1.prototype.getPointB = function() {
  return this.getTrackE().pointB;
}

RechargeArea1.prototype.getTrackD = function() {
  return this.getTrackByIndex(3);
}

RechargeArea1.prototype.getTrackE = function() {
  return this.getTrackByIndex(4);
}

RechargeArea1.prototype.getGeometries = function() {
    let geometries = [];

    geometries.push(this.getTrackA().geometry);
    geometries.push(FillVertices(this.getTrackB().geometry));
    geometries.push(this.getTrackC().geometry);
    geometries.push(FillVertices(this.getTrackD().geometry));
    geometries.push(this.getTrackE().geometry);

    return geometries;
}

RechargeArea1.prototype.getLines = function() {
    let lines = [];

    lines.push(this.getTrackA());
    lines.push(this.getTrackB());
    lines.push(this.getTrackC());
    lines.push(this.getTrackD());
    lines.push(this.getTrackE());

    return lines;
}

export default RechargeArea1;
