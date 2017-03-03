import { Vector3 } from 'three'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function Point(pointJsonObj) {
  Vector3.call(this, pointJsonObj.x, pointJsonObj.y, pointJsonObj.z);
  // Vector3.call(this);

  this.type = "POINT";

  this.jsonObj = pointJsonObj;
  // this.set(pointJsonObj.x, pointJsonObj.y, pointJsonObj.z);
  this.name = pointJsonObj.pointSeq;
}

Point.prototype = Object.create(Vector3.prototype);
Point.prototype.constructor = Point;

export default Point;
