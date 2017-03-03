import { Object3D } from 'three'

import BaseRail from './BaseRail.js';
import StraightTrack from './StraightTrack.js';

import * as CONSTANTS from './Constants'
import { RectifyAngle } from './Utils'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

 function EscalatorPort(portJsonObj, options) {
   BaseRail.call(this, portJsonObj, options);

   this.type = this.jsonObj.type || CONSTANTS.ESCALATOR_PORT;
   this.name = this.jsonObj.portSeq;

   this.length = this.jsonObj.length;
   this.carLength = this.jsonObj.carLength;

   this.escalatorSeq = this.jsonObj.escalatorSeq;
   this.floorNum = this.jsonObj.floorNum;

   this.pointC = this.jsonObj.pointC;
   this.pointD = this.jsonObj.pointD;
 }

EscalatorPort.prototype = Object.create(BaseRail.prototype);
EscalatorPort.prototype.constructor = EscalatorPort;

EscalatorPort.prototype.initialize = function() {
  this.addTracks();
  this.addTags();
  this.setCurvePath();
}

EscalatorPort.prototype.generateTracks = function() {
  this.tracks = new Object3D();
  this.tracks.name = 'tracks';

  for (let i = 0 ; i < this.jsonObj.trackList.length; i++) {
    var trackJsonObj = this.jsonObj.trackList[i];

    var baseTrack = new StraightTrack(trackJsonObj)
    baseTrack.visible = false;

    var displayLength = ( this.jsonObj.length - this.jsonObj.carLength ) / 2,
      directionA = this.jsonObj.direction,
      directionB = RectifyAngle(directionA + Math.PI);

    var trackAJsonObj = JSON.parse(JSON.stringify(trackJsonObj)),
      trackBJsonObj = JSON.parse(JSON.stringify(trackJsonObj));

    trackAJsonObj.length = displayLength;
    trackAJsonObj.pointB.x = trackAJsonObj.pointA.x + displayLength * Math.cos(directionA);
    trackAJsonObj.pointB.y = trackAJsonObj.pointA.y + displayLength * Math.sin(directionA);
    trackAJsonObj.trackIndex = 1;

    trackBJsonObj.length = displayLength;
    trackBJsonObj.pointA.x = trackBJsonObj.pointB.x + displayLength * Math.cos(directionB);
    trackBJsonObj.pointA.y = trackBJsonObj.pointB.y + displayLength * Math.sin(directionB);
    trackBJsonObj.trackIndex = 2;

    var trackA = new StraightTrack(trackAJsonObj),
      trackB = new StraightTrack(trackBJsonObj);

    this.tracks.add(baseTrack);
    this.tracks.add(trackA);
    this.tracks.add(trackB);
  }
}

export default EscalatorPort;
