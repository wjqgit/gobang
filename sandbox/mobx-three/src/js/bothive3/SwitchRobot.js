import { Vector3, Object3D } from 'three'

import StraightTrack from './StraightTrack.js';
import CurvedTrack from './CurvedTrack.js';

import { RenderTrackMaterial, INFO_ENABLED } from './Configurations'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function SwitchRobot(switchJsonObj) {
  Object3D.call(this);

  this.type = switchJsonObj.type || 'SWITCH';

  this.name = switchJsonObj.switchSeq;

  this.jsonObj = switchJsonObj;

  this.moduleSeq;

  this.addRenderTracks();

  this.currentPosition = 'AC';
  this.switchPosition('AB');
}

SwitchRobot.prototype = Object.create(Object3D.prototype);
SwitchRobot.prototype.constructor = SwitchRobot;

SwitchRobot.prototype.getTrackAObj = function() {
  return this.jsonObj.trackList[0];
}

SwitchRobot.prototype.getTrackBObj = function() {
  return this.jsonObj.trackList[1];
}

SwitchRobot.prototype.getTrackCObj = function() {
  return this.jsonObj.trackList[2];
}

SwitchRobot.prototype.addRenderTracks = function() {
  this.generateRenderTrack(this.getTrackAObj(), 'A');
  this.generateRenderTrack(this.getTrackBObj(), 'B');
  this.generateRenderTrack(this.getTrackCObj(), 'C');
}

SwitchRobot.prototype.generateRenderTrack = function(trackObj, seq) {
  // TODO: copy obj by a clone function
  var trackJsonObj = JSON.parse(JSON.stringify(trackObj));

  var vector = new Vector3();
  var scale = 200 / trackObj.length;

  vector.subVectors(new Vector3(trackObj.pointB.x, trackObj.pointB.y, trackObj.pointB.z), new Vector3(trackObj.pointA.x, trackObj.pointA.y, trackObj.pointA.z))

  if (seq == 'A') {
    scale = 1 - scale;
    trackJsonObj.pointA.x = trackJsonObj.pointA.x + vector.x * scale;
    trackJsonObj.pointA.y = trackJsonObj.pointA.y + vector.y * scale;
    trackJsonObj.pointA.pointSeq += "_RD";
  } else if (seq == 'B') {
    trackJsonObj.pointB.x = trackJsonObj.pointA.x + vector.x * scale;
    trackJsonObj.pointB.y = trackJsonObj.pointA.y + vector.y * scale;
    trackJsonObj.pointB.pointSeq += "_RD";
  }

  trackJsonObj.trackSeq += "_RD";

  var renderTrack;
  if (seq == 'C') {
    renderTrack = new CurvedTrack(trackJsonObj);
  } else {
    renderTrack = new StraightTrack(trackJsonObj);
  }

  renderTrack.material = RenderTrackMaterial;

  var annotation = renderTrack.getObjectByName('annotation');
  renderTrack.remove(annotation);

  this.add(renderTrack);
}

SwitchRobot.prototype.getRenderTrackA = function() {
  return this.children[0];
}

SwitchRobot.prototype.getRenderTrackB = function() {
  return this.children[1];
}

SwitchRobot.prototype.getRenderTrackC = function() {
  return this.children[2];
}

SwitchRobot.prototype.switchPosition = function(position) {
  if (this.currentPosition === position) {
    if (INFO_ENABLED) console.info("Switch to the same position!");
    return;
  }

  switch (position) {
    case 'AB':
      this.getRenderTrackB().visible = true;
      this.getRenderTrackC().visible = false;
      break;

    case 'AC':
      this.getRenderTrackC().visible = true;
      this.getRenderTrackB().visible = false;
      break;

    default:

  }

  this.currentPosition = position;
}

SwitchRobot.prototype.togglePosition = function() {
  this.getRenderTrackB.visible = !this.getRenderTrackB.visible;
  this.getRenderTrackC.visible = !this.getRenderTrackC.visible;
}

SwitchRobot.prototype.getStatus = function() {
  let status = {};

  status.switchSeq = this.name;

  status.currentPosition = this.currentPosition;

  return status;
}

SwitchRobot.prototype.setStatus = function(status) {
  setTimeout(() => this.switchPosition(status.currentPosition), 0); // make it async to reduce delay
  // this.switchPosition(status.currentPosition);
}

export default SwitchRobot;
