import { Mesh } from 'three'

import Annotation from './Annotation.js';

import { TagGeometry, TagMaterial, LOG_ENABLED, TagAnnotationOption } from './Configurations'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function Tag(tagJsonObj, options) {
  // Object3D.call(this);
  Mesh.call(this);

  this.type = "TAG";

  this.jsonObj = tagJsonObj;

  var options = options || {};

  this.name = this.jsonObj.tagSeq;

  this.index = this.jsonObj.tagIndex;
  this.tagType = this.jsonObj.tagType;
  this.trackSeq = this.jsonObj.trackSeq;
  this.distanceFromPointA = this.jsonObj.distanceFromPointA;

  this.geometry = TagGeometry;
  this.material = TagMaterial;

  this.initialize(options.displayed);
}

Tag.prototype = Object.create(Mesh.prototype);
Tag.prototype.constructor = Tag;

Tag.prototype.initialize = function(displayed) {
  if (typeof document != 'undefined' && document) {
    if (displayed) this.addAnnotation();
    else this.generateAnnotation();
  } else {
    if (LOG_ENABLED) console.log(`${this.name}: not running in browser environment, annotation will not be created.`);
  }
}

Tag.prototype.setPosition = function(track, displayed) {
  var t = this.distanceFromPointA / track.length,
  direction = track.curve.getTangentAt(t);

  this.position.copy(track.reference);
  this.position.x += direction.x * this.distanceFromPointA;
  this.position.y += direction.y * this.distanceFromPointA;

  if(!displayed && this.annotation) this.annotation.setPosition(this.position);
}

Tag.prototype.addAnnotation = function() {
  if (!this.annotation) this.generateAnnotation();

  this.add(this.annotation);
}

Tag.prototype.generateAnnotation = function() {
  this.annotation = new Annotation(this.name, TagAnnotationOption);
  this.annotation.name = 'annotation';
}

export default Tag;
