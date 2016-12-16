import BaseRail from './BaseRail.js';

import * as CONSTANTS from './Constants'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function StraightRail(railJsonObj, options) {
  BaseRail.call(this, railJsonObj, options);

  this.type = this.jsonObj.type || CONSTANTS.STRAIGHT_RAIL;

  this.name = this.jsonObj.railSeq;

};

StraightRail.prototype = Object.create(BaseRail.prototype);
StraightRail.prototype.constructor = StraightRail;

export default StraightRail;
