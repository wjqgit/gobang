import { Object3D } from 'three'

import StraightTrack from './StraightTrack.js';
import CurvedTrack from './CurvedTrack.js';
import Tag from './Tag.js';
import PointMark from './PointMark.js';
import CurvePath from './CurvePath.js';
import PathTag from './PathTag.js';

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function BaseRail(jsonObj, options) {
  Object3D.call(this);

  this.jsonObj = jsonObj;

  var options = options || {};

  this.initialize(options.displayed);
};

BaseRail.prototype = Object.create(Object3D.prototype);
BaseRail.prototype.constructor = BaseRail;

BaseRail.prototype.getReferenceByDirection = function(direction) {
  var track = this.getTrack();

  return track.pointA;
}

BaseRail.prototype.getReversedByDirection = function(direction) {
  var reversed = false;

  switch (direction) {
    case "AB":
      reversed = false;
      break;

    case "BA":
      reversed = true;
      break;
    default:

  }

  return reversed;
}

BaseRail.prototype.initialize = function(displayed) {
  if (displayed) {
    this.addTracks();
    this.addTags();
    this.addPointMarks();
  } else {
    this.generateTracks();
    this.generateTags();
    // this.addPointMarks();
  }
  this.setCurvePath();

}

BaseRail.prototype.setCurvePath = function() {
  var track = this.getTrack();

  this.curvePath = new CurvePath();

  this.curvePath.curve = track.curve;

  var tagA = this.getTagA(),
    tagB = this.getTagB();

  var pathTagA = new PathTag(tagA.name, tagA.distanceFromPointA),
    pathTagB = new PathTag(tagB.name, tagB.distanceFromPointA);

  this.curvePath.add(pathTagA);
  this.curvePath.add(pathTagB);
}

BaseRail.prototype.getCurvePathByDirection = function(direction) {
  return this.curvePath;
}

BaseRail.prototype.addTracks = function() {
  if (!this.tracks) this.generateTracks();

  this.add(this.tracks);
}

BaseRail.prototype.generateTracks = function() {
  this.tracks = new Object3D();
  this.tracks.name = 'tracks';

  for (var i in this.jsonObj.trackList) {
    var trackJsonObj = this.jsonObj.trackList[i];

    if (trackJsonObj.radius == undefined || trackJsonObj.radius <= 0) {
      this.tracks.add(new StraightTrack(trackJsonObj));
    } else {
      this.tracks.add(new CurvedTrack(trackJsonObj));
    }
  }
}

BaseRail.prototype.addTags = function() {
  if (!this.tags) this.generateTags({displayed: true});

  this.add(this.tags);
}

BaseRail.prototype.generateTags = function(options) {
  var options = options || {};

  this.tags = new Object3D();
  this.tags.name = 'tags';

  for (var i in this.jsonObj.tagList) {
    var tagObj = this.jsonObj.tagList[i];

    var tag = new Tag(tagObj, options);

    tag.setPosition(this.tracks.getObjectByName(tagObj.trackSeq), options.displayed);

    this.tags.add(tag);
  }
}

BaseRail.prototype.addPointMarks = function() {
  if (!this.pointMarks) this.generatePointMarks({displayed: true});

  this.add(this.pointMarks);
}

BaseRail.prototype.generatePointMarks = function(options) {
  var options = options || {};

  this.pointMarks = new Object3D();
  this.pointMarks.name = 'pointMarks';

  let pointA = this.getPointA(),
    pointB = this.getPointB();

  let pointAMark = new PointMark(pointA.name, options);
  pointAMark.setPosition(pointA, options.displayed);

  let pointBMark = new PointMark(pointB.name, options);
  pointBMark.setPosition(pointB, options.displayed);

  if (pointAMark) this.pointMarks.add(pointAMark);
  if (pointBMark) this.pointMarks.add(pointBMark);
}

BaseRail.prototype.getTrack = function() {
  return this.getTrackA();
}

BaseRail.prototype.getTrackA = function() {
  return this.getTrackByIndex(0);
}

BaseRail.prototype.getTrackByIndex = function(index) {
  for (let i = 0; i < this.tracks.children.length; i++) {
    let track = this.tracks.children[i];

    if (index == track.index) {
      return track;
    }
  }

  // var trackList = this.jsonObj.trackList;
  // var trackSeq;
  //
  // for (var i in trackList) {
  //   if (index == trackList[i].trackIndex) {
  //     trackSeq = trackList[i].trackSeq;
  //   }
  // }
  //
  // return this.getObjectByName(trackSeq);
}

BaseRail.prototype.getTagA = function() {
  return this.getTagByIndex(0);
}

BaseRail.prototype.getTagB = function() {
  return this.getTagByIndex(1);
}

BaseRail.prototype.getTags = function() {
  let tags = [];

  tags.push(this.getTagA());
  tags.push(this.getTagB());

  return tags;
}

BaseRail.prototype.getTagByIndex = function(index) {
  for (let i = 0; i < this.tags.children.length; i++) {
    let tag = this.tags.children[i];

    if (index == tag.index) {
      return tag;
    }
  }
  //
  // var tagList = this.jsonObj.tagList;
  // var tagSeq;
  //
  // for (var i in tagList) {
  //
  //     tagSeq = tagList[i].tagSeq;
  //   }
  // }
  //
  // return this.getObjectByName(tagSeq);
}

BaseRail.prototype.getPointA = function() {
  return this.getTrack().pointA;
}

BaseRail.prototype.getPointB = function() {
  return this.getTrack().pointB;
}

BaseRail.prototype.getPoints = function() {
  let points = [];

  points.push(this.getPointA());
  points.push(this.getPointB());

  return points;
}

BaseRail.prototype.containsPoint = function(pointSeq) {
  let points = this.getPoints();

  for (let j in points) {
    if (pointSeq == points[j].name) {
      return true;
    }
  }

  return false;
}

BaseRail.prototype.getGeometries = function() {
  let geometries = [];

  geometries.push(this.getTrack().geometry);

  return geometries;
}

BaseRail.prototype.getLines = function() {
  let lines = [];

  lines.push(this.getTrack());

  return lines;
}

// Deprecated
BaseRail.prototype.getTagGeometries = function() {
  let tagGeometries = [];

  tagGeometries.push(this.getTagA().geometry);
  tagGeometries.push(this.getTagB().geometry);

  return tagGeometries;
}

// Deprecated
BaseRail.prototype.getTagMeshes = function() {
  let tagMeshes = [];

  tagMeshes.push(this.getTagA());
  tagMeshes.push(this.getTagB());

  return tagMeshes;
}

export default BaseRail;
