import { Object3D, Line, LineSegments, Geometry, BufferGeometry, Mesh  } from 'three'

import StraightRail from './StraightRail.js';
import CornerRail from './CornerRail.js';
import Switch from './Switch.js';
import RechargeArea from './RechargeArea.js';
import ShipmentArea from './ShipmentArea.js';
import StationDock from './StationDock.js';
import Crossroad from './Crossroad.js';
import PushArea from './PushArea.js';
import Escalator from './Escalator.js';
import StorageUnit from './StorageUnit.js';
import Tag from './Tag.js';
import PointMark from './PointMark.js';
import {
    BaseTrackMaterial,
    TagMaterial,
    PointMaterial,
} from './Configurations'
import * as DISPLAY_CONFIGS from './DisplayConfigurations'
import * as CONSTANTS from './Constants'
import { TestPointSimilarity } from './Utils'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function DigitalMap(mapJsonObj) {
    Line.call(this);

    this.jsonObj = mapJsonObj || {};

    this.type = 'DIGITAL_MAP';

    // nodes
    this.nodeMaterial = BaseTrackMaterial;
    this.nodeGeometry = new Geometry();

    this.nodes = {};

    // movers
    this.movers = new Object3D();
    this.movers.name = 'movers';

    // racks
    this.racks = new Object3D();
    this.racks.name = 'racks';

    // switch robots
    this.switchRobots = new Object3D();
    this.switchRobots.name = 'switchRobots';

    // pushers
    this.pushers = new Object3D();
    this.pushers.name = 'pushers';

    // pickers
    this.pickers = new Object3D();
    this.pickers.name = 'pickers';

    // escalators
    this.escalators = new Object3D();
    this.escalators.name = 'escalators';

    // storage units
    this.storageUnits = new Object3D();
    this.storageUnits.name = 'storageUnits';

    // tags
    this.tagMaterial = TagMaterial;
    this.tagsGeometry = new Geometry();

    // points
    this.pointMaterial = PointMaterial;
    this.pointsGeometry = new Geometry();

    // this.tracks = new Object3D(); // Initialize tracks as a property, and it will not be rendered by threejs
    if (mapJsonObj) {
        // this.generateRails();
        this.generateStraightRails();
        this.generateCornerRails();
        this.generateSwitches();
        this.generateRechargeAreas();
        this.generateShipmentAreas();
        this.generateStationDocks();
        this.generateCrossroads();
        this.generatePushAreas();
        this.generateEscalators();
        this.generateStorageUnits();
        this.generateNodes();
    } else {
        this.jsonObj.straightRailList = [];
        this.jsonObj.cornerRailList = [];
        this.jsonObj.switchList = [];
        this.jsonObj.rechargeAreaList = [];
        this.jsonObj.shipmentAreaList = [];
        this.jsonObj.stationDockList = [];
        this.jsonObj.crossroadList = [];
        this.jsonObj.pushAreaList = [];
        this.jsonObj.escalatorList = [];
        this.jsonObj.storageUnitList = [];
        this.jsonObj.pointList = [];
    }

    this.setComponentCounts();
}


DigitalMap.prototype = Object.create(Object3D.prototype);
DigitalMap.prototype.constructor = DigitalMap;

// Deprecated
DigitalMap.prototype.generateRails = function() {
    var rails = new Object3D();
    rails.name = 'rails';

    for (let i = 0; i < this.jsonObj.straightRailList.length; i++) {
        var railJsonObj = this.jsonObj.straightRailList[i];
        var rail = new Rail(railJsonObj);
        rails.add(rail);
    }

    for (let i = 0; i < this.jsonObj.cornerRailList.length; i++) {
        var railJsonObj = this.jsonObj.cornerRailList[i];
        var rail = new Rail(railJsonObj);
        rails.add(rail);
    }

    this.add(rails);
}

DigitalMap.prototype.generateStraightRails = function() {
    var straightRails = new Object3D();
    straightRails.name = 'straightRails';

    for (let i = 0; i < this.jsonObj.straightRailList.length; i++) {
        var straightRailJsonObj = this.jsonObj.straightRailList[i];
        var straightRail = new StraightRail(straightRailJsonObj);
        // straightRails.add(straightRail);
        this.addNode(straightRail);

        this.addPointToPointList(straightRailJsonObj.trackList);
    }

    //this.add(straightRails);

}

DigitalMap.prototype.generateCornerRails = function() {
    var cornerRails = new Object3D();
    cornerRails.name = 'cornerRails';

    for (let i = 0; i < this.jsonObj.cornerRailList.length; i++) {
        var cornerRailJsonObj = this.jsonObj.cornerRailList[i];
        var cornerRail = new CornerRail(cornerRailJsonObj);
        // cornerRails.add(cornerRail);

        this.addNode(cornerRail);

        this.addPointToPointList(cornerRailJsonObj.trackList);
    }

    // this.add(cornerRails);
}

DigitalMap.prototype.generateSwitches = function() {
    var switches = new Object3D();
    switches.name = 'switches';

    for (let i = 0; i < this.jsonObj.switchList.length; i++) {
        var switchJsonObj = this.jsonObj.switchList[i];
        var sw = new Switch(switchJsonObj);
        // switches.add(sw);

        this.addNode(sw);

        this.switchRobots.add(sw.switchRobot);

        this.addPointToPointList(switchJsonObj.trackList);
    }

    // this.add(switches);
}

