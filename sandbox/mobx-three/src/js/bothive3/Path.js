/**
 * @author wjq / http://wangjiaqi.xyz
 */

 Path = function (pathways, reversed) {
 	Object.call(this);

 	this.type = 'Path';

 	this.numOfPathways = pathways.length;
 	this.pathways = [];
  this.reversed = [];
  this.startNode;
  this.goalNode;

 	for (var i in pathways) {
 		this.pathways[i] = pathways[i];
    this.reversed[i] = reversed[i];
 	}

 };

Path.prototype = Object.create(Object.prototype);
Path.prototype.constructor = Path;
