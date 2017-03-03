import { Geometry, Mesh } from 'three'

import BaseRail from './BaseRail.js';
import CurvePath from './CurvePath.js';
import Picker from './Picker.js';
import Rack from './Rack.js';

import * as CONSTANTS from './Constants'
import { RackGeometry, RackMaterial, RackLength, RackGap, StorageRackMaterial, PickerGeometry, PickerMaterial, LOG_ENABLED } from './Configurations'
import { ShowRackAnnotation } from './DisplayConfigurations'
import { ParseNumber, Pad } from './Utils'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function StorageUnit(storageUnitObj, map, options) {
    BaseRail.call(this, storageUnitObj, options);

    this.map = map;

    this.type = storageUnitObj.type || CONSTANTS.STORAGE_UNIT;

    this.name = storageUnitObj.storageUnitSeq;

    this.shipmentAreaSeq = storageUnitObj.shipmentAreaSeq;

    this.pickerSeq = storageUnitObj.pickerSeq;

    this.leftPushAreaSeq = storageUnitObj.leftPushAreaSeq;
    this.leftPusherSeq = storageUnitObj.leftPusherSeq;

    this.rightPushAreaSeq = storageUnitObj.rightPushAreaSeq;
    this.rightPusherSeq = storageUnitObj.rightPusherSeq;

    this.leftStorageCapacity = storageUnitObj.leftStorageCapacity;
    this.rightStorageCapacity = storageUnitObj.rightStorageCapacity;

    this.shipmentArea;

    this.leftPushArea;
    this.leftPusher;

    this.rightPushArea;
    this.rightPusher;

    this.leftStorageIndices = new Array(this.leftStorageCapacity).fill(0);
    this.rightStorageIndices = new Array(this.rightStorageCapacity).fill(0);

    this.currentLeftStorageCount = 0;
    this.currentRightStorageCount = 0;
}

StorageUnit.prototype = Object.create(BaseRail.prototype);
StorageUnit.prototype.constructor = StorageUnit;

StorageUnit.prototype.createStorageRacks = function(currentLeftStorageCount, currentRightStorageCount) {
    // left storage
    if (currentLeftStorageCount > this.leftStorageCapacity) {
        console.error(`${this.name}: left storage count exceeded capacity (${currentLeftStorageCount} > ${this.leftStorageCapacity})`);
    } else {
        for (let i = 0; i < currentLeftStorageCount; i++) {
            this.leftStorageIndices[i] = 1;
        }

        this.currentLeftStorageCount = currentLeftStorageCount;

        this.updateStorageRack(CONSTANTS.LEFT);
    }


    // right storage
    if (currentRightStorageCount > this.rightStorageCapacity) {
        console.error(`${this.name}: right storage count exceeded capacity (${currentRightStorageCount} > ${this.rightStorageCapacity})`);
    } else {
        for (let i = 0; i < currentRightStorageCount; i++) {
            this.rightStorageIndices[i] = 1;
        }

        this.currentRightStorageCount = currentRightStorageCount;

        this.updateStorageRack(CONSTANTS.RIGHT)
    }
}

StorageUnit.prototype.storeRack = function(side) {
    let storageCapacity = this.getStorageCapacityBySide(side),
        currentStorageCount = this.getCurrentStorageCountBySide(side),
        storageIndices = this.getStorageIndexBySide(side),
        storageTrack = this.getStorageTrackBySide(side);

    if (currentStorageCount >= storageCapacity) {
        console.error(`${this.name}: ${side} storage reached limit (${currentStorageCount } >= ${storageCapacity}), no space for more rack.`);
    } else {
        for (let i = 0; i < storageIndices.length; i++) {
            if (storageIndices[i] == 0) {
                storageIndices[i] = 1;
                break;
            }
        }

        this.changeCurrentStorageCountBySide(side, 1);

        this.updateStorageRack(side);
    }
}

StorageUnit.prototype.pickRack = function(side, index, rackSeq) {
    let storageIndices = this.getStorageIndexBySide(side)

    if (storageIndices[index] == 0) {
        console.error(`${this.name}: picker tries to pick from empty location (side: ${side}, index: ${index})`);
    } else {
        storageIndices[index] = 0;

        this.changeCurrentStorageCountBySide(side, -1);
        this.updateStorageRack(side);

        return this.createRack(side, index, rackSeq);
    }
}