DigitalMap.prototype.generateRechargeAreas = function() {
    var rechargeAreas = new Object3D();
    rechargeAreas.name = 'rechargeAreas';

    for (let i = 0; i < this.jsonObj.rechargeAreaList.length; i++) {
        var rechargeAreaJsonObj = this.jsonObj.rechargeAreaList[i];
        var rechargeArea = new RechargeArea(rechargeAreaJsonObj);
        // rechargeAreas.add(rechargeArea);

        this.addNode(rechargeArea);

        this.addPointToPointList(rechargeAreaJsonObj.trackList);
    }

    // this.add(rechargeAreas);
}

DigitalMap.prototype.generateShipmentAreas = function() {
    var shipmentAreas = new Object3D();
    shipmentAreas.name = 'shipmentAreas';

    for (let i = 0; i < this.jsonObj.shipmentAreaList.length; i++) {
        var shipmentAreaJsonObj = this.jsonObj.shipmentAreaList[i];
        var shipmentArea = new ShipmentArea(shipmentAreaJsonObj);
        // shipmentAreas.add(shipmentArea);

        this.addNode(shipmentArea);

        // this.pickers.add(shipmentArea.picker);

        this.addPointToPointList(shipmentAreaJsonObj.trackList);
    }

    // this.add(shipmentAreas);
}

DigitalMap.prototype.generateStationDocks = function() {
    var stationDocks = new Object3D();
    stationDocks.name = 'stationDocks';

    for (let i = 0; i < this.jsonObj.stationDockList.length; i++) {
        var stationDockJsonObj = this.jsonObj.stationDockList[i];
        var stationDock = new StationDock(stationDockJsonObj);
        // stationDocks.add(stationDock);

        this.addNode(stationDock);

        this.addPointToPointList(stationDockJsonObj.trackList);
    }

    // this.add(stationDocks);
}

DigitalMap.prototype.generateCrossroads = function() {
    var crossroads = new Object3D();
    crossroads.name = 'crossroads';

    for (let i = 0; i < this.jsonObj.crossroadList.length; i++) {
        var crossroadJsonObj = this.jsonObj.crossroadList[i];
        var crossroad = new Crossroad(crossroadJsonObj);
        // crossroads.add(crossroad);

        this.addNode(crossroad)

        for (let j in crossroad.components) {
            this.switchRobots.add(crossroad.components[j]);
        }

        this.addPointToPointList(crossroadJsonObj.trackList);
    }

    // this.add(crossroads);
}

DigitalMap.prototype.generatePushAreas = function() {
    var pushAreas = new Object3D();
    pushAreas.name = 'pushAreas';

    for (let i = 0; i < this.jsonObj.pushAreaList.length; i++) {
        var pushAreaJsonObj = this.jsonObj.pushAreaList[i];
        var pushArea = new PushArea(pushAreaJsonObj);
        // pushAreas.add(pushArea);

        this.addNode(pushArea);

        // this.pushers.add(pushArea.pusher);

        for (let j in pushArea.components) {
            this.switchRobots.add(pushArea.components[j]);
        }

        this.addPointToPointList(pushAreaJsonObj.trackList);
    }

    // this.add(pushAreas);
}

DigitalMap.prototype.generateEscalators = function() {
    for (let i = 0; i < this.jsonObj.escalatorList.length; i++) {
        var escalatorJsonObj = this.jsonObj.escalatorList[i];

        var up;
        switch (escalatorJsonObj.allowedDirectionStr) {
            case "AB":
                up = true;
                break;
            case "BA":
                up = false;
                break;
            default:
                up = true;
        }

        escalatorJsonObj.up = up;

        var escalator = new Escalator(escalatorJsonObj);

        this.escalators.add(escalator);

        for (let j = 0; j < escalatorJsonObj.numOfFloors; j++) {
            var portObj = escalatorJsonObj.portList[j],
                channelObj = escalatorJsonObj.channelList[j];

            this.addPointToPointList(portObj.trackList);
            this.addPointToPointList(channelObj.trackList);
        }

        for (let j = 0; j < escalatorJsonObj.numOfCars; j++) {
            var carObj = escalatorJsonObj.carList[j];

            this.addPointToPointList(carObj.trackList);
        }
    }
}

DigitalMap.prototype.generateStorageUnits = function() {
    for (let i = 0; i < this.jsonObj.storageUnitList.length; i++) {
        let storageUnitJsonObj = this.jsonObj.storageUnitList[i];
        let storageUnit = new StorageUnit(storageUnitJsonObj, this);

        this.storageUnits.add(storageUnit);

        this.addNode(storageUnit);

        this.addPointToPointList(storageUnitJsonObj.trackList);

        // shipment area
        let shipmentArea = this.nodes[storageUnit.shipmentAreaSeq];

        shipmentArea.storageUnit = storageUnit;

        storageUnit.shipmentArea = shipmentArea;

        // picker
        storageUnit.generatePicker();

        // left push area
        let leftPushArea = this.nodes[storageUnit.leftPushAreaSeq];

        leftPushArea.storageUnit = storageUnit;
        leftPushArea.side = CONSTANTS.LEFT;

        storageUnit.leftPushArea = leftPushArea;

        // left pusher
        leftPushArea.generatePusher();

        storageUnit.leftPusher = leftPushArea.pusher;

        // right push area
        let rightPushArea = this.nodes[storageUnit.rightPushAreaSeq];

        rightPushArea.storageUnit = storageUnit;
        rightPushArea.side = CONSTANTS.RIGHT;

        storageUnit.rightPushArea = rightPushArea;

        // right pusher
        rightPushArea.generatePusher();

        storageUnit.rightPusher = rightPushArea.pusher;
    }


}

