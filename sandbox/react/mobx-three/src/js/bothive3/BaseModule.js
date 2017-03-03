import { Object3D } from 'three'

import BaseRail from './BaseRail.js';
import PointMark from './PointMark.js';
import SwitchRobot from './SwitchRobot.js';

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function BaseModule(jsonObj, options) {
  BaseRail.call(this, jsonObj, options);

  this.components = [];

  this.addComponents();
}

BaseModule.prototype = Object.create(BaseRail.prototype);
BaseModule.prototype.constructor = BaseModule;

BaseModule.prototype.addComponents = function() {
  for (let i = 0; i < this.jsonObj.componentList.length; i++) {
    var componentJsonObj = this.jsonObj.componentList[i];

    var componentType = componentJsonObj.type;
    var component;
    switch (componentType) {
      case 'SWITCH':
        component = new SwitchRobot(componentJsonObj);
        break;

      default:
        console.error('Unsupported component type: ' + componentType);
    }

    this.components.push(component);
  }
}

BaseModule.prototype.generatePointMarks = function(options) {
  var options = options || {};

  this.pointMarks = new Object3D();
  this.pointMarks.name = 'pointMarks';

  let pointA = this.getPointA(),
    pointB = this.getPointB(),
    pointC = this.getPointC(),
    pointD = this.getPointD();

  if (pointA) {
    let pointAMark = new PointMark(pointA.name, options);
    pointAMark.setPosition(pointA, options.displayed);
    if (pointAMark) this.pointMarks.add(pointAMark);
  }

  if (pointB) {
    let pointBMark = new PointMark(pointB.name, options);
    pointBMark.setPosition(pointB, options.displayed);
    if (pointBMark) this.pointMarks.add(pointBMark);

  }

  if (pointC) {
    let pointCMark = new PointMark(pointC.name, options);
    pointCMark.setPosition(pointC, options.displayed);
    if (pointCMark) this.pointMarks.add(pointCMark);
  }

  if (pointD) {
    let pointDMark = new PointMark(pointD.name, options);
    pointDMark.setPosition(pointD, options.displayed);
    if (pointDMark) this.pointMarks.add(pointDMark);
  }

}

BaseModule.prototype.getPointC = function() {
  console.log('Getting Point C');
  return null;
}

BaseModule.prototype.getPointD = function() {
  console.log('Getting Point D');
  return null;
}

export default BaseModule;
