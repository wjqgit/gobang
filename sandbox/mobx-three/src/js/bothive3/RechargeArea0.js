import { Vector2, Vector3, LineCurve, EllipseCurve } from 'three'

import CornerRail from './CornerRail.js';
import CurvePath from './CurvePath.js';
import PathTag from './PathTag.js';

import * as CONSTANTS from './Constants'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function RechargeArea0(rechargeAreaJsonObj, options) {
    CornerRail.call(this, rechargeAreaJsonObj, options);

    this.type = rechargeAreaJsonObj.type || CONSTANTS.RECHARGE_AREA;
    this.name = rechargeAreaJsonObj.rechargeAreaSeq;
}

RechargeArea0.prototype = Object.create(CornerRail.prototype);
RechargeArea0.prototype.constructor = RechargeArea0;

RechargeArea0.prototype.getReversedByDirection = function(direction) {
    var reversed;

    switch (direction) {
        case "AC":
            reversed = false;
            break;

        case "CA":
            reversed = true;
            break;

        default:

    }

    return reversed;
}

RechargeArea0.prototype.setCurvePath = function() {
    var trackA = this.getTrackA(),
        trackB = this.getTrackB(),
        trackC = this.getTrackC();

    this.curvePath = new CurvePath();

    var curveA = trackA.curve.curves[0];

    var pointB_C = new Vector3();
    pointB_C.subVectors(trackB.center, trackA.pointA);

    var curveB = new EllipseCurve(
        pointB_C.x, pointB_C.y,
        trackB.radius, trackB.radius,
        trackB.startAngle, trackB.endAngle,
        trackB.clockwise,
        0);

    var pointC_A = new Vector3();
    pointC_A.subVectors(trackB.pointB, trackA.pointA);
    // pointC_A.add(trackA.vector);

    var curveC = new LineCurve(
        new Vector2(pointC_A.x, pointC_A.y),
        new Vector2(pointC_A.x + trackC.vector.x, pointC_A.y + trackC.vector.y)
    );

    this.curvePath.curve.curves = [curveA, curveB, curveC];

    var tagA = this.getTagA(),
        tagB = this.getTagB(),
        tagC = this.getTagC();

    var pathTagA = new PathTag(tagA.name, tagA.distanceFromPointA),
        pathTagB = new PathTag(tagB.name, trackA.length + trackB.length + tagB.distanceFromPointA),
        pathTagC = new PathTag(tagC.name, trackA.length + trackB.length + tagC.distanceFromPointA);

    this.curvePath.add(pathTagA);
    this.curvePath.add(pathTagB);
    this.curvePath.add(pathTagC);
}

RechargeArea0.prototype.getTagC = function() {
    return this.getTagByIndex(2);
}

export default RechargeArea0;