DigitalMap.prototype.generateTags = function() {
    var tags = new Object3D();
    tags.name = "tags";

    for (let i = 0; i < this.jsonObj.tagList.length; i++) {
        var tagJsonObj = this.jsonObj.tagList[i];
        var tag = new Tag(tagJsonObj);

        tag.setPosition(this.getObjectByName(tagJsonObj.trackSeq));

        tags.add(tag);
    }

    this.add(tags);
}

// TODO
DigitalMap.prototype.loadMapFromJson = function(mapJsonObj) {
    // this.jsonObj = mapJsonObj;

    for (let i = 0; i < mapJsonObj.straightRailList.length; i++) {
        this.addStraightRail(mapJsonObj.straightRailList[i]);
    }
    for (let i = 0; i < mapJsonObj.cornerRailList.length; i++) {
        this.addCornerRail(mapJsonObj.cornerRailList[i]);
    }
    for (let i = 0; i < mapJsonObj.switchList.length; i++) {
        this.addSwitch(mapJsonObj.switchList[i]);
    }
    for (let i = 0; i < mapJsonObj.rechargeAreaList.length; i++) {
        this.addRechargeArea(mapJsonObj.rechargeAreaList[i]);
    }
    for (let i = 0; i < mapJsonObj.shipmentAreaList.length; i++) {
        this.addShipmentArea(mapJsonObj.shipmentAreaList[i]);
    }
    for (let i = 0; i < mapJsonObj.stationDockList.length; i++) {
        this.addStationDock(mapJsonObj.stationDockList[i]);
    }
    for (let i = 0; i < mapJsonObj.crossroadList.length; i++) {
        this.addCrossroad(mapJsonObj.crossroadList[i]);
    }
    for (let i = 0; i < mapJsonObj.pushAreaList.length; i++) {
        this.addPushArea(mapJsonObj.pushAreaList[i]);
    }
    for (let i = 0; i < mapJsonObj.escalatorList.length; i++) {
        this.addEscalator(mapJsonObj.escalatorList[i]);
    }
    for (let i = 0; i < mapJsonObj.storageUnitList.length; i++) {
        this.addStorageUnit(mapJsonObj.storageUnitList[i]);
    }

    this.jsonObj.pointList = mapJsonObj.pointList;

    this.setComponentCounts();
}

DigitalMap.prototype.setComponentCounts = function() {
    this.pointCount = this.jsonObj.pointList.length;
    this.straightRailCount = this.jsonObj.straightRailList.length;
    this.cornerRailCount = this.jsonObj.cornerRailList.length;
    this.switchCount = this.jsonObj.switchList.length;
    this.rechargeAreaCount = this.jsonObj.rechargeAreaList.length;
    this.shipmentAreaCount = this.jsonObj.shipmentAreaList.length;
    this.stationDockCount = this.jsonObj.stationDockList.length;
    this.crossroadCount = this.jsonObj.crossroadList.length;
    this.pushAreaCount = this.jsonObj.pushAreaList.length;
    this.escalatorCount = this.jsonObj.escalatorList.length;
    this.storageUnitCount = this.jsonObj.storageUnitList.length;
}

DigitalMap.prototype.addStraightRail = function(straightRailObj) {
    var straightRails;

    if (this.getObjectByName('straightRails') == null) {
        straightRails = new Object3D();
        straightRails.name = 'straightRails';

        this.add(straightRails)

    } else {
        straightRails = this.getObjectByName('straightRails');
    }

    var straightRail = new StraightRail(straightRailObj, {
        displayed: true
    });
    straightRails.add(straightRail)

    this.jsonObj.straightRailList.push(straightRailObj);

    return straightRail;
}

DigitalMap.prototype.addCornerRail = function(cornerRailObj) {
    var cornerRails;

    if (this.getObjectByName('cornerRails') == null) {
        cornerRails = new Object3D();
        cornerRails.name = 'cornerRails';

        this.add(cornerRails)

    } else {
        cornerRails = this.getObjectByName('cornerRails');
    }

    var cornerRail = new CornerRail(cornerRailObj, {
        displayed: true
    });
    cornerRails.add(cornerRail)

    this.jsonObj.cornerRailList.push(cornerRailObj);

    return cornerRail;
}

DigitalMap.prototype.addSwitch = function(switchObj) {
    var switches;

    if (this.getObjectByName('switches') == null) {
        switches = new Object3D();
        switches.name = 'switches';

        this.add(switches)

    } else {
        switches = this.getObjectByName('switches');
    }

    var sw = new Switch(switchObj, {
        displayed: true
    });
    switches.add(sw)

    this.jsonObj.switchList.push(switchObj);

    return sw;
}

DigitalMap.prototype.addRechargeArea = function(rechargeAreaObj) {
    var rechargeAreas;

    if (this.getObjectByName('rechargeAreas') == null) {
        rechargeAreas = new Object3D();
        rechargeAreas.name = 'rechargeAreas';

        this.add(rechargeAreas)

    } else {
        rechargeAreas = this.getObjectByName('rechargeAreas');
    }

    var rechargeArea = new RechargeArea(rechargeAreaObj, {
        displayed: true
    });
    rechargeAreas.add(rechargeArea)

    this.jsonObj.rechargeAreaList.push(rechargeAreaObj);

    return rechargeArea;
}

