/**
 * @author wjq / http://wangjiaqi.xyz
 */

 Path = function (rails) {
 	Object.call(this);

 	this.type = 'Path';

 	this.numOfRails = rails.length;
 	this.rails = [];
 	
 	for (var i in rails) {
 		this.rails[i] = rails[i];	
 	}

 };

Path.prototype = Object.create(Object.prototype);
Path.prototype.constructor = Path;