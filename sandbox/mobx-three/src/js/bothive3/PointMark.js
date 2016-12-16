import { Mesh } from 'three'

import Annotation from './Annotation'

import { PointGeometry, PointMaterial, LOG_ENABLED, PointAnnotationOption } from './Configurations'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

 function PointMark(pointSeq, options) {
   Mesh.call(this);

   var options = options || {};

   this.type = "POINT_MARK";
   this.name = pointSeq;

   this.geometry = PointGeometry;
   this.material = PointMaterial;

  //  this.generateAnnotation();
    this.initialize(options.displayed);
 }

 PointMark.prototype = Object.create(Mesh.prototype);
 PointMark.prototype.constructor = PointMark;

 PointMark.prototype.initialize = function(displayed) {
   if (typeof document != 'undefined' && document) {
     if (displayed) this.addAnnotation();
     else this.generateAnnotation();
   } else {
     if (LOG_ENABLED) console.log(`${this.name}: not running in browser environment, annotation will not be created.`);
   }
 }

 PointMark.prototype.setPosition = function(point, displayed) {
   this.position.copy(point)

   if (!displayed) this.annotation.setPosition(this.position);
 }

 PointMark.prototype.setAnnotationPosition = function(displayed) {
   if (!displayed) this.annotation.setPosition(this.position);
 }

 PointMark.prototype.addAnnotation = function() {
   if (!this.annotation) this.generateAnnotation();

   this.add(this.annotation);
 }

 PointMark.prototype.generateAnnotation = function() {
     this.annotation = new Annotation(this.name, PointAnnotationOption);
     this.annotation.name = 'annotation';
 }

export default PointMark;