DigitalMap.prototype.addShipmentArea = function(shipmentAreaObj) {
    var shipmentAreas;

    if (this.getObjectByName('shipmentAreas') == null) {
        shipmentAreas = new Object3D();
        shipmentAreas.name = 'shipmentAreas';

        this.add(shipmentAreas);
    } else {
        shipmentAreas = this.getObjectByName('shipmentAreas');
    }

    var shipmentArea = new ShipmentArea(shipmentAreaObj, {
        displayed: true
    });
    shipmentAreas.add(shipmentArea);

    this.jsonObj.shipmentAreaList.push(shipmentAreaObj);

    return shipmentArea;
}

DigitalMap.prototype.addStationDock = function(stationDockObj) {
    var stationDocks;

    if (this.getObjectByName('stationDocks') == null) {
        stationDocks = new Object3D();
        stationDocks.name = 'stationDocks';

        this.add(stationDocks);
    } else {
        stationDocks = this.getObjectByName('stationDocks');
    }

    var stationDock = new StationDock(stationDockObj, {
        displayed: true
    });
    stationDocks.add(stationDock);

    this.jsonObj.stationDockList.push(stationDockObj);

    return stationDock;
}

DigitalMap.prototype.addCrossroad = function(crossroadObj) {
    var crossroads;

    if (this.getObjectByName('crossroads') == null) {
        crossroads = new Object3D();
        crossroads.name = 'crossroads';

        this.add(crossroads);
    } else {
        crossroads = this.getObjectByName('crossroads');
    }

    var crossroad = new Crossroad(crossroadObj, {
        displayed: true
    });
    crossroads.add(crossroad);

    this.jsonObj.crossroadList.push(crossroadObj);

    return crossroad;
}

DigitalMap.prototype.addPushArea = function(pushAreaObj) {
    var pushAreas;

    if (this.getObjectByName('pushAreas') == null) {
        pushAreas = new Object3D();
        pushAreas.name = 'pushAreas';

        this.add(pushAreas);
    } else {
        pushAreas = this.getObjectByName('pushAreas');
    }

    var pushArea = new PushArea(pushAreaObj, {
        displayed: true
    });
    pushAreas.add(pushArea);

    this.jsonObj.pushAreaList.push(pushAreaObj);

    return pushArea;
}

DigitalMap.prototype.addEscalator = function(escalatorObj) {
    var escalators;

    if (this.getObjectByName('escalators') == null) {
        escalators = new Object3D();
        escalators.name = 'escalators';

        this.add(escalators);
    } else {
        escalators = this.getObjectByName('escalators');
    }

    var escalator = new Escalator(escalatorObj);
    escalators.add(escalator);

    this.jsonObj.escalatorList.push(escalatorObj);

    return escalator;
}

DigitalMap.prototype.addStorageUnit = function(storageUnitObj) {
    var storageUnits;

    if (this.getObjectByName('storageUnits') == null) {
        storageUnits = new Object3D();
        storageUnits.name = 'storageUnits';

        this.add(storageUnits);
    } else {
        storageUnits = this.getObjectByName('storageUnits');
    }

    var storageUnit = new StorageUnit(storageUnitObj, this, {
        displayed: true
    });
    storageUnits.add(storageUnit);

    this.jsonObj.storageUnitList.push(storageUnitObj);

    return storageUnit;
}

// Deprecated
DigitalMap.prototype.addTag = function(tagObj) {
    var tags;

    if (this.getObjectByName('tags') == null) {
        tags = new Object3D();
        tags.name = 'tags';

        this.add(tags)
    } else {
        tags = this.getObjectByName('tags');
    }

    var tag = new Tag(tagObj);
    tag.setPosition(this.getObjectByName(tagObj.trackSeq));
    tags.add(tag);

    this.jsonObj.tagList.push(tagObj);
}

DigitalMap.prototype.getComponentByPointSeq = function(pointSeq, type) {
    let components = this.getObjectByName(type);

    for (let i = 0; i < components.children.length; i++) {
        let component = components.children[i];

        if (component.containsPoint(pointSeq)) {
            return component;
        }
    }
}

DigitalMap.prototype.removeStraightRail = function(straightRail) {
    // Remove tags
    // var tagRemoved = this.removeTag(straightRail.children[0].name, 'TGA');
    // tagRemoved = tagRemoved && this.removeTag(straightRail.children[0].name, 'TGB');
    //
    // if (!tagRemoved) {
    //   console.Error('Error removing tags!');
    //   return false;
    // }

    var straightRailList = this.jsonObj.straightRailList;
    for (let i = 0; i < straightRailList.length; i++) {
        var straightRailObj = straightRailList[i];
        if (straightRailObj.railSeq == straightRail.name) {
            this.jsonObj.straightRailList.splice(i, 1);
            break;
        }
    }

    if (this.getObjectByName('straightRails')) {
        this.getObjectByName('straightRails').remove(straightRail);
        return true;
    } else {
        return false;
    }

}