StorageUnit.prototype.createRack = function(side, index, rackSeq) {
    let storageTrack = this.getStorageTrackBySide(side),
        reference = storageTrack.pointA,
        curve = storageTrack.curve;

    let rack = new Rack(RackGeometry, RackMaterial);
    rack.name = rackSeq;
    // rack.generateAnnotation();
    if (ShowRackAnnotation) rack.toggleAnnotationDisplay(ShowRackAnnotation);

    let distance = (RackLength + RackGap) * index + RackLength / 2,
        t = distance / storageTrack.length;

    let tangent = curve.getTangentAt(0);
    let angle = Math.atan(tangent.y / tangent.x);

    let point = curve.getPointAt(t);

    rack.position.copy(reference);
    rack.position.x += point.x;
    rack.position.y += point.y;

    rack.rotation.z = angle;

    this.map.racks.add(rack);

    return rack;
}

StorageUnit.prototype.removeRack =  function(rack) {
  this.map.racks.remove(rack);
}

StorageUnit.prototype.updateStorageRack = function(side) {
    let storageRacksName = this.getStorageRacksNameBySide(side),
        storageCapacity = this.getStorageCapacityBySide(side),
        storageIndices = this.getStorageIndexBySide(side),
        storageTrack = this.getStorageTrackBySide(side);

    let reference = storageTrack.pointA,
        curve = storageTrack.curve;

    let direction = curve.getTangentAt(0);
    let angle = Math.atan(direction.y / direction.x);

    let storageRacks = this.map.getObjectByName(storageRacksName);

    if (storageRacks) {
        this.map.remove(storageRacks);
    }

    let racksGeometry = new Geometry();

    for (let i = 0; i < storageCapacity; i++) {
        let distance = (RackLength + RackGap) * i + RackLength / 2;
        let t = distance / storageTrack.length;


        let point = curve.getPointAt(t);

        let rackGeometry = RackGeometry;

        let rackMesh = new Mesh(rackGeometry);
        rackMesh.position.copy(reference);
        rackMesh.position.x += point.x;
        rackMesh.position.y += point.y;

        rackMesh.rotation.z = angle;

        rackMesh.updateMatrix();
        racksGeometry.merge(rackGeometry, rackMesh.matrix);
    }

    for (let i = 0; i < racksGeometry.faces.length; i++) {
        racksGeometry.faces[i].materialIndex = storageIndices[Math.floor(i / CONSTANTS.FACES_PER_BOX)];
    }

    racksGeometry.sortFacesByMaterialIndex();

    storageRacks = new Mesh(racksGeometry, StorageRackMaterial);
    storageRacks.name = storageRacksName;

    this.map.add(storageRacks);
}

StorageUnit.prototype.generatePicker = function() {
    var prefix = 'PK',
        seq = ParseNumber(this.name);

    var pickerSeq = this.pickerSeq || prefix + Pad(seq, 2, 0);
    var picker = new Picker(this, {
        name: pickerSeq,
        geometry: PickerGeometry,
        material: PickerMaterial
    });
    // picker.generateAnnotation();
    // Temp: set picker position
    var curve = this.getCurvePathByDirection('AB').curve,
        reference = this.getReferenceByDirection('AB'),
        offset = 0;

    picker.setCurve(curve, reference, {
        offset: offset
    });

    picker.updatePosition(picker.standbyLocation);

    picker.addPickingTracks();

    this.picker = picker;

    this.map.pickers.add(this.picker);

    return picker;
}

StorageUnit.prototype.setCurvePath = function() {
    let pickerTrack = this.getPickerTrack();

    this.curvePath = new CurvePath();

    this.curvePath.curve = pickerTrack.curve;
}

StorageUnit.prototype.changeCurrentStorageCountBySide = function(side, change) {
    switch (side) {
        case CONSTANTS.LEFT:
            this.currentLeftStorageCount += change;
            break;
        case CONSTANTS.RIGHT:
            this.currentRightStorageCount += change;
            break;
        default:
            console.error(`${this.name}: invalid side (${side})`);
    }
}

StorageUnit.prototype.getRackPosition = function(rackSide, rackIndex) {
    let storageIndices = this.getStorageIndexBySide(rackSide);

    let rackCounter = 0;

    let rackPosition;

    for (let i = 0; i < storageIndices.length; i++) {
        let storageIndex = storageIndices[i];

        if (storageIndex == 1) {
          if (++rackCounter >= rackIndex + 1) {
            rackPosition = {};
            rackPosition.rackLocationIndex = i;
            rackPosition.rackDistance = (RackLength + RackGap) * i + RackLength / 2;
            break;
          }
        }
    }

    return rackPosition;
}

StorageUnit.prototype.getStorageCapacityBySide = function(side) {
    let storageCapacity;

    switch (side) {
        case CONSTANTS.LEFT:
            storageCapacity = this.leftStorageCapacity;
            break;
        case CONSTANTS.RIGHT:
            storageCapacity = this.rightStorageCapacity;
            break;
        default:
            console.error(`${this.name}: invalid side (${side})`);
    }

    return storageCapacity;
}

