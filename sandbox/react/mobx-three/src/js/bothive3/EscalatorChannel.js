/**
 * @author wjq / http://wangjiaqi.xyz
 */

KOVAN.EscalatorChannel = function(channelObj) {
  KOVAN.BaseRail.call(this, channelObj);

  this.type = this.jsonObj.type || 'ESCALATOR_CHANNEL';
}

KOVAN.EscalatorChannel.prototype = Object.create(KOVAN.BaseRail.prototype);
KOVAN.EscalatorChannel.prototype.constructor = KOVAN.EscalatorChannel;
