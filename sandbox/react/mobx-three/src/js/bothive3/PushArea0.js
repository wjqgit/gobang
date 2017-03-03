import Crossroad from './Crossroad.js';
import PointMark from './PointMark.js';
import CurvePath from './CurvePath.js';
import PathTag from './PathTag.js';
import Pusher from './Pusher.js';

import * as CONSTANTS from './Constants'
import { ParseNumber, Pad } from './Utils'
import { PusherMaterial } from './Configurations'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function PushArea0(pushAreaJsonObj, options) {
    Crossroad.call(this, pushAreaJsonObj, options);

    this.type = pushAreaJsonObj.type || CONSTANTS.PUSH_AREA;
    this.name = pushAreaJsonObj.pushAreaSeq;

    this.storageUnit;
    this.side;

    // this.generatePusher();
}

PushArea0.prototype = Object.create(Crossroad.prototype);
PushArea0.prototype.constructor = PushArea0;

PushArea0.prototype.generatePusher = function() {
    var seq = ParseNumber(this.name),
        pusherPrefix = "PS";

    var pusherSeq = this.jsonObj.pusherSeq || pusherPrefix + Pad(seq, 2, 0);
    var pusher = new Pusher(this, {
        name: pusherSeq,
        material: PusherMaterial
    });

    pusher.storageUnit = this.storageUnit;
    pusher.side = this.side;

    // pusher.generateAnnotation();

    var curve = this.getCurvePathByDirection('BE').curve,
        reference = this.getReferenceByDirection('BE'),
        // offset = curve.getLength();
        offset = 0;

    pusher.setCurve(curve, reference, {
        offset: offset
    });

    pusher.updatePosition(pusher.startLocation);

    this.pusher = pusher;

    this.storageUnit.map.pushers.add(this.pusher);

    return pusher;
}

PushArea0.prototype.getReferenceByDirection = function(direction) {
    var reference;

    switch (direction) {
        case "AB":
            reference = this.getPointA();
            break;

        case "BD":
            reference = this.getTrackB().pointB;
            break;

        case "DC":
            reference = this.getPointC();
            break;

        case "BE":
            reference = this.getTrackB().pointB;
            break;

        case "AE":
            reference = this.getTrackA().pointB;
            break;

        default:
    }

    return reference;
}

PushArea0.prototype.getReversedByDirection = function(direction) {
    var reversed;

    switch (direction) {
        case "AB":
            reversed = false;
            break;

        case "BD":
            reversed = false;
            break;

        case "DC":
            reversed = true;
            break;

        case "BE":
            reversed = false;
            break;

        case "AE":
            curve = false;
            break;

        default:

    }

    return reversed;
}

PushArea0.prototype.getCurvePathByDirection = function(direction) {
    var curve;

    switch (direction) {
        case "AB":
            curve = this.curvePathAB;
            break;

        case "BD":
            curve = this.curvePathBD;
            break;

        case "DC":
            curve = this.curvePathCD;
            break;

        case "BE":
            curve = this.curvePathBE;
            break;

        case "AE":
            curve = this.curvePathAE;
            break;

        default:
    }

    return curve;
}

