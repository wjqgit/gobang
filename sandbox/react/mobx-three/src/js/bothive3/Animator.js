import { Geometry, Vector3, LineSegments, AmbientLight, DirectionalLight, WebGLRenderer, Scene, PerspectiveCamera } from 'three'
import { OrbitControls } from '../../vendor/OrbitControls.js';
import Stats from 'stats.js';

import { GridMaterial, RendererClearColor, INFO_ENABLED } from './Configurations'

/**
 * @author wjq / http://wangjiaqi.xyz
 */

function Animator(floorWidth, floorDepth) {
  Object.call(this);

  // if (KOVAN.INFO_ENABLED) console.info(`Build time: ${KOVAN.BUILD_TIME}`);

  // WAREHOUSE PARAMS
  this.floorWidth = floorWidth || 10;
  this.floorDepth = floorDepth || 10;

  // GRAPHICS PARAMS
  this.margin = 0;

  this.renderer;
  this.scene;
  this.camera;
  this.control;
  this.stats;

  this.fps = 0;
  this.startTime = Date.now();
  this.prevTime = this.startTime;
  this.lastTime = this.startTime;
  this.deltaTime = 0;
  this.frames = 0;

  this.angle = 0;
}

Animator.prototype = Object.create(Object.prototype);
Animator.prototype.constructor = Animator;

Animator.prototype.initialize = function(options) {
  var options = options || {};
  // GRAPHICS PARAMS
  // var screenWidth = window.innerWidth,
  //   screenHeight = window.innerHeight - 2 * this.margin;

  // GRAPHICS COMPONENTS
  var container, info;

  var ambientLight, directionalLight;

  var gridGeometry, gridMaterial, grid;

  // CONTAINER
  container = document.createElement('div');
  container.className = "container";
  document.body.appendChild(container);

  var viewportWidth = container.offsetWidth,
    viewportHeight = container.offsetHeight;

  // INFO
  info = document.createElement('div');
  info.style.position = 'absolute';
  info.style.top = '1em';
  info.style.width = '100%';
  info.style.textAlign = 'center';
  info.innerHTML = 'BotHive System';

  container.appendChild(info);

  // GRID
  var step = options.gridSize || 1000; // 1 meter per grid
  // var step = 1000; // 1 meter per grid
  gridGeometry = new Geometry();
  for (let i = 0; i <= this.floorWidth; i += step) {
    gridGeometry.vertices.push(new Vector3(i, 0, 0));
    gridGeometry.vertices.push(new Vector3(i, this.floorDepth, 0));
  }
  for (var j = 0; j <= this.floorDepth; j += step) {
    gridGeometry.vertices.push(new Vector3(0, j, 0));
    gridGeometry.vertices.push(new Vector3(this.floorWidth, j, 0));
  }
  gridMaterial = GridMaterial;

  grid = new LineSegments(gridGeometry, gridMaterial);

  // LIGHT
  ambientLight = new AmbientLight(0x606060);
  ambientLight.castShadow = false;

  directionalLight = new DirectionalLight(0xffffff, 2);
  directionalLight.position.set(-1, 1, 1);
  directionalLight.castShadow = false;

  // RENDERER
  this.renderer = new WebGLRenderer({
    antialias: true
  });

  this.renderer.shadowMap.enabled = false;

  // SCENE
  this.scene = new Scene();

  // CAMERA
  // this.camera = new PerspectiveCamera(75, viewportWidth / viewportHeight, 1, 200000)；
  this.camera = new PerspectiveCamera(75, viewportWidth / viewportHeight, 1, this.floorWidth * 10);
  // this.camera.position.set(this.floorWidth / 2, -this.floorWidth / 2, this.floorDepth / 2);
  this.camera.position.set(this.floorWidth / 2, this.floorDepth / 2, this.floorDepth / 2);
  this.camera.lookAt(new Vector3(this.floorWidth / 2, this.floorDepth / 2, 0));

  // CONTROL
  this.control = new OrbitControls(this.camera, this.renderer.domElement);
  this.control.target.set(this.floorWidth / 2, this.floorDepth / 2, 0);

  // ADD MESH TO SCENE
  this.scene.add(grid);
  this.scene.add(ambientLight);
  this.scene.add(directionalLight);

  // RENDERER SETUP
  // this.renderer.setClearColor(0x000000);
  this.renderer.setClearColor(RendererClearColor);
  this.renderer.setPixelRatio(window.devicePixelRatio);
  this.renderer.setSize(viewportWidth, viewportHeight);

  container.appendChild(this.renderer.domElement);

  // STATS
  this.stats = new Stats();
  this.stats.domElement.style.position = 'absolute';
  this.stats.domElement.style.top = '1em';
  this.stats.domElement.style.right = '1em';
  this.stats.domElement.style.zIndex = 100;
  container.appendChild(this.stats.domElement);

  if (INFO_ENABLED) console.info("Animator Initialized!");
};

Animator.prototype.onWindowResize = function() {
  // var screenWidth = window.innerWidth,
  //   screenHeight = window.innerHeight;
  var container = document.getElementsByClassName('container')[0];

  var viewportWidth = container.offsetWidth,
    viewportHeight = container.offsetHeight;

  this.camera.aspect = viewportWidth / viewportHeight;
  this.camera.updateProjectionMatrix();

  this.renderer.setSize(viewportWidth, viewportHeight);
};

Animator.prototype.resetView = function() {
  this.camera.position.set(this.floorWidth / 2, this.floorDepth / 2, this.floorDepth / 2);
  this.camera.up.set(0, 1, 0);
}

Animator.prototype.rotateLeft = function() {
  this.angle = (this.angle - Math.PI / 2) % (2 * Math.PI);
  this.camera.up.set(Math.sin(this.angle), Math.sin(this.angle + Math.PI / 2), 0);
}

Animator.prototype.rotateRight = function() {
  this.angle = (this.angle + Math.PI / 2) % (2 * Math.PI);
  this.camera.up.set(Math.sin(this.angle), Math.sin(this.angle + Math.PI / 2), 0);
}


Animator.prototype.render = function() {
  this.control.update();
  this.stats.update();
  this.renderer.render(this.scene, this.camera);
};

Animator.prototype.updateFPS = function() {
  var time = Date.now();
  this.frames++;

  this.deltaTime = time - this.lastTime;
  this.lastTime = time;

  // console.log(this.deltaTime);

  if (time > this.prevTime + 200) {
    this.fps = this.roundTo(((this.frames * 1000) / (time - this.prevTime)), 3);

    this.prevTime = time;
    this.frames = 0;
  }
  return time;
};

Animator.prototype.roundTo = function(x, d) {
  return +(Math.round(x + "e+" + d) + "e-" + d); // append "e+3" equals to multiply the number by 1000, and +() convert a string back to number.
};

Animator.prototype.add = function(mesh) {
  this.scene.add(mesh);
}

Animator.prototype.getObjectByName = function(name) {
  return this.scene.getObjectByName(name);
}

Animator.prototype.remove = function(obj) {
  return this.scene.remove(obj);
}

export default Animator
