/**
 * @author wjq / http://wangjiaqi.xyz
 */

 Path = function (rails, reversed) {
 	Object.call(this);

 	this.type = 'Path';

 	this.numOfRails = rails.length;
 	this.rails = [];
  this.reversed = [];

 	for (var i in rails) {
 		this.rails[i] = rails[i];
    this.reversed[i] = reversed[i];
 	}

 };

Path.prototype = Object.create(Object.prototype);
Path.prototype.constructor = Path;
