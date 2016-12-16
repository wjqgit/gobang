import { Object3D } from 'three'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

 function CurvePath() {
   Object3D.call(this);

   this.curve = new CurvePath();

 }

 CurvePath.prototype = Object.create(Object3D.prototype);
 CurvePath.prototype.constructor = CurvePath;

export default CurvePath 
