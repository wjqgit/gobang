import { Object3D } from 'three'

/**
 * @author wjq / http://wangjiaqi.xyz
 */


function PathTag(tagSeq, distanceFromReference) {
  Object3D.call(this);

  this.name = tagSeq;
  this.distanceFromReference = distanceFromReference;
}

PathTag.prototype = Object.create(Object3D.prototype);
PathTag.prototype.constructor = PathTag;

export default PathTag;