DigitalMap.prototype.removeCornerRail = function(cornerRail) {
    // Remove tags
    // var tagRemoved = this.removeTag(cornerRail.children[0].name, 'TGA');
    // tagRemoved = tagRemoved && this.removeTag(cornerRail.children[2].name, 'TGB');
    //
    // if (!tagRemoved) {
    //   console.Error('Error removing tags!');
    //   return false;
    // }

    // Remove points
    this.removePoint("PTB" + cornerRail.children[0].name)
    this.removePoint("PTB" + cornerRail.children[1].name)
    this.removePoint("PTC" + cornerRail.children[1].name)

    var cornerRailList = this.jsonObj.cornerRailList;
    for (let i = 0; i < cornerRailList.length; i++) {
        var cornerRailObj = cornerRailList[i];
        if (cornerRailObj.railSeq == cornerRail.name) {
            this.jsonObj.cornerRailList.splice(i, 1);
            break;
        }
    }

    if (this.getObjectByName('cornerRails')) {
        this.getObjectByName('cornerRails').remove(cornerRail);
        return true;
    } else {
        return false;
    }
}

DigitalMap.prototype.removeSwitch = function(sw) {
    // Remove tags
    // var tagRemoved = this.removeTag(sw.children[0].name, 'TGA');
    // tagRemoved = tagRemoved && this.removeTag(sw.children[1].name, 'TGB');
    // tagRemoved = tagRemoved && this.removeTag(sw.children[3].name, 'TGC');
    //
    // if (!tagRemoved) {
    //   console.error('Error removing tags!');
    //   return false;
    // }

    // Remove points
    this.removePoint("PTB" + sw.children[0].name);
    this.removePoint("PTB" + sw.children[2].name);
    this.removePoint("PTC" + sw.children[2].name);

    var switchList = this.jsonObj.switchList;
    for (let i = 0; i < switchList.length; i++) {
        var switchObj = switchList[i];
        if (switchObj.switchSeq == sw.name) {
            this.jsonObj.switchList.splice(i, 1);
            break;
        }
    }

    if (this.getObjectByName('switches')) {
        this.getObjectByName('switches').remove(sw);
        return true;
    } else {
        return false;
    }
}

DigitalMap.prototype.removeRechargeArea = function(ra) {
    // Remove points
    this.removePoint("PTB" + ra.children[0].name);
    this.removePoint("PTB" + ra.children[1].name);
    this.removePoint("PTC" + ra.children[1].name);

    var rechargeAreaList = this.jsonObj.rechargeAreaList;
    for (let i = 0; i < rechargeAreaList.length; i++) {
        var rechargeAreaObj = rechargeAreaList[i];
        if (rechargeAreaObj.rechargeAreaSeq == ra.name) {
            this.jsonObj.rechargeAreaList.splice(i, 1);
            break;
        }
    }

    if (this.getObjectByName('rechargeAreas')) {
        this.getObjectByName('rechargeAreas').remove(ra);
        return true;
    } else {
        return false;
    }
}

DigitalMap.prototype.removeShipmentArea = function(sa) {
    var shipmentAreaList = this.jsonObj.shipmentAreaList;
    for (let i = 0; i < shipmentAreaList.length; i++) {
        var shipmentAreaObj = shipmentAreaList[i];
        if (shipmentAreaObj.shipmentAreaSeq == sa.name) {
            this.jsonObj.shipmentAreaList.splice(i, 1);
            break;
        }
    }

    if (this.getObjectByName('shipmentAreas')) {
        this.getObjectByName('shipmentAreas').remove(sa);
        return true;
    } else {
        return false;
    }
}

DigitalMap.prototype.removeStationDock = function(sd) {
    var stationDockList = this.jsonObj.stationDockList;
    for (let i = 0; i < stationDockList.length; i++) {
        var stationDockObj = stationDockList[i];
        if (stationDockObj.stationDockSeq == sd.name) {
            this.jsonObj.stationDockList.splice(i, 1);
            break;
        }
    }

    if (this.getObjectByName('stationDocks')) {
        this.getObjectByName('stationDocks').remove(sd);
        return true;
    } else {
        return false;
    }
}

DigitalMap.prototype.removeCrossroad = function(cd) {
    // remove points
    this.removePoint('PTA' + cd.getTrackB().name);
    this.removePoint('PTB' + cd.getTrackB().name);
    this.removePoint('PTB' + cd.getTrackC().name);
    this.removePoint('PTC' + cd.getTrackC().name);
    this.removePoint('PTB' + cd.getTrackE().name);
    this.removePoint('PTC' + cd.getTrackE().name);

    var crossroadList = this.jsonObj.crossroadList;
    for (let i = 0; i < crossroadList.length; i++) {
        var crossroadObj = crossroadList[i];
        if (crossroadObj.crossroadSeq == cd.name) {
            this.jsonObj.crossroadList.splice(i, 1);
            break;
        }
    }

    if (this.getObjectByName('crossroads')) {
        this.getObjectByName('crossroads').remove(cd);
        return true;
    } else {
        return false;
    }
}

DigitalMap.prototype.removePushArea = function(pa) {
    // remove points
    this.removePoint('PTB' + pa.getTrackA().name);
    this.removePoint('PTB' + pa.getTrackB().name);
    this.removePoint('PTB' + pa.getTrackC().name);
    this.removePoint('PTC' + pa.getTrackC().name);
    this.removePoint('PTB' + pa.getTrackE().name);
    this.removePoint('PTC' + pa.getTrackE().name);

    var pushAreaList = this.jsonObj.pushAreaList;
    for (let i = 0; i < pushAreaList.length; i++) {
        var pushAreaObj = pushAreaList[i];
        if (pushAreaObj.pushAreaSeq == pa.name) {
            this.jsonObj.pushAreaList.splice(i, 1);
            break;
        }
    }

    if (this.getObjectByName('pushAreas')) {
        this.getObjectByName('pushAreas').remove(pa);
        return true;
    } else {
        return false;
    }
}

