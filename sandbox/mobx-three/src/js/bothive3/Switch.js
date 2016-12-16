import BaseRail from './BaseRail.js';
import StraightTrack from './StraightTrack.js';
import CurvedTrack from './CurvedTrack.js';
import PointMark from './PointMark.js';
import CurvePath from './CurvePath.js';
import PathTag from './PathTag.js';
import SwitchRobot from './SwitchRobot.js';

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function Switch(switchJsonObj, options) {
    BaseRail.call(this, switchJsonObj, options);

    this.type = switchJsonObj.type || KOVAN.SWITCH;

    this.name = switchJsonObj.switchSeq;

    // this.addRenderTracks();
    this.switchRobot = new SwitchRobot(switchJsonObj);
    // this.add(this.switchRobot);

    // this.currentPosition = 'AC';
    // this.switchPosition('AB');
}

Switch.prototype = Object.create(BaseRail.prototype);
Switch.prototype.constructor = Switch;

Switch.prototype.getReversedByDirection = function(direction) {
    var reversed;

    switch (direction) {
        case "AB":
            reversed = false;
            break;

        case "BA":
            reversed = true;
            break;

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

Switch.prototype.getCurvePathByDirection = function(direction) {
    var curve;

    switch (direction) {
        case "AB":
            curve = this.curvePathAB;
            break;

        case "BA":
            curve = this.curvePathAB;
            break;

        case "AC":
            curve = this.curvePathAC;
            break;

        case "CA":
            curve = this.curvePathAC;
            break;
        default:
    }

    return curve;
}

Switch.prototype.setCurvePath = function() {
    var trackA = this.getTrackA(),
        trackB = this.getTrackB(),
        trackC = this.getTrackC(),
        trackD = this.getTrackD();

    var tagA = this.getTagA(),
        tagB = this.getTagB(),
        tagC = this.getTagC();

    // AB
    this.curvePathAB = new CurvePath();
    var refPointAB = trackA.pointA;

    var curveAB_A = trackA.curve.curves[0];

    var pointAB_B_A = new THREE.Vector3();
    pointAB_B_A.subVectors(trackA.pointB, refPointAB);

    var curveAB_B = new THREE.LineCurve(
        new THREE.Vector2(pointAB_B_A.x, pointAB_B_A.y),
        new THREE.Vector2(pointAB_B_A.x + trackB.vector.x, pointAB_B_A.y + trackB.vector.y)
    );

    this.curvePathAB.curve.curves = [curveAB_A, curveAB_B];

    var pathTagAB_A = new PathTag(tagA.name, tagA.distanceFromPointA),
        pathTagAB_B = new PathTag(tagB.name, trackA.length + tagB.distanceFromPointA);

    this.curvePathAB.add(pathTagAB_A);
    this.curvePathAB.add(pathTagAB_B);

    // AC
    this.curvePathAC = new CurvePath();
    var refPointAC = trackA.pointA;

    var pointAC_B_C = new THREE.Vector3();
    pointAC_B_C.subVectors(trackC.center, refPointAC);

    var curveAC_B = new THREE.EllipseCurve(
        pointAC_B_C.x, pointAC_B_C.y,
        trackC.radius, trackC.radius,
        trackC.startAngle, trackC.endAngle,
        trackC.clockwise, 0
    );

    var pointAC_C_A = new THREE.Vector3();
    pointAC_C_A.subVectors(trackD.pointA, refPointAC);

    var curveAC_C = new THREE.LineCurve(
        new THREE.Vector2(pointAC_C_A.x, pointAC_C_A.y),
        new THREE.Vector2(pointAC_C_A.x + trackD.vector.x, pointAC_C_A.y + trackD.vector.y)
    );

    this.curvePathAC.curve.curves = [curveAB_A, curveAC_B, curveAC_C];

    var pathTagAC_A = new PathTag(tagA.name, tagA.distanceFromPointA),
        pathTagAC_C = new PathTag(tagC.name, trackA.length + trackC.length + tagC.distanceFromPointA);

    this.curvePathAC.add(pathTagAC_A);
    this.curvePathAC.add(pathTagAC_C);
}

Switch.prototype.addRenderTracks = function() {
    for (var i in this.children) {
        if (this.children[i].type != 'STRAIGHT_TRACK' && this.children[i].type != 'CURVED_TRACK')
            continue;

        var track = this.children[i],
            trackSeq = track.name;

        if (trackSeq.indexOf('A') > -1) {
            this.trackASeq = trackSeq;
            this.generateRenderTrack(track);
        } else if (trackSeq.indexOf('B') > -1) {
            this.trackBSeq = trackSeq;
            this.generateRenderTrack(track);
        } else if (trackSeq.indexOf('C') > -1) {
            this.trackCSeq = trackSeq;
            this.generateRenderTrack(track);
        }
    }
}

Switch.prototype.switchPosition = function(position) {
    if (this.currentPosition === position) {
        console.log("Switch to the same position!");
        return;
    }

    switch (position) {
        case "AB":
            this.getObjectByName(this.trackBSeq + '_RD').visible = true;
            this.getObjectByName(this.trackCSeq + '_RD').visible = false;
            break;
        case "AC":
            this.getObjectByName(this.trackBSeq + '_RD').visible = false;
            this.getObjectByName(this.trackCSeq + '_RD').visible = true;
            break;
        default:
    }

    this.currentPosition = position;
};

Switch.prototype.togglePosition = function() {
    this.getObjectByName(this.trackBSeq + '_RD').visible = !this.getObjectByName(this.trackBSeq + '_RD').visible;
    this.getObjectByName(this.trackCSeq + '_RD').visible = !this.getObjectByName(this.trackCSeq + '_RD').visible;
}

Switch.prototype.generateRenderTrack = function(track) {
    // TODO: copy obj by a clone function
    var trackJsonObj = JSON.parse(JSON.stringify(track.jsonObj));

    var vector = new THREE.Vector3();
    var scale = 200 / track.length;

    if (trackJsonObj.trackSeq.indexOf("A") > -1) {
        scale = 1 - scale;
        vector.subVectors(track.pointB, track.pointA);
        trackJsonObj.pointA.x = trackJsonObj.pointA.x + vector.x * scale;
        trackJsonObj.pointA.y = trackJsonObj.pointA.y + vector.y * scale;
        trackJsonObj.pointA.pointSeq += "_RD";
    } else if (trackJsonObj.trackSeq.indexOf("B") > -1) {
        vector.subVectors(track.pointB, track.pointA);
        trackJsonObj.pointB.x = trackJsonObj.pointA.x + vector.x * scale;
        trackJsonObj.pointB.y = trackJsonObj.pointA.y + vector.y * scale;
        trackJsonObj.pointB.pointSeq += "_RD";
    }

    trackJsonObj.trackSeq += "_RD";

    var renderTrack;
    if (trackJsonObj.trackSeq.indexOf('C') > -1) {
        renderTrack = new CurvedTrack(trackJsonObj);
    } else {
        renderTrack = new StraightTrack(trackJsonObj);
    }

    renderTrack.material = KOVAN.RenderTrackMaterial;

    var annotation = renderTrack.getObjectByName('annotation');
    renderTrack.remove(annotation);

    this.add(renderTrack);
};

Switch.prototype.generatePointMarks = function(options) {
    var options = options || {};

    this.pointMarks = new THREE.Object3D();
    this.pointMarks.name = 'pointMarks';

    let pointA = this.getPointA(),
        pointB = this.getPointB(),
        pointC = this.getPointC();

    let pointAMark = new PointMark(pointA.name, options);
    pointAMark.setPosition(pointA, options.displayed);

    let pointBMark = new PointMark(pointB.name, options);
    pointBMark.setPosition(pointB, options.displayed);

    let pointCMark = new PointMark(pointC.name, options);
    pointCMark.setPosition(pointC, options.displayed);

    if (pointAMark) this.pointMarks.add(pointAMark);
    if (pointBMark) this.pointMarks.add(pointBMark);
    if (pointCMark) this.pointMarks.add(pointCMark);
}

Switch.prototype.getTrackB = function() {
    return this.getTrackByIndex(1);
}

Switch.prototype.getTrackC = function() {
    return this.getTrackByIndex(2);
}

Switch.prototype.getTrackD = function() {
    return this.getTrackByIndex(3);
}

Switch.prototype.getTagC = function() {
    return this.getTagByIndex(2)
}

Switch.prototype.getTags = function() {
    let tags = [];

    tags.push(this.getTagA());
    tags.push(this.getTagB());
    tags.push(this.getTagC());

    return tags;
}

Switch.prototype.getPointB = function() {
    return this.getTrackB().pointB;
}

Switch.prototype.getPointC = function() {
    return this.getTrackD().pointB;
}

Switch.prototype.getPoints = function() {
    let points = [];

    points.push(this.getPointA());
    points.push(this.getPointB());
    points.push(this.getPointC());

    return points;
}

Switch.prototype.getGeometries = function() {
    let geometries = [];

    geometries.push(this.getTrackA().geometry);
    geometries.push(this.getTrackB().geometry);
    geometries.push(KOVAN.FillVertices(this.getTrackC().geometry));
    geometries.push(this.getTrackD().geometry);

    return geometries;
}

Switch.prototype.getLines = function() {
    let lines = [];

    lines.push(this.getTrackA());
    lines.push(this.getTrackB());
    lines.push(this.getTrackC());
    lines.push(this.getTrackD());

    return lines;
}

Switch.prototype.getTagGeometries = function() {
    let tagGeometries = [];

    tagGeometries.push(this.getTagA().geometry);
    tagGeometries.push(this.getTagB().geometry);
    tagGeometries.push(this.getTagC().geometry);

    return tagGeometries;
}

Switch.prototype.getTagMeshes = function() {
    let tagMeshes = [];

    tagMeshes.push(this.getTagA());
    tagMeshes.push(this.getTagB());
    tagMeshes.push(this.getTagC());

    return tagMeshes;
}

export default Switch
