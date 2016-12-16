import { BoxHelper } from 'three'

import StraightRail from './StraightRail.js';
import CurvePath from './CurvePath.js';
import PathTag from './PathTag.js';
import Annotation from './Annotation.js';

import * as CONSTANTS from './Constants'
import { StationMesh, StationDirection, StationWidth, StationHeight, StationBoxColor } from './Configurations'
import { RectifyAngle } from './Utils'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function StationDock(stationDockJsonObj, options) {
    StraightRail.call(this, stationDockJsonObj, options);

    this.type = this.jsonObj.type || CONSTANTS.STATION_DOCK;

    this.name = this.jsonObj.stationDockSeq;
}

StationDock.prototype = Object.create(StraightRail.prototype);
StationDock.prototype.constructor = StationDock;

StationDock.prototype.getReversedByDirection = function(direction) {
    return false;
}

StationDock.prototype.setCurvePath = function() {
    var track = this.getTrack();

    this.curvePath = new CurvePath();

    this.curvePath.curve = track.curve;

    var tagA = this.getTagA(),
        tagB = this.getTagB(),
        tagC = this.getTagC();

    var pathTagA = new PathTag(tagA.name, tagA.distanceFromPointA),
        pathTagB = new PathTag(tagB.name, tagB.distanceFromPointA),
        pathTagC = new PathTag(tagC.name, tagC.distanceFromPointA);

    this.curvePath.add(pathTagA);
    this.curvePath.add(pathTagB);
    this.curvePath.add(pathTagC);
}

StationDock.prototype.getTagC = function() {
    return this.getTagByIndex(2)
}

StationDock.prototype.getTags = function() {
    let tags = [];

    tags.push(this.getTagA());
    tags.push(this.getTagB());
    tags.push(this.getTagC());

    return tags;
}

StationDock.prototype.getTagGeometries = function() {
    let tagGeometries = [];

    tagGeometries.push(this.getTagA().geometry);
    tagGeometries.push(this.getTagB().geometry);
    tagGeometries.push(this.getTagC().geometry);

    return tagGeometries;
}

StationDock.prototype.getTagMeshes = function() {
    let tagMeshes = [];

    tagMeshes.push(this.getTagA());
    tagMeshes.push(this.getTagB());
    tagMeshes.push(this.getTagC());

    return tagMeshes;
}

StationDock.prototype.addStation = function() {
  if (document) {
    let reference = this.getTagC().position,
    tangent = this.getTrack().curve.getTangentAt(0);

    // box helper
    let stationBox = new BoxHelper(StationMesh);
    stationBox.name = 'station';

    let angle = Math.atan(tangent.y / tangent.x);

    let direction = RectifyAngle(angle + StationDirection);

    stationBox.position.set(reference.x + StationWidth / 2 * Math.cos(direction), reference.y + StationWidth / 2 * Math.sin(direction), reference.z - StationHeight / 2);
    stationBox.material.color.set(StationBoxColor);

    this.station = stationBox;

    // annotation
    this.stationAnnotation = new Annotation('Station');
    //  stationAnnotation.geometry.applyMatrix(new Matrix4().makeTranslation(600, -500, -500));
    this.stationAnnotation.setPosition(stationBox.position);
  } else {
    console.log(`${this.name}: not running in browser environment, station will not be created.`);
  }
}

export default StationDock;