DigitalMap.prototype.removeStorageUnit = function(su) {
    // remove points
    this.removePoint('PTB' + su.getPickerTrack().name);
    this.removePoint('PTB' + su.getLeftStorageTrack().name);
    this.removePoint('PTB' + su.getRightStorageTrack().name);

    let storageUnitList = this.jsonObj.storageUnitList;
    for (let i = 0; i < storageUnitList.length; i++) {
        let storageUnitObj = storageUnitList[i];
        if (storageUnitObj.storageUnitSeq == su.name) {
            this.jsonObj.storageUnitList.splice(i, 1);
            break;
        }
    }

    if (this.getObjectByName('storageUnits')) {
        this.getObjectByName('storageUnits').remove(su);
        return true;
    } else {
        return false;
    }


}


DigitalMap.prototype.removeEscalator = function(es) {
    // remove points
    for (let i = 1; i <= es.numOfFloors; i++) {
        var port = es.getPortByFloorNum(i),
            channelObj = es.getChannelObjByNum(i);

        this.removePoint('PTC' + port.getTrack().name);

        var channelTrackSeq = channelObj.trackList[0].trackSeq;
        this.removePoint('PTA' + channelTrackSeq);
        this.removePoint('PTB' + channelTrackSeq);
    }

    for (let i = 1; i <= es.numOfCars; i++) {
        var car = es.getCarByNum(i),
            carTrackSeq = car.getTrack().name;

        this.removePoint('PTA' + carTrackSeq);
        this.removePoint('PTB' + carTrackSeq);
    }

    var escalatorList = this.jsonObj.escalatorList;
    for (let i = 0; i < escalatorList.length; i++) {
        var escalatorObj = escalatorList[i];
        if (escalatorObj.escalatorSeq == es.name) {
            this.jsonObj.escalatorList.splice(i, 1);
            break;
        }
    }

    var escalators = this.getObjectByName('escalators')
    if (escalators) {
        escalators.remove(es);
        return true;
    } else {
        return false;
    }
}

DigitalMap.prototype.removeTag = function(trackSeq, prefix) {
    var tagSeq = prefix + trackSeq;
    var tag = this.getObjectByName(tagSeq);

    if (!tag) {
        console.warn('Tag does not exist!');
        return false;
    }

    var tagList = this.jsonObj.tagList;
    for (let i = 0; i < tagList.length; i++) {
        var tagObj = tagList[i];
        if (tagObj.tagSeq == tagSeq) {
            this.jsonObj.tagList.splice(i, 1);
            break;
        }
    }

    if (this.getObjectByName('tags')) {
        this.getObjectByName('tags').remove(tag);
        return true;
    } else {
        return false;
    }

}

DigitalMap.prototype.removePoint = function(pointSeq) {
    var pointList = this.jsonObj.pointList;
    for (let i = 0; i < pointList.length; i++) {
        var pointObj = pointList[i];
        if (pointObj.pointSeq == pointSeq) {
            this.jsonObj.pointList.splice(i, 1);
        }
    }
}

DigitalMap.prototype.addPointToPointList = function(trackList) {
    for (let i = 0; i < trackList.length; i++) {
        var track = trackList[i];
        var pointA = track.pointA;
        var pointAObj = this.getPointObjBySeq(pointA.pointSeq);

        if (pointAObj) {
            pointA = pointAObj;
        } else {
            this.jsonObj.pointList.push(pointA);
        }

        var pointB = track.pointB;
        var pointBObj = this.getPointObjBySeq(pointB.pointSeq);

        if (pointBObj) {
            pointB = pointBObj;
        } else {
            this.jsonObj.pointList.push(pointB)
        }
    }
}

DigitalMap.prototype.getPointObjBySeq = function(pointSeq) {
    var pointList = this.jsonObj.pointList;
    for (let i = 0; i < pointList.length; i++) {
        var pointObj = pointList[i]
        if (pointObj.pointSeq == pointSeq) {
            return pointObj;
        }
    }

    return undefined;
}

DigitalMap.prototype.getPointObjByLocation = function(x, y, z, options) {
    var options = options || {},
        tolerance = options.tolerance || 10; // 1 cm tolerance

    var pointList = this.jsonObj.pointList;

    for (let i = 0; i < pointList.length; i++) {
        var pointObj = pointList[i];

        var passed = TestPointSimilarity(pointObj, x, y, z, tolerance);

        if (passed) {
            return pointObj;
        }
    }

    return undefined;
}

