import StraightRail from './StraightRail.js';

import * as CONSTANTS from './Constants'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function ShipmentArea(shipmentAreaJsonObj, options) {
  StraightRail.call(this, shipmentAreaJsonObj, options);

  this.type = this.jsonObj.type || SHIPMENT_AREA;

  this.name = this.jsonObj.shipmentAreaSeq;

  this.storageUnit;

  // this.leftPusher;
  // this.rightPusher;

  this.dropoffLocation = 0.625;

  // this.generatePicker();
}

ShipmentArea.prototype = Object.create(StraightRail.prototype);
ShipmentArea.prototype.constructor = ShipmentArea;

ShipmentArea.prototype.getTagC = function() {
  return this.getTagByIndex(2);
}

ShipmentArea.prototype.getTags = function() {
  let tags = [];

  tags.push(this.getTagA());
  tags.push(this.getTagB());
  tags.push(this.getTagC());

  return tags;
}

export default ShipmentArea;
