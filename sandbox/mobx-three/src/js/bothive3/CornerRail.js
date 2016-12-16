import StraightRail from './StraightRail.js';
import CurvePath from './CurvePath.js';
import PathTag from './PathTag.js';

import * as CONSTANTS from './Constants'
import { FillVertices } from './Utils'


/**
 * @author wjq / http://wangjiaqi.xyz
 */

function CornerRail(railJsonObj, options) {
    StraightRail.call(this, railJsonObj, options);

    this.type = railJsonObj.type || KOVAN.CORNER_RAIL;

}

CornerRail.prototype = Object.create(StraightRail.prototype);
CornerRail.prototype.constructor = CornerRail;

CornerRail.prototype.setCurvePath = function() {
    var trackA = this.getTrackA(),
        trackB = this.getTrackB(),
        trackC = this.getTrackC();

    this.curvePath = new CurvePath();

    var curveA = trackA.curve.curves[0];

    var pointB_C = new THREE.Vector3();
    pointB_C.subVectors(trackB.center, trackA.pointA);

    var curveB = new THREE.EllipseCurve(
        pointB_C.x, pointB_C.y,
        trackB.radius, trackB.radius,
        trackB.startAngle, trackB.endAngle,
        trackB.clockwise,
        0);

    var pointC_A = new THREE.Vector3();
    pointC_A.subVectors(trackB.pointB, trackA.pointA);
    // pointC_A.add(trackA.vector);

    var curveC = new THREE.LineCurve(
        new THREE.Vector2(pointC_A.x, pointC_A.y),
        new THREE.Vector2(pointC_A.x + trackC.vector.x, pointC_A.y + trackC.vector.y)
    );

    this.curvePath.curve.curves = [curveA, curveB, curveC];

    var tagA = this.getTagA(),
        tagB = this.getTagB();

    var pathTagA = new PathTag(tagA.name, tagA.distanceFromPointA),
        pathTagB = new PathTag(tagB.name, trackA.length + trackB.length + tagB.distanceFromPointA);

    this.curvePath.add(pathTagA);
    this.curvePath.add(pathTagB);
}

CornerRail.prototype.getTrackB = function() {
    return this.getTrackByIndex(1);
}

CornerRail.prototype.getTrackC = function() {
    return this.getTrackByIndex(2);
}

CornerRail.prototype.getPointB = function() {
    return this.getTrackC().pointB;
}

CornerRail.prototype.getGeometries = function() {
    let geometries = [];

    geometries.push(this.getTrackA().geometry);
    geometries.push(KOVAN.FillVertices(this.getTrackB().geometry));
    geometries.push(this.getTrackC().geometry);

    return geometries;
}

CornerRail.prototype.getLines = function() {
    let lines = [];

    lines.push(this.getTrackA());
    lines.push(this.getTrackB());
    lines.push(this.getTrackC());

    return lines;
}

export default CornerRail;