DigitalMap.prototype.modifyPointSeq = function(pointSeq, modifier) {
    // straight rail
    var straightRailList = this.jsonObj.straightRailList;

    for (let i = 0; i < straightRailList.length; i++) {
        var straightRailObj = straightRailList[i];
        var trackList = straightRailObj.trackList;

        for (var j in trackList) {
            var track = trackList[j];
            this.modifyTrackPointSeq(track, pointSeq, modifier);
        }
    }

    // corner rail
    var cornerRailList = this.jsonObj.cornerRailList;

    for (let i = 0; i < cornerRailList.length; i++) {
        var cornerRailObj = cornerRailList[i];
        var trackList = cornerRailObj.trackList;

        for (var j in trackList) {
            var track = trackList[j];
            this.modifyTrackPointSeq(track, pointSeq, modifier);
        }
    }

    // switch
    var switchList = this.jsonObj.switchList;

    for (let i = 0; i < switchList.length; i++) {
        var switchObj = switchList[i];
        var trackList = switchObj.trackList;

        for (var j in trackList) {
            var track = trackList[j];
            this.modifyTrackPointSeq(track, pointSeq, modifier);
        }
    }

    // recharge area
    var rechargeAreaList = this.jsonObj.rechargeAreaList;

    for (let i = 0; i < rechargeAreaList.length; i++) {
        var rechargeAreaObj = rechargeAreaList[i];
        var trackList = rechargeAreaObj.trackList;

        for (var j in trackList) {
            var track = trackList[j];
            this.modifyTrackPointSeq(track, pointSeq, modifier);
        }
    }

    // shipment area
    var shipmentAreaList = this.jsonObj.shipmentAreaList;

    for (let i = 0; i < shipmentAreaList.length; i++) {
        var shipmentAreaObj = shipmentAreaList[i];
        var trackList = shipmentAreaObj.trackList;

        for (var j in trackList) {
            var track = trackList[j];
            this.modifyTrackPointSeq(track, pointSeq, modifier);
        }
    }

    // station dock
    var stationDockList = this.jsonObj.stationDockList;

    for (let i = 0; i < stationDockList.length; i++) {
        var stationDockObj = stationDockList[i];
        var trackList = stationDockObj.trackList;

        for (var j in trackList) {
            var track = trackList[j];
            this.modifyTrackPointSeq(track, pointSeq, modifier);
        }
    }

    // push area
    var pushAreaList = this.jsonObj.pushAreaList;

    for (let i = 0; i < pushAreaList.length; i++) {
        var pushAreaObj = pushAreaList[i];
        var trackList = pushAreaObj.trackList;

        for (var j in trackList) {
            var track = trackList[j];
            this.modifyTrackPointSeq(track, pointSeq, modifier);
        }
    }
}

DigitalMap.prototype.modifyTrackPointSeq = function(track, pointSeq, modifier) {
    var shouldModify = false;
    if (track.pointA.pointSeq == pointSeq) {
        shouldModify = true;
        track.pointA.pointSeq = pointSeq + modifier;
    }
    if (track.pointB.pointSeq == pointSeq) {
        shouldModify = true;
        track.pointB.pointSeq = pointSeq + modifier;
    }

    if (shouldModify) {
        this.getObjectByName(track.trackSeq).modifyPointSeq(pointSeq, modifier);
    }
}

DigitalMap.prototype.addNode = function(node) {
    var geometries = node.getGeometries(),
        lines = node.getLines();

    this.addGeometryToNodes(geometries, lines);

    this.nodes[node.name] = node;
}

DigitalMap.prototype.addGeometryToNodes = function(geometries, lines) {
    for (let i = 0; i < geometries.length; i++) {
        lines[i].updateMatrix();
        this.nodeGeometry.merge(geometries[i], lines[i].matrix);
    }
}

DigitalMap.prototype.generateNodes = function() {
    this.add(new LineSegments(this.nodeGeometry, this.nodeMaterial));
}

DigitalMap.prototype.getDisplayedByName = function(name) {
    let displayed;
    switch (name) {
        case CONSTANTS.SWITCH_ROBOT:
            displayed = DISPLAY_CONFIGS.ShowSwitchRobot;
            break;
        case CONSTANTS.TAG:
            displayed = DISPLAY_CONFIGS.ShowTag;
            break;
        case CONSTANTS.POINT:
            displayed = DISPLAY_CONFIGS.ShowPoint;
            break;
        case CONSTANTS.STATION:
            displayed = DISPLAY_CONFIGS.ShowStation;
            break;
        case CONSTANTS.TAG_ANNOTATION:
            displayed = DISPLAY_CONFIGS.ShowTagAnnotation;
            break;
        case CONSTANTS.POINT_ANNOTATION:
            displayed = DISPLAY_CONFIGS.ShowPointAnnotation;
            break;
        case CONSTANTS.STATION_ANNOTATION:
            displayed = DISPLAY_CONFIGS.ShowStationAnnotation;
            break;
        case CONSTANTS.MOVER_ANNOTATION:
            displayed = DISPLAY_CONFIGS.ShowMoverAnnotation;
            break;
        case CONSTANTS.RACK_ANNOTATION:
            displayed = DISPLAY_CONFIGS.ShowRackAnnotation;
            break;
        case CONSTANTS.PICKER_ANNOTATION:
            displayed = DISPLAY_CONFIGS.ShowPickerAnnotation;
            break;
        case CONSTANTS.PUSHER_ANNOTATION:
            displayed = DISPLAY_CONFIGS.ShowPusherAnnotation;
            break;
        default:
            console.error(`${this.name}: invalid name (${name}).`);
    }

    return displayed;
}