StorageUnit.prototype.getCurrentStorageCountBySide = function(side) {
    let currentStorageCount;

    switch (side) {
        case CONSTANTS.LEFT:
            currentStorageCount = this.currentLeftStorageCount;
            break;
        case CONSTANTS.RIGHT:
            currentStorageCount = this.currentRightStorageCount;
            break;
        default:
            console.error(`${this.name}: invalid side (${side})`);
    }

    return currentStorageCount;
}

StorageUnit.prototype.getStorageIndexBySide = function(side) {
    let storageIndices;

    switch (side) {
        case CONSTANTS.LEFT:
            storageIndices = this.leftStorageIndices;
            break;
        case CONSTANTS.RIGHT:
            storageIndices = this.rightStorageIndices;
            break;
        default:
            console.error(`${this.name}: invalid side (${side})`);
    }

    return storageIndices;
}

StorageUnit.prototype.getStorageTrackBySide = function(side) {
    let storageTrack;

    switch (side) {
        case CONSTANTS.LEFT:
            storageTrack = this.getLeftStorageTrack();
            break;
        case CONSTANTS.RIGHT:
            storageTrack = this.getRightStorageTrack();
            break;
        default:
            console.error(`${this.name}: invalid side (${side})`);
    }

    return storageTrack;
}

StorageUnit.prototype.getStorageRacksNameBySide = function(side) {
    let storageRacksName;

    switch (side) {
        case CONSTANTS.LEFT:
            storageRacksName = 'leftStorageRacks-' + this.name;
            break;
        case CONSTANTS.RIGHT:
            storageRacksName = 'rightStorageRacks-' + this.name;
            break;
        default:
            console.error(`${this.name}: invalid side (${side})`);
    }

    return storageRacksName;
}

StorageUnit.prototype.getPusherSeqBySide = function(side) {
    switch (side) {
        case CONSTANTS.LEFT:
            return this.leftPusherSeq;
            break;
        case CONSTANTS.RIGHT:
            return this.rightPusherSeq;
            break;
        default:
            console.error(`${this.name}: invalid side (${side})`);
    }
}

StorageUnit.prototype.getWidth = function() {
    let leftStorageTrack = this.getLeftStorageTrack(),
        rightStorageTrack = this.getRightStorageTrack();

    let leftStorageTrackPointA = leftStorageTrack.pointA,
        rightStorageTrackPointA = rightStorageTrack.pointA;

    return Math.sqrt(Math.pow(leftStorageTrackPointA.x - rightStorageTrackPointA.x, 2) + Math.pow(leftStorageTrackPointA.y - rightStorageTrackPointA.y, 2));
}

StorageUnit.prototype.getPickerTrack = function() {
    return this.getTrackByIndex(0);
}

StorageUnit.prototype.getLeftStorageTrack = function() {
    return this.getTrackByIndex(1);
}

StorageUnit.prototype.getRightStorageTrack = function() {
    return this.getTrackByIndex(2);
}

StorageUnit.prototype.getGeometries = function() {
    let geometries = [];

    geometries.push(this.getPickerTrack().geometry);
    geometries.push(this.getLeftStorageTrack().geometry);
    geometries.push(this.getRightStorageTrack().geometry);

    return geometries;
}

StorageUnit.prototype.getLines = function() {
    let lines = [];

    lines.push(this.getPickerTrack());
    lines.push(this.getLeftStorageTrack());
    lines.push(this.getRightStorageTrack());

    return lines;
}

StorageUnit.prototype.getTagGeometries = function() {
    if (LOG_ENABLED) console.log(`${this.jsonObj.storageUnitSeq}: getting tag geometries.`);
}

StorageUnit.prototype.getTagMeshes = function() {
    if (LOG_ENABLED) console.log(`${this.jsonObj.storageUnitSeq}: getting tag meshes.`);
}

StorageUnit.prototype.getTags = function() {
  if (LOG_ENABLED) console.log(`${this.jsonObj.storageUnitSeq}: getting tags.`);
}

StorageUnit.prototype.getStatus = function() {
  let status = {};

  status.storageUnitSeq = this.name;

  status.leftStorageIndices = this.leftStorageIndices;
  status.rightStorageIndices = this.rightStorageIndices;

  status.currentLeftStorageCount = this.currentLeftStorageCount;
  status.currentRightStorageCount = this.currentRightStorageCount;

  return status;
}

StorageUnit.prototype.setStatus = function(status) {
  this.leftStorageIndices = status.leftStorageIndices;
  this.rightStorageIndices = status.rightStorageIndices;

  this.currentLeftStorageCount = status.currentLeftStorageCount;
  this.currentRightStorageCount = status.currentRightStorageCount;

  setTimeout(() => {
    this.updateStorageRack(CONSTANTS.LEFT);
    this.updateStorageRack(CONSTANTS.RIGHT);
  }, 0); // make it async to reduce delay
}

export default StorageUnit;