PushArea0.prototype.setCurvePath = function() {
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
    var refPointAB = trackA.pointB;

    var curveAB_A = new THREE.LineCurve(
        new THREE.Vector2(0, 0),
        new THREE.Vector2(-trackA.vector.x, -trackA.vector.y)
    );

    var pointAB_B_A = new THREE.Vector3();
    pointAB_B_A.subVectors(trackB.pointB, refPointAB);

    var curveAB_B = new THREE.LineCurve(
        new THREE.Vector2(pointAB_B_A.x, pointAB_B_A.y),
        new THREE.Vector2(pointAB_B_A.x - trackB.vector.x, pointAB_B_A.y - trackB.vector.y)
    )

    var pointAB_C_C = new THREE.Vector3();
    pointAB_C_C.subVectors(trackF.center, refPointAB);

    var curveAB_C = new THREE.EllipseCurve(
        pointAB_C_C.x, pointAB_C_C.y,
        trackF.radius, trackF.radius,
        trackF.startAngle, trackF.endAngle,
        trackF.clockwise, 0
    )

    var pointAB_D_A = new THREE.Vector3();
    pointAB_D_A.subVectors(trackG.pointA, refPointAB);

    var curveAB_D = new THREE.LineCurve(
        new THREE.Vector2(pointAB_D_A.x, pointAB_D_A.y),
        new THREE.Vector2(pointAB_D_A.x + trackG.vector.x, pointAB_D_A.y + trackG.vector.y)
    )

    this.curvePathAB.curve.curves = [curveAB_A, curveAB_B, curveAB_C, curveAB_D];

    var pathTagAB_A = new PathTag(tagA.name, trackA.length - tagA.distanceFromPointA),
        pathTagAB_B = new PathTag(tagB.name, trackA.length + trackB.length - tagB.distanceFromPointA);

    this.curvePathAB.add(pathTagAB_A);
    this.curvePathAB.add(pathTagAB_B);

    // BD
    this.curvePathBD = new CurvePath();
    var refPointBD = trackB.pointB;

    var curveBD_A = new THREE.LineCurve(
        new THREE.Vector2(0, 0),
        new THREE.Vector2(-trackB.vector.x, -trackB.vector.y)
    );

    var pointBD_B_C = new THREE.Vector3();
    pointBD_B_C.subVectors(trackF.center, refPointBD);

    var curveBD_B = new THREE.EllipseCurve(
        pointBD_B_C.x, pointBD_B_C.y,
        trackF.radius, trackF.radius,
        trackF.startAngle, trackF.endAngle,
        trackF.clockwise, 0
    );

    var pointBD_C_A = new THREE.Vector3();
    pointBD_C_A.subVectors(trackG.pointA, refPointBD);

    var curveBD_C = new THREE.LineCurve(
        new THREE.Vector2(pointBD_C_A.x, pointBD_C_A.y),
        new THREE.Vector2(pointBD_C_A.x + trackG.vector.x, pointBD_C_A.y + trackG.vector.y)
    )

    this.curvePathBD.curve.curves = [curveBD_A, curveBD_B, curveBD_C];

    var pathTagBD_A = new PathTag(tagB.name, tagB.distanceFromPointA),
        pathTagBD_B = new PathTag(tagD.name, trackB.length + trackF.length + tagD.distanceFromPointA);

    this.curvePathBD.add(pathTagBD_A);
    this.curvePathBD.add(pathTagBD_B);

    // CD
    this.curvePathCD = new CurvePath();
    var refPointDC = trackD.pointB;

    var curveCD_A = new THREE.LineCurve(
        new THREE.Vector2(0, 0),
        new THREE.Vector2(-trackD.vector.x, -trackD.vector.y)
    )

    var pointCD_B_C = new THREE.Vector3();
    pointCD_B_C.subVectors(trackC.center, refPointDC);

    var curveCD_B = new THREE.EllipseCurve(
        pointCD_B_C.x, pointCD_B_C.y,
        trackC.radius, trackC.radius,
        trackC.endAngle, trackC.startAngle, !trackC.clockwise, 0
    );

    var pointCD_C_A = new THREE.Vector3();
    pointCD_C_A.subVectors(trackB.pointB, refPointDC)

    var curveCD_C = new THREE.LineCurve(
        new THREE.Vector2(pointCD_C_A.x, pointCD_C_A.y),
        new THREE.Vector2(pointCD_C_A.x - trackB.vector.x, pointCD_C_A.y - trackB.vector.y)
    );

    var pointCD_D_C = new THREE.Vector3();
    pointCD_D_C.subVectors(trackF.center, refPointDC);

    var curveCD_D = new THREE.EllipseCurve(
        pointCD_D_C.x, pointCD_D_C.y,
        trackF.radius, trackF.radius,
        trackF.startAngle, trackF.endAngle,
        trackF.clockwise, 0
    );

    var pointCD_E_A = new THREE.Vector3();
    pointCD_E_A.subVectors(trackG.pointA, refPointDC);

    var curveCD_E = new THREE.LineCurve(
        new THREE.Vector2(pointCD_E_A.x, pointCD_E_A.y),
        new THREE.Vector2(pointCD_E_A.x + trackG.vector.x, pointCD_E_A.y + trackG.vector.y)
    );

    this.curvePathCD.curve.curves = [curveCD_A, curveCD_B, curveCD_C, curveCD_D, curveCD_E];

    var pathTagCD_A = new PathTag(tagC.name, trackD.length - tagC.distanceFromPointA),
        pathTagCD_B = new PathTag(tagB.name, trackD.length + trackC.length + trackB.length - tagB.distanceFromPointA),
        pathTagCD_C = new PathTag(tagD.name, trackD.length + trackC.length + trackB.length + trackF.length + tagD.distanceFromPointA);

    this.curvePathCD.add(pathTagCD_A);
    this.curvePathCD.add(pathTagCD_B);
    this.curvePathCD.add(pathTagCD_C);

    // BE
    this.curvePathBE = new CurvePath();
    var refPointBE = trackB.pointB;

    var pointBE_B_A = new THREE.Vector3();
    pointBE_B_A.subVectors(trackE.pointA, refPointBE);

    var curveBE_B = new THREE.LineCurve(
        new THREE.Vector2(pointBE_B_A.x, pointBE_B_A.y),
        new THREE.Vector2(pointBE_B_A.x + trackE.vector.x, pointBE_B_A.y + trackE.vector.y)
    );

    this.curvePathBE.curve.curves = [curveBD_A, curveBE_B];

    // AE
    this.curvePathAE = new CurvePath();
    let refPointAE = trackA.pointB;

    let pointAE_C_A = new THREE.Vector3();
    pointAE_C_A.subVectors(trackE.pointA, refPointAE);

    let curveAE_C = new THREE.LineCurve(
        new THREE.Vector2(pointAE_C_A.x, pointAE_C_A.y),
        new THREE.Vector2(pointAE_C_A.x + trackE.vector.x, pointAE_C_A.y + trackE.vector.y)
    );

    this.curvePathAE.curve.curves = [curveAB_A, curveAB_B, curveAE_C];
}