DigitalMap.prototype.getObjByName = function(name) {
    let obj;
    switch (name) {
        case CONSTANTS.SWITCH_ROBOT:
            obj = this.switchRobots;
            break;
        case CONSTANTS.TAG:
            obj = this.tagsMesh;
            break;
        case CONSTANTS.POINT:
            obj = this.pointsMesh;
            break;
        case CONSTANTS.STATION:
            obj = this.stations;
            break;
        case CONSTANTS.TAG_ANNOTATION:
            obj = this.tagAnnotations;
            break;
        case CONSTANTS.POINT_ANNOTATION:
            obj = this.pointAnnotations;
            break;
        case CONSTANTS.STATION_ANNOTATION:
            obj = this.stationAnnotations;
            break;
        case CONSTANTS.MOVER_ANNOTATION:
            obj = this.movers;
            break;
        case CONSTANTS.RACK_ANNOTATION:
            obj = this.racks;
            break;
        case CONSTANTS.PICKER_ANNOTATION:
            obj = this.pickers;
            break;
        case CONSTANTS.PUSHER_ANNOTATION:
            obj = this.pushers;
            break;
        default:
            console.error(`${this.name}: invalid name (${name}).`);
    }
    return obj;
}

DigitalMap.prototype.getGeneratorByName = function(name) {
    let generator;

    switch (name) {
        case CONSTANTS.TAG:
            generator = this.generateTagsMesh;
            break;
        case CONSTANTS.POINT:
            generator = this.generatePointsMesh;
            break
        case CONSTANTS.STATION:
            generator = this.generateStationsMesh;
            break
        case CONSTANTS.TAG_ANNOTATION:
            generator = this.generateTagAnnotations;
            break;
        case CONSTANTS.POINT_ANNOTATION:
            generator = this.generatePointAnnotations;
            break
        case CONSTANTS.STATION_ANNOTATION:
            generator = this.generateStationAnnotations;
            break
        default:
            console.error(`${this.name}: invalid name (${name}).`);
    }

    return generator;
}

DigitalMap.prototype.generateTagsMesh = function() {
    if (!this.tags) this.addTags();

    for (let i = 0; i < this.tags.length; i++) {
        let tag = this.tags[i];

        tag.updateMatrix();
        this.tagsGeometry.merge(tag.geometry, tag.matrix);
    }

    this.tagsMesh = new Mesh(new BufferGeometry().fromGeometry(this.tagsGeometry), this.tagMaterial);
    this.tagsMesh.name = 'tagsMesh';

    return this.tagsMesh;
}

DigitalMap.prototype.addTags = function() {
    this.tags = [];
    for (let i in this.nodes) {
        let node = this.nodes[i];

        let tags = node.getTags();

        for (let j in tags) {
            this.tags.push(tags[j]);
        }
    }
}

DigitalMap.prototype.generatePointsMesh = function() {
    if (!this.points) this.addPoints();

    this.pointAnnotations = new Object3D();
    this.pointAnnotations.name = 'pointAnnotations';

    for (let i = 0; i < this.points.length; i++) {
        let point = this.points[i];

        let pointMark = new PointMark(point.name);
        pointMark.setPosition(point);

        pointMark.updateMatrix();
        this.pointsGeometry.merge(pointMark.geometry, pointMark.matrix);

        this.pointAnnotations.add(pointMark.annotation);
    }

    this.pointsMesh = new Mesh(new BufferGeometry().fromGeometry(this.pointsGeometry), this.pointMaterial)
    this.pointsMesh.name = 'pointsMesh';

    return this.pointsMesh;
}

DigitalMap.prototype.addPoints = function() {
    this.points = [];

    for (let i in this.nodes) {
        let node = this.nodes[i];

        let points = node.getPoints();

        for (let j in points) {
            this.points.push(points[j]);
        }
    }
}

DigitalMap.prototype.generateStationsMesh = function() {
    this.stations = new Object3D();
    this.stations.name = 'stations';

    this.stationAnnotations = new Object3D();
    this.stationAnnotations.name = 'stationAnnotations';

    for (let i in this.nodes) {
        let node = this.nodes[i];

        if (CONSTANTS.STATION_DOCK == node.type) {
            node.addStation();

            this.stations.add(node.station);
            this.stationAnnotations.add(node.stationAnnotation);
        }
    }

    return this.stations;
}

DigitalMap.prototype.generateTagAnnotations = function() {
    if (!this.tags) this.addTags();

    this.tagAnnotations = new Object3D();
    this.tagAnnotations.name = 'tagAnnotations';

    for (let i = 0; i < this.tags.length; i++) {
        let tag = this.tags[i];

        this.tagAnnotations.add(tag.annotation);
        // this.add(tag.annotation);
    }

    return this.tagAnnotations;
}

DigitalMap.prototype.generatePointAnnotations = function() {
    if (!this.pointAnnotations) this.generatePointsMesh();

    return this.pointAnnotations;
}

DigitalMap.prototype.generateStationAnnotations = function() {
    if (!this.stationAnnotations) this.generateStationsMesh();

    return this.stationAnnotations;
}

DigitalMap.prototype.getNodeByName = function(name) {
    let node = this.nodes[name] || this.escalators.getObjectByName(name);

    return node;
}

DigitalMap.prototype.getCarrierByType = function(carrierSeq, carrierType) {
    let carrier;
    switch (carrierType) {
        case CONSTANTS.MOVER:
            carrier = this.movers.getObjectByName(carrierSeq);
            break;
        case CONSTANTS.PICKER:
            carrier = this.pickers.getObjectByName(carrierSeq);
            break;
        case CONSTANTS.PUSHER:
            carrier = this.pushers.getObjectByName(carrierSeq);
            break;
        default:
            console.warn(`DigitalMap: invalid carrier type: ${carrierType}.`);
    }

    return carrier;
}

DigitalMap.prototype.printMap = function() {
    console.log(this);
    console.log(this.jsonObj.pointList);
};

export default DigitalMap;
