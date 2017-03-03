import { BoxGeometry, SphereGeometry, LineBasicMaterial, MeshPhongMaterial, Matrix4, MeshFaceMaterial, MeshBasicMaterial, Mesh } from 'three'

export const VERSION = 1;

export const BUILD_TIME = "BUILD_TIME_TO_BE_REPLACED";

export const LOG_ENABLED = false; // log level = debug
export const INFO_ENABLED = true; // log level = info

export const FPS = 60;
export const PLAY_SPEED = 1;

// GRID
export const GridMaterial = new LineBasicMaterial({
  // color: 0xffffff,
  color: 0x78909C,
  opacity: 0.2,
  transparent: true
});

// RENDERER
// export const RendererClearColor = 0x263238;
export const RendererClearColor = 0xECEFF1;

// TRACK
export const BaseTrackMaterial = new LineBasicMaterial({
  // color: 0xffffff,
  color: 0x455A64,
  opacity: 0.8,
  transparent: true
});

export const RenderTrackMaterial = new LineBasicMaterial({
  color: 0xF44336,
  linewidth: 10,
  opacity: 0.99,
  transparent: true
});

export const CurveGeometryResolution = 32;

// BASEBOX
export const BaseBoxMaterial = new MeshPhongMaterial({
    color: 0x666666
});
export const BaseBoxAnnotationOption = {fontsize: 32, scaleX: 500, scaleY: 250, offsetZ: 250}

// MOVER
export const MoverLength = 500;
export const MoverWidth = 200;
export const MoverHeight = 200;
export var MoverGeometry = new BoxGeometry(MoverLength, MoverWidth, MoverHeight);
export const MoverMaterial = new MeshPhongMaterial({
    color: 0x303F9F
});;
// set pivot point
export const MoverTranslationZ = -MoverHeight / 2;
MoverGeometry.applyMatrix(new Matrix4().makeTranslation(0, 0, MoverTranslationZ));

// RACK
export const RackLength = 500;
export const RackWidth = 1000;
export const RackHeight = 1800;
export var RackGeometry = new BoxGeometry(RackLength, RackWidth, RackHeight);
export const RackMaterial = new MeshPhongMaterial({
    color: 0xBDBDBD
});
let materials = [
  new MeshBasicMaterial({transparent: true, opacity: 0}),
  RackMaterial
]
export const StorageRackMaterial = new MeshFaceMaterial(materials);

export const RackGap = 10;

// set pivot point
export const RackTranslationZ = -RackHeight / 2 - 200;
RackGeometry.applyMatrix(new Matrix4().makeTranslation(0, 0, RackTranslationZ));

// PUSHER
export const PusherLength = 100;
export const PusherWidth = 500;
export const PusherHeight = 100;
export var PusherGeometry = new BoxGeometry(PusherLength, PusherWidth, PusherHeight);
export const PusherMaterial = new MeshPhongMaterial({
    color: 0xF44336
});
// set pivot point
export const PusherTranslationZ = -PusherHeight / 2;
PusherGeometry.applyMatrix(new Matrix4().makeTranslation(0, 0, PusherTranslationZ));

// PICKER
export const PickerLength = 200;
export const PickerWidth = 1000;
export const PickerHeight = 200;
export const PickerGeometry = new BoxGeometry(PickerLength, PickerWidth, PickerHeight);
export const PickerMaterial = new MeshPhongMaterial({
    color: 0x444444
});

// TAG
export const TagGeometry = new SphereGeometry(30, 8, 8);
export const TagMaterial = new MeshBasicMaterial({
    color: 0x2FA1D6
});
export const TagAnnotationOption = {fontsize: 24, scaleX: 500, scaleY: 250, offsetZ: 150}

// POINT
export const PointGeometry = new SphereGeometry(20, 8, 8);
export const PointMaterial = new MeshBasicMaterial({
    color: 0xF44336
});

export const PointAnnotationOption = {fontsize: 24, scaleX: 500, scaleY: 250, offsetZ: -150};

// STATION
export const StationLength = 1000;
export const StationWidth = 1000;
export const StationHeight = 1000;
export const StationGeometry = new BoxGeometry(StationLength, StationWidth, StationHeight);
export const StationMaterial = new MeshBasicMaterial(0xffffff);
export const StationMesh = new Mesh(StationGeometry, StationMaterial);
export const StationDirection = Math.PI / 2;
export const StationBoxColor = 0xffc107;

// PICKER
export const PickerStandbyDistance = 1250;
export const PickerDropoffDistances = [750];
export const PickingSpeed = 500;
export const PickingDelay = 1000;

// PUSHER
export const PusherStartDistance = 1200;
export const PusherEndDistance = VERSION == 0 ? 2500 : 3000;
