import { Mesh, Vector3 } from 'three'
import { Annotation } from './Annotation';
import { BaseBoxMaterial, BaseBoxAnnotationOption, LOG_ENABLED } from './Configurations'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function BaseBox() {
  Mesh.call(this);
  this.castShadow = false;

  this.type = 'BaseBox';

  this.length = 1000; // x axis
  this.width = 500; // y axis
  this.height = 500; // z axis

  this.reference;
  this.curve;

  this.material = BaseBoxMaterial;

};

BaseBox.prototype = Object.create(Mesh.prototype);
BaseBox.prototype.constructor = BaseBox;

BaseBox.prototype.getDimension = function() {
  return new Vector3(this.length, this.width, this.height);
}

BaseBox.prototype.setPosition = function(position) {
  this.position.set(position.x, position.y, position.z);
};

BaseBox.prototype.generateAnnotation = function() {
  this.annotation = new Annotation(this.name, BaseBoxAnnotationOption);
  this.annotation.name = "annotation";
}

BaseBox.prototype.toggleAnnotationDisplay = function(displayed) {
  if (typeof document != 'undefined' && document) {
    if (displayed) {
      if (!this.annotation) this.generateAnnotation();

      this.add(this.annotation);
    } else {
      if (this.annotation) {
        if (this.getObjectByName(this.annotation.name) != null) {
          this.remove(this.annotation)
        } else {
          console.warn(`${this.name}: annotation is not added.`);
        }
      } else {
        console.warn(`${this.name} does NOT have annotation.`);
      }
    }
  } else {
    if (LOG_ENABLED) console.log(`${this.name}: not running in browser environment, annotation will not be created.`);
  }
}

BaseBox.prototype.setCurve = function(curve, reference, options) {
  this.curve = curve;
  this.reference = reference;

  var t = options.t || 0;
  this.updatePosition(t);
}

BaseBox.prototype.updatePosition = function(t) {
  var offset = this.curve.getPointAt(t),
    direction = this.curve.getTangentAt(t);

  this.position.copy(this.reference);
  this.position.x += offset.x;
  this.position.y += offset.y;

  var angle = Math.atan(direction.y / direction.x);
  this.rotation.z = angle;
}

BaseBox.prototype.shift = function(vector) {
  this.position.x += vector.x;
  this.position.y += vector.y;
}

export default BaseBox;