PushArea0.prototype.generatePointMarks = function(options) {
    var options = options || {};

    this.pointMarks = new THREE.Object3D();
    this.pointMarks.name = 'pointMarks';

    let pointA = this.getPointA(),
        pointC = this.getPointC(),
        pointD = this.getPointD(),
        pointE = this.getPointE();

    if (pointA) {
        let pointAMark = new PointMark(pointA.name, options);
        pointAMark.setPosition(pointA, options.displayed);
        if (pointAMark) this.pointMarks.add(pointAMark);
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

    if (pointE) {
        let pointEMark = new PointMark(pointE.name, options);
        pointEMark.setPosition(pointE, options.displayed);
        if (pointEMark) this.pointMarks.add(pointEMark);
    }
}

PushArea0.prototype.getPointA = function() {
    return this.getTrackA().pointB;
}

PushArea0.prototype.getPointC = function() {
    return this.getTrackD().pointB;
}

PushArea0.prototype.getPointD = function() {
    return this.getTrackG().pointB;
}

PushArea0.prototype.getPointE = function() {
    return this.getTrackE().pointB;
}

PushArea0.prototype.getPoints = function() {
    let points = [];

    points.push(this.getPointA());
    points.push(this.getPointB());
    points.push(this.getPointC());
    points.push(this.getPointD());
    points.push(this.getPointE());

    return points;
}

export default PushArea0;
