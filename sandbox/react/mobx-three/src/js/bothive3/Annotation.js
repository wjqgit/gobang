import { Sprite, Texture, LinearFilter } from 'three'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function Annotation(message, options) {
  Sprite.call(this);

  this.message = message;

  this.options = options || {};

  this.canvas = null;
  this.width;
  this.height;
  this.datumX;
  this.datumY;

  this.scaleX = this.options.scaleX || 1000;
  this.scaleY = this.options.scaleY || 500;

  this.offsetZ = this.options.offsetZ || 500;

  this.fontface = "monospace";
  // this.fontface = "Arial";
  this.fontsize = this.options.fontsize || 64;
  this.borderThickness = 4;
  // border color
  this.bdrColor = {
    r: 255,
    g: 255,
    b: 255,
    a: 0.4
  };
  // background color
  this.bgdColor = {
    r: 255,
    g: 255,
    b: 255,
    a: 0.4
  };
  this.textColor = {
    r: 0,
    g: 0,
    b: 0,
    a: 0.6
  }

  this.generateCanvasElement();

  this.material = new SpriteMaterial({
    map: this.generateTexture()
  });
  this.scale.set(this.scaleX, this.scaleY, 0);
  this.up.set(0, 0, 1);
  this.position.z = this.offsetZ;

}

Annotation.prototype = Object.create(Sprite.prototype);
Annotation.prototype.constructor = Annotation;

Annotation.prototype.generateTexture = function() {
  // use canvas contents as texture
  var texture = new Texture(this.canvas);
  texture.needsUpdate = true;
  texture.minFilter = LinearFilter;

  return texture;
}

Annotation.prototype.generateCanvasElement = function() {
  this.canvas = document.createElement('canvas');
  var context = this.canvas.getContext('2d');

  context.font = this.fontsize + "px " + this.fontface;

  // get size data (height depends only on font size)
  var metrics = context.measureText(this.message),
    textWidth = metrics.width;

  this.width = textWidth + this.borderThickness;
  this.height = this.fontsize * 1.4 + this.borderThickness;

  this.datumX = (this.canvas.width - this.width) / 2;
  this.datumY = (this.canvas.height - this.height) / 2;

  // context.canvas.width = width;
  // context.canvas.height = height;

  // background color
  context.fillStyle = "rgba(" + this.bgdColor.r + "," + this.bgdColor.g + "," + this.bgdColor.b + "," + this.bgdColor.a + ")";

  // border color
  context.strokeStyle = "rgba(" + this.bdrColor.r + "," + this.bdrColor.g + "," + this.bdrColor.b + "," + this.bdrColor.a + ")";

  context.lineWidth = this.borderThickness;
  // this.drawRectangle(context, this.borderThickness / 2, this.borderThickness / 2, this.width, this.height);
  this.drawRectangle(context, this.datumX, this.datumY, this.width, this.height);
  // this.drawRectangle(context, this.borderThickness / 2, this.borderThickness / 2, this.canvas.width, this.canvas.height)

  context.fillStyle = "rgba(" + this.textColor.r + "," + this.textColor.g + "," + this.textColor.b + "," + this.textColor.a + ")";

  context.fillText(this.message, this.datumX + this.borderThickness, this.datumY + this.fontsize);
  // context.fillText(this.message, this.canvas.width / 2 - textWidth / 2, this.canvas.height / 2 + this.fontsize / 4);
  // context.fillText(this.message, 0, this.canvas.height / 4);

  // console.log(this.canvas.width + " " + this.canvas.height);
}

Annotation.prototype.drawRectangle = function(context, x, y, width, height) {
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x + width, y);
  context.lineTo(x + width, y + height);
  context.lineTo(x, y + height);
  context.lineTo(x, y);
  context.closePath();
  context.fill();
  // context.stroke();
}

Annotation.prototype.setPosition = function(position) {
  this.position.x = position.x + (this.canvas.width - this.width) / 2;
  this.position.y = position.y - (this.canvas.height - this.height) / 2;
  this.position.z = position.z;
}

export default Annotation;
