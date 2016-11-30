(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
   typeof define === 'function' && define.amd ? define(['exports'], factory) :
   (factory((global.KOVAN = global.KOVAN || {})));
}(this, (function (exports) { 'use strict';

	const SECOND = 1000;

	const LEFT = 'LEFT';
	const RIGHT = 'RIGHT';

	const FACES_PER_BOX = 12;

	// NOUN
	const TRACK = "TRACK";
	const STRAIGHT_TRACK = "STRAIGHT_TRACK";
	const CURVED_TRACK = "CURVED_TRACK";

	const STRAIGHT_RAIL = "STRAIGHT_RAIL";
	const CORNER_RAIL = "CORNER_RAIL";
	const SWITCH = "SWITCH";
	const SWITCH_ROBOT = "SWITCH_ROBOT";
	const RECHARGE_AREA = "RECHARGE_AREA";
	const STATION_DOCK = "STATION_DOCK";
	const SHIPMENT_AREA = "SHIPMENT_AREA";
	const CROSSROAD = "CROSSROAD";
	const PUSH_AREA = "PUSH_AREA";

	const STORAGE_UNIT = "STORAGE_UNIT";

	const ESCALATOR = "ESCALATOR";
	const ESCALATOR_CAR = "ESCALATOR_CAR";
	const ESCALATOR_PORT = "ESCALATOR_PORT";
	const ESCALATOR_CHANNEL = "ESCALATOR_CHANNEL";

	const MOVER = "MOVER";
	const RACK = "RACK";
	const PICKER = "PICKER";
	const PUSHER = "PUSHER";

	const TAG = 'TAG';
	const POINT = 'POINT';
	const STATION = 'STATION';

	const TAG_ANNOTATION = 'TAG_ANNOTATION';
	const POINT_ANNOTATION = 'POINT_ANNOTATION';
	const STATION_ANNOTATION = 'STATION_ANNOTATION';
	const MOVER_ANNOTATION = 'MOVER_ANNOTATION';
	const RACK_ANNOTATION = 'RACK_ANNOTATION';
	const PICKER_ANNOTATION = 'PICKER_ANNOTATION';
	const PUSHER_ANNOTATION = 'PUSHER_ANNOTATION';

	const VERSION = 1;

	const BUILD_TIME = "Mon Nov 28 2016 11:35:28 GMT+0800 (China Standard Time)";

	const LOG_ENABLED = false; // log level = debug
	const INFO_ENABLED = true; // log level = info

	const FPS = 60;
	const PLAY_SPEED = 1;

	const ShowSwitchRobot = false;
	const ShowTag = false;
	const ShowPoint = false;
	const ShowStation = false;

	const ShowTagAnnotation = false;
	const ShowPointAnnotation = false;
	const ShowStationAnnotation = false;
	const ShowMoverAnnotation = false;
	const ShowRackAnnotation = false;
	const ShowPickerAnnotation = false;
	const ShowPusherAnnotation = false;

	const ShowTrackAnnotation = false;

	// GRID
	const GridMaterial = new THREE.LineBasicMaterial({
	  // color: 0xffffff,
	  color: 0x78909C,
	  opacity: 0.2,
	  transparent: true
	});

	// RENDERER
	// export const RendererClearColor = 0x263238;
	const RendererClearColor = 0xECEFF1;

	// TRACK
	const BaseTrackMaterial = new THREE.LineBasicMaterial({
	  // color: 0xffffff,
	  color: 0x455A64,
	  opacity: 0.8,
	  transparent: true
	});

	const RenderTrackMaterial = new THREE.LineBasicMaterial({
	  color: 0xF44336,
	  linewidth: 10,
	  opacity: 0.99,
	  transparent: true
	});

	const CurveGeometryResolution = 32;

	// BASEBOX
	const BaseBoxMaterial = new THREE.MeshPhongMaterial({
	    color: 0x666666
	});
	const BaseBoxAnnotationOption = {fontsize: 32, scaleX: 500, scaleY: 250, offsetZ: 250};

	// MOVER
	const MoverLength = 500;
	const MoverWidth = 200;
	const MoverHeight = 200;
	var MoverGeometry = new THREE.BoxGeometry(MoverLength, MoverWidth, MoverHeight);
	const MoverMaterial = new THREE.MeshPhongMaterial({
	    color: 0x303F9F
	});
	// set pivot point
	const MoverTranslationZ = -MoverHeight / 2;
	MoverGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, MoverTranslationZ));

	// RACK
	const RackLength = 500;
	const RackWidth = 1000;
	const RackHeight = 1800;
	var RackGeometry = new THREE.BoxGeometry(RackLength, RackWidth, RackHeight);
	const RackMaterial = new THREE.MeshPhongMaterial({
	    color: 0xBDBDBD
	});
	let materials = [
	  new THREE.MeshBasicMaterial({transparent: true, opacity: 0}),
	  RackMaterial
	];
	const StorageRackMaterial = new THREE.MeshFaceMaterial(materials);

	const RackGap = 10;

	// set pivot point
	const RackTranslationZ = -RackHeight / 2 - 200;
	RackGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, RackTranslationZ));

	// PUSHER
	const PusherLength = 100;
	const PusherWidth = 500;
	const PusherHeight = 100;
	var PusherGeometry = new THREE.BoxGeometry(PusherLength, PusherWidth, PusherHeight);
	const PusherMaterial = new THREE.MeshPhongMaterial({
	    color: 0xF44336
	});
	// set pivot point
	const PusherTranslationZ = -PusherHeight / 2;
	PusherGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, PusherTranslationZ));

	// PICKER
	const PickerLength = 200;
	const PickerWidth = 1000;
	const PickerHeight = 200;
	const PickerGeometry = new THREE.BoxGeometry(PickerLength, PickerWidth, PickerHeight);
	const PickerMaterial = new THREE.MeshPhongMaterial({
	    color: 0x444444
	});

	// TAG
	const TagGeometry = new THREE.SphereGeometry(30, 8, 8);
	const TagMaterial = new THREE.MeshBasicMaterial({
	    color: 0x2FA1D6
	});
	const TagAnnotationOption = {fontsize: 24, scaleX: 500, scaleY: 250, offsetZ: 150};

	// POINT
	const PointGeometry = new THREE.SphereGeometry(20, 8, 8);
	const PointMaterial = new THREE.MeshBasicMaterial({
	    color: 0xF44336
	});

	const PointAnnotationOption = {fontsize: 24, scaleX: 500, scaleY: 250, offsetZ: -150};

	// STATION
	const StationLength = 1000;
	const StationWidth = 1000;
	const StationHeight = 1000;
	const StationGeometry = new THREE.BoxGeometry(StationLength, StationWidth, StationHeight);
	const StationMaterial = new THREE.MeshBasicMaterial(0xffffff);
	const StationMesh = new THREE.Mesh(StationGeometry, StationMaterial);
	const StationDirection = Math.PI / 2;
	const StationBoxColor = 0xffc107;

	// PICKER
	const PickerStandbyDistance = 1250;
	const PickerDropoffDistances = [750];
	const PickingSpeed = 500;
	const PickingDelay = 1000;

	// PUSHER
	const PusherStartDistance = 1200;
	const PusherEndDistance = VERSION == 0 ? 2500 : 3000;

	// CURVE
	var LineCurvePathMap = {};
	var EllipseCurvePathMap = {};

	function GetLineCurvePath(vector) {
	    var key = vector.x + ';' + vector.y;

	    var lineCurvePath = KOVAN.LineCurvePathMap[key];

	    if (!lineCurvePath) {
	        lineCurvePath = new THREE.CurvePath();

	        lineCurvePath.add(new THREE.LineCurve(
	            new THREE.Vector2(0, 0),
	            new THREE.Vector2(vector.x, vector.y)
	        ));

	        KOVAN.LineCurvePathMap[key] = lineCurvePath;
	    }

	    return lineCurvePath;
	}

	function GetEllipseCurvePath(xRadius, yRadius, aStartAngle, aEndAngle, aClockwise) {
	    var key = xRadius + ';' + yRadius + ';' + aStartAngle + ';' + aEndAngle + ';' + aClockwise;

	    var ellipseCurvePath = KOVAN.EllipseCurvePathMap[key];

	    if (!ellipseCurvePath) {
	        ellipseCurvePath = new THREE.CurvePath();

	        ellipseCurvePath.add(new THREE.EllipseCurve(
	            0, 0,
	            xRadius, yRadius,
	            aStartAngle, aEndAngle,
	            aClockwise, 0
	        ));

	        KOVAN.EllipseCurvePathMap[key] = ellipseCurvePath;
	    }

	    return ellipseCurvePath;
	}

	// GEOMETRY
	var LineCurveGeometryMap = {};
	var EllipseCurveGeometryMap = {};

	function GetLineCurveGeometry(vector, resolution) {
	    var key = vector.x + ';' + vector.y + ';' + resolution;

	    var lineCurveGeometry = KOVAN.LineCurveGeometryMap[key];

	    if (!lineCurveGeometry) {
	        var lineCurvePath = LineCurvePathMap[vector.x + ';' + vector.y];

	        lineCurveGeometry = lineCurvePath.createPointsGeometry(resolution);

	        KOVAN.LineCurveGeometryMap[key] = lineCurveGeometry;
	    }

	    return lineCurveGeometry;
	}

	function GetEllipseCurveGeometry(xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, resolution) {
	    var key = xRadius + ';' + yRadius + ';' + aStartAngle + ';' + aEndAngle + ';' + aClockwise + ';' + resolution;

	    var ellipseCurveGeometry = KOVAN.EllipseCurveGeometryMap[key];

	    if (!ellipseCurveGeometry) {
	        var ellipseCurvePath = EllipseCurvePathMap[xRadius + ';' + yRadius + ';' + aStartAngle + ';' + aEndAngle + ';' + aClockwise];

	        ellipseCurveGeometry = ellipseCurvePath.createPointsGeometry(resolution);

	        KOVAN.EllipseCurveGeometryMap[key] = ellipseCurveGeometry;
	    }

	    return ellipseCurveGeometry;
	}

	function FillVertices(geometry) {
	    let numOfVertices = geometry.vertices.length;

	    if (numOfVertices > 2 * KOVAN.CurveGeometryResolution + 1) return geometry;

	    for (let i = 0; i < numOfVertices; i++) {
	        let currentIndex = 2 * i;
	        geometry.vertices.splice(currentIndex, 0, geometry.vertices[currentIndex]);
	    }

	    geometry.vertices.splice(geometry.vertices.length - 1, 1);
	    geometry.vertices.splice(0, 1);

	    return geometry;
	}

	// UTIL
	function RoundTo(x, d) {
	    return +(Math.round(x + "e+" + d) + "e-" + d); // append "e+3" equals to multiply the number by 1000, and +() convert a string back to number.
	}

	function ParseNumber(s) {
	    return parseInt(s.match(/\d+/g));
	}

	function Pad(n, width, z) {
	    z = z || '0';
	    n = n + '';
	    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}

	function TestNumberSimilarity(a, b, tolerance) {
	    var tolerance = tolerance || 0;
	    if ((a <= (b + tolerance)) && (a >= (b - tolerance))) {
	        return true;
	    }
	    return false;
	}


	function TestPointSimilarity(pointObj, x, y, z, tolerance) {
	    if (TestNumberSimilarity(x, pointObj.x, tolerance) && TestNumberSimilarity(y, pointObj.y, tolerance) && TestNumberSimilarity(z, pointObj.z, tolerance)) {
	        return true;
	    }
	}

	function RectifyAngle(angle) {
	    angle = angle >= 2 * Math.PI ? angle - 2 * Math.PI : angle;
	    angle = angle < 0 ? angle + 2 * Math.PI : angle;

	    return angle;
	}

	/**
	 * @author qiao / https://github.com/qiao
	 * @author mrdoob / http://mrdoob.com
	 * @author alteredq / http://alteredqualia.com/
	 * @author WestLangley / http://github.com/WestLangley
	 * @author erich666 / http://erichaines.com
	 */

	// This set of controls performs orbiting, dollying (zooming), and panning.
	// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
	//
	//    Orbit - left mouse / touch: one finger move
	//    Zoom - middle mouse, or mousewheel / touch: two finger spread or squish
	//    Pan - right mouse, or arrow keys / touch: three finter swipe

	THREE.OrbitControls = function ( object, domElement ) {

		this.object = object;

		this.domElement = ( domElement !== undefined ) ? domElement : document;

		// Set to false to disable this control
		this.enabled = true;

		// "target" sets the location of focus, where the object orbits around
		this.target = new THREE.Vector3();

		// How far you can dolly in and out ( PerspectiveCamera only )
		this.minDistance = 0;
		this.maxDistance = Infinity;

		// How far you can zoom in and out ( OrthographicCamera only )
		this.minZoom = 0;
		this.maxZoom = Infinity;

		// How far you can orbit vertically, upper and lower limits.
		// Range is 0 to Math.PI radians.
		this.minPolarAngle = 0; // radians
		this.maxPolarAngle = Math.PI; // radians

		// How far you can orbit horizontally, upper and lower limits.
		// If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
		this.minAzimuthAngle = - Infinity; // radians
		this.maxAzimuthAngle = Infinity; // radians

		// Set to true to enable damping (inertia)
		// If damping is enabled, you must call controls.update() in your animation loop
		this.enableDamping = false;
		this.dampingFactor = 0.25;

		// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
		// Set to false to disable zooming
		this.enableZoom = true;
		this.zoomSpeed = 1.0;

		// Set to false to disable rotating
		this.enableRotate = true;
		this.rotateSpeed = 1.0;

		// Set to false to disable panning
		this.enablePan = true;
		this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

		// Set to true to automatically rotate around the target
		// If auto-rotate is enabled, you must call controls.update() in your animation loop
		this.autoRotate = false;
		this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

		// Set to false to disable use of the keys
		this.enableKeys = true;

		// The four arrow keys
		this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

		// Mouse buttons
		this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };

		// for reset
		this.target0 = this.target.clone();
		this.position0 = this.object.position.clone();
		this.zoom0 = this.object.zoom;

		//
		// public methods
		//

		this.getPolarAngle = function () {

			return spherical.phi;

		};

		this.getAzimuthalAngle = function () {

			return spherical.theta;

		};

		this.reset = function () {

			scope.target.copy( scope.target0 );
			scope.object.position.copy( scope.position0 );
			scope.object.zoom = scope.zoom0;

			scope.object.updateProjectionMatrix();
			scope.dispatchEvent( changeEvent );

			scope.update();

			state = STATE.NONE;

		};

		// this method is exposed, but perhaps it would be better if we can make it private...
		this.update = function() {

			var offset = new THREE.Vector3();

			// so camera.up is the orbit axis
			var quat = new THREE.Quaternion().setFromUnitVectors( object.up, new THREE.Vector3( 0, 1, 0 ) );
			var quatInverse = quat.clone().inverse();

			var lastPosition = new THREE.Vector3();
			var lastQuaternion = new THREE.Quaternion();

			return function update () {

				var position = scope.object.position;

				offset.copy( position ).sub( scope.target );

				// rotate offset to "y-axis-is-up" space
				offset.applyQuaternion( quat );

				// angle from z-axis around y-axis
				spherical.setFromVector3( offset );

				if ( scope.autoRotate && state === STATE.NONE ) {

					rotateLeft( getAutoRotationAngle() );

				}

				spherical.theta += sphericalDelta.theta;
				spherical.phi += sphericalDelta.phi;

				// restrict theta to be between desired limits
				spherical.theta = Math.max( scope.minAzimuthAngle, Math.min( scope.maxAzimuthAngle, spherical.theta ) );

				// restrict phi to be between desired limits
				spherical.phi = Math.max( scope.minPolarAngle, Math.min( scope.maxPolarAngle, spherical.phi ) );

				spherical.makeSafe();


				spherical.radius *= scale;

				// restrict radius to be between desired limits
				spherical.radius = Math.max( scope.minDistance, Math.min( scope.maxDistance, spherical.radius ) );

				// move target to panned location
				scope.target.add( panOffset );

				offset.setFromSpherical( spherical );

				// rotate offset back to "camera-up-vector-is-up" space
				offset.applyQuaternion( quatInverse );

				position.copy( scope.target ).add( offset );

				scope.object.lookAt( scope.target );

				if ( scope.enableDamping === true ) {

					sphericalDelta.theta *= ( 1 - scope.dampingFactor );
					sphericalDelta.phi *= ( 1 - scope.dampingFactor );

				} else {

					sphericalDelta.set( 0, 0, 0 );

				}

				scale = 1;
				panOffset.set( 0, 0, 0 );

				// update condition is:
				// min(camera displacement, camera rotation in radians)^2 > EPS
				// using small-angle approximation cos(x/2) = 1 - x^2 / 8

				if ( zoomChanged ||
					lastPosition.distanceToSquared( scope.object.position ) > EPS ||
					8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS ) {

					scope.dispatchEvent( changeEvent );

					lastPosition.copy( scope.object.position );
					lastQuaternion.copy( scope.object.quaternion );
					zoomChanged = false;

					return true;

				}

				return false;

			};

		}();

		this.dispose = function() {

			scope.domElement.removeEventListener( 'contextmenu', onContextMenu, false );
			scope.domElement.removeEventListener( 'mousedown', onMouseDown, false );
			scope.domElement.removeEventListener( 'wheel', onMouseWheel, false );

			scope.domElement.removeEventListener( 'touchstart', onTouchStart, false );
			scope.domElement.removeEventListener( 'touchend', onTouchEnd, false );
			scope.domElement.removeEventListener( 'touchmove', onTouchMove, false );

			document.removeEventListener( 'mousemove', onMouseMove, false );
			document.removeEventListener( 'mouseup', onMouseUp, false );

			window.removeEventListener( 'keydown', onKeyDown, false );

			//scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?

		};

		//
		// internals
		//

		var scope = this;

		var changeEvent = { type: 'change' };
		var startEvent = { type: 'start' };
		var endEvent = { type: 'end' };

		var STATE = { NONE : - 1, ROTATE : 0, DOLLY : 1, PAN : 2, TOUCH_ROTATE : 3, TOUCH_DOLLY : 4, TOUCH_PAN : 5 };

		var state = STATE.NONE;

		var EPS = 0.000001;

		// current position in spherical coordinates
		var spherical = new THREE.Spherical();
		var sphericalDelta = new THREE.Spherical();

		var scale = 1;
		var panOffset = new THREE.Vector3();
		var zoomChanged = false;

		var rotateStart = new THREE.Vector2();
		var rotateEnd = new THREE.Vector2();
		var rotateDelta = new THREE.Vector2();

		var panStart = new THREE.Vector2();
		var panEnd = new THREE.Vector2();
		var panDelta = new THREE.Vector2();

		var dollyStart = new THREE.Vector2();
		var dollyEnd = new THREE.Vector2();
		var dollyDelta = new THREE.Vector2();

		function getAutoRotationAngle() {

			return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

		}

		function getZoomScale() {

			return Math.pow( 0.95, scope.zoomSpeed );

		}

		function rotateLeft( angle ) {

			sphericalDelta.theta -= angle;

		}

		function rotateUp( angle ) {

			sphericalDelta.phi -= angle;

		}

		var panLeft = function() {

			var v = new THREE.Vector3();

			return function panLeft( distance, objectMatrix ) {

				v.setFromMatrixColumn( objectMatrix, 0 ); // get X column of objectMatrix
				v.multiplyScalar( - distance );

				panOffset.add( v );

			};

		}();

		var panUp = function() {

			var v = new THREE.Vector3();

			return function panUp( distance, objectMatrix ) {

				v.setFromMatrixColumn( objectMatrix, 1 ); // get Y column of objectMatrix
				v.multiplyScalar( distance );

				panOffset.add( v );

			};

		}();

		// deltaX and deltaY are in pixels; right and down are positive
		var pan = function() {

			var offset = new THREE.Vector3();

			return function pan ( deltaX, deltaY ) {

				var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

				if ( scope.object instanceof THREE.PerspectiveCamera ) {

					// perspective
					var position = scope.object.position;
					offset.copy( position ).sub( scope.target );
					var targetDistance = offset.length();

					// half of the fov is center to top of screen
					targetDistance *= Math.tan( ( scope.object.fov / 2 ) * Math.PI / 180.0 );

					// we actually don't use screenWidth, since perspective camera is fixed to screen height
					panLeft( 2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix );
					panUp( 2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix );

				} else if ( scope.object instanceof THREE.OrthographicCamera ) {

					// orthographic
					panLeft( deltaX * ( scope.object.right - scope.object.left ) / scope.object.zoom / element.clientWidth, scope.object.matrix );
					panUp( deltaY * ( scope.object.top - scope.object.bottom ) / scope.object.zoom / element.clientHeight, scope.object.matrix );

				} else {

					// camera neither orthographic nor perspective
					console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );
					scope.enablePan = false;

				}

			};

		}();

		function dollyIn( dollyScale ) {

			if ( scope.object instanceof THREE.PerspectiveCamera ) {

				scale /= dollyScale;

			} else if ( scope.object instanceof THREE.OrthographicCamera ) {

				scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom * dollyScale ) );
				scope.object.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
				scope.enableZoom = false;

			}

		}

		function dollyOut( dollyScale ) {

			if ( scope.object instanceof THREE.PerspectiveCamera ) {

				scale *= dollyScale;

			} else if ( scope.object instanceof THREE.OrthographicCamera ) {

				scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom / dollyScale ) );
				scope.object.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
				scope.enableZoom = false;

			}

		}

		//
		// event callbacks - update the object state
		//

		function handleMouseDownRotate( event ) {

			//console.log( 'handleMouseDownRotate' );

			rotateStart.set( event.clientX, event.clientY );

		}

		function handleMouseDownDolly( event ) {

			//console.log( 'handleMouseDownDolly' );

			dollyStart.set( event.clientX, event.clientY );

		}

		function handleMouseDownPan( event ) {

			//console.log( 'handleMouseDownPan' );

			panStart.set( event.clientX, event.clientY );

		}

		function handleMouseMoveRotate( event ) {

			//console.log( 'handleMouseMoveRotate' );

			rotateEnd.set( event.clientX, event.clientY );
			rotateDelta.subVectors( rotateEnd, rotateStart );

			var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

			// rotating across whole screen goes 360 degrees around
			rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );

			// rotating up and down along whole screen attempts to go 360, but limited to 180
			rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

			rotateStart.copy( rotateEnd );

			scope.update();

		}

		function handleMouseMoveDolly( event ) {

			//console.log( 'handleMouseMoveDolly' );

			dollyEnd.set( event.clientX, event.clientY );

			dollyDelta.subVectors( dollyEnd, dollyStart );

			if ( dollyDelta.y > 0 ) {

				dollyIn( getZoomScale() );

			} else if ( dollyDelta.y < 0 ) {

				dollyOut( getZoomScale() );

			}

			dollyStart.copy( dollyEnd );

			scope.update();

		}

		function handleMouseMovePan( event ) {

			//console.log( 'handleMouseMovePan' );

			panEnd.set( event.clientX, event.clientY );

			panDelta.subVectors( panEnd, panStart );

			pan( panDelta.x, panDelta.y );

			panStart.copy( panEnd );

			scope.update();

		}

		function handleMouseUp( event ) {

			//console.log( 'handleMouseUp' );

		}

		function handleMouseWheel( event ) {

			//console.log( 'handleMouseWheel' );

			if ( event.deltaY < 0 ) {

				dollyOut( getZoomScale() );

			} else if ( event.deltaY > 0 ) {

				dollyIn( getZoomScale() );

			}

			scope.update();

		}

		function handleKeyDown( event ) {

			//console.log( 'handleKeyDown' );

			switch ( event.keyCode ) {

				case scope.keys.UP:
					pan( 0, scope.keyPanSpeed );
					scope.update();
					break;

				case scope.keys.BOTTOM:
					pan( 0, - scope.keyPanSpeed );
					scope.update();
					break;

				case scope.keys.LEFT:
					pan( scope.keyPanSpeed, 0 );
					scope.update();
					break;

				case scope.keys.RIGHT:
					pan( - scope.keyPanSpeed, 0 );
					scope.update();
					break;

			}

		}

		function handleTouchStartRotate( event ) {

			//console.log( 'handleTouchStartRotate' );

			rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

		}

		function handleTouchStartDolly( event ) {

			//console.log( 'handleTouchStartDolly' );

			var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
			var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

			var distance = Math.sqrt( dx * dx + dy * dy );

			dollyStart.set( 0, distance );

		}

		function handleTouchStartPan( event ) {

			//console.log( 'handleTouchStartPan' );

			panStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

		}

		function handleTouchMoveRotate( event ) {

			//console.log( 'handleTouchMoveRotate' );

			rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
			rotateDelta.subVectors( rotateEnd, rotateStart );

			var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

			// rotating across whole screen goes 360 degrees around
			rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );

			// rotating up and down along whole screen attempts to go 360, but limited to 180
			rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

			rotateStart.copy( rotateEnd );

			scope.update();

		}

		function handleTouchMoveDolly( event ) {

			//console.log( 'handleTouchMoveDolly' );

			var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
			var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

			var distance = Math.sqrt( dx * dx + dy * dy );

			dollyEnd.set( 0, distance );

			dollyDelta.subVectors( dollyEnd, dollyStart );

			if ( dollyDelta.y > 0 ) {

				dollyOut( getZoomScale() );

			} else if ( dollyDelta.y < 0 ) {

				dollyIn( getZoomScale() );

			}

			dollyStart.copy( dollyEnd );

			scope.update();

		}

		function handleTouchMovePan( event ) {

			//console.log( 'handleTouchMovePan' );

			panEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

			panDelta.subVectors( panEnd, panStart );

			pan( panDelta.x, panDelta.y );

			panStart.copy( panEnd );

			scope.update();

		}

		function handleTouchEnd( event ) {

			//console.log( 'handleTouchEnd' );

		}

		//
		// event handlers - FSM: listen for events and reset state
		//

		function onMouseDown( event ) {

			if ( scope.enabled === false ) return;

			event.preventDefault();

			if ( event.button === scope.mouseButtons.ORBIT ) {

				if ( scope.enableRotate === false ) return;

				handleMouseDownRotate( event );

				state = STATE.ROTATE;

			} else if ( event.button === scope.mouseButtons.ZOOM ) {

				if ( scope.enableZoom === false ) return;

				handleMouseDownDolly( event );

				state = STATE.DOLLY;

			} else if ( event.button === scope.mouseButtons.PAN ) {

				if ( scope.enablePan === false ) return;

				handleMouseDownPan( event );

				state = STATE.PAN;

			}

			if ( state !== STATE.NONE ) {

				document.addEventListener( 'mousemove', onMouseMove, false );
				document.addEventListener( 'mouseup', onMouseUp, false );

				scope.dispatchEvent( startEvent );

			}

		}

		function onMouseMove( event ) {

			if ( scope.enabled === false ) return;

			event.preventDefault();

			if ( state === STATE.ROTATE ) {

				if ( scope.enableRotate === false ) return;

				handleMouseMoveRotate( event );

			} else if ( state === STATE.DOLLY ) {

				if ( scope.enableZoom === false ) return;

				handleMouseMoveDolly( event );

			} else if ( state === STATE.PAN ) {

				if ( scope.enablePan === false ) return;

				handleMouseMovePan( event );

			}

		}

		function onMouseUp( event ) {

			if ( scope.enabled === false ) return;

			handleMouseUp( event );

			document.removeEventListener( 'mousemove', onMouseMove, false );
			document.removeEventListener( 'mouseup', onMouseUp, false );

			scope.dispatchEvent( endEvent );

			state = STATE.NONE;

		}

		function onMouseWheel( event ) {

			if ( scope.enabled === false || scope.enableZoom === false || ( state !== STATE.NONE && state !== STATE.ROTATE ) ) return;

			event.preventDefault();
			event.stopPropagation();

			handleMouseWheel( event );

			scope.dispatchEvent( startEvent ); // not sure why these are here...
			scope.dispatchEvent( endEvent );

		}

		function onKeyDown( event ) {

			if ( scope.enabled === false || scope.enableKeys === false || scope.enablePan === false ) return;

			handleKeyDown( event );

		}

		function onTouchStart( event ) {

			if ( scope.enabled === false ) return;

			switch ( event.touches.length ) {

				case 1:	// one-fingered touch: rotate

					if ( scope.enableRotate === false ) return;

					handleTouchStartRotate( event );

					state = STATE.TOUCH_ROTATE;

					break;

				case 2:	// two-fingered touch: dolly

					if ( scope.enableZoom === false ) return;

					handleTouchStartDolly( event );

					state = STATE.TOUCH_DOLLY;

					break;

				case 3: // three-fingered touch: pan

					if ( scope.enablePan === false ) return;

					handleTouchStartPan( event );

					state = STATE.TOUCH_PAN;

					break;

				default:

					state = STATE.NONE;

			}

			if ( state !== STATE.NONE ) {

				scope.dispatchEvent( startEvent );

			}

		}

		function onTouchMove( event ) {

			if ( scope.enabled === false ) return;

			event.preventDefault();
			event.stopPropagation();

			switch ( event.touches.length ) {

				case 1: // one-fingered touch: rotate

					if ( scope.enableRotate === false ) return;
					if ( state !== STATE.TOUCH_ROTATE ) return; // is this needed?...

					handleTouchMoveRotate( event );

					break;

				case 2: // two-fingered touch: dolly

					if ( scope.enableZoom === false ) return;
					if ( state !== STATE.TOUCH_DOLLY ) return; // is this needed?...

					handleTouchMoveDolly( event );

					break;

				case 3: // three-fingered touch: pan

					if ( scope.enablePan === false ) return;
					if ( state !== STATE.TOUCH_PAN ) return; // is this needed?...

					handleTouchMovePan( event );

					break;

				default:

					state = STATE.NONE;

			}

		}

		function onTouchEnd( event ) {

			if ( scope.enabled === false ) return;

			handleTouchEnd( event );

			scope.dispatchEvent( endEvent );

			state = STATE.NONE;

		}

		function onContextMenu( event ) {

			event.preventDefault();

		}

		//

		scope.domElement.addEventListener( 'contextmenu', onContextMenu, false );

		scope.domElement.addEventListener( 'mousedown', onMouseDown, false );
		scope.domElement.addEventListener( 'wheel', onMouseWheel, false );

		scope.domElement.addEventListener( 'touchstart', onTouchStart, false );
		scope.domElement.addEventListener( 'touchend', onTouchEnd, false );
		scope.domElement.addEventListener( 'touchmove', onTouchMove, false );

		window.addEventListener( 'keydown', onKeyDown, false );

		// force an update at start

		this.update();

	};

	THREE.OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );
	THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;

	Object.defineProperties( THREE.OrbitControls.prototype, {

		center: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .center has been renamed to .target' );
				return this.target;

			}

		},

		// backward compatibility

		noZoom: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
				return ! this.enableZoom;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
				this.enableZoom = ! value;

			}

		},

		noRotate: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
				return ! this.enableRotate;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
				this.enableRotate = ! value;

			}

		},

		noPan: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
				return ! this.enablePan;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
				this.enablePan = ! value;

			}

		},

		noKeys: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
				return ! this.enableKeys;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
				this.enableKeys = ! value;

			}

		},

		staticMoving : {

			get: function () {

				console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
				return ! this.enableDamping;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
				this.enableDamping = ! value;

			}

		},

		dynamicDampingFactor : {

			get: function () {

				console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
				return this.dampingFactor;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
				this.dampingFactor = value;

			}

		}

	} );

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function Animator(floorWidth, floorDepth) {
	  Object.call(this);

	  if (KOVAN.INFO_ENABLED) console.info(`Build time: ${KOVAN.BUILD_TIME}`);

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
    container = document.getElementById('app')
	  // container = document.createElement('div');
	  // container.className = "container";
	  // document.body.appendChild(container);

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
	  gridGeometry = new THREE.Geometry();
	  for (let i = 0; i <= this.floorWidth; i += step) {
	    gridGeometry.vertices.push(new THREE.Vector3(i, 0, 0));
	    gridGeometry.vertices.push(new THREE.Vector3(i, this.floorDepth, 0));
	  }
	  for (var j = 0; j <= this.floorDepth; j += step) {
	    gridGeometry.vertices.push(new THREE.Vector3(0, j, 0));
	    gridGeometry.vertices.push(new THREE.Vector3(this.floorWidth, j, 0));
	  }
	  gridMaterial = KOVAN.GridMaterial;

	  grid = new THREE.LineSegments(gridGeometry, gridMaterial);

	  // LIGHT
	  ambientLight = new THREE.AmbientLight(0x606060);
	  ambientLight.castShadow = false;

	  directionalLight = new THREE.DirectionalLight(0xffffff, 2);
	  directionalLight.position.set(-1, 1, 1);
	  directionalLight.castShadow = false;

	  // RENDERER
	  this.renderer = new THREE.WebGLRenderer({
	    antialias: true
	  });

	  this.renderer.shadowMap.enabled = false;

	  // SCENE
	  this.scene = new THREE.Scene();

	  // CAMERA
	  // this.camera = new THREE.PerspectiveCamera(75, viewportWidth / viewportHeight, 1, 200000)；
	  this.camera = new THREE.PerspectiveCamera(75, viewportWidth / viewportHeight, 1, this.floorWidth * 10);
	  // this.camera.position.set(this.floorWidth / 2, -this.floorWidth / 2, this.floorDepth / 2);
	  this.camera.position.set(this.floorWidth / 2, this.floorDepth / 2, this.floorDepth / 2);
	  this.camera.lookAt(new THREE.Vector3(this.floorWidth / 2, this.floorDepth / 2, 0));

	  // CONTROL
	  this.control = new THREE.OrbitControls(this.camera, this.renderer.domElement);
	  this.control.target.set(this.floorWidth / 2, this.floorDepth / 2, 0);

	  // ADD MESH TO SCENE
	  this.scene.add(grid);
	  this.scene.add(ambientLight);
	  this.scene.add(directionalLight);

	  // RENDERER SETUP
	  // this.renderer.setClearColor(0x000000);
	  this.renderer.setClearColor(KOVAN.RendererClearColor);
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

	  if (KOVAN.INFO_ENABLED) console.info("Animator Initialized!");
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
	};

	Animator.prototype.rotateLeft = function() {
	  this.angle = (this.angle - Math.PI / 2) % (2 * Math.PI);
	  this.camera.up.set(Math.sin(this.angle), Math.sin(this.angle + Math.PI / 2), 0);
	};

	Animator.prototype.rotateRight = function() {
	  this.angle = (this.angle + Math.PI / 2) % (2 * Math.PI);
	  this.camera.up.set(Math.sin(this.angle), Math.sin(this.angle + Math.PI / 2), 0);
	};


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
	};

	Animator.prototype.getObjectByName = function(name) {
	  return this.scene.getObjectByName(name);
	};

	Animator.prototype.remove = function(obj) {
	  return this.scene.remove(obj);
	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function Annotation(message, options) {
	  THREE.Sprite.call(this);

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
	  };

	  this.generateCanvasElement();

	  this.material = new THREE.SpriteMaterial({
	    map: this.generateTexture()
	  });
	  this.scale.set(this.scaleX, this.scaleY, 0);
	  this.up.set(0, 0, 1);
	  this.position.z = this.offsetZ;

	}

	Annotation.prototype = Object.create(THREE.Sprite.prototype);
	Annotation.prototype.constructor = Annotation;

	Annotation.prototype.generateTexture = function() {
	  // use canvas contents as texture
	  var texture = new THREE.Texture(this.canvas);
	  texture.needsUpdate = true;
	  texture.minFilter = THREE.LinearFilter;

	  return texture;
	};

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
	};

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
	};

	Annotation.prototype.setPosition = function(position) {
	  this.position.x = position.x + (this.canvas.width - this.width) / 2;
	  this.position.y = position.y - (this.canvas.height - this.height) / 2;
	  this.position.z = position.z;
	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function BaseBox() {
	  THREE.Mesh.call(this);
	  this.castShadow = false;

	  this.type = 'BaseBox';

	  this.length = 1000; // x axis
	  this.width = 500; // y axis
	  this.height = 500; // z axis

	  this.reference;
	  this.curve;

	  this.material = KOVAN.BaseBoxMaterial;

	}

	BaseBox.prototype = Object.create(THREE.Mesh.prototype);
	BaseBox.prototype.constructor = BaseBox;

	BaseBox.prototype.getDimension = function() {
	  return new THREE.Vector3(this.length, this.width, this.height);
	};

	BaseBox.prototype.setPosition = function(position) {
	  this.position.set(position.x, position.y, position.z);
	};

	BaseBox.prototype.generateAnnotation = function() {
	  this.annotation = new Annotation(this.name, KOVAN.BaseBoxAnnotationOption);
	  this.annotation.name = "annotation";
	};

	BaseBox.prototype.toggleAnnotationDisplay = function(displayed) {
	  if (typeof document != 'undefined' && document) {
	    if (displayed) {
	      if (!this.annotation) this.generateAnnotation();

	      this.add(this.annotation);
	    } else {
	      if (this.annotation) {
	        if (this.getObjectByName(this.annotation.name) != null) {
	          this.remove(this.annotation);
	        } else {
	          console.warn(`${this.name}: annotation is not added.`);
	        }
	      } else {
	        console.warn(`${this.name} does NOT have annotation.`);
	      }
	    }
	  } else {
	    if (KOVAN.LOG_ENABLED) console.log(`${this.name}: not running in browser environment, annotation will not be created.`);
	  }
	};

	BaseBox.prototype.setCurve = function(curve, reference, options) {
	  this.curve = curve;
	  this.reference = reference;

	  var t = options.t || 0;
	  this.updatePosition(t);
	};

	BaseBox.prototype.updatePosition = function(t) {
	  var offset = this.curve.getPointAt(t),
	    direction = this.curve.getTangentAt(t);

	  this.position.copy(this.reference);
	  this.position.x += offset.x;
	  this.position.y += offset.y;

	  var angle = Math.atan(direction.y / direction.x);
	  this.rotation.z = angle;
	};

	BaseBox.prototype.shift = function(vector) {
	  this.position.x += vector.x;
	  this.position.y += vector.y;
	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function BaseCarrier() {
	    BaseBox.call(this);

	    this.speed = 0;
	    this.acceleration = 0;
	    this.targetSpeed = 0;

	    this.reversed = false;
	    this.stopwatch = 0;

	    this.trace = []; // position and direction history
	    this.rack;
	    this.armLength;
	}

	BaseCarrier.prototype = Object.create(BaseBox.prototype);
	BaseCarrier.prototype.constructor = BaseCarrier;

	BaseCarrier.prototype.setCurve = function(curve, reference, options) {
	    this.curve = curve;
	    this.reference = reference;

	    var options = options || {},
	        reversed = options.reversed || false,
	        offset = options.offset || 0;

	    this.reversed = reversed;

	    if (offset > 0) {
	        var distance = this.curve.getLength(),
	            division = Math.floor(distance * 10);

	        this.stopwatch = offset / distance * division;
	    } else {
	        this.stopwatch = 0;
	    }
	};

	BaseCarrier.prototype.setRack = function(rack) {
	  this.rack = rack;
	  this.rack.setCarrier(this);
	};

	BaseCarrier.prototype.move = function(deltaTime) {
	    // if ((KOVAN.SECOND / deltaTime) <= 10) return false;

	    var distance = this.curve.getLength(),
	        division = Math.floor(distance * 10),
	        increment = division * this.speed * deltaTime * KOVAN.PLAY_SPEED / (distance * KOVAN.SECOND);

	    var t = this.stopwatch / division;

	    // console.log(t);

	    var extension = 0;
	    if (t > 1) {
	        extension = t - 1;
	        t = 1;
	    } else if (t < 0) {
	        extension = t;
	        t = 0;
	    }

	    var multiplier = this.reversed ? -1 : 1;

	    t = this.reversed ? 1 - t : t;

	    var direction = this.curve.getTangentAt(t),
	        dx = direction.x,
	        dy = direction.y;

	    // LOCATION
	    this.position.copy(this.reference);
	    var point = this.curve.getPointAt(t);
	    this.position.x += (point.x + extension * multiplier * distance * dx);
	    this.position.y += (point.y + extension * multiplier * distance * dy);

	    // DIRECTION
	    var angle = Math.atan(dy / dx);
	    this.rotation.z = angle;

	    // ACCELERATION
	    if ((this.acceleration > 0 && this.speed >= this.targetSpeed) || (this.acceleration < 0 && this.speed <= this.targetSpeed)) {
	      this.speed = this.targetSpeed;
	      this.acceleration = 0;
	    } else if (this.acceleration != 0) {
	        this.accelerate(deltaTime);
	    }

	    // RUN STOPWATCH
	    this.stopwatch += increment;

	    if (this.rack) {
	        this.drag();
	    }

	    // console.log('point: ' + point.x + ' ' + point.y);
	    // console.log('mover position: ' + this.position.x + ' ' + this.position.y + ' ' + this.position.z);

	    return false;
	};

	BaseCarrier.prototype.accelerate = function(deltaTime) {
	    var convertedAcceleration = this.acceleration * deltaTime / KOVAN.SECOND;

	    this.speed += convertedAcceleration;
	};

	BaseCarrier.prototype.drag = function() {
	    // record current position and direction
	    var currentTrace = {
	        position: this.position.clone(),
	        direction: this.rotation.clone()
	    };
	    this.trace.push(currentTrace);

	    var exceededXY = false;

	    // get current position and rotation of rack
	    // from trace
	    for (let i = 0; i < this.trace.length; i++) {
	        var trace = this.trace[i],
	            position = trace.position;

	        var distanceXY = Math.sqrt(Math.pow(this.position.x - position.x, 2) + Math.pow(this.position.y - position.y, 2));

	        if (Math.ceil(distanceXY) < this.armLength) {
	            if (exceededXY) {
	                this.trace.splice(0, i);

	                this.rack.position.copy(position);
	                this.rack.rotation.copy(trace.direction);
	            }

	            break;
	        }

	        if (Math.floor(distanceXY) > this.armLength) {
	            exceededXY = true;
	            continue;
	        }


	    }

	    // for escalating
	    var lastPosition = this.trace[this.trace.length - 2];

	    if (lastPosition) {
	        if (lastPosition.z != this.position.z) {
	            this.rack.position.z = this.position.z;
	        }
	    }

	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function Mover(geometry, material, options) {
	  BaseCarrier.call(this);

	  this.type = KOVAN.MOVER;

	  var options = options || {};

	  this.length = options.length || KOVAN.MoverLength;
	  this.width = options.width || KOVAN.MoverWidth;
	  this.height = options.height || KOVAN.MoverHeight;

	  this.acceleration = 0;
	  this.speedLimit = options.speedLimit || 5000;
	  // this.braking = false;

	  this.node;
	  this.direction; // node passing direction
	  this.armLength = options.armLength || this.length / 2;

	  this.escalating = false;

	  this.geometry = geometry !== undefined ? geometry : new THREE.BoxGeometry(this.length, this.width, this.height);
	  if (material !== undefined) this.material = material;

	}

	Mover.prototype = Object.create(BaseCarrier.prototype);
	Mover.prototype.constructor = Mover;

	Mover.prototype.turn = function() {
	  this.reversed = !this.reversed;

	  var distance = this.track.length,
	    division = Math.floor(distance * 10);

	  this.stopwatch = division - this.stopwatch;
	};

	Mover.prototype.releaseRack = function() {
	  this.rack = null;
	};

	Mover.prototype.setReversed = function(reversed) {
	  if (this.reversed != reversed) {
	    this.reversed = reversed;

	    var distance = this.curve.getLength(),
	      division = Math.floor(distance * 10);

	    this.stopwatch = division - this.stopwatch;
	  }
	};

	Mover.prototype.getStatus = function() {
	  let status = {};

	  status.moverSeq = this.name;

	  status.direction = this.direction;
	  status.nodeSeq = this.node.name;

	  status.speed = this.speed;
	  status.acceleration = this.acceleration;
	  status.targetSpeed = this.targetSpeed;

	  status.stopwatch = this.stopwatch;

	  return status;
	};

	Mover.prototype.setStatus = function(status) {
	  this.direction = status.direction;
	  this.node = status.node;

	  this.reversed = this.node.getReversedByDirection(this.direction);

	  let curvePath = this.node.getCurvePathByDirection(this.direction);
	  this.curve =  curvePath.curve;

	  this.reference = this.node.getReferenceByDirection(this.direction);

	  this.speed = status.speed;
	  this.acceleration = status.acceleration;
	  this.targetSpeed = status.targetSpeed;

	  this.stopwatch = status.stopwatch;
	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function Rack( geometry, material, options ) {
		BaseBox.call(this);

		this.type = KOVAN.RACK;

		var options = options || {};

		this.length = options.length || KOVAN.RackLength;
		this.width = options.width || KOVAN.RackWidth;
		this.height = options.height || KOVAN.RackHeight;

		this.geometry = geometry !== undefined ? geometry : new THREE.BoxGeometry(this.length, this.width, this.height);
		this.material = material !== undefined ? material : KOVAN.RackMaterial;

	}

	Rack.prototype = Object.create(BaseBox.prototype);
	Rack.prototype.constructor = Rack;

	Rack.prototype.setCarrier = function(carrier) {
		this.carrier = carrier;
	};

	Rack.prototype.getStatus = function() {
		let status = {};

		status.rackSeq = this.name;

		status.position = this.position;

		status.rotationZ = this.rotation.z;

		status.carrierSeq = this.carrier.name;
		status.carrierType = this.carrier.type;

		return status;
	};

	Rack.prototype.setStatus = function(status) {
		this.position.copy(status.position);

		this.rotation.z = status.rotationZ;
	};

	Rack.prototype.generateAnnotation = function() {
	    this.annotation = new Annotation(this.name);
	    this.annotation.name = "annotation";
	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function Player(map) {
	    Object.call(this);

	    this.type = "PLAYER";
	    this.map = map;

	    // this.shipmentAreas = map.getObjectByName('shipmentAreas');
	    // this.pushAreas = map.getObjectByName('pushAreas');
	    // this.escalators = map.getObjectByName('escalators');

	    this.animation = [];

	    this.nextEventIndex = 0;
	}

	Player.prototype = Object.create(Object.prototype);
	Player.prototype.constructor = Player;

	Player.prototype.addAnimation = function(animationArray) {
	  if (this.animation.length <= 0) {
	    this.animation = animationArray;
	  } else {
	    animationArray.forEach(newAnimation => this.animation.push(newAnimation));
	  }
	};

	Player.prototype.initialize = function() {
	    this.nextEventIndex = 0;
	    if (this.animation.length > 0) this.startTime = this.animation[this.nextEventIndex].currentTime;
	    else this.startTime = 0; // Difference between animation time and Player clock
	    this.clock = 0; // Player clock
	};

	Player.prototype.skipToNextEvent = function() {
	    if (this.nextEventIndex >= this.animation.length) {
	        return;
	    }

	    var nextEventTime = this.animation[this.nextEventIndex].currentTime;

	    this.clock = nextEventTime - this.startTime;
	};

	Player.prototype.play = function(deltaTime) {
	    var finished = false;
	    if (this.nextEventIndex >= this.animation.length) {
	        finished = true;
	    }

	    this.clock += deltaTime * KOVAN.PLAY_SPEED;
	    // console.log(this.clock);

	    if (!finished) {
	        var eventExecuted = false;
	        do {
	            let evnt = this.animation[this.nextEventIndex],
	              convertedTime = evnt.currentTime - this.startTime;

	            if (convertedTime < this.clock) {
	                this.nextEventIndex++;

	                if (KOVAN.INFO_ENABLED) console.info(`${evnt.entitySeq}: ${evnt.actionType}`);

	                this.execute(evnt);
	                eventExecuted = true;
	            } else {
	                eventExecuted = false;
	            }

	        } while (eventExecuted && this.nextEventIndex < this.animation.length);
	    }

	    this.act(deltaTime);

	    return this.clock;
	};

	Player.prototype.act = function(deltaTime) {
	  // movers
	  for (let i = 0; i < this.map.movers.children.length; i++) {
	      let mover = this.map.movers.children[i];
	      if (mover) {
	        mover.move(deltaTime);
	      }
	  }

	  // pusher
	  for (let i = 0; i < this.map.pushers.children.length; i++) {
	      let pusher = this.map.pushers.children[i];
	      if (pusher) {
	          pusher.act(deltaTime);
	      }
	  }

	  // pickers
	  for (let i = 0; i < this.map.pickers.children.length; i++) {
	    let picker = this.map.pickers.children[i];
	    if (picker) {
	      picker.act(deltaTime);
	    }
	  }

	  // escalators
	  for (let i = 0; i < this.map.escalators.children.length; i++) {
	      this.map.escalators.children[i].escalate(deltaTime);
	  }

	};

	Player.prototype.execute = function(evnt) {
	    var evntType = evnt.actionType;

	    switch (evntType) {
	        case "CREATE_MOVER":
	            this.onMoverCreate(evnt);
	            break;
	        case "CREATE_RACKS":
	            this.onRacksCreate(evnt);
	            break;
	        case "TAG_SCAN":
	            this.onTagScan(evnt);
	            break;
	        case "ACCELERATION_CHANGE":
	            this.onAccelerationChange(evnt);
	            break;
	        case "TRACK_CHANGE":
	            this.onTrackChange(evnt); // Deprecated
	            break;
	        case "START_CHANGE":
	            this.onStartChange(evnt);
	            break;
	        case "END_CHANGE":
	            this.onEndChange(evnt);
	            break;
	        case "PATH_END":
	            this.onPathEnd(evnt);
	            break;
	        case "START_RETRIEVE":
	            this.onStartRetrive(evnt);
	            break;
	        case "START_PICK":
	            this.onStartPick(evnt);
	            break;
	        case "START_RETURN":
	            this.onStartReturn(evnt);
	            break;
	        case "START_DROPOFF":
	            this.onStartDropoff(evnt);
	            break;
	        case "START_LEAVE":
	            this.onStartLeave(evnt);
	            break;
	        case "RACK_GRABBED":
	            this.onRackGrabbed(evnt);
	            break;
	        case "RACK_RELEASED":
	            this.onRackReleased(evnt);
	            break;
	        case "START_PUSH_RACK":
	            this.onStartPushRack(evnt);
	            break;
	        case "START_RESUME":
	            this.onStartResume(evnt);
	            break;
	        case "START_CLEAR":
	            this.onStartClear(evnt);
	            break;
	        case "START_ESCALATE":
	            this.onStartEscalate(evnt);
	            break;
	        case "LEVEL_ALIGNED":
	            this.onLevelAligned(evnt);
	            break;

	            // Temp: for test purpose only
	        case "ADD_RACK":
	            this.addRackToMover(evnt);
	            break;
	        default:
	            console.log("Invalid Event Type: " + evntType);
	    }
	};

	Player.prototype.onMoverCreate = function(evnt) {
	    this.createMover(evnt);
	};

	Player.prototype.onRacksCreate = function(evnt) {
	    let storageUnit = this.map.nodes[evnt.entitySeq];

	    storageUnit.createStorageRacks(evnt.currentLeftStorageCount, evnt.currentRightStorageCount);
	};

	Player.prototype.onTagScan = function(evnt) {
	    var mover = this.map.movers.getObjectByName(evnt.entitySeq);

	    if (mover == undefined) {
	        this.createMover(evnt);
	        // console.warn("WARN: TAG SCAN event pointing to a non-existent mover: " + evnt.entitySeq);
	    } else {
	        this.setMoverStatus(mover, evnt);
	    }
	};

	Player.prototype.onAccelerationChange = function(evnt) {
	    var mover = this.map.movers.getObjectByName(evnt.entitySeq);

	    if (mover == undefined) {
	        console.warn("WARN: ACCELERATION CHANGE event pointing to a non-existent mover: " + evnt.entitySeq);
	    } else {
	        if (evnt.currentAcceleration != null) {
	            mover.acceleration = evnt.currentAcceleration;
	        }
	        if (evnt.currentSpeed != null) {
	            mover.speed = evnt.currentSpeed;
	        }
	        if (evnt.targetSpeed != null) {
	            mover.targetSpeed = evnt.targetSpeed;
	        }
	        if (evnt.direction != null) {
	            if (evnt.nodeSeq != null) {
	                var node = mover.node;
	                if (node.name == evnt.nodeSeq) {
	                    mover.setReversed(node.getReversedByDirection(evnt.direction));
	                }
	            }
	        }
	    }
	};

	Player.prototype.onTrackChange = function(evnt) {
	    var mover = this.map.movers.getObjectByName(evnt.entitySeq);

	    var reversed = evnt.direction == "AB" ? false : true;

	    if (mover == undefined) {
	        console.warn("WARN: TRACK CHANGE event pointing to a non-existent mover: " + evnt.entitySeq);
	    } else {
	        mover.setTrack(this.map.getObjectByName(evnt.trackSeq), {
	            reversed: reversed
	        });
	    }
	};

	Player.prototype.onStartChange = function(evnt) {
	    // var sw = this.map.getObjectByName(evnt.entitySeq);
	    let sw = this.map.switchRobots.getObjectByName(evnt.entitySeq);

	    if (sw == undefined) {
	        console.warn("WARN: SWITCH START CHANGE event pointing to non-existent switch: " + evnt.entitySeq);
	    } else {
	        if (KOVAN.LOG_ENABLED) console.log(sw.name + " start changing position.");
	    }
	};

	Player.prototype.onEndChange = function(evnt) {
	    // var sw = this.map.getObjectByName(evnt.entitySeq);
	    let sw = this.map.switchRobots.getObjectByName(evnt.entitySeq);

	    if (sw == undefined) {
	        console.warn("WARN: SWITCH END CHANGE event pointing to non-existent switch: " + evnt.entitySeq);
	    } else {
	        // console.log(sw.name + " end changing position.");
	        var position = evnt.currentStatus;
	        sw.switchPosition(position);
	    }
	};

	Player.prototype.onPathEnd = function(evnt) {
	    var mover = this.map.movers.getObjectByName(evnt.entitySeq);

	    if (mover) {
	        movers.remove(mover);
	    } else {
	        console.warn("WARN: PATH END event pointing to non-existent mover: " + evnt.entitySeq());
	    }
	};

	Player.prototype.onStartRetrive = function(evnt) {
	    let picker = this.map.pickers.getObjectByName(evnt.entitySeq);

	    if (picker) {
	        picker.onStartRetrive(evnt.rackSeq, evnt.rackSide, evnt.rackIndex, evnt.speed);
	    } else {
	        console.warn(`${evnt.actionType} evnt pointing to non-existent picker: ${evnt.entitySeq}`);
	    }
	};

	Player.prototype.onStartPick = function(evnt) {
	    let picker = this.map.pickers.getObjectByName(evnt.entitySeq);

	    if (picker) {
	        picker.onStartPick();
	    } else {
	        console.warn(`${evnt.actionType} evnt pointing to non-existent picker: ${evnt.entitySeq}`);
	    }
	};

	Player.prototype.onStartReturn = function(evnt) {
	    let picker = this.map.pickers.getObjectByName(evnt.entitySeq);

	    if (picker) {
	        picker.onStartReturn(evnt.speed);
	    } else {
	        console.warn(`${evnt.actionType} evnt pointing to non-existent picker: ${evnt.entitySeq}`);
	    }
	};

	Player.prototype.onStartDropoff = function(evnt) {
	    let picker = this.map.pickers.getObjectByName(evnt.entitySeq);

	    if (picker) {
	        picker.onStartDropoff(evnt.dropoffLocation, evnt.speed);
	    } else {
	        console.warn(`${evnt.actionType} evnt pointing to non-existent picker: ${evnt.entitySeq}`);
	    }
	};

	Player.prototype.onStartLeave = function(evnt) {
	    let picker = this.map.pickers.getObjectByName(evnt.entitySeq);

	    if (picker) {
	        picker.onStartLeave(evnt.speed);
	    } else {
	        console.warn(`${evnt.actionType} evnt pointing to non-existent picker: ${evnt.entitySeq}`);
	    }
	};

	Player.prototype.onRackGrabbed = function(evnt) {
	    var mover = this.map.movers.getObjectByName(evnt.entitySeq);
	    var rack = this.map.racks.getObjectByName(evnt.rackSeq);

	    if (mover) {
	      if (rack) {
	        mover.setRack(rack);
	      } else {
	        console.warn(`${evnt.actionType} evnt pointing to non-existent rack: ${evnt.rackSeq}`);
	      }
	    } else {
	      console.warn(`${evnt.actionType} evnt pointing to non-existent mover: ${evnt.entitySeq}`);
	    }
	};

	Player.prototype.onRackReleased = function(evnt) {
	    var mover = this.map.movers.getObjectByName(evnt.entitySeq);

	    mover.releaseRack();
	};

	Player.prototype.onStartPushRack = function(evnt) {
	    var pusher = this.map.pushers.getObjectByName(evnt.entitySeq);
	    var rack = this.map.racks.getObjectByName(evnt.rackSeq);

	    if (pusher) {
	      pusher.onStartPushRack(rack, evnt.speed);
	    } else {
	      console.warn(`${evnt.actionType} evnt pointing to non-existent pusher: ${evnt.entitySeq}`);
	    }

	};

	Player.prototype.onStartResume = function(evnt) {
	    var pusher = this.map.pushers.getObjectByName(evnt.entitySeq);

	    if (pusher) {
	      pusher.onStartResume(evnt.speed);
	    } else {
	      console.warn(`${evnt.actionType} evnt pointing to non-existent pusher: ${evnt.entitySeq}`);
	    }

	};

	Player.prototype.onStartClear = function(evnt) {
	    var pusher = this.map.pushers.getObjectByName(evnt.entitySeq);

	    pusher.stopwatch = 0;
	    pusher.clearing = true;
	};

	Player.prototype.onStartEscalate = function(evnt) {
	    var escalator = this.map.escalators.getObjectByName(evnt.entitySeq);

	    escalator.setUp(evnt.up);
	    escalator.escalating = true;
	};

	Player.prototype.onLevelAligned = function(evnt) {
	    var escalator = this.map.escalators.getObjectByName(evnt.entitySeq);

	    escalator.onAligned(evnt.carNum);
	};

	Player.prototype.createMover = function(evnt) {
	    var mover = new Mover(KOVAN.MoverGeometry, KOVAN.MoverMaterial);
	    mover.name = evnt.entitySeq;
	    // mover.generateAnnotation();
	    if (KOVAN.ShowMoverAnnotation) mover.toggleAnnotationDisplay(KOVAN.ShowMoverAnnotation);

	    mover.acceleration = evnt.currentAcceleration || 0;

	    this.setMoverStatus(mover, evnt);

	    /*
	  var reversed = evnt.direction == "AB" ? false : true,
	    offset = evnt.initDistance,
	    trackSeq = evnt.trackSeq,
	    track = this.map.getObjectByName(trackSeq);

	  mover.setTrack(track, {reversed: reversed, offset: offset});
	 */
	    this.map.movers.add(mover);

	    return mover;
	};

	Player.prototype.createRack = function(evnt) {
	    var rack = new Rack(KOVAN.RackGeometry, KOVAN.RackMaterial);
	    rack.name = evnt.rackSeq;
	    // rack.generateAnnotation();

	    this.map.racks.add(rack);

	    return rack;
	};

	Player.prototype.setMoverStatus = function(mover, evnt) {
	    var node = this.map.getNodeByName(evnt.nodeSeq);

	    mover.speed = evnt.currentSpeed || 0;

	    if (node != mover.node) {
	        mover.node = node;
	    }

	    var direction = evnt.direction;
	    mover.direction = direction;

	    var reversed = node.getReversedByDirection(direction),
	        curvePath = node.getCurvePathByDirection(direction),
	        curve = curvePath.curve,
	        pathTag = curvePath.getObjectByName(evnt.tagSeq),
	        offset = pathTag.distanceFromReference;

	    offset = reversed ? curve.getLength() - offset : offset;

	    if (evnt.initDistance != null) {
	        offset += evnt.initDistance;
	    }

	    mover.setCurve(curve, node.getReferenceByDirection(direction), {
	        reversed: reversed,
	        offset: offset
	    });
	};

	Player.prototype.addRackToMover = function(evnt) {
	    var mover = this.map.movers.getObjectByName(evnt.entitySeq);

	    var rack = new Rack(KOVAN.RackGeometry, KOVAN.RackMaterial);
	    rack.name = evnt.rackSeq;
	    // rack.generateAnnotation();

	    this.map.racks.add(rack);

	    mover.setRack(rack);

	    rack.position.copy(mover.position);
	    rack.rotation.copy(mover.rotation);
	};

	Player.prototype.getStatus = function(indexRequired) {
	  let status = {};

	  status.startTime = this.startTime;
	  status.clock = this.clock;

	  if (indexRequired) status.nextEventIndex = this.nextEventIndex;

	  return status;
	};

	Player.prototype.setStatus = function(status) {
	  this.startTime = status.startTime;
	  this.clock = status.clock;

	  this.nextEventIndex = status.nextEventIndex || this.nextEventIndex;
	};

	Player.prototype.snapshotStatus = function(options) {
	  var options = options || {};

	  let status = {};

	  // player
	  status.playerStatus = this.getStatus(options.indexRequired);

	  // movers
	  status.moverStatusList = [];
	  for(let i = 0; i < this.map.movers.children.length; i++) {
	    status.moverStatusList.push(this.map.movers.children[i].getStatus());
	  }

	  // pickers
	  status.pickerStatusList = [];
	  for(let i = 0; i < this.map.pickers.children.length; i++) {
	    status.pickerStatusList.push(this.map.pickers.children[i].getStatus());
	  }

	  // pushers
	  status.pusherStatusList = [];
	  for(let i = 0; i < this.map.pushers.children.length; i++) {
	    status.pusherStatusList.push(this.map.pushers.children[i].getStatus());
	  }
	  // racks
	  status.rackStatusList = [];
	  for(let i = 0; i < this.map.racks.children.length; i++) {
	    status.rackStatusList.push(this.map.racks.children[i].getStatus());
	  }

	  // escalators
	  status.escalatorStatusList = [];
	  for(let i = 0; i < this.map.escalators.children.length; i++) {
	    status.escalatorStatusList.push(this.map.escalators.children[i].getStatus());
	  }

	  // switches
	  status.switchStatusList = [];
	  for(let i = 0; i < this.map.switchRobots.children.length; i++) {
	    status.switchStatusList.push(this.map.switchRobots.children[i].getStatus());
	  }

	  // storage unit
	  status.storageUnitStatusList = [];
	  for(let i = 0; i < this.map.storageUnits.children.length; i++) {
	    status.storageUnitStatusList.push(this.map.storageUnits.children[i].getStatus());
	  }

	  return status;
	};

	Player.prototype.reconstructStatus = function(status) {
	  if (KOVAN.INFO_ENABLED) console.info('Reconstructing status...');
	  if (KOVAN.LOG_ENABLED) console.log(status);

	  //player
	  this.setStatus(status.playerStatus);

	  // movers
	  for (let i = 0; i < status.moverStatusList.length; i++) {
	    this.reconstructMoverStatus(status.moverStatusList[i]);
	  }

	  // pickers
	  for (let i = 0; i < status.pickerStatusList.length; i++) {
	    this.reconstructPickerStatus(status.pickerStatusList[i]);
	  }

	  // pushers
	  for (let i = 0; i < status.pusherStatusList.length; i++) {
	    this.reconstructPusherStatus(status.pusherStatusList[i]);
	  }

	  // racks
	  for (let i = 0; i < status.rackStatusList.length; i++) {
	    this.reconstructRackStatus(status.rackStatusList[i]);
	  }

	  // escalators
	  for (let i = 0; i < status.escalatorStatusList.length; i++) {
	    this.reconstructEscalatorStatus(status.escalatorStatusList[i]);
	  }

	  // switches
	  for (let i = 0; i < status.switchStatusList.length; i++) {
	    this.reconstructSwitchStatus(status.switchStatusList[i]);
	  }

	  // storage unit
	  for (let i = 0; i < status.storageUnitStatusList.length; i++) {
	    this.reconstructStorageUnitStatus(status.storageUnitStatusList[i]);
	  }

	  this.act(0);
	};

	Player.prototype.reconstructMoverStatus = function(moverStatus) {
	  // create mover
	  let mover = new Mover(KOVAN.MoverGeometry, KOVAN.MoverMaterial);
	  mover.name = moverStatus.moverSeq;
	  if (KOVAN.ShowMoverAnnotation) mover.toggleAnnotationDisplay(KOVAN.ShowMoverAnnotation);

	  // set status
	  moverStatus.node = this.map.getNodeByName(moverStatus.nodeSeq);

	  mover.setStatus(moverStatus);

	  this.map.movers.add(mover);
	};

	Player.prototype.reconstructPickerStatus = function(pickerStatus) {
	  // find picker
	  let pickerSeq = pickerStatus.pickerSeq;
	  let picker = this.map.getCarrierByType(pickerSeq, KOVAN.PICKER);

	  if (picker) {
	    // set status
	    picker.setStatus(pickerStatus);
	  } else {
	    console.error(`Player: picker does NOT exist when reconstructing status (pickerSeq: ${pickerSeq})`);
	  }
	};

	Player.prototype.reconstructPusherStatus = function(pusherStatus) {
	  // find pusher
	  let pusherSeq = pusherStatus.pusherSeq;
	  let pusher = this.map.getCarrierByType(pusherSeq, KOVAN.PUSHER);

	  if (pusher) {
	    // set status
	    pusher.setStatus(pusherStatus);
	  } else {
	    console.error(`Player: pusher does NOT exist when reconstructing status (pusherSeq: ${pusherSeq})`);
	  }

	};

	Player.prototype.reconstructRackStatus = function(rackStatus) {
	  // create rack
	  let rack = new Rack(KOVAN.RackGeometry, KOVAN.RackMaterial);
	  rack.name = rackStatus.rackSeq;
	  if (KOVAN.ShowRackAnnotation) rack.toggleAnnotationDisplay(KOVAN.ShowRackAnnotation);

	  // find carrier
	  let carrierSeq = rackStatus.carrierSeq,
	    carrierType = rackStatus.carrierType;

	  let carrier = this.map.getCarrierByType(carrierSeq, carrierType);

	  if (carrier) {
	    carrier.setRack(rack);
	  } else {
	    console.error(`Player: carrier does NOT exist when reconstructing rack status (carrierSeq: ${carrierSeq}, carrierType: ${carrierType})`);
	  }

	  rack.setStatus(rackStatus);

	  this.map.racks.add(rack);
	};

	Player.prototype.reconstructEscalatorStatus = function(escalatorStatus) {
	  // find escalator
	  let escalatorSeq = escalatorStatus.escalatorSeq;
	  let escalator = this.map.escalators.getObjectByName(escalatorSeq);

	  if (escalator) {
	    escalator.setStatus(escalatorStatus);
	  } else {
	    console.error(`Player: escalator does NOT exist when reconstructing status (escalatorSeq: ${escalatorSeq})`);
	  }
	};

	Player.prototype.reconstructSwitchStatus = function(switchStatus) {
	  // find switch robot
	  let switchSeq = switchStatus.switchSeq;
	  let switchRobot = this.map.switchRobots.getObjectByName(switchSeq);

	  if (switchRobot) {
	    switchRobot.setStatus(switchStatus);
	  } else {
	    console.error(`Player: switch does NOT exist when reconstructing status (switchSeq: ${switchSeq})`);
	  }
	};

	Player.prototype.reconstructStorageUnitStatus = function(storageUnitStatus) {
	  // find storage unit
	  let storageUnitSeq = storageUnitStatus.storageUnitSeq;
	  let storageUnit = this.map.storageUnits.getObjectByName(storageUnitSeq);

	  if (storageUnit) {
	    storageUnit.setStatus(storageUnitStatus);
	  } else {
	    console.error(`Player: storageUnit does NOT exist when reconstructing status (storageUnitSeq: ${storageUnitSeq})`);
	  }
	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function Point(pointJsonObj) {
	  THREE.Vector3.call(this, pointJsonObj.x, pointJsonObj.y, pointJsonObj.z);
	  // THREE.Vector3.call(this);

	  this.type = "POINT";

	  this.jsonObj = pointJsonObj;
	  // this.set(pointJsonObj.x, pointJsonObj.y, pointJsonObj.z);
	  this.name = pointJsonObj.pointSeq;
	}

	Point.prototype = Object.create(THREE.Vector3.prototype);
	Point.prototype.constructor = Point;

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	 function PointMark(pointSeq, options) {
	   THREE.Mesh.call(this);

	   var options = options || {};

	   this.type = "POINT_MARK";
	   this.name = pointSeq;

	   this.geometry = KOVAN.PointGeometry;
	   this.material = KOVAN.PointMaterial;

	  //  this.generateAnnotation();
	    this.initialize(options.displayed);
	 }

	 PointMark.prototype = Object.create(THREE.Mesh.prototype);
	 PointMark.prototype.constructor = PointMark;

	 PointMark.prototype.initialize = function(displayed) {
	   if (typeof document != 'undefined' && document) {
	     if (displayed) this.addAnnotation();
	     else this.generateAnnotation();
	   } else {
	     if (KOVAN.LOG_ENABLED) console.log(`${this.name}: not running in browser environment, annotation will not be created.`);
	   }
	 };

	 PointMark.prototype.setPosition = function(point, displayed) {
	   this.position.copy(point);

	   if (!displayed) this.annotation.setPosition(this.position);
	 };

	 PointMark.prototype.setAnnotationPosition = function(displayed) {
	   if (!displayed) this.annotation.setPosition(this.position);
	 };

	 PointMark.prototype.addAnnotation = function() {
	   if (!this.annotation) this.generateAnnotation();

	   this.add(this.annotation);
	 };

	 PointMark.prototype.generateAnnotation = function() {
	     this.annotation = new Annotation(this.name, KOVAN.PointAnnotationOption);
	     this.annotation.name = 'annotation';
	 };

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function BaseTrack(trackJsonObj) {
	  THREE.Line.call(this);
	  this.castShadow = false;

	  this.jsonObj = trackJsonObj;

	  this.type = 'BASE_TRACK';
	  this.name = this.jsonObj.trackSeq;
	  this.index = this.jsonObj.trackIndex;

	  this.nodeSeq = this.jsonObj.nodeSeq;
	  this.nodeType = this.jsonObj.nodeType;

	  this.speedLimit = 1500;

	  this.material = KOVAN.BaseTrackMaterial;

	  this.initialize();

	}

	BaseTrack.prototype = Object.create(THREE.Line.prototype);
	BaseTrack.prototype.constructor = BaseTrack;

	BaseTrack.prototype.initialize = function() {
	  this.pointA = new Point(0, 0, 0);
	  this.pointB = new Point(0, 0, 0);
	  this.reference = new Point(0, 0, 0);
	  this.length = 0;

	  this.createGeometry();
	  // this.generateAnnotation();


	};

	BaseTrack.prototype.createGeometry = function() {
	  console.log('adding geometry...');
	};

	BaseTrack.prototype.addAnnotation = function() {
	  if (typeof document != 'undefined' && document) {
	    if (!this.annotation) this.generateAnnotation();

	    this.add(this.annotation);
	  } else {
	    if (KOVAN.LOG_ENABLED) console.log(`${this.name}: not running in browser environment, annotation will not be created.`);
	  }
	};

	BaseTrack.prototype.generateAnnotation = function() {
	  this.annotation = new Annotation(this.name + ': ' + KOVAN.RoundTo(this.length, 0), {fontsize: 24, scaleX: 500, scaleY: 250, offsetZ: 150});
	  this.annotation.name = 'annotation';
	};

	BaseTrack.prototype.getLength = function() {
	  return this.length;
	};

	BaseTrack.prototype.modifyPointSeq = function(pointSeq, modifier) {
	  console.log(pointSeq + " " + this.pointA.name + " " + this.pointB.name);
	  if (this.pointA.name == pointSeq) {
	    this.pointA.name += modifier;
	  }

	  if (this.pointB.name == pointSeq) {
	    this.pointB.name += modifier;
	  }
	};

	BaseTrack.prototype.setZ = function(z) {
	  this.position.z = z;
	  this.pointA.z = z;
	  this.pointB.z = z;
	};

	BaseTrack.prototype.shift = function(vector) {
	  this.position.x += vector.x;
	  this.position.y += vector.y;

	  this.pointA.x += vector.x;
	  this.pointA.y += vector.y;

	  this.pointB.x += vector.x;
	  this.pointB.y += vector.y;
	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function StraightTrack(trackJsonObj) {
	  BaseTrack.call(this, trackJsonObj);

	  this.type = this.jsonObj.trackType || 'STRAIGHT_TRACK';

	}

	StraightTrack.prototype = Object.create(BaseTrack.prototype);
	StraightTrack.prototype.constructor = StraightTrack;

	StraightTrack.prototype.initialize = function() {
	  this.pointA = new Point(this.jsonObj.pointA);
	  this.pointB = new Point(this.jsonObj.pointB);
	  this.reference = this.pointA;
	  this.vector = new THREE.Vector3();
	  this.vector.subVectors(this.pointB, this.pointA);
	  // this.length = this.pointA.distanceTo(this.pointB);
	  this.length = this.jsonObj.length ? this.jsonObj.length : this.pointA.distanceTo(this.pointB);

	  this.createGeometry();
	};

	StraightTrack.prototype.createGeometry = function() {
	  var resolution = Math.floor(this.length / 100); // DM Accuracy

	  // this.curve = new THREE.CurvePath();
	  // this.curve.add(new THREE.LineCurve(
	  //   new THREE.Vector2(0, 0),
	  //   new THREE.Vector2(this.vector.x, this.vector.y)));
	  //
	  // this.geometry = this.curve.createPointsGeometry(resolution);

	  this.curve = KOVAN.GetLineCurvePath(this.vector);
	  this.geometry = KOVAN.GetLineCurveGeometry(this.vector, resolution);

	  this.position.set(this.pointA.x, this.pointA.y, this.pointA.z);
	};



	// KOVAN.generateTracks = function(trackList) {
	//   var tracks = new THREE.Object3D();
	//   tracks.name = "tracks";
	//
	//   var trackList = trackList;
	//
	//   for (var i in trackList) {
	//     var trackJsonObj = trackList[i];
	//     var track = new KOVAN.StraightTrack(trackJsonObj);
	//     tracks.add(track)
	//   }
	//
	//   return tracks;
	// }

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function CurvedTrack(trackJsonObj) {
	  BaseTrack.call(this, trackJsonObj);

	  this.type = this.jsonObj.trackType || 'CURVED_TRACK';

	}

	CurvedTrack.prototype = Object.create(BaseTrack.prototype);
	CurvedTrack.prototype.constructor = CurvedTrack;

	CurvedTrack.prototype.initialize = function() {
	  this.radius = this.jsonObj.radius || 140;

	  this.pointA = new Point(this.jsonObj.pointA);
	  this.pointB = new Point(this.jsonObj.pointB);
	  this.center = new Point(this.jsonObj.center);

	  this.reference = this.center;

	  this.startAngle = this.jsonObj.startAngle;
	  this.endAngle = this.jsonObj.endAngle;

	  this.clockwise = this.jsonObj.clockwise || false;

	  this.angle = this.clockwise ? this.startAngle - this.endAngle : this.endAngle - this.startAngle;
	  this.angle = this.angle < 0 ? this.angle + 2 * Math.PI : this.angle;

	  this.length = this.jsonObj.lenght || this.radius * this.angle;

	  this.createGeometry();
	};

	CurvedTrack.prototype.createGeometry = function() {
	  // var resolution = Math.floor(this.length / 30); // CM Accuracy
	  var resolution = KOVAN.CurveGeometryResolution;

	  // this.curve = new THREE.CurvePath();
	  // this.curve.add(new THREE.EllipseCurve(
	  //   0, 0,
	  //   this.radius, this.radius,
	  //   this.startAngle, this.endAngle,
	  //   this.clockwise,
	  // 0));
	  //
	  // this.geometry = this.curve.createPointsGeometry(resolution);

	  this.curve = KOVAN.GetEllipseCurvePath(this.radius, this.radius, this.startAngle, this.endAngle, this.clockwise);
	  this.geometry = KOVAN.GetEllipseCurveGeometry(this.radius, this.radius, this.startAngle, this.endAngle, this.clockwise, resolution);

	  this.position.set(this.center.x, this.center.y, this.center.z);

	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */


	function PathTag(tagSeq, distanceFromReference) {
	  THREE.Object3D.call(this);

	  this.name = tagSeq;
	  this.distanceFromReference = distanceFromReference;
	}

	PathTag.prototype = Object.create(THREE.Object3D.prototype);
	PathTag.prototype.constructor = PathTag;

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	 function CurvePath() {
	   THREE.Object3D.call(this);

	   this.curve = new THREE.CurvePath();

	 }

	 CurvePath.prototype = Object.create(THREE.Object3D.prototype);
	 CurvePath.prototype.constructor = CurvePath;

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function Tag(tagJsonObj, options) {
	  // THREE.Object3D.call(this);
	  THREE.Mesh.call(this);

	  this.type = "TAG";

	  this.jsonObj = tagJsonObj;

	  var options = options || {};

	  this.name = this.jsonObj.tagSeq;

	  this.index = this.jsonObj.tagIndex;
	  this.tagType = this.jsonObj.tagType;
	  this.trackSeq = this.jsonObj.trackSeq;
	  this.distanceFromPointA = this.jsonObj.distanceFromPointA;

	  this.geometry = KOVAN.TagGeometry;
	  this.material = KOVAN.TagMaterial;

	  this.initialize(options.displayed);
	}

	// KOVAN.Tag.prototype = Object.create(THREE.Object3D.prototype);
	Tag.prototype = Object.create(THREE.Mesh.prototype);
	Tag.prototype.constructor = Tag;

	Tag.prototype.initialize = function(displayed) {
	  if (typeof document != 'undefined' && document) {
	    if (displayed) this.addAnnotation();
	    else this.generateAnnotation();
	  } else {
	    if (KOVAN.LOG_ENABLED) console.log(`${this.name}: not running in browser environment, annotation will not be created.`);
	  }
	};

	Tag.prototype.setPosition = function(track, displayed) {
	  var t = this.distanceFromPointA / track.length,
	  direction = track.curve.getTangentAt(t);

	  this.position.copy(track.reference);
	  this.position.x += direction.x * this.distanceFromPointA;
	  this.position.y += direction.y * this.distanceFromPointA;

	  if(!displayed && this.annotation) this.annotation.setPosition(this.position);
	};

	Tag.prototype.addAnnotation = function() {
	  if (!this.annotation) this.generateAnnotation();

	  this.add(this.annotation);
	};

	Tag.prototype.generateAnnotation = function() {
	  this.annotation = new Annotation(this.name, KOVAN.TagAnnotationOption);
	  this.annotation.name = 'annotation';
	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function BaseRail(jsonObj, options) {
	  THREE.Object3D.call(this);

	  this.jsonObj = jsonObj;

	  var options = options || {};

	  this.initialize(options.displayed);
	}

	BaseRail.prototype = Object.create(THREE.Object3D.prototype);
	BaseRail.prototype.constructor = BaseRail;

	BaseRail.prototype.getReferenceByDirection = function(direction) {
	  var track = this.getTrack();

	  return track.pointA;
	};

	BaseRail.prototype.getReversedByDirection = function(direction) {
	  var reversed = false;

	  switch (direction) {
	    case "AB":
	      reversed = false;
	      break;

	    case "BA":
	      reversed = true;
	      break;
	    default:

	  }

	  return reversed;
	};

	BaseRail.prototype.initialize = function(displayed) {
	  if (displayed) {
	    this.addTracks();
	    this.addTags();
	    this.addPointMarks();
	  } else {
	    this.generateTracks();
	    this.generateTags();
	    // this.addPointMarks();
	  }
	  this.setCurvePath();

	};

	BaseRail.prototype.setCurvePath = function() {
	  var track = this.getTrack();

	  this.curvePath = new CurvePath();

	  this.curvePath.curve = track.curve;

	  var tagA = this.getTagA(),
	    tagB = this.getTagB();

	  var pathTagA = new PathTag(tagA.name, tagA.distanceFromPointA),
	    pathTagB = new PathTag(tagB.name, tagB.distanceFromPointA);

	  this.curvePath.add(pathTagA);
	  this.curvePath.add(pathTagB);
	};

	BaseRail.prototype.getCurvePathByDirection = function(direction) {
	  return this.curvePath;
	};

	BaseRail.prototype.addTracks = function() {
	  if (!this.tracks) this.generateTracks();

	  this.add(this.tracks);
	};

	BaseRail.prototype.generateTracks = function() {
	  this.tracks = new THREE.Object3D();
	  this.tracks.name = 'tracks';

	  for (var i in this.jsonObj.trackList) {
	    var trackJsonObj = this.jsonObj.trackList[i];

	    if (trackJsonObj.radius == undefined || trackJsonObj.radius <= 0) {
	      this.tracks.add(new StraightTrack(trackJsonObj));
	    } else {
	      this.tracks.add(new CurvedTrack(trackJsonObj));
	    }
	  }
	};

	BaseRail.prototype.addTags = function() {
	  if (!this.tags) this.generateTags({displayed: true});

	  this.add(this.tags);
	};

	BaseRail.prototype.generateTags = function(options) {
	  var options = options || {};

	  this.tags = new THREE.Object3D();
	  this.tags.name = 'tags';

	  for (var i in this.jsonObj.tagList) {
	    var tagObj = this.jsonObj.tagList[i];

	    var tag = new Tag(tagObj, options);

	    tag.setPosition(this.tracks.getObjectByName(tagObj.trackSeq), options.displayed);

	    this.tags.add(tag);
	  }
	};

	BaseRail.prototype.addPointMarks = function() {
	  if (!this.pointMarks) this.generatePointMarks({displayed: true});

	  this.add(this.pointMarks);
	};

	BaseRail.prototype.generatePointMarks = function(options) {
	  var options = options || {};

	  this.pointMarks = new THREE.Object3D();
	  this.pointMarks.name = 'pointMarks';

	  let pointA = this.getPointA(),
	    pointB = this.getPointB();

	  let pointAMark = new PointMark(pointA.name, options);
	  pointAMark.setPosition(pointA, options.displayed);

	  let pointBMark = new PointMark(pointB.name, options);
	  pointBMark.setPosition(pointB, options.displayed);

	  if (pointAMark) this.pointMarks.add(pointAMark);
	  if (pointBMark) this.pointMarks.add(pointBMark);
	};

	BaseRail.prototype.getTrack = function() {
	  return this.getTrackA();
	};

	BaseRail.prototype.getTrackA = function() {
	  return this.getTrackByIndex(0);
	};

	BaseRail.prototype.getTrackByIndex = function(index) {
	  for (let i = 0; i < this.tracks.children.length; i++) {
	    let track = this.tracks.children[i];

	    if (index == track.index) {
	      return track;
	    }
	  }

	  // var trackList = this.jsonObj.trackList;
	  // var trackSeq;
	  //
	  // for (var i in trackList) {
	  //   if (index == trackList[i].trackIndex) {
	  //     trackSeq = trackList[i].trackSeq;
	  //   }
	  // }
	  //
	  // return this.getObjectByName(trackSeq);
	};

	BaseRail.prototype.getTagA = function() {
	  return this.getTagByIndex(0);
	};

	BaseRail.prototype.getTagB = function() {
	  return this.getTagByIndex(1);
	};

	BaseRail.prototype.getTags = function() {
	  let tags = [];

	  tags.push(this.getTagA());
	  tags.push(this.getTagB());

	  return tags;
	};

	BaseRail.prototype.getTagByIndex = function(index) {
	  for (let i = 0; i < this.tags.children.length; i++) {
	    let tag = this.tags.children[i];

	    if (index == tag.index) {
	      return tag;
	    }
	  }
	  //
	  // var tagList = this.jsonObj.tagList;
	  // var tagSeq;
	  //
	  // for (var i in tagList) {
	  //
	  //     tagSeq = tagList[i].tagSeq;
	  //   }
	  // }
	  //
	  // return this.getObjectByName(tagSeq);
	};

	BaseRail.prototype.getPointA = function() {
	  return this.getTrack().pointA;
	};

	BaseRail.prototype.getPointB = function() {
	  return this.getTrack().pointB;
	};

	BaseRail.prototype.getPoints = function() {
	  let points = [];

	  points.push(this.getPointA());
	  points.push(this.getPointB());

	  return points;
	};

	BaseRail.prototype.containsPoint = function(pointSeq) {
	  let points = this.getPoints();

	  for (let j in points) {
	    if (pointSeq == points[j].name) {
	      return true;
	    }
	  }

	  return false;
	};

	BaseRail.prototype.getGeometries = function() {
	  let geometries = [];

	  geometries.push(this.getTrack().geometry);

	  return geometries;
	};

	BaseRail.prototype.getLines = function() {
	  let lines = [];

	  lines.push(this.getTrack());

	  return lines;
	};

	// Deprecated
	BaseRail.prototype.getTagGeometries = function() {
	  let tagGeometries = [];

	  tagGeometries.push(this.getTagA().geometry);
	  tagGeometries.push(this.getTagB().geometry);

	  return tagGeometries;
	};

	// Deprecated
	BaseRail.prototype.getTagMeshes = function() {
	  let tagMeshes = [];

	  tagMeshes.push(this.getTagA());
	  tagMeshes.push(this.getTagB());

	  return tagMeshes;
	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function StraightRail(railJsonObj, options) {
	  BaseRail.call(this, railJsonObj, options);

	  this.type = this.jsonObj.type || KOVAN.STRAIGHT_RAIL;

	  this.name = this.jsonObj.railSeq;

	}

	StraightRail.prototype = Object.create(BaseRail.prototype);
	StraightRail.prototype.constructor = StraightRail;

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function CornerRail(railJsonObj, options) {
	    StraightRail.call(this, railJsonObj, options);

	    this.type = railJsonObj.type || KOVAN.CORNER_RAIL;

	}

	CornerRail.prototype = Object.create(StraightRail.prototype);
	CornerRail.prototype.constructor = CornerRail;

	CornerRail.prototype.setCurvePath = function() {
	    var trackA = this.getTrackA(),
	        trackB = this.getTrackB(),
	        trackC = this.getTrackC();

	    this.curvePath = new CurvePath();

	    var curveA = trackA.curve.curves[0];

	    var pointB_C = new THREE.Vector3();
	    pointB_C.subVectors(trackB.center, trackA.pointA);

	    var curveB = new THREE.EllipseCurve(
	        pointB_C.x, pointB_C.y,
	        trackB.radius, trackB.radius,
	        trackB.startAngle, trackB.endAngle,
	        trackB.clockwise,
	        0);

	    var pointC_A = new THREE.Vector3();
	    pointC_A.subVectors(trackB.pointB, trackA.pointA);
	    // pointC_A.add(trackA.vector);

	    var curveC = new THREE.LineCurve(
	        new THREE.Vector2(pointC_A.x, pointC_A.y),
	        new THREE.Vector2(pointC_A.x + trackC.vector.x, pointC_A.y + trackC.vector.y)
	    );

	    this.curvePath.curve.curves = [curveA, curveB, curveC];

	    var tagA = this.getTagA(),
	        tagB = this.getTagB();

	    var pathTagA = new PathTag(tagA.name, tagA.distanceFromPointA),
	        pathTagB = new PathTag(tagB.name, trackA.length + trackB.length + tagB.distanceFromPointA);

	    this.curvePath.add(pathTagA);
	    this.curvePath.add(pathTagB);
	};

	CornerRail.prototype.getTrackB = function() {
	    return this.getTrackByIndex(1);
	};

	CornerRail.prototype.getTrackC = function() {
	    return this.getTrackByIndex(2);
	};

	CornerRail.prototype.getPointB = function() {
	    return this.getTrackC().pointB;
	};

	CornerRail.prototype.getGeometries = function() {
	    let geometries = [];

	    geometries.push(this.getTrackA().geometry);
	    geometries.push(KOVAN.FillVertices(this.getTrackB().geometry));
	    geometries.push(this.getTrackC().geometry);

	    return geometries;
	};

	CornerRail.prototype.getLines = function() {
	    let lines = [];

	    lines.push(this.getTrackA());
	    lines.push(this.getTrackB());
	    lines.push(this.getTrackC());

	    return lines;
	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function SwitchRobot(switchJsonObj) {
	  THREE.Object3D.call(this);

	  this.type = switchJsonObj.type || 'SWITCH';

	  this.name = switchJsonObj.switchSeq;

	  this.jsonObj = switchJsonObj;

	  this.moduleSeq;

	  this.addRenderTracks();

	  this.currentPosition = 'AC';
	  this.switchPosition('AB');
	}

	SwitchRobot.prototype = Object.create(THREE.Object3D.prototype);
	SwitchRobot.prototype.constructor = SwitchRobot;

	SwitchRobot.prototype.getTrackAObj = function() {
	  return this.jsonObj.trackList[0];
	};

	SwitchRobot.prototype.getTrackBObj = function() {
	  return this.jsonObj.trackList[1];
	};

	SwitchRobot.prototype.getTrackCObj = function() {
	  return this.jsonObj.trackList[2];
	};

	SwitchRobot.prototype.addRenderTracks = function() {
	  this.generateRenderTrack(this.getTrackAObj(), 'A');
	  this.generateRenderTrack(this.getTrackBObj(), 'B');
	  this.generateRenderTrack(this.getTrackCObj(), 'C');
	};

	SwitchRobot.prototype.generateRenderTrack = function(trackObj, seq) {
	  // TODO: copy obj by a clone function
	  var trackJsonObj = JSON.parse(JSON.stringify(trackObj));

	  var vector = new THREE.Vector3();
	  var scale = 200 / trackObj.length;

	  vector.subVectors(new THREE.Vector3(trackObj.pointB.x, trackObj.pointB.y, trackObj.pointB.z), new THREE.Vector3(trackObj.pointA.x, trackObj.pointA.y, trackObj.pointA.z));

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

	  renderTrack.material = KOVAN.RenderTrackMaterial;

	  var annotation = renderTrack.getObjectByName('annotation');
	  renderTrack.remove(annotation);

	  this.add(renderTrack);
	};

	SwitchRobot.prototype.getRenderTrackA = function() {
	  return this.children[0];
	};

	SwitchRobot.prototype.getRenderTrackB = function() {
	  return this.children[1];
	};

	SwitchRobot.prototype.getRenderTrackC = function() {
	  return this.children[2];
	};

	SwitchRobot.prototype.switchPosition = function(position) {
	  if (this.currentPosition === position) {
	    if (KOVAN.INFO_ENABLED) console.info("Switch to the same position!");
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
	};

	SwitchRobot.prototype.togglePosition = function() {
	  this.getRenderTrackB.visible = !this.getRenderTrackB.visible;
	  this.getRenderTrackC.visible = !this.getRenderTrackC.visible;
	};

	SwitchRobot.prototype.getStatus = function() {
	  let status = {};

	  status.switchSeq = this.name;

	  status.currentPosition = this.currentPosition;

	  return status;
	};

	SwitchRobot.prototype.setStatus = function(status) {
	  setTimeout(() => this.switchPosition(status.currentPosition), 0); // make it async to reduce delay
	  // this.switchPosition(status.currentPosition);
	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function Switch(switchJsonObj, options) {
	    BaseRail.call(this, switchJsonObj, options);

	    this.type = switchJsonObj.type || KOVAN.SWITCH;

	    this.name = switchJsonObj.switchSeq;

	    // this.addRenderTracks();
	    this.switchRobot = new SwitchRobot(switchJsonObj);
	    // this.add(this.switchRobot);

	    // this.currentPosition = 'AC';
	    // this.switchPosition('AB');
	}

	Switch.prototype = Object.create(BaseRail.prototype);
	Switch.prototype.constructor = Switch;

	Switch.prototype.getReversedByDirection = function(direction) {
	    var reversed;

	    switch (direction) {
	        case "AB":
	            reversed = false;
	            break;

	        case "BA":
	            reversed = true;
	            break;

	        case "AC":
	            reversed = false;
	            break;

	        case "CA":
	            reversed = true;
	            break;
	        default:

	    }
	    return reversed;
	};

	Switch.prototype.getCurvePathByDirection = function(direction) {
	    var curve;

	    switch (direction) {
	        case "AB":
	            curve = this.curvePathAB;
	            break;

	        case "BA":
	            curve = this.curvePathAB;
	            break;

	        case "AC":
	            curve = this.curvePathAC;
	            break;

	        case "CA":
	            curve = this.curvePathAC;
	            break;
	        default:
	    }

	    return curve;
	};

	Switch.prototype.setCurvePath = function() {
	    var trackA = this.getTrackA(),
	        trackB = this.getTrackB(),
	        trackC = this.getTrackC(),
	        trackD = this.getTrackD();

	    var tagA = this.getTagA(),
	        tagB = this.getTagB(),
	        tagC = this.getTagC();

	    // AB
	    this.curvePathAB = new CurvePath();
	    var refPointAB = trackA.pointA;

	    var curveAB_A = trackA.curve.curves[0];

	    var pointAB_B_A = new THREE.Vector3();
	    pointAB_B_A.subVectors(trackA.pointB, refPointAB);

	    var curveAB_B = new THREE.LineCurve(
	        new THREE.Vector2(pointAB_B_A.x, pointAB_B_A.y),
	        new THREE.Vector2(pointAB_B_A.x + trackB.vector.x, pointAB_B_A.y + trackB.vector.y)
	    );

	    this.curvePathAB.curve.curves = [curveAB_A, curveAB_B];

	    var pathTagAB_A = new PathTag(tagA.name, tagA.distanceFromPointA),
	        pathTagAB_B = new PathTag(tagB.name, trackA.length + tagB.distanceFromPointA);

	    this.curvePathAB.add(pathTagAB_A);
	    this.curvePathAB.add(pathTagAB_B);

	    // AC
	    this.curvePathAC = new CurvePath();
	    var refPointAC = trackA.pointA;

	    var pointAC_B_C = new THREE.Vector3();
	    pointAC_B_C.subVectors(trackC.center, refPointAC);

	    var curveAC_B = new THREE.EllipseCurve(
	        pointAC_B_C.x, pointAC_B_C.y,
	        trackC.radius, trackC.radius,
	        trackC.startAngle, trackC.endAngle,
	        trackC.clockwise, 0
	    );

	    var pointAC_C_A = new THREE.Vector3();
	    pointAC_C_A.subVectors(trackD.pointA, refPointAC);

	    var curveAC_C = new THREE.LineCurve(
	        new THREE.Vector2(pointAC_C_A.x, pointAC_C_A.y),
	        new THREE.Vector2(pointAC_C_A.x + trackD.vector.x, pointAC_C_A.y + trackD.vector.y)
	    );

	    this.curvePathAC.curve.curves = [curveAB_A, curveAC_B, curveAC_C];

	    var pathTagAC_A = new PathTag(tagA.name, tagA.distanceFromPointA),
	        pathTagAC_C = new PathTag(tagC.name, trackA.length + trackC.length + tagC.distanceFromPointA);

	    this.curvePathAC.add(pathTagAC_A);
	    this.curvePathAC.add(pathTagAC_C);
	};

	Switch.prototype.addRenderTracks = function() {
	    for (var i in this.children) {
	        if (this.children[i].type != 'STRAIGHT_TRACK' && this.children[i].type != 'CURVED_TRACK')
	            continue;

	        var track = this.children[i],
	            trackSeq = track.name;

	        if (trackSeq.indexOf('A') > -1) {
	            this.trackASeq = trackSeq;
	            this.generateRenderTrack(track);
	        } else if (trackSeq.indexOf('B') > -1) {
	            this.trackBSeq = trackSeq;
	            this.generateRenderTrack(track);
	        } else if (trackSeq.indexOf('C') > -1) {
	            this.trackCSeq = trackSeq;
	            this.generateRenderTrack(track);
	        }
	    }
	};

	Switch.prototype.switchPosition = function(position) {
	    if (this.currentPosition === position) {
	        console.log("Switch to the same position!");
	        return;
	    }

	    switch (position) {
	        case "AB":
	            this.getObjectByName(this.trackBSeq + '_RD').visible = true;
	            this.getObjectByName(this.trackCSeq + '_RD').visible = false;
	            break;
	        case "AC":
	            this.getObjectByName(this.trackBSeq + '_RD').visible = false;
	            this.getObjectByName(this.trackCSeq + '_RD').visible = true;
	            break;
	        default:
	    }

	    this.currentPosition = position;
	};

	Switch.prototype.togglePosition = function() {
	    this.getObjectByName(this.trackBSeq + '_RD').visible = !this.getObjectByName(this.trackBSeq + '_RD').visible;
	    this.getObjectByName(this.trackCSeq + '_RD').visible = !this.getObjectByName(this.trackCSeq + '_RD').visible;
	};

	Switch.prototype.generateRenderTrack = function(track) {
	    // TODO: copy obj by a clone function
	    var trackJsonObj = JSON.parse(JSON.stringify(track.jsonObj));

	    var vector = new THREE.Vector3();
	    var scale = 200 / track.length;

	    if (trackJsonObj.trackSeq.indexOf("A") > -1) {
	        scale = 1 - scale;
	        vector.subVectors(track.pointB, track.pointA);
	        trackJsonObj.pointA.x = trackJsonObj.pointA.x + vector.x * scale;
	        trackJsonObj.pointA.y = trackJsonObj.pointA.y + vector.y * scale;
	        trackJsonObj.pointA.pointSeq += "_RD";
	    } else if (trackJsonObj.trackSeq.indexOf("B") > -1) {
	        vector.subVectors(track.pointB, track.pointA);
	        trackJsonObj.pointB.x = trackJsonObj.pointA.x + vector.x * scale;
	        trackJsonObj.pointB.y = trackJsonObj.pointA.y + vector.y * scale;
	        trackJsonObj.pointB.pointSeq += "_RD";
	    }

	    trackJsonObj.trackSeq += "_RD";

	    var renderTrack;
	    if (trackJsonObj.trackSeq.indexOf('C') > -1) {
	        renderTrack = new CurvedTrack(trackJsonObj);
	    } else {
	        renderTrack = new StraightTrack(trackJsonObj);
	    }

	    renderTrack.material = KOVAN.RenderTrackMaterial;

	    var annotation = renderTrack.getObjectByName('annotation');
	    renderTrack.remove(annotation);

	    this.add(renderTrack);
	};

	Switch.prototype.generatePointMarks = function(options) {
	    var options = options || {};

	    this.pointMarks = new THREE.Object3D();
	    this.pointMarks.name = 'pointMarks';

	    let pointA = this.getPointA(),
	        pointB = this.getPointB(),
	        pointC = this.getPointC();

	    let pointAMark = new PointMark(pointA.name, options);
	    pointAMark.setPosition(pointA, options.displayed);

	    let pointBMark = new PointMark(pointB.name, options);
	    pointBMark.setPosition(pointB, options.displayed);

	    let pointCMark = new PointMark(pointC.name, options);
	    pointCMark.setPosition(pointC, options.displayed);

	    if (pointAMark) this.pointMarks.add(pointAMark);
	    if (pointBMark) this.pointMarks.add(pointBMark);
	    if (pointCMark) this.pointMarks.add(pointCMark);
	};

	Switch.prototype.getTrackB = function() {
	    return this.getTrackByIndex(1);
	};

	Switch.prototype.getTrackC = function() {
	    return this.getTrackByIndex(2);
	};

	Switch.prototype.getTrackD = function() {
	    return this.getTrackByIndex(3);
	};

	Switch.prototype.getTagC = function() {
	    return this.getTagByIndex(2)
	};

	Switch.prototype.getTags = function() {
	    let tags = [];

	    tags.push(this.getTagA());
	    tags.push(this.getTagB());
	    tags.push(this.getTagC());

	    return tags;
	};

	Switch.prototype.getPointB = function() {
	    return this.getTrackB().pointB;
	};

	Switch.prototype.getPointC = function() {
	    return this.getTrackD().pointB;
	};

	Switch.prototype.getPoints = function() {
	    let points = [];

	    points.push(this.getPointA());
	    points.push(this.getPointB());
	    points.push(this.getPointC());

	    return points;
	};

	Switch.prototype.getGeometries = function() {
	    let geometries = [];

	    geometries.push(this.getTrackA().geometry);
	    geometries.push(this.getTrackB().geometry);
	    geometries.push(KOVAN.FillVertices(this.getTrackC().geometry));
	    geometries.push(this.getTrackD().geometry);

	    return geometries;
	};

	Switch.prototype.getLines = function() {
	    let lines = [];

	    lines.push(this.getTrackA());
	    lines.push(this.getTrackB());
	    lines.push(this.getTrackC());
	    lines.push(this.getTrackD());

	    return lines;
	};

	Switch.prototype.getTagGeometries = function() {
	    let tagGeometries = [];

	    tagGeometries.push(this.getTagA().geometry);
	    tagGeometries.push(this.getTagB().geometry);
	    tagGeometries.push(this.getTagC().geometry);

	    return tagGeometries;
	};

	Switch.prototype.getTagMeshes = function() {
	    let tagMeshes = [];

	    tagMeshes.push(this.getTagA());
	    tagMeshes.push(this.getTagB());
	    tagMeshes.push(this.getTagC());

	    return tagMeshes;
	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function RechargeArea0(rechargeAreaJsonObj, options) {
	    CornerRail.call(this, rechargeAreaJsonObj, options);

	    this.type = rechargeAreaJsonObj.type || KOVAN.RECHARGE_AREA;
	    this.name = rechargeAreaJsonObj.rechargeAreaSeq;
	}

	RechargeArea0.prototype = Object.create(CornerRail.prototype);
	RechargeArea0.prototype.constructor = RechargeArea0;

	RechargeArea0.prototype.getReversedByDirection = function(direction) {
	    var reversed;

	    switch (direction) {
	        case "AC":
	            reversed = false;
	            break;

	        case "CA":
	            reversed = true;
	            break;

	        default:

	    }

	    return reversed;
	};

	RechargeArea0.prototype.setCurvePath = function() {
	    var trackA = this.getTrackA(),
	        trackB = this.getTrackB(),
	        trackC = this.getTrackC();

	    this.curvePath = new CurvePath();

	    var curveA = trackA.curve.curves[0];

	    var pointB_C = new THREE.Vector3();
	    pointB_C.subVectors(trackB.center, trackA.pointA);

	    var curveB = new THREE.EllipseCurve(
	        pointB_C.x, pointB_C.y,
	        trackB.radius, trackB.radius,
	        trackB.startAngle, trackB.endAngle,
	        trackB.clockwise,
	        0);

	    var pointC_A = new THREE.Vector3();
	    pointC_A.subVectors(trackB.pointB, trackA.pointA);
	    // pointC_A.add(trackA.vector);

	    var curveC = new THREE.LineCurve(
	        new THREE.Vector2(pointC_A.x, pointC_A.y),
	        new THREE.Vector2(pointC_A.x + trackC.vector.x, pointC_A.y + trackC.vector.y)
	    );

	    this.curvePath.curve.curves = [curveA, curveB, curveC];

	    var tagA = this.getTagA(),
	        tagB = this.getTagB(),
	        tagC = this.getTagC();

	    var pathTagA = new PathTag(tagA.name, tagA.distanceFromPointA),
	        pathTagB = new PathTag(tagB.name, trackA.length + trackB.length + tagB.distanceFromPointA),
	        pathTagC = new PathTag(tagC.name, trackA.length + trackB.length + tagC.distanceFromPointA);

	    this.curvePath.add(pathTagA);
	    this.curvePath.add(pathTagB);
	    this.curvePath.add(pathTagC);
	};

	RechargeArea0.prototype.getTagC = function() {
	    return this.getTagByIndex(2);
	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function RechargeArea1(rechargeAreaJsonObj, options) {
	  CornerRail.call(this, rechargeAreaJsonObj, options);

	  this.type = rechargeAreaJsonObj.type || KOVAN.RECHARGE_AREA;
	  this.name = rechargeAreaJsonObj.rechargeAreaSeq;
	}

	RechargeArea1.prototype = Object.create(CornerRail.prototype);
	RechargeArea1.prototype.constructor = RechargeArea1;

	RechargeArea1.prototype.getReversedByDirection = function(direction) {
	    var reversed;

	    switch (direction) {
	        case "AC":
	            reversed = false;
	            break;

	        case "CA":
	            reversed = true;
	            break;

	        case "CB":
	            reversed = false;
	            break;
	        default:

	    }

	    return reversed;
	};

	RechargeArea1.prototype.setCurvePath = function() {
	  var trackA = this.getTrackA(),
	    trackB = this.getTrackB(),
	    trackC = this.getTrackC(),
	    trackD = this.getTrackD(),
	    trackE = this.getTrackE();

	  var tagA = this.getTagA(),
	    tagB = this.getTagB(),
	    tagC = this.getTagC();

	  this.curvePath = new CurvePath();

	  var refPoint = trackA.pointA;

	  var curveA = trackA.curve.curves[0];

	  var pointB_C = new THREE.Vector3();
	  pointB_C.subVectors(trackB.center, refPoint);

	  var curveB = new THREE.EllipseCurve(
	    pointB_C.x, pointB_C.y,
	    trackB.radius, trackB.radius,
	    trackB.startAngle, trackB.endAngle,
	    trackB.clockwise, 0
	  );

	  var pointC_A = new THREE.Vector3();
	  pointC_A.subVectors(trackC.pointA, refPoint);

	  var curveC = new THREE.LineCurve(
	    new THREE.Vector2(pointC_A.x, pointC_A.y),
	    new THREE.Vector2(pointC_A.x + trackC.vector.x, pointC_A.y + trackC.vector.y)
	  );

	  var pointD_C = new THREE.Vector3();
	  pointD_C.subVectors(trackD.center, refPoint);

	  var curveD = new THREE.EllipseCurve(
	    pointD_C.x, pointD_C.y,
	    trackD.radius, trackD.radius,
	    trackD.startAngle, trackD.endAngle,
	    trackD.clockwise, 0
	  );

	  var pointE_A = new THREE.Vector3();
	  pointE_A.subVectors(trackE.pointA, refPoint);

	  var curveE = new THREE.LineCurve(
	    new THREE.Vector2(pointE_A.x, pointE_A.y),
	    new THREE.Vector2(pointE_A.x + trackE.vector.x, pointE_A.y + trackE.vector.y)
	  );

	  this.curvePath.curve.curves = [curveA, curveB, curveC, curveD, curveE];

	  var pathTagA = new PathTag(tagA.name, tagA.distanceFromPointA),
	    pathTagB = new PathTag(tagB.name, trackA.length + trackB.length + trackC.length + trackD.length + tagB.distanceFromPointA),
	    pathTagC = new PathTag(tagC.name, trackA.length + trackB.length + trackC.length + trackD.length + tagC.distanceFromPointA);

	  this.curvePath.add(pathTagA);
	  this.curvePath.add(pathTagB);
	  this.curvePath.add(pathTagC);
	};

	RechargeArea1.prototype.getTagC = function() {
	  return this.getTagByIndex(2);
	};

	RechargeArea1.prototype.getTags = function() {
	  let tags = [];

	  tags.push(this.getTagA());
	  tags.push(this.getTagB());
	  tags.push(this.getTagC());

	  return tags;
	};

	RechargeArea1.prototype.getPointB = function() {
	  return this.getTrackE().pointB;
	};

	RechargeArea1.prototype.getTrackD = function() {
	  return this.getTrackByIndex(3);
	};

	RechargeArea1.prototype.getTrackE = function() {
	  return this.getTrackByIndex(4);
	};

	RechargeArea1.prototype.getGeometries = function() {
	    let geometries = [];

	    geometries.push(this.getTrackA().geometry);
	    geometries.push(KOVAN.FillVertices(this.getTrackB().geometry));
	    geometries.push(this.getTrackC().geometry);
	    geometries.push(KOVAN.FillVertices(this.getTrackD().geometry));
	    geometries.push(this.getTrackE().geometry);

	    return geometries;
	};

	RechargeArea1.prototype.getLines = function() {
	    let lines = [];

	    lines.push(this.getTrackA());
	    lines.push(this.getTrackB());
	    lines.push(this.getTrackC());
	    lines.push(this.getTrackD());
	    lines.push(this.getTrackE());

	    return lines;
	};

	(function () {
	  switch (VERSION) {
	      case 0:
	        exports.RechargeArea = RechargeArea0;
	        break;
	      case 1:
	          exports.RechargeArea = RechargeArea1;
	          break;
	      default:
	          console.warn(`Version ${VERSION} is not supported `);
	          exports.RechargeArea = RechargeArea1;
	  }
	})();

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function ShipmentArea(shipmentAreaJsonObj, options) {
	  StraightRail.call(this, shipmentAreaJsonObj, options);

	  this.type = this.jsonObj.type || KOVAN.SHIPMENT_AREA;

	  this.name = this.jsonObj.shipmentAreaSeq;

	  this.storageUnit;

	  // this.leftPusher;
	  // this.rightPusher;

	  this.dropoffLocation = 0.625;

	  // this.generatePicker();
	}

	ShipmentArea.prototype = Object.create(StraightRail.prototype);
	ShipmentArea.prototype.constructor = ShipmentArea;

	ShipmentArea.prototype.getTagC = function() {
	  return this.getTagByIndex(2);
	};

	ShipmentArea.prototype.getTags = function() {
	  let tags = [];

	  tags.push(this.getTagA());
	  tags.push(this.getTagB());
	  tags.push(this.getTagC());

	  return tags;
	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function StationDock(stationDockJsonObj, options) {
	    StraightRail.call(this, stationDockJsonObj, options);

	    this.type = this.jsonObj.type || KOVAN.STATION_DOCK;

	    this.name = this.jsonObj.stationDockSeq;
	}

	StationDock.prototype = Object.create(StraightRail.prototype);
	StationDock.prototype.constructor = StationDock;

	StationDock.prototype.getReversedByDirection = function(direction) {
	    return false;
	};

	StationDock.prototype.setCurvePath = function() {
	    var track = this.getTrack();

	    this.curvePath = new CurvePath();

	    this.curvePath.curve = track.curve;

	    var tagA = this.getTagA(),
	        tagB = this.getTagB(),
	        tagC = this.getTagC();

	    var pathTagA = new PathTag(tagA.name, tagA.distanceFromPointA),
	        pathTagB = new PathTag(tagB.name, tagB.distanceFromPointA),
	        pathTagC = new PathTag(tagC.name, tagC.distanceFromPointA);

	    this.curvePath.add(pathTagA);
	    this.curvePath.add(pathTagB);
	    this.curvePath.add(pathTagC);
	};

	StationDock.prototype.getTagC = function() {
	    return this.getTagByIndex(2)
	};

	StationDock.prototype.getTags = function() {
	    let tags = [];

	    tags.push(this.getTagA());
	    tags.push(this.getTagB());
	    tags.push(this.getTagC());

	    return tags;
	};

	StationDock.prototype.getTagGeometries = function() {
	    let tagGeometries = [];

	    tagGeometries.push(this.getTagA().geometry);
	    tagGeometries.push(this.getTagB().geometry);
	    tagGeometries.push(this.getTagC().geometry);

	    return tagGeometries;
	};

	StationDock.prototype.getTagMeshes = function() {
	    let tagMeshes = [];

	    tagMeshes.push(this.getTagA());
	    tagMeshes.push(this.getTagB());
	    tagMeshes.push(this.getTagC());

	    return tagMeshes;
	};

	StationDock.prototype.addStation = function() {
	  if (document) {
	    let reference = this.getTagC().position,
	    tangent = this.getTrack().curve.getTangentAt(0);

	    // box helper
	    let stationBox = new THREE.BoxHelper(KOVAN.StationMesh);
	    stationBox.name = 'station';

	    let angle = Math.atan(tangent.y / tangent.x);

	    let direction = KOVAN.RectifyAngle(angle + KOVAN.StationDirection);

	    stationBox.position.set(reference.x + KOVAN.StationWidth / 2 * Math.cos(direction), reference.y + KOVAN.StationWidth / 2 * Math.sin(direction), reference.z - KOVAN.StationHeight / 2);
	    stationBox.material.color.set(KOVAN.StationBoxColor);

	    this.station = stationBox;

	    // annotation
	    this.stationAnnotation = new Annotation('Station');
	    //  stationAnnotation.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(600, -500, -500));
	    this.stationAnnotation.setPosition(stationBox.position);
	  } else {
	    console.log(`${this.name}: not running in browser environment, station will not be created.`);
	  }
	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function BaseModule(jsonObj, options) {
	  BaseRail.call(this, jsonObj, options);

	  this.components = [];

	  this.addComponents();
	}

	BaseModule.prototype = Object.create(BaseRail.prototype);
	BaseModule.prototype.constructor = BaseModule;

	BaseModule.prototype.addComponents = function() {
	  for (let i = 0; i < this.jsonObj.componentList.length; i++) {
	    var componentJsonObj = this.jsonObj.componentList[i];

	    var componentType = componentJsonObj.type;
	    var component;
	    switch (componentType) {
	      case 'SWITCH':
	        component = new SwitchRobot(componentJsonObj);
	        break;

	      default:
	        console.error('Unsupported component type: ' + componentType);
	    }

	    this.components.push(component);
	  }
	};

	BaseModule.prototype.generatePointMarks = function(options) {
	  var options = options || {};

	  this.pointMarks = new THREE.Object3D();
	  this.pointMarks.name = 'pointMarks';

	  let pointA = this.getPointA(),
	    pointB = this.getPointB(),
	    pointC = this.getPointC(),
	    pointD = this.getPointD();

	  if (pointA) {
	    let pointAMark = new PointMark(pointA.name, options);
	    pointAMark.setPosition(pointA, options.displayed);
	    if (pointAMark) this.pointMarks.add(pointAMark);
	  }

	  if (pointB) {
	    let pointBMark = new PointMark(pointB.name, options);
	    pointBMark.setPosition(pointB, options.displayed);
	    if (pointBMark) this.pointMarks.add(pointBMark);

	  }

	  if (pointC) {
	    let pointCMark = new PointMark(pointC.name, options);
	    pointCMark.setPosition(pointC, options.displayed);
	    if (pointCMark) this.pointMarks.add(pointCMark);
	  }

	  if (pointD) {
	    let pointDMark = new PointMark(pointD.name, options);
	    pointDMark.setPosition(pointD, options.displayed);
	    if (pointDMark) this.pointMarks.add(pointDMark);
	  }

	};

	BaseModule.prototype.getPointC = function() {
	  console.log('Getting Point C');
	  return null;
	};

	BaseModule.prototype.getPointD = function() {
	  console.log('Getting Point D');
	  return null;
	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function Crossroad(crossroadJsonObj, options) {
	  BaseModule.call(this, crossroadJsonObj, options);

	  this.type = crossroadJsonObj.type || KOVAN.CROSSROAD;
	  this.name = crossroadJsonObj.crossroadSeq;
	}

	Crossroad.prototype = Object.create(BaseModule.prototype);
	Crossroad.prototype.constructor = Crossroad;

	Crossroad.prototype.getReferenceByDirection = function(direction) {
	  var reference;

	  switch (direction) {
	    case "BA":
	      reference = this.getPointA();
	      break;

	    case "CA":
	      reference = this.getPointA();
	      break;

	    case "AD":
	      reference = this.getPointA();
	      break;
	    default:
	  }

	  return reference;
	};

	Crossroad.prototype.getReversedByDirection = function(direction) {
	  var reversed;

	  switch (direction) {
	    case "BA":
	      reversed = true;
	      break;

	    case "CA":
	      reversed = true;
	      break;

	    case "AD":
	      reversed = false;
	      break;
	    default:

	  }

	  return reversed;
	};

	Crossroad.prototype.getCurvePathByDirection = function(direction) {
	  var curve;

	  switch (direction) {
	    case "BA":
	      curve = this.curvePathAB;
	      break;

	    case "CA":
	      curve = this.curvePathAC;
	      break;

	    case "AD":
	      curve = this.curvePathAD;
	      break;
	    default:
	  }

	  return curve;
	};

	Crossroad.prototype.setCurvePath = function() {
	  var trackA = this.getTrackA(),
	    trackB = this.getTrackB(),
	    trackC = this.getTrackC(),
	    trackD = this.getTrackD(),
	    trackE = this.getTrackE(),
	    trackF = this.getTrackF(),
	    trackG = this.getTrackG();

	  var tagA = this.getTagA(),
	    tagB = this.getTagB(),
	    tagC = this.getTagC(),
	    tagD = this.getTagD();

	  // AB
	  this.curvePathAB = new CurvePath();
	  var refPointAB = trackA.pointA;

	  var curveAB_A = trackA.curve.curves[0];

	  var pointAB_B_C = new THREE.Vector3();
	  pointAB_B_C.subVectors(trackC.center, refPointAB);

	  var curveAB_B = new THREE.EllipseCurve(
	    pointAB_B_C.x, pointAB_B_C.y,
	    trackC.radius, trackC.radius,
	    trackC.startAngle, trackC.endAngle,
	    trackC.clockwise, 0
	  );

	  var pointAB_C_A = new THREE.Vector3();
	  pointAB_C_A.subVectors(trackD.pointA, refPointAB);

	  var curveAB_C = new THREE.LineCurve(
	    new THREE.Vector2(pointAB_C_A.x, pointAB_C_A.y),
	    new THREE.Vector2(pointAB_C_A.x + trackD.vector.x, pointAB_C_A.y + trackD.vector.y)
	  );

	  this.curvePathAB.curve.curves = [curveAB_A, curveAB_B, curveAB_C];


	  var pathTagAB_A = new PathTag(tagA.name, tagA.distanceFromPointA),
	    pathTagAB_B = new PathTag(tagB.name, trackA.length + trackC.length + tagB.distanceFromPointA);

	  this.curvePathAB.add(pathTagAB_A);
	  this.curvePathAB.add(pathTagAB_B);

	  // AC
	  this.curvePathAC = new CurvePath();
	  var refPointAC = trackA.pointA;

	  var curveAC_A = trackA.curve.curves[0];

	  var pointAC_B_A = new THREE.Vector3();
	  pointAC_B_A.subVectors(trackB.pointA, refPointAC);

	  var curveAC_B = new THREE.LineCurve(
	    new THREE.Vector2(pointAC_B_A.x, pointAC_B_A.y),
	    new THREE.Vector2(pointAC_B_A.x + trackB.vector.x, pointAC_B_A.y + trackB.vector.y)
	  );

	  var pointAC_C_C = new THREE.Vector3();
	  pointAC_C_C.subVectors(trackF.center, refPointAC);

	  var curveAC_C = new THREE.EllipseCurve(
	    pointAC_C_C.x, pointAC_C_C.y,
	    trackF.radius, trackF.radius,
	    trackF.startAngle, trackF.endAngle,
	    trackF.clockwise, 0
	  );

	  var pointAC_D_A = new THREE.Vector3();
	  pointAC_D_A.subVectors(trackG.pointA, refPointAC);

	  var curveAC_D = new THREE.LineCurve(
	    new THREE.Vector2(pointAC_D_A.x, pointAC_D_A.y),
	    new THREE.Vector2(pointAC_D_A.x + trackG.vector.x, pointAC_D_A.y + trackG.vector.y)
	  );

	  this.curvePathAC.curve.curves = [curveAC_A, curveAC_B, curveAC_C, curveAC_D];

	  var pathTagAC_A = new PathTag(tagA.name, tagA.distanceFromPointA),
	    pathTagAC_B = new PathTag(tagC.name, trackA.length + trackB.length + trackF.length + tagC.distanceFromPointA);

	  this.curvePathAC.add(pathTagAC_A);
	  this.curvePathAC.add(pathTagAC_B);

	  // AD
	  this.curvePathAD = new CurvePath();
	  var refPointAD = trackA.pointA;

	  var curveAD_A = trackA.curve;

	  var pointAD_B_A = new THREE.Vector3();
	  pointAD_B_A.subVectors(trackB.pointA, refPointAD);

	  var curveAD_B = new THREE.LineCurve(
	    new THREE.Vector2(pointAD_B_A.x, pointAD_B_A.y),
	    new THREE.Vector2(pointAD_B_A.x + trackB.vector.x, pointAD_B_A.y + trackB.vector.y)
	  );

	  var pointAD_C_A = new THREE.Vector3();
	  pointAD_C_A.subVectors(trackE.pointA, refPointAD);

	  var curveAD_C = new THREE.LineCurve(
	    new THREE.Vector2(pointAD_C_A.x, pointAD_C_A.y),
	    new THREE.Vector2(pointAD_C_A.x + trackE.vector.x, pointAD_C_A.y + trackE.vector.y)
	  );

	  this.curvePathAD.curve.curves = [curveAD_A, curveAD_B, curveAD_C];

	  var pathTagAD_A = new PathTag(tagA.name, tagA.distanceFromPointA),
	    pathTagAD_B = new PathTag(tagD.name, trackA.length + trackB.length + tagD.distanceFromPointA);

	  this.curvePathAD.add(pathTagAD_A);
	  this.curvePathAD.add(pathTagAD_B);
	};

	Crossroad.prototype.generatePointMarks = function(options) {
	  var options = options || {};

	  this.pointMarks = new THREE.Object3D();
	  this.pointMarks.name = 'pointMarks';

	  let pointA = this.getPointA(),
	    pointB = this.getPointB(),
	    pointC = this.getPointC(),
	    pointD = this.getPointD();

	  if (pointA) {
	    let pointAMark = new PointMark(pointA.name, options);
	    pointAMark.setPosition(pointA, options.displayed);
	    if (pointAMark) this.pointMarks.add(pointAMark);
	  }

	  if (pointB) {
	    let pointBMark = new PointMark(pointB.name, options);
	    pointBMark.setPosition(pointB, options.displayed);
	    if (pointBMark) this.pointMarks.add(pointBMark);
	  }

	  if (pointC) {
	    let pointCMark = new PointMark(pointC.name, options);
	    pointCMark.setPosition(pointC, options.displayed);
	    if (pointCMark) this.pointMarks.add(pointCMark);
	  }

	  if (pointD) {
	    let pointDMark = new PointMark(pointD.name, options);
	    pointDMark.setPosition(pointD, options.displayed);
	    if (pointDMark) this.pointMarks.add(pointDMark);
	  }


	};

	Crossroad.prototype.getTrackB = function() {
	  return this.getTrackByIndex(1);
	};

	Crossroad.prototype.getTrackC = function() {
	  return this.getTrackByIndex(2);
	};

	Crossroad.prototype.getTrackD = function() {
	  return this.getTrackByIndex(3);
	};

	Crossroad.prototype.getTrackE = function() {
	  return this.getTrackByIndex(4);
	};

	Crossroad.prototype.getTrackF = function() {
	  return this.getTrackByIndex(5);
	};

	Crossroad.prototype.getTrackG = function() {
	  return this.getTrackByIndex(6);
	};

	Crossroad.prototype.getTagC = function() {
	  return this.getTagByIndex(2);
	};

	Crossroad.prototype.getTagD = function() {
	  return this.getTagByIndex(3);
	};

	Crossroad.prototype.getTags = function() {
	  let tags = [];

	  tags.push(this.getTagA());
	  tags.push(this.getTagB());
	  tags.push(this.getTagC());
	  tags.push(this.getTagD());

	  return tags;
	};

	Crossroad.prototype.getPointA = function() {
	  return this.getTrackA().pointA;
	};

	Crossroad.prototype.getPointB = function() {
	  return this.getTrackD().pointB;
	};

	Crossroad.prototype.getPointC = function() {
	  return this.getTrackG().pointB;
	};

	Crossroad.prototype.getPointD = function() {
	  return this.getTrackE().pointB;
	};

	Crossroad.prototype.getPoints = function() {
	  let points = [];

	  points.push(this.getPointA());
	  points.push(this.getPointB());
	  points.push(this.getPointC());
	  points.push(this.getPointD());

	  return points;
	};

	Crossroad.prototype.getGeometries = function() {
	    let geometries = [];

	    geometries.push(this.getTrackA().geometry);
	    geometries.push(this.getTrackB().geometry);
	    geometries.push(KOVAN.FillVertices(this.getTrackC().geometry));
	    geometries.push(this.getTrackD().geometry);
	    geometries.push(this.getTrackE().geometry);
	    geometries.push(KOVAN.FillVertices(this.getTrackF().geometry));
	    geometries.push(this.getTrackG().geometry);

	    return geometries;
	};

	Crossroad.prototype.getLines = function() {
	    let lines = [];

	    lines.push(this.getTrackA());
	    lines.push(this.getTrackB());
	    lines.push(this.getTrackC());
	    lines.push(this.getTrackD());
	    lines.push(this.getTrackE());
	    lines.push(this.getTrackF());
	    lines.push(this.getTrackG());

	    return lines;
	};

	Crossroad.prototype.getTagGeometries = function() {
	  let tagGeometries = [];

	  tagGeometries.push(this.getTagA().geometry);
	  tagGeometries.push(this.getTagB().geometry);
	  tagGeometries.push(this.getTagC().geometry);
	  tagGeometries.push(this.getTagD().geometry);

	  return tagGeometries;
	};

	Crossroad.prototype.getTagMeshes = function() {
	  let tagMeshes = [];

	  tagMeshes.push(this.getTagA());
	  tagMeshes.push(this.getTagB());
	  tagMeshes.push(this.getTagC());
	  tagMeshes.push(this.getTagD());

	  return tagMeshes;
	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function BaseFixedCarrier() {
	    BaseCarrier.call(this);
	}

	BaseFixedCarrier.prototype = Object.create(BaseCarrier.prototype);
	BaseFixedCarrier.prototype.constructor = BaseFixedCarrier;

	BaseFixedCarrier.prototype.setStopwatch = function(t, reversed) {
	    let division = Math.floor(this.trackLength * 10);

	    this.stopwatch = Math.floor(reversed ? (1 - t) * division : t * division);
	};

	BaseFixedCarrier.prototype.move = function(deltaTime, reversed, targetLocation) {

	    if (this.lastPosition == null) {
	        this.lastPosition = this.position.clone();
	    }

	    let division = Math.floor(this.trackLength * 10),
	        increment = division * this.speed * deltaTime * KOVAN.PLAY_SPEED / (this.trackLength * KOVAN.SECOND);

	    let t = this.stopwatch / division;

	    t = reversed ? 1 - t : t;

	    if ((!reversed && t < targetLocation) || (reversed && t > targetLocation)) {
	        this.position.copy(this.reference);
	        let point = this.curve.getPointAt(t);
	        this.position.x += point.x;
	        this.position.y += point.y;

	        this.stopwatch += increment;

	        let vector = new THREE.Vector3();
	        vector.subVectors(this.position, this.lastPosition);

	        this.onMove(vector);

	        this.lastPosition = this.position.clone();

	        return true;
	    } else {
	        this.updatePosition(targetLocation);

	        return false;
	    }
	};

	BaseFixedCarrier.prototype.onMove = function(vector) {
	  console.log('BaseFixedCarrier: onMove().');
	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function Pusher(pushArea, options) {
	    BaseFixedCarrier.call(this);

	    this.type = KOVAN.PUSHER;

	    this.pushArea = pushArea;

	    this.storageUnit;
	    this.side;

	    var options = options || {};

	    this.name = options.name || 'PS-UNKNOWN';

	    this.side = options.side;

	    this.length = options.length || KOVAN.PusherLength;
	    this.width = options.width || KOVAN.PusherWidth;
	    this.height = options.height || KOVAN.PusherHeight;

	    this.speedLimit = options.speedLimit || 2000;
	    this.acceleration = options.acceleration || 10000;

	    this.trackLength = this.pushArea.getCurvePathByDirection('AE').curve.getLength();

	    this.startLocation = options.startLocation || KOVAN.PusherStartDistance / this.trackLength;
	    this.endLocation = options.endLocation || KOVAN.PusherEndDistance / this.trackLength;

	    this.pushing = false;
	    this.resuming = false;
	    this.clearing = false;

	    this.armLength = options.armLength || this.length / 2;

	    this.geometry = options.geometry !== undefined ? options.geometry : new THREE.BoxGeometry(this.length, this.width, this.height);
	    if (options.material !== undefined) this.material = options.material;

	}

	Pusher.prototype = Object.create(BaseFixedCarrier.prototype);
	Pusher.prototype.constructor = Pusher;

	Pusher.prototype.push = function(deltaTime) {
	    // if (KOVAN.SECOND / deltaTime <= 10) return false;

	    if (!this.pushing) return false;

	    this.pushing = this.move(deltaTime, false, this.endLocation);

	    // Unbind Rack
	    // if (!this.pushing && this.rack) {
	    if (!this.pushing) this.onPushEnded();
	};

	Pusher.prototype.resume = function(deltaTime) {
	    // if (KOVAN.SECOND / deltaTime <= 10) return false;

	    if (!this.resuming) return false;

	    this.resuming = this.move(deltaTime, true, this.startLocation);
	};

	Pusher.prototype.clear = function(deltaTime) {
	    // if (KOVAN.SECOND / deltaTime < 0) return false;

	    if (!this.clearing) return false;

	    this.clearing = this.move(deltaTime, false);
	};

	Pusher.prototype.act = function(deltaTime) {
	    if (this.pushing) {
	        this.push(deltaTime);
	    } else if (this.resuming) {
	        this.resume(deltaTime);
	    } else if (this.clearing) {
	        this.clear(deltaTime);
	    }
	};

	Pusher.prototype.onStartPushRack = function(rack, speed) {
	    if (KOVAN.INFO_ENABLED) console.info(`${this.name} starts pushing rack.`);

	    if (this.resuming) {
	      this.updatePosition(this.startLocation);
	      this.resuming = false;
	    }

	    this.setRack(rack);
	    this.speed = speed;

	    this.setStopwatch(this.startLocation, false);

	    this.pushing = true;
	};

	Pusher.prototype.onStartResume = function(speed) {
	    if (KOVAN.INFO_ENABLED) console.info(`${this.name} starts returning.`);

	    if (this.pushing) {
	      this.updatePosition(this.endLocation);
	      this.pushing = false;
	      this.onPushEnded();
	    }

	    this.speed = speed;

	    this.setStopwatch(this.endLocation, true);

	    this.resuming = true;
	};

	Pusher.prototype.onPushEnded = function() {
	  this.storageUnit.removeRack(this.rack); // remove the rack from scene
	  this.rack = null;
	  this.storageUnit.storeRack(this.side);
	};

	Pusher.prototype.onMove = function(vector) {
	  if (this.pushing) this.updateRackPosition(vector);
	};

	Pusher.prototype.updateRackPosition = function(vector) {
	  if (!this.rack) console.error(`${this.name} is pushing with no rack `);
	  else this.rack.shift(vector);
	};

	Pusher.prototype.getStatus = function() {
	  let status = {};

	  status.pusherSeq = this.name;

	  status.pushing = this.pushing;
	  status.resuming = this.resuming;

	  status.stopwatch = this.stopwatch;

	  return status;
	};

	Pusher.prototype.setStatus = function(status) {
	  for (let i in status) {
	    if (i != 'pusherSeq') {
	      this[i] = status[i];
	    }
	  }

	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function PushArea0(pushAreaJsonObj, options) {
	    Crossroad.call(this, pushAreaJsonObj, options);

	    this.type = pushAreaJsonObj.type || KOVAN.PUSH_AREA;
	    this.name = pushAreaJsonObj.pushAreaSeq;

	    this.storageUnit;
	    this.side;

	    // this.generatePusher();
	}

	PushArea0.prototype = Object.create(Crossroad.prototype);
	PushArea0.prototype.constructor = PushArea0;

	PushArea0.prototype.generatePusher = function() {
	    var seq = KOVAN.ParseNumber(this.name),
	        pusherPrefix = "PS";

	    var pusherSeq = this.jsonObj.pusherSeq || pusherPrefix + KOVAN.Pad(seq, 2, 0);
	    var pusher = new Pusher(this, {
	        name: pusherSeq,
	        material: KOVAN.PusherMaterial
	    });

	    pusher.storageUnit = this.storageUnit;
	    pusher.side = this.side;

	    // pusher.generateAnnotation();

	    var curve = this.getCurvePathByDirection('BE').curve,
	        reference = this.getReferenceByDirection('BE'),
	        // offset = curve.getLength();
	        offset = 0;

	    pusher.setCurve(curve, reference, {
	        offset: offset
	    });

	    pusher.updatePosition(pusher.startLocation);

	    this.pusher = pusher;

	    this.storageUnit.map.pushers.add(this.pusher);

	    return pusher;
	};

	PushArea0.prototype.getReferenceByDirection = function(direction) {
	    var reference;

	    switch (direction) {
	        case "AB":
	            reference = this.getPointA();
	            break;

	        case "BD":
	            reference = this.getTrackB().pointB;
	            break;

	        case "DC":
	            reference = this.getPointC();
	            break;

	        case "BE":
	            reference = this.getTrackB().pointB;
	            break;

	        case "AE":
	            reference = this.getTrackA().pointB;
	            break;

	        default:
	    }

	    return reference;
	};

	PushArea0.prototype.getReversedByDirection = function(direction) {
	    var reversed;

	    switch (direction) {
	        case "AB":
	            reversed = false;
	            break;

	        case "BD":
	            reversed = false;
	            break;

	        case "DC":
	            reversed = true;
	            break;

	        case "BE":
	            reversed = false;
	            break;

	        case "AE":
	            curve = false;
	            break;

	        default:

	    }

	    return reversed;
	};

	PushArea0.prototype.getCurvePathByDirection = function(direction) {
	    var curve;

	    switch (direction) {
	        case "AB":
	            curve = this.curvePathAB;
	            break;

	        case "BD":
	            curve = this.curvePathBD;
	            break;

	        case "DC":
	            curve = this.curvePathCD;
	            break;

	        case "BE":
	            curve = this.curvePathBE;
	            break;

	        case "AE":
	            curve = this.curvePathAE;
	            break;

	        default:
	    }

	    return curve;
	};

	PushArea0.prototype.setCurvePath = function() {
	    var trackA = this.getTrackA(),
	        trackB = this.getTrackB(),
	        trackC = this.getTrackC(),
	        trackD = this.getTrackD(),
	        trackE = this.getTrackE(),
	        trackF = this.getTrackF(),
	        trackG = this.getTrackG();

	    var tagA = this.getTagA(),
	        tagB = this.getTagB(),
	        tagC = this.getTagC(),
	        tagD = this.getTagD();

	    // AB
	    this.curvePathAB = new CurvePath();
	    var refPointAB = trackA.pointB;

	    var curveAB_A = new THREE.LineCurve(
	        new THREE.Vector2(0, 0),
	        new THREE.Vector2(-trackA.vector.x, -trackA.vector.y)
	    );

	    var pointAB_B_A = new THREE.Vector3();
	    pointAB_B_A.subVectors(trackB.pointB, refPointAB);

	    var curveAB_B = new THREE.LineCurve(
	        new THREE.Vector2(pointAB_B_A.x, pointAB_B_A.y),
	        new THREE.Vector2(pointAB_B_A.x - trackB.vector.x, pointAB_B_A.y - trackB.vector.y)
	    );

	    var pointAB_C_C = new THREE.Vector3();
	    pointAB_C_C.subVectors(trackF.center, refPointAB);

	    var curveAB_C = new THREE.EllipseCurve(
	        pointAB_C_C.x, pointAB_C_C.y,
	        trackF.radius, trackF.radius,
	        trackF.startAngle, trackF.endAngle,
	        trackF.clockwise, 0
	    );

	    var pointAB_D_A = new THREE.Vector3();
	    pointAB_D_A.subVectors(trackG.pointA, refPointAB);

	    var curveAB_D = new THREE.LineCurve(
	        new THREE.Vector2(pointAB_D_A.x, pointAB_D_A.y),
	        new THREE.Vector2(pointAB_D_A.x + trackG.vector.x, pointAB_D_A.y + trackG.vector.y)
	    );

	    this.curvePathAB.curve.curves = [curveAB_A, curveAB_B, curveAB_C, curveAB_D];

	    var pathTagAB_A = new PathTag(tagA.name, trackA.length - tagA.distanceFromPointA),
	        pathTagAB_B = new PathTag(tagB.name, trackA.length + trackB.length - tagB.distanceFromPointA);

	    this.curvePathAB.add(pathTagAB_A);
	    this.curvePathAB.add(pathTagAB_B);

	    // BD
	    this.curvePathBD = new CurvePath();
	    var refPointBD = trackB.pointB;

	    var curveBD_A = new THREE.LineCurve(
	        new THREE.Vector2(0, 0),
	        new THREE.Vector2(-trackB.vector.x, -trackB.vector.y)
	    );

	    var pointBD_B_C = new THREE.Vector3();
	    pointBD_B_C.subVectors(trackF.center, refPointBD);

	    var curveBD_B = new THREE.EllipseCurve(
	        pointBD_B_C.x, pointBD_B_C.y,
	        trackF.radius, trackF.radius,
	        trackF.startAngle, trackF.endAngle,
	        trackF.clockwise, 0
	    );

	    var pointBD_C_A = new THREE.Vector3();
	    pointBD_C_A.subVectors(trackG.pointA, refPointBD);

	    var curveBD_C = new THREE.LineCurve(
	        new THREE.Vector2(pointBD_C_A.x, pointBD_C_A.y),
	        new THREE.Vector2(pointBD_C_A.x + trackG.vector.x, pointBD_C_A.y + trackG.vector.y)
	    );

	    this.curvePathBD.curve.curves = [curveBD_A, curveBD_B, curveBD_C];

	    var pathTagBD_A = new PathTag(tagB.name, tagB.distanceFromPointA),
	        pathTagBD_B = new PathTag(tagD.name, trackB.length + trackF.length + tagD.distanceFromPointA);

	    this.curvePathBD.add(pathTagBD_A);
	    this.curvePathBD.add(pathTagBD_B);

	    // CD
	    this.curvePathCD = new CurvePath();
	    var refPointDC = trackD.pointB;

	    var curveCD_A = new THREE.LineCurve(
	        new THREE.Vector2(0, 0),
	        new THREE.Vector2(-trackD.vector.x, -trackD.vector.y)
	    );

	    var pointCD_B_C = new THREE.Vector3();
	    pointCD_B_C.subVectors(trackC.center, refPointDC);

	    var curveCD_B = new THREE.EllipseCurve(
	        pointCD_B_C.x, pointCD_B_C.y,
	        trackC.radius, trackC.radius,
	        trackC.endAngle, trackC.startAngle, !trackC.clockwise, 0
	    );

	    var pointCD_C_A = new THREE.Vector3();
	    pointCD_C_A.subVectors(trackB.pointB, refPointDC);

	    var curveCD_C = new THREE.LineCurve(
	        new THREE.Vector2(pointCD_C_A.x, pointCD_C_A.y),
	        new THREE.Vector2(pointCD_C_A.x - trackB.vector.x, pointCD_C_A.y - trackB.vector.y)
	    );

	    var pointCD_D_C = new THREE.Vector3();
	    pointCD_D_C.subVectors(trackF.center, refPointDC);

	    var curveCD_D = new THREE.EllipseCurve(
	        pointCD_D_C.x, pointCD_D_C.y,
	        trackF.radius, trackF.radius,
	        trackF.startAngle, trackF.endAngle,
	        trackF.clockwise, 0
	    );

	    var pointCD_E_A = new THREE.Vector3();
	    pointCD_E_A.subVectors(trackG.pointA, refPointDC);

	    var curveCD_E = new THREE.LineCurve(
	        new THREE.Vector2(pointCD_E_A.x, pointCD_E_A.y),
	        new THREE.Vector2(pointCD_E_A.x + trackG.vector.x, pointCD_E_A.y + trackG.vector.y)
	    );

	    this.curvePathCD.curve.curves = [curveCD_A, curveCD_B, curveCD_C, curveCD_D, curveCD_E];

	    var pathTagCD_A = new PathTag(tagC.name, trackD.length - tagC.distanceFromPointA),
	        pathTagCD_B = new PathTag(tagB.name, trackD.length + trackC.length + trackB.length - tagB.distanceFromPointA),
	        pathTagCD_C = new PathTag(tagD.name, trackD.length + trackC.length + trackB.length + trackF.length + tagD.distanceFromPointA);

	    this.curvePathCD.add(pathTagCD_A);
	    this.curvePathCD.add(pathTagCD_B);
	    this.curvePathCD.add(pathTagCD_C);

	    // BE
	    this.curvePathBE = new CurvePath();
	    var refPointBE = trackB.pointB;

	    var pointBE_B_A = new THREE.Vector3();
	    pointBE_B_A.subVectors(trackE.pointA, refPointBE);

	    var curveBE_B = new THREE.LineCurve(
	        new THREE.Vector2(pointBE_B_A.x, pointBE_B_A.y),
	        new THREE.Vector2(pointBE_B_A.x + trackE.vector.x, pointBE_B_A.y + trackE.vector.y)
	    );

	    this.curvePathBE.curve.curves = [curveBD_A, curveBE_B];

	    // AE
	    this.curvePathAE = new CurvePath();
	    let refPointAE = trackA.pointB;

	    let pointAE_C_A = new THREE.Vector3();
	    pointAE_C_A.subVectors(trackE.pointA, refPointAE);

	    let curveAE_C = new THREE.LineCurve(
	        new THREE.Vector2(pointAE_C_A.x, pointAE_C_A.y),
	        new THREE.Vector2(pointAE_C_A.x + trackE.vector.x, pointAE_C_A.y + trackE.vector.y)
	    );

	    this.curvePathAE.curve.curves = [curveAB_A, curveAB_B, curveAE_C];
	};

	PushArea0.prototype.generatePointMarks = function(options) {
	    var options = options || {};

	    this.pointMarks = new THREE.Object3D();
	    this.pointMarks.name = 'pointMarks';

	    let pointA = this.getPointA(),
	        pointC = this.getPointC(),
	        pointD = this.getPointD(),
	        pointE = this.getPointE();

	    if (pointA) {
	        let pointAMark = new PointMark(pointA.name, options);
	        pointAMark.setPosition(pointA, options.displayed);
	        if (pointAMark) this.pointMarks.add(pointAMark);
	    }

	    if (pointC) {
	        let pointCMark = new PointMark(pointC.name, options);
	        pointCMark.setPosition(pointC, options.displayed);
	        if (pointCMark) this.pointMarks.add(pointCMark);
	    }

	    if (pointD) {
	        let pointDMark = new PointMark(pointD.name, options);
	        pointDMark.setPosition(pointD, options.displayed);
	        if (pointDMark) this.pointMarks.add(pointDMark);
	    }

	    if (pointE) {
	        let pointEMark = new PointMark(pointE.name, options);
	        pointEMark.setPosition(pointE, options.displayed);
	        if (pointEMark) this.pointMarks.add(pointEMark);
	    }
	};

	PushArea0.prototype.getPointA = function() {
	    return this.getTrackA().pointB;
	};

	PushArea0.prototype.getPointC = function() {
	    return this.getTrackD().pointB;
	};

	PushArea0.prototype.getPointD = function() {
	    return this.getTrackG().pointB;
	};

	PushArea0.prototype.getPointE = function() {
	    return this.getTrackE().pointB;
	};

	PushArea0.prototype.getPoints = function() {
	    let points = [];

	    points.push(this.getPointA());
	    points.push(this.getPointB());
	    points.push(this.getPointC());
	    points.push(this.getPointD());
	    points.push(this.getPointE());

	    return points;
	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function PushArea1(pushAreaJsonObj, options) {
	    Crossroad.call(this, pushAreaJsonObj, options);

	    this.type = pushAreaJsonObj.type || KOVAN.PUSH_AREA;
	    this.name = pushAreaJsonObj.pushAreaSeq;

	    this.storageUnit;
	    this.side;

	    // this.generatePusher();
	}

	PushArea1.prototype = Object.create(Crossroad.prototype);
	PushArea1.prototype.constructor = PushArea1;

	PushArea1.prototype.generatePusher = function() {
	    var seq = KOVAN.ParseNumber(this.name),
	        pusherPrefix = "PS";

	    var pusherSeq = this.storageUnit.getPusherSeqBySide(this.side) || pusherPrefix + KOVAN.Pad(seq, 2, 0);
	    var pusher = new Pusher(this, {
	        name: pusherSeq,
	        side: this.side,
	        geometry: KOVAN.PusherGeometry,
	        material: KOVAN.PusherMaterial
	    });

	    pusher.storageUnit = this.storageUnit;
	    pusher.side = this.side;

	    // pusher.generateAnnotation();

	    var curve = this.getCurvePathByDirection('AE').curve,
	        reference = this.getReferenceByDirection('AE'),
	        // offset = curve.getLength();
	        offset = 0;

	    pusher.setCurve(curve, reference, {
	        offset: offset
	    });

	    pusher.updatePosition(pusher.startLocation);

	    this.pusher = pusher;

	    this.storageUnit.map.pushers.add(this.pusher);

	    return pusher;
	};

	PushArea1.prototype.getReferenceByDirection = function(direction) {
	    var reference;

	    switch (direction) {
	        case "AB":
	            reference = this.getPointA();
	            break;

	        case "BD":
	            reference = this.getTrackB().pointB;
	            break;

	        case "DC":
	            reference = this.getPointC();
	            break;

	        case "BE":
	            reference = this.getTrackB().pointB;
	            break;

	        case "AE":
	            reference = this.getTrackA().pointB;
	            break;

	        default:
	    }

	    return reference;
	};

	PushArea1.prototype.getReversedByDirection = function(direction) {
	    var reversed;

	    switch (direction) {
	        case "AB":
	            reversed = false;
	            break;

	        case "BD":
	            reversed = false;
	            break;

	        case "DC":
	            reversed = true;
	            break;

	        case "BE":
	            reversed = false;
	            break;

	        case "AE":
	            reversed = false;
	            break;

	        default:

	    }

	    return reversed;
	};

	PushArea1.prototype.getCurvePathByDirection = function(direction) {
	    var curve;

	    switch (direction) {
	        case "AB":
	            curve = this.curvePathAB;
	            break;

	        case "BD":
	            curve = this.curvePathBD;
	            break;

	        case "DC":
	            curve = this.curvePathCD;
	            break;

	        case "BE":
	            curve = this.curvePathBE;
	            break;

	        case "AE":
	            curve = this.curvePathAE;
	            break;

	        default:
	    }

	    return curve;
	};

	PushArea1.prototype.setCurvePath = function() {
	    var trackA = this.getTrackA(),
	        trackB = this.getTrackB(),
	        trackC = this.getTrackC(),
	        trackD = this.getTrackD(),
	        trackE = this.getTrackE(),
	        trackF = this.getTrackF(),
	        trackG = this.getTrackG(),
	        trackH = this.getTrackH();

	    var tagA = this.getTagA(),
	        tagB = this.getTagB(),
	        tagC = this.getTagC(),
	        tagD = this.getTagD();

	    // AB
	    this.curvePathAB = new CurvePath();
	    var refPointAB = trackA.pointB;

	    var curveAB_A = new THREE.LineCurve(
	        new THREE.Vector2(0, 0),
	        new THREE.Vector2(-trackA.vector.x, -trackA.vector.y)
	    );

	    var pointAB_B_A = new THREE.Vector3();
	    pointAB_B_A.subVectors(trackB.pointB, refPointAB);

	    var curveAB_B = new THREE.LineCurve(
	        new THREE.Vector2(pointAB_B_A.x, pointAB_B_A.y),
	        new THREE.Vector2(pointAB_B_A.x - trackB.vector.x, pointAB_B_A.y - trackB.vector.y)
	    );

	    var pointAB_C_C = new THREE.Vector3();
	    pointAB_C_C.subVectors(trackF.center, refPointAB);

	    var curveAB_C = new THREE.EllipseCurve(
	        pointAB_C_C.x, pointAB_C_C.y,
	        trackF.radius, trackF.radius,
	        trackF.startAngle, trackF.endAngle,
	        trackF.clockwise, 0
	    );

	    var pointAB_D_C = new THREE.Vector3();
	    pointAB_D_C.subVectors(trackG.center, refPointAB);

	    var curveAB_D = new THREE.EllipseCurve(
	        pointAB_D_C.x, pointAB_D_C.y,
	        trackG.radius, trackG.radius,
	        trackG.startAngle, trackG.endAngle,
	        trackG.clockwise, 0
	    );

	    var pointAB_E_A = new THREE.Vector3();
	    pointAB_E_A.subVectors(trackH.pointA, refPointAB);

	    var curveAB_E = new THREE.LineCurve(
	        new THREE.Vector2(pointAB_E_A.x, pointAB_E_A.y),
	        new THREE.Vector2(pointAB_E_A.x + trackH.vector.x, pointAB_E_A.y + trackH.vector.y)
	    );

	    this.curvePathAB.curve.curves = [curveAB_A, curveAB_B, curveAB_C, curveAB_D, curveAB_E];

	    var pathTagAB_A = new PathTag(tagA.name, trackA.length - tagA.distanceFromPointA),
	        pathTagAB_B = new PathTag(tagB.name, trackA.length + trackB.length - tagB.distanceFromPointA);

	    this.curvePathAB.add(pathTagAB_A);
	    this.curvePathAB.add(pathTagAB_B);

	    // BD
	    this.curvePathBD = new CurvePath();
	    var refPointBD = trackB.pointB;

	    var curveBD_A = new THREE.LineCurve(
	        new THREE.Vector2(0, 0),
	        new THREE.Vector2(-trackB.vector.x, -trackB.vector.y)
	    );

	    var pointBD_B_C = new THREE.Vector3();
	    pointBD_B_C.subVectors(trackF.center, refPointBD);

	    var curveBD_B = new THREE.EllipseCurve(
	        pointBD_B_C.x, pointBD_B_C.y,
	        trackF.radius, trackF.radius,
	        trackF.startAngle, trackF.endAngle,
	        trackF.clockwise, 0
	    );

	    var pointBD_C_C = new THREE.Vector3();
	    pointBD_C_C.subVectors(trackG.center, refPointBD);

	    var curveBD_C = new THREE.EllipseCurve(
	        pointBD_C_C.x, pointBD_C_C.y,
	        trackG.radius, trackG.radius,
	        trackG.startAngle, trackG.endAngle,
	        trackG.clockwise, 0
	    );

	    var pointBD_D_A = new THREE.Vector3();
	    pointBD_D_A.subVectors(trackH.pointA, refPointBD);

	    var curveBD_D = new THREE.LineCurve(
	        new THREE.Vector2(pointBD_D_A.x, pointBD_D_A.y),
	        new THREE.Vector2(pointBD_D_A.x + trackH.vector.x, pointBD_D_A.y + trackH.vector.y)
	    );

	    this.curvePathBD.curve.curves = [curveBD_A, curveBD_B, curveBD_C, curveBD_D];

	    var pathTagBD_A = new PathTag(tagB.name, tagB.distanceFromPointA),
	        pathTagBD_B = new PathTag(tagD.name, trackB.length + trackF.length + trackG.length + tagD.distanceFromPointA);

	    this.curvePathBD.add(pathTagBD_A);
	    this.curvePathBD.add(pathTagBD_B);

	    // CD
	    this.curvePathCD = new CurvePath();
	    var refPointCD = trackD.pointB;

	    var curveCD_A = new THREE.LineCurve(
	        new THREE.Vector2(0, 0),
	        new THREE.Vector2(-trackD.vector.x, -trackD.vector.y)
	    );

	    var pointCD_B_C = new THREE.Vector3();
	    pointCD_B_C.subVectors(trackC.center, refPointCD);

	    var curveCD_B = new THREE.EllipseCurve(
	        pointCD_B_C.x, pointCD_B_C.y,
	        trackC.radius, trackC.radius,
	        trackC.endAngle, trackC.startAngle, !trackC.clockwise, 0
	    );

	    var pointCD_C_A = new THREE.Vector3();
	    pointCD_C_A.subVectors(trackB.pointB, refPointCD);

	    var curveCD_C = new THREE.LineCurve(
	        new THREE.Vector2(pointCD_C_A.x, pointCD_C_A.y),
	        new THREE.Vector2(pointCD_C_A.x - trackB.vector.x, pointCD_C_A.y - trackB.vector.y)
	    );

	    var pointCD_D_C = new THREE.Vector3();
	    pointCD_D_C.subVectors(trackF.center, refPointCD);

	    var curveCD_D = new THREE.EllipseCurve(
	        pointCD_D_C.x, pointCD_D_C.y,
	        trackF.radius, trackF.radius,
	        trackF.startAngle, trackF.endAngle,
	        trackF.clockwise, 0
	    );

	    var pointCD_E_C = new THREE.Vector3();
	    pointCD_E_C.subVectors(trackG.center, refPointCD);

	    var curveCD_E = new THREE.EllipseCurve(
	        pointCD_E_C.x, pointCD_E_C.y,
	        trackG.radius, trackG.radius,
	        trackG.startAngle, trackG.endAngle,
	        trackG.clockwise, 0
	    );

	    var pointCD_F_A = new THREE.Vector3();
	    pointCD_F_A.subVectors(trackH.pointA, refPointCD);

	    var curveCD_F = new THREE.LineCurve(
	        new THREE.Vector2(pointCD_F_A.x, pointCD_F_A.y),
	        new THREE.Vector2(pointCD_F_A.x + trackH.vector.x, pointCD_F_A.y + trackH.vector.y)
	    );

	    this.curvePathCD.curve.curves = [curveCD_A, curveCD_B, curveCD_C, curveCD_D, curveCD_E, curveCD_F];

	    var pathTagCD_A = new PathTag(tagC.name, trackD.length - tagC.distanceFromPointA),
	        pathTagCD_B = new PathTag(tagB.name, trackD.length + trackC.length + trackB.length - tagB.distanceFromPointA),
	        pathTagCD_C = new PathTag(tagD.name, trackD.length + trackC.length + trackB.length + trackF.length + trackG.length + tagD.distanceFromPointA);

	    this.curvePathCD.add(pathTagCD_A);
	    this.curvePathCD.add(pathTagCD_B);
	    this.curvePathCD.add(pathTagCD_C);

	    // BE
	    this.curvePathBE = new CurvePath();
	    var refPointBE = trackB.pointB;

	    var pointBE_B_A = new THREE.Vector3();
	    pointBE_B_A.subVectors(trackE.pointA, refPointBE);

	    var curveBE_B = new THREE.LineCurve(
	        new THREE.Vector2(pointBE_B_A.x, pointBE_B_A.y),
	        new THREE.Vector2(pointBE_B_A.x + trackE.vector.x, pointBE_B_A.y + trackE.vector.y)
	    );

	    this.curvePathBE.curve.curves = [curveBD_A, curveBE_B];

	    // AE
	    this.curvePathAE = new CurvePath();
	    let refPointAE = trackA.pointB;

	    let pointAE_C_A = new THREE.Vector3();
	    pointAE_C_A.subVectors(trackE.pointA, refPointAE);

	    let curveAE_C = new THREE.LineCurve(
	      new THREE.Vector2(pointAE_C_A.x, pointAE_C_A.y),
	      new THREE.Vector2(pointAE_C_A.x + trackE.vector.x, pointAE_C_A.y + trackE.vector.y)
	    );

	    this.curvePathAE.curve.curves = [curveAB_A, curveAB_B, curveAE_C];

	};

	PushArea1.prototype.generatePointMarks = function(options) {
	    var options = options || {};

	    this.pointMarks = new THREE.Object3D();
	    this.pointMarks.name = 'pointMarks';

	    let pointA = this.getPointA(),
	        pointC = this.getPointC(),
	        pointD = this.getPointD(),
	        pointE = this.getPointE();

	    if (pointA) {
	        let pointAMark = new PointMark(pointA.name, options);
	        pointAMark.setPosition(pointA, options.displayed);
	        if (pointAMark) this.pointMarks.add(pointAMark);
	    }

	    if (pointC) {
	        let pointCMark = new PointMark(pointC.name, options);
	        pointCMark.setPosition(pointC, options.displayed);
	        if (pointCMark) this.pointMarks.add(pointCMark);
	    }

	    if (pointD) {
	        let pointDMark = new PointMark(pointD.name, options);
	        pointDMark.setPosition(pointD, options.displayed);
	        if (pointDMark) this.pointMarks.add(pointDMark);
	    }

	    if (pointE) {
	        let pointEMark = new PointMark(pointE.name, options);
	        pointEMark.setPosition(pointE, options.displayed);
	        if (pointEMark) this.pointMarks.add(pointEMark);
	    }
	};

	PushArea1.prototype.getTrackH = function() {
	    return this.getTrackByIndex(7);
	};

	PushArea1.prototype.getPointA = function() {
	    return this.getTrackA().pointB;
	};

	PushArea1.prototype.getPointC = function() {
	    return this.getTrackD().pointB;
	};

	PushArea1.prototype.getPointD = function() {
	    return this.getTrackH().pointB;
	};

	PushArea1.prototype.getPointE = function() {
	    return this.getTrackE().pointB;
	};

	PushArea1.prototype.getPoints = function() {
	    let points = [];

	    points.push(this.getPointA());
	    points.push(this.getPointB());
	    points.push(this.getPointC());
	    points.push(this.getPointD());
	    points.push(this.getPointE());

	    return points;
	};

	PushArea1.prototype.getGeometries = function() {
	    let geometries = [];

	    geometries.push(this.getTrackA().geometry);
	    geometries.push(this.getTrackB().geometry);
	    geometries.push(KOVAN.FillVertices(this.getTrackC().geometry));
	    geometries.push(this.getTrackD().geometry);
	    geometries.push(this.getTrackE().geometry);
	    geometries.push(KOVAN.FillVertices(this.getTrackF().geometry));
	    geometries.push(this.getTrackG().geometry);
	    geometries.push(KOVAN.FillVertices(this.getTrackH().geometry));

	    return geometries;
	};

	PushArea1.prototype.getLines = function() {
	    let lines = [];

	    lines.push(this.getTrackA());
	    lines.push(this.getTrackB());
	    lines.push(this.getTrackC());
	    lines.push(this.getTrackD());
	    lines.push(this.getTrackE());
	    lines.push(this.getTrackF());
	    lines.push(this.getTrackG());
	    lines.push(this.getTrackH());

	    return lines;
	};

	(function () {
	  switch (VERSION) {
	      case 0:
	          exports.PushArea = PushArea0;
	          break;
	      case 1:
	          exports.PushArea = PushArea1;
	          break;
	      default:
	          console.warn(`Version ${VERSION} is not supported `);
	          exports.PushArea = PushArea1;
	  }
	})();

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	 function EscalatorPort(portJsonObj, options) {
	   BaseRail.call(this, portJsonObj, options);

	   this.type = this.jsonObj.type || KOVAN.ESCALATOR_PORT;
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
	};

	EscalatorPort.prototype.generateTracks = function() {
	  this.tracks = new THREE.Object3D();
	  this.tracks.name = 'tracks';

	  for (let i = 0 ; i < this.jsonObj.trackList.length; i++) {
	    var trackJsonObj = this.jsonObj.trackList[i];

	    var baseTrack = new StraightTrack(trackJsonObj);
	    baseTrack.visible = false;

	    var displayLength = ( this.jsonObj.length - this.jsonObj.carLength ) / 2,
	      directionA = this.jsonObj.direction,
	      directionB = KOVAN.RectifyAngle(directionA + Math.PI);

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
	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function EscalatorCar(carJsonObj, options) {
	  BaseRail.call(this, carJsonObj, options);

	  this.type = this.jsonObj.type || KOVAN.ESCALATOR_CAR;
	  this.name = this.jsonObj.carSeq;

	  this.carNum = this.jsonObj.carNum;
	  this.length = this.jsonObj.length;

	  this.escalatorSeq = this.jsonObj.escalatorSeq;
	  this.floorNum;

	  this.mover;

	  this.setTrackMaterial();

	  this.setVisible(false);
	}

	EscalatorCar.prototype = Object.create(BaseRail.prototype);
	EscalatorCar.prototype.constructor = EscalatorCar;

	EscalatorCar.prototype.initialize = function() {
	  this.addTracks();
	  this.addTags();
	  this.addPointMarks();
	  this.setCurvePath();
	};

	EscalatorCar.prototype.setCurvePath = function() {
	  var track = this.getTrack();

	  this.curvePath = new CurvePath();

	  this.curvePath.curve = track.curve;

	  var tag = this.getTagA();

	  var pathTag = new PathTag(tag.name, tag.distanceFromPointA);

	  this.curvePath.add(pathTag);
	};

	EscalatorCar.prototype.setTrackMaterial = function() {
	  var track = this.getTrack();

	  track.material = KOVAN.RenderTrackMaterial;
	};

	EscalatorCar.prototype.setFloorNum = function(floorNum) {
	  this.floorNum = floorNum;
	};

	EscalatorCar.prototype.getVisible = function() {
	  var track = this.getTrack();

	  return track.visbile;
	};

	EscalatorCar.prototype.setVisible = function(visible) {
	  // for (var i in this.tracks.children) {
	  //   this.tracks.children[i].visible = visible;
	  // }
	  this.visible = visible;
	};

	EscalatorCar.prototype.setZ = function(z) {
	  // track
	  var track = this.getTrack();

	  track.setZ(z);

	  // point mark
	  var pointAMark = this.getObjectByName(this.getPointA().name),
	    pointBMark = this.getObjectByName(this.getPointB().name);

	  pointAMark.position.z = z;
	  pointBMark.position.z = z;

	  // tag
	  var tag = this.getTagA();
	  tag.position.z = z;
	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function Escalator(escalatorObj) {
	    THREE.Object3D.call(this);

	    this.jsonObj = escalatorObj;

	    this.type = this.jsonObj.type || KOVAN.ESCALATOR;
	    this.name = this.jsonObj.escalatorSeq;

	    this.numOfFloors = this.jsonObj.numOfFloors;
	    this.floorHeight = this.jsonObj.floorHeight || 2000;
	    if (this.jsonObj.up != null) {
	        this.up = this.jsonObj.up;
	    } else {
	        this.up = true;
	    }

	    this.reversed = !this.up; // default direction is up.

	    this.numOfCars = this.jsonObj.numOfCars || this.numOfFloors + 2;
	    this.carNumOnFirstFloor = 1;

	    this.portLength = this.jsonObj.portLength || 2000;
	    this.carLength = this.jsonObj.carLength || 1000;

	    this.carPathExtension = 0.2; // buffer path at each end
	    this.tMin = (1 - 0.2) / (this.numOfFloors + 2);
	    this.tMax = 1 - this.tMin;

	    this.centerDatumZ = this.getChannelObjByNum(1).trackList[0].pointA.z - this.floorHeight;

	    this.addPorts();
	    this.addCars();
	    this.setCarPath();

	    // movement
	    this.escalating = false; // use this flag instead of acceleration to control the movement.

	    this.speed = 500; // ignore acceleration and deceleration, use constant speed
	    this.acceleration = 200; // NOT used
	    this.speedLimit = 500;

	    this.division = Math.floor(this.floorHeight * 10);

	    this.stopwatch;
	    this.resetStopwatch();
	    this.alignCars(this.carNumOnFirstFloor);
	}

	Escalator.prototype = Object.create(THREE.Object3D.prototype);
	Escalator.prototype.constructor = Escalator;

	Escalator.prototype.addPorts = function() {
	    var portList = this.jsonObj.portList;

	    this.ports = new THREE.Object3D();
	    this.ports.name = 'ports';
	    this.add(this.ports);

	    for (var i in portList) {
	        var portObj = portList[i];

	        this.ports.add(new EscalatorPort(portObj));
	    }
	};

	Escalator.prototype.addCars = function() {
	    var carList = this.jsonObj.carList;

	    this.cars = new THREE.Object3D();
	    this.cars.name = 'cars';
	    this.add(this.cars);

	    // add all cars
	    for (var i in carList) {
	        var carObj = carList[i];

	        var car = new EscalatorCar(carObj);

	        this.cars.add(car);
	    }
	};

	Escalator.prototype.setCarPath = function() {
	    this.carPath = new THREE.CurvePath();

	    for (let i = 1; i <= this.numOfFloors; i++) {
	        var channelObj = this.getChannelObjByNum(i);

	        var absPointA = channelObj.trackList[0].pointA,
	            absPointB = channelObj.trackList[0].pointB;

	        var pointAOffset = absPointA.z - this.centerDatumZ,
	            pointBOffset = absPointB.z - this.centerDatumZ;

	        // add buffer curve at bottom
	        if (i == 1) {
	            var bottomBufferCurve = new THREE.LineCurve(
	                new THREE.Vector2(0, 0),
	                new THREE.Vector2(0, pointAOffset)
	            );

	            this.carPath.add(bottomBufferCurve);
	        }

	        // add curve of each channel
	        var curve = new THREE.LineCurve(
	            new THREE.Vector2(0, pointAOffset),
	            new THREE.Vector2(0, pointBOffset)
	        );

	        this.carPath.add(curve);

	        // add buffer curve at top
	        if (i == this.numOfFloors) {
	            var topOffset = pointBOffset + this.floorHeight;

	            var topBufferCurve = new THREE.LineCurve(
	                new THREE.Vector2(0, pointBOffset),
	                new THREE.Vector2(0, topOffset)
	            );

	            this.carPath.add(topBufferCurve);
	        }
	    }

	};

	Escalator.prototype.alignCars = function(carNumOnFirstFloor) {
	    this.carNumOnFirstFloor = carNumOnFirstFloor;

	    for (let i = 0; i <= this.numOfFloors + 1; i++) {

	        var car = this.getCarByNum(this.rectifyCarNum(i - 1 + carNumOnFirstFloor));

	        car.setFloorNum(i);
	        car.setVisible(true);
	    }

	    this.updateCarPosition();
	};

	Escalator.prototype.escalate = function(deltaTime) {
	    if (KOVAN.SECOND / deltaTime <= 10 || !this.escalating) return false;
	    // accelerate
	    // this.accelerate(deltaTime);

	    // run stopwatch
	    var increment = this.division * this.speed * deltaTime * KOVAN.PLAY_SPEED / (this.floorHeight * KOVAN.SECOND);

	    this.stopwatch += increment;

	    if (this.stopwatch / this.division > 1) {
	        this.proceedToNextFloor();
	    }

	    // escalate cars
	    this.updateCarPosition();

	};

	Escalator.prototype.setUp = function(up) {
	    this.up = up;
	    this.reversed = !this.up;

	    this.resetStopwatch();
	};

	Escalator.prototype.resetStopwatch = function() {
	  this.stopwatch = this.up ? this.division : 0;
	};

	Escalator.prototype.onAligned = function(carNum) {
	    if (this.stopwatch / this.division > 1) {
	        this.proceedToNextFloor();
	      }

	    this.stopwatch = this.stopwatch / this.division > 0.5 ? this.division : 0;

	    if (this.carNumOnFirstFloor != carNum) {
	      this.resetStopwatch();
	      this.alignCars(carNum);
	    }

	    this.escalating = false;

	    this.updateCarPosition();
	};

	Escalator.prototype.proceedToNextFloor = function() {
	    if (KOVAN.INFO_ENABLED) console.info('proceeding to next floor...');
	    var change = this.reversed ? -1 : 1;

	    var nextCarNum = null;

	    for (let i = 1; i <= this.numOfCars; i++) {
	        var car = this.getCarByNum(i);

	        var floorNum = car.floorNum;
	        if (floorNum != null) {
	            if (car.carNum != nextCarNum) {
	                car.setFloorNum(floorNum + change);
	            }

	            if (nextCarNum == null) {
	                var carNum = car.carNum,
	                    nextCar;

	                if (car.floorNum == 1 && !this.reversed) {
	                    if (carNum > 1) {
	                        nextCar = this.getCarByNum(carNum - 1);
	                    } else {
	                        nextCar = this.getCarByNum(this.numOfCars);
	                    }

	                    nextCar.setFloorNum(0);
	                    nextCarNum = nextCar.carNum;

	                } else if (car.floorNum == this.numOfFloors && this.reversed) {
	                    if (carNum < this.numOfCars) {
	                        nextCar = this.getCarByNum(carNum + 1);
	                    } else {
	                        nextCar = this.getCarByNum(1);
	                    }

	                    nextCar.setFloorNum(this.numOfFloors + 1);
	                    nextCarNum = nextCar.carNum;
	                }
	            }
	        }
	    }

	    this.stopwatch = 0;
	    this.carNumOnFirstFloor = this.rectifyCarNum(this.carNumOnFirstFloor - change);
	    if (KOVAN.LOG_ENABLED) console.log(this.carNumOnFirstFloor);
	};

	Escalator.prototype.updateCarPosition = function() {
	    var tempT = this.stopwatch / this.division;
	    tempT = this.reversed ? 1 - tempT : tempT;

	    for (let i = 1; i <= this.numOfCars; i++) {
	        var car = this.getCarByNum(i);

	        var floorNum = car.floorNum;
	        if (floorNum != null) {
	            var t = (floorNum + tempT) / (this.numOfFloors + 2);

	            if (this.tMin <= t && t <= this.tMax) {
	                var z = this.carPath.getPointAt(t).y;

	                car.setZ(z + this.centerDatumZ);

	                if (!car.getVisible()) {
	                    car.setVisible(true);
	                }
	            } else if (0 <= t && t <= 1) {
	                car.setVisible(false);
	            } else {
	                car.setFloorNum(null);
	            }
	        }
	    }
	};

	Escalator.prototype.getPortByFloorNum = function(floorNum) {
	    for (let i = 0; i < this.ports.children.length; i++) {
	        let port = this.ports.children[i];

	        if (floorNum == port.floorNum) {
	            return port;
	        }
	    }
	};

	Escalator.prototype.getCarByNum = function(carNum) {
	    for (let i = 0; i < this.cars.children.length; i++) {
	        let car = this.cars.children[i];

	        if (carNum == car.carNum) {
	            return car;
	        }
	    }
	};

	Escalator.prototype.getChannelObjByNum = function(floorNum) {
	    var channelList = this.jsonObj.channelList;

	    for (var i in channelList) {
	        var channelObj = channelList[i];

	        if (floorNum == channelObj.floorNum) {
	            return channelObj;
	        }
	    }
	};

	Escalator.prototype.getStatus = function() {
	  let status = {};

	  status.escalatorSeq = this.name;

	  status.up = this.up;
	  status.escalating = this.escalating;
	  status.stopwatch = this.stopwatch;

	  status.carNumOnFirstFloor =  this.carNumOnFirstFloor;

	  return status;
	};

	Escalator.prototype.setStatus = function(status) {
	  this.escalating = status.escalating;
	  this.stopwatch = status.stopwatch;

	  this.setUp(status.up);

	  this.alignCars(status.carNumOnFirstFloor);
	};

	Escalator.prototype.rectifyCarNum = function(carNum) {
	    return carNum % this.numOfCars <= 0 ? (carNum % this.numOfCars + this.numOfCars) % (this.numOfCars + 1) : carNum % this.numOfCars;
	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	// TODO
	function Picker(storageUnit, options) {
	    BaseFixedCarrier.call(this);

	    this.type = KOVAN.PICKER;

	    this.storageUnit = storageUnit;
	    this.shipmentArea;

	    var options = options || {};

	    this.name = options.name || 'PK-UNKNOWN';

	    this.length = options.length || KOVAN.PickerLength;
	    this.width = options.width || KOVAN.PickerWidth;
	    this.height = options.height || KOVAN.PickerHeight;

	    // DEPRECATED: Use constant speed
	    //  this.speedLimit = options.speedLimit || 2000;
	    //  this.acceleration = options.acceleration || 10000;

	    this.trackLength = this.storageUnit.getPickerTrack().length;
	    this.reference = this.storageUnit.getPickerTrack().pointA;
	    this.storageUnitWidth = this.storageUnit.getWidth();
	    // this.leftStorageTrackLength = this.storageUnit.getLeftStorageTrack().length;
	    // this.rightStorageTrackLength = this.storageUnit.getRightStorageTrack().length;

	    this.standbyLocation = options.standybyLocation || KOVAN.PickerStandbyDistance / this.trackLength;
	    this.dropoffLocations = options.dropoffLocations || KOVAN.PickerDropoffDistances.map((a) => {
	        return a / this.trackLength
	    });

	    this.pickInfo = {};

	    this.retrieving = false;
	    this.picking = false;
	    this.returning = false;
	    this.dropping = false;
	    this.leaving = false;

	    this.armLength = options.armLength || this.length / 2;

	    this.pickingSpeed = options.pickingSpeed || KOVAN.PickingSpeed;

	    this.geometry = options.geometry !== undefined ? options.geometry : new THREE.BoxGeometry(this.length, this.width, this.height);
	    if (options.material !== undefined) this.material = options.material;

	}

	Picker.prototype = Object.create(BaseFixedCarrier.prototype);
	Picker.prototype.constructor = Picker;

	Picker.prototype.act = function(deltaTime) {
	    if (this.retrieving) this.retrieve(deltaTime);
	    else if (this.picking) this.pick(deltaTime);
	    else if (this.returning) this.return(deltaTime);
	    else if (this.dropping) this.dropoff(deltaTime);
	    else if (this.leaving) this.leave(deltaTime);
	};

	Picker.prototype.retrieve = function(deltaTime) {
	    if (!this.retrieving) return false;

	    if (KOVAN.LOG_ENABLED) console.log(`${this.name} is retrieving.`);

	    this.retrieving = this.move(deltaTime, false, this.pickInfo.pickLocation);
	};

	Picker.prototype.pick = function(deltaTime, _t) {
	    if (!this.picking) return false;

	    if (KOVAN.LOG_ENABLED) console.log(`${this.name} is picking.`);

	    let division = Math.floor(this.currentPickingLength * 10),
	        increment = division * this.pickingSpeed * deltaTime * KOVAN.PLAY_SPEED / (this.currentPickingLength * KOVAN.SECOND);

	    let t = _t || this.pickStopwatch / division;

	    if (t <= 1) {
	        this.rack.position.copy(this.currentPickingReference);
	        let point = this.currentPickingCurve.getPointAt(t);
	        this.rack.position.x += point.x;
	        this.rack.position.y += point.y;

	        if (t == 1) {
	            this.picking = false;
	        } else {
	            this.pickStopwatch += increment;
	        }
	    } else {
	        this.pickStopwatch = division;
	    }
	};

	Picker.prototype.return = function(deltaTime) {
	    if (!this.returning) return false;

	    if (KOVAN.LOG_ENABLED) console.log(`${this.name} is returning.`);

	    this.returning = this.move(deltaTime, true, this.standbyLocation);
	};

	Picker.prototype.dropoff = function(deltaTime) {
	    if (!this.dropping) return false;

	    if (KOVAN.LOG_ENABLED) console.log(`${this.name} is dropping off.`);

	    this.dropping = this.move(deltaTime, true, this.pickInfo.dropoffLocation);
	};

	Picker.prototype.leave = function(deltaTime) {
	    if (!this.leaving) return false;

	    if (KOVAN.LOG_ENABLED) console.log(`${this.name} is leaving.`);

	    this.leaving = this.move(deltaTime, false, this.standbyLocation);
	};

	Picker.prototype.onStartRetrive = function(rackSeq, rackSide, rackIndex, speed) {
	    if (KOVAN.INFO_ENABLED) console.info(`${this.name} starts retrieving.`);

	    this.pickInfo.rackSeq = rackSeq;
	    this.pickInfo.rackSide = rackSide;
	    this.pickInfo.rackIndex = rackIndex;
	    this.speed = speed;

	    let rackPosition = this.storageUnit.getRackPosition(rackSide, rackIndex);

	    if (rackPosition) {
	      this.pickInfo.rackLocationIndex = rackPosition.rackLocationIndex;
	      this.pickInfo.pickLocation = (rackPosition.rackDistance + this.trackLength - this.storageUnit.getStorageTrackBySide(rackSide).length + this.armLength) / this.trackLength;

	      this.setStopwatch(this.standbyLocation, false);

	      this.retrieving = true;
	    } else {
	      console.error(`${this.name}: there are no enough racks in its storage (storage unit: ${this.storageUnit.name}, rackSeq: ${rackSeq}, side: ${rackSide}, rackIndex: ${rackIndex}).`);
	    }

	};

	Picker.prototype.onStartPick = function() {
	    if (KOVAN.INFO_ENABLED) console.info(`${this.name} starts picking.`);

	    if (this.retrieving) {
	        this.updatePosition(this.pickInfo.pickLocation);
	        this.retrieving = false;
	    }

	    // setTimeout(() => {
	    if (KOVAN.INFO_ENABLED) console.info(`${this.name} actually starts picking.`);

	    let rack = this.storageUnit.pickRack(this.pickInfo.rackSide, this.pickInfo.rackLocationIndex, this.pickInfo.rackSeq);

	    if (rack) {
	      this.setRack(rack);

	      this.pickStopwatch = 0;
	      this.picking = true;

	      this.setPickingTrack();
	    } else {
	      console.error(`${this.name} failed to pick rack from storage unit.`);
	    }

	    // }, KOVAN.PickingDelay);

	};

	Picker.prototype.onStartReturn = function(speed) {
	    if (KOVAN.INFO_ENABLED) console.info(`${this.name} starts returning.`);

	    if (this.picking) this.pick(0, 1);

	    this.speed = speed;

	    this.setStopwatch(this.pickInfo.pickLocation, true);

	    this.returning = true;
	};

	Picker.prototype.onStartDropoff = function(dropoffLocationIndex, speed) {
	    if (KOVAN.INFO_ENABLED) console.info(`${this.name} starts dropping off.`);

	    if (this.returning) {
	        this.updatePosition(this.standbyLocation);
	        this.returning = false;
	    }

	    this.pickInfo.dropoffLocation = this.dropoffLocations[dropoffLocationIndex];
	    this.speed = speed;

	    this.setStopwatch(this.standbyLocation, true);

	    this.dropping = true;
	};

	Picker.prototype.onStartLeave = function(speed) {
	    if (KOVAN.INFO_ENABLED) console.info(`${this.name} starts leaving.`);

	    if (this.dropping) {
	        this.updatePosition(this.pickInfo.dropoffLocation);
	        this.dropping = false;
	    }


	    if (speed) this.speed = speed;

	    this.setStopwatch(this.pickInfo.dropoffLocation, false);

	    //reset pick info
	    this.pickInfo = {};

	    this.leaving = true;
	};

	Picker.prototype.setPickingTrack = function() {
	  switch (this.pickInfo.rackSide) {
	      case KOVAN.LEFT:
	          this.currentPickingTrack = this.leftPickingTrack;
	          break;
	      case KOVAN.RIGHT:
	          this.currentPickingTrack = this.rightPickingTrack;
	          break;
	      default:
	          console.error(`${this.name}: invalid side (${this.pickInfo.rackSide})`);
	  }
	  this.currentPickingCurve = this.currentPickingTrack.curve;
	  this.currentPickingLength = this.currentPickingTrack.length;
	  this.currentPickingReference = this.currentPickingTrack.pointA;
	};

	Picker.prototype.onMove = function(vector) {
	  this.updatePickingTracksPosition(vector);

	  if (this.returning || this.dropping) this.updateRackPosition(vector);
	};

	Picker.prototype.updatePickingTracksPosition = function(vector) {
	    this.leftPickingTrack.shift(vector);
	    this.rightPickingTrack.shift(vector);
	};

	Picker.prototype.updateRackPosition = function(vector) {
	    if (!this.rack) {
	        console.error(`${this.name} is returning/dropping off with no rack.`);
	    } else {
	        this.rack.shift(vector);
	    }
	};

	Picker.prototype.addPickingTracks = function() {
	    // point B
	    let tangent = this.curve.getTangentAt(0),
	        angle = Math.atan(tangent.y / tangent.x);

	    let direction = KOVAN.RectifyAngle(angle + Math.PI);

	    let pointBObj = {
	        x: this.position.x + this.armLength * Math.cos(direction),
	        y: this.position.y + this.armLength * Math.sin(direction),
	        z: this.position.z
	    };

	    // left picking track
	    let leftPickingTrackSeq = `LPT${this.name}`,
	        leftPickingTrackDirection = KOVAN.RectifyAngle(angle + Math.PI / 2);

	    let leftPickingTrackObj = this.generatePickingTrackObj(leftPickingTrackSeq, pointBObj, leftPickingTrackDirection);

	    // right picking track
	    let rightPickingTrackSeq = `RPT${this.name}`,
	        rightPickingTrackDirection = KOVAN.RectifyAngle(angle - Math.PI / 2);

	    let rightPickingTrackObj = this.generatePickingTrackObj(rightPickingTrackSeq, pointBObj, rightPickingTrackDirection);

	    this.leftPickingTrack = new StraightTrack(leftPickingTrackObj);
	    this.rightPickingTrack = new StraightTrack(rightPickingTrackObj);
	};

	Picker.prototype.generatePickingTrackObj = function(trackSeq, pointBObj, direction) {
	    let length = this.storageUnitWidth / 2;

	    let trackObj = {};

	    let trackPointBObj = JSON.parse(JSON.stringify(pointBObj));
	    trackPointBObj.pointSeq = `PTB${trackSeq}`;

	    let trackPointAObj = {
	        x: trackPointBObj.x + length * Math.cos(direction),
	        y: trackPointBObj.y + length * Math.sin(direction),
	        z: trackPointBObj.z
	    };
	    trackPointAObj.pointSeq = `PTA${trackSeq}`;

	    trackObj.trackSeq = trackSeq;
	    trackObj.trackType = "STRAIGHT_TRACK";
	    trackObj.nodeSeq = this.name;
	    trackObj.nodeType = "PICKER";
	    trackObj.pointA = trackPointAObj;
	    trackObj.pointB = trackPointBObj;
	    trackObj.length = length;

	    return trackObj;
	};

	Picker.prototype.getStatus = function() {
	  let status = {};

	  status.pickerSeq = this.name;

	  status.pickInfo = this.pickInfo;

	  status.retrieving = this.retrieving;
	  status.picking = this.picking;
	  status.returning = this.returning;
	  status.dropping = this.dropping;
	  status.leaving = this.leaving;

	  status.speed = this.speed;

	  status.pickStopwatch = this.pickStopwatch;
	  status.stopwatch = this.stopwatch;

	  status.lastPosition = this.lastPosition;

	  return status;
	};

	Picker.prototype.setStatus = function(status) {
	  // if (status.rackSeq) this.pickInfo.rackSeq = status.rackSeq;
	  // if (status.rackSide) this.pickInfo.rackSide = status.rackSide;
	  // if (status.rackIndex) this.pickInfo.rackIndex = status.rackIndex;
	  // if (status.rackLocationIndex) this.pickInfo.rackLocationIndex = status.rackLocationIndex;
	  //
	  // if (status.pickLocation) this.pickInfo.pickLocation = status.pickLocation;
	  // if (status.dropoffLocation) this.pickInfo.dropoffLocation = status.dropoffLocation;
	  //
	  // this.retrieving = this.retrieving;
	  // this.picking = this.picking;
	  // this.returning = this.returning;
	  // this.dropping = this.dropping;
	  // this.leaving = this.leaving;
	  //
	  // this.speed = this.speed;
	  //
	  // this.pickStopwatch = this.pickStopwatch;
	  // this.stopwatch = this.stopwatch;
	  for (let i in status) {
	    if (i != 'pickerSeq') {
	      this[i] = status[i];
	    }
	  }

	  if (this.picking) {
	    this.setPickingTrack();
	  }

	};

	// DEPRECATED
	Picker.prototype.pickRack = function(rack) {
	    this.rack = rack;

	    this.rack.setCurve(this.storageUnit.getCurvePathByDirection('BA').curve, this.storageUnit.getReferenceByDirection('BA'), {
	        t: 0.75
	    });
	};

	// DEPRECATED
	Picker.prototype.dropoffRack = function() {
	    this.rack.setCurve(this.shipmentArea.getCurvePathByDirection('BA').curve, this.shipmentArea.getReferenceByDirection('BA'), {
	        t: this.shipmentArea.dropoffLocation
	    });

	    this.rack = null;
	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function StorageUnit(storageUnitObj, map, options) {
	    BaseRail.call(this, storageUnitObj, options);

	    this.map = map;

	    this.type = storageUnitObj.type || "STORAGE_UNIT";

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

	        this.updateStorageRack(KOVAN.LEFT);
	    }


	    // right storage
	    if (currentRightStorageCount > this.rightStorageCapacity) {
	        console.error(`${this.name}: right storage count exceeded capacity (${currentRightStorageCount} > ${this.rightStorageCapacity})`);
	    } else {
	        for (let i = 0; i < currentRightStorageCount; i++) {
	            this.rightStorageIndices[i] = 1;
	        }

	        this.currentRightStorageCount = currentRightStorageCount;

	        this.updateStorageRack(KOVAN.RIGHT);
	    }
	};

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
	};

	StorageUnit.prototype.pickRack = function(side, index, rackSeq) {
	    let storageIndices = this.getStorageIndexBySide(side);

	    if (storageIndices[index] == 0) {
	        console.error(`${this.name}: picker tries to pick from empty location (side: ${side}, index: ${index})`);
	    } else {
	        storageIndices[index] = 0;

	        this.changeCurrentStorageCountBySide(side, -1);
	        this.updateStorageRack(side);

	        return this.createRack(side, index, rackSeq);
	    }
	};

	StorageUnit.prototype.createRack = function(side, index, rackSeq) {
	    let storageTrack = this.getStorageTrackBySide(side),
	        reference = storageTrack.pointA,
	        curve = storageTrack.curve;

	    let rack = new Rack(KOVAN.RackGeometry, KOVAN.RackMaterial);
	    rack.name = rackSeq;
	    // rack.generateAnnotation();
	    if (KOVAN.ShowRackAnnotation) rack.toggleAnnotationDisplay(KOVAN.ShowRackAnnotation);

	    let distance = (KOVAN.RackLength + KOVAN.RackGap) * index + KOVAN.RackLength / 2,
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
	};

	StorageUnit.prototype.removeRack =  function(rack) {
	  this.map.racks.remove(rack);
	};

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

	    let racksGeometry = new THREE.Geometry();

	    for (let i = 0; i < storageCapacity; i++) {
	        let distance = (KOVAN.RackLength + KOVAN.RackGap) * i + KOVAN.RackLength / 2;
	        let t = distance / storageTrack.length;


	        let point = curve.getPointAt(t);

	        let rackGeometry = KOVAN.RackGeometry;

	        let rackMesh = new THREE.Mesh(rackGeometry);
	        rackMesh.position.copy(reference);
	        rackMesh.position.x += point.x;
	        rackMesh.position.y += point.y;

	        rackMesh.rotation.z = angle;

	        rackMesh.updateMatrix();
	        racksGeometry.merge(rackGeometry, rackMesh.matrix);
	    }

	    for (let i = 0; i < racksGeometry.faces.length; i++) {
	        racksGeometry.faces[i].materialIndex = storageIndices[Math.floor(i / KOVAN.FACES_PER_BOX)];
	    }

	    racksGeometry.sortFacesByMaterialIndex();

	    storageRacks = new THREE.Mesh(racksGeometry, KOVAN.StorageRackMaterial);
	    storageRacks.name = storageRacksName;

	    this.map.add(storageRacks);
	};

	StorageUnit.prototype.generatePicker = function() {
	    var prefix = 'PK',
	        seq = KOVAN.ParseNumber(this.name);

	    var pickerSeq = this.pickerSeq || prefix + KOVAN.Pad(seq, 2, 0);
	    var picker = new Picker(this, {
	        name: pickerSeq,
	        geometry: KOVAN.PickerGeometry,
	        material: KOVAN.PickerMaterial
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
	};

	StorageUnit.prototype.setCurvePath = function() {
	    let pickerTrack = this.getPickerTrack();

	    this.curvePath = new CurvePath();

	    this.curvePath.curve = pickerTrack.curve;
	};

	StorageUnit.prototype.changeCurrentStorageCountBySide = function(side, change) {
	    switch (side) {
	        case KOVAN.LEFT:
	            this.currentLeftStorageCount += change;
	            break;
	        case KOVAN.RIGHT:
	            this.currentRightStorageCount += change;
	            break;
	        default:
	            console.error(`${this.name}: invalid side (${side})`);
	    }
	};

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
	            rackPosition.rackDistance = (KOVAN.RackLength + KOVAN.RackGap) * i + KOVAN.RackLength / 2;
	            break;
	          }
	        }
	    }

	    return rackPosition;
	};

	StorageUnit.prototype.getStorageCapacityBySide = function(side) {
	    let storageCapacity;

	    switch (side) {
	        case KOVAN.LEFT:
	            storageCapacity = this.leftStorageCapacity;
	            break;
	        case KOVAN.RIGHT:
	            storageCapacity = this.rightStorageCapacity;
	            break;
	        default:
	            console.error(`${this.name}: invalid side (${side})`);
	    }

	    return storageCapacity;
	};

	StorageUnit.prototype.getCurrentStorageCountBySide = function(side) {
	    let currentStorageCount;

	    switch (side) {
	        case KOVAN.LEFT:
	            currentStorageCount = this.currentLeftStorageCount;
	            break;
	        case KOVAN.RIGHT:
	            currentStorageCount = this.currentRightStorageCount;
	            break;
	        default:
	            console.error(`${this.name}: invalid side (${side})`);
	    }

	    return currentStorageCount;
	};

	StorageUnit.prototype.getStorageIndexBySide = function(side) {
	    let storageIndices;

	    switch (side) {
	        case KOVAN.LEFT:
	            storageIndices = this.leftStorageIndices;
	            break;
	        case KOVAN.RIGHT:
	            storageIndices = this.rightStorageIndices;
	            break;
	        default:
	            console.error(`${this.name}: invalid side (${side})`);
	    }

	    return storageIndices;
	};

	StorageUnit.prototype.getStorageTrackBySide = function(side) {
	    let storageTrack;

	    switch (side) {
	        case KOVAN.LEFT:
	            storageTrack = this.getLeftStorageTrack();
	            break;
	        case KOVAN.RIGHT:
	            storageTrack = this.getRightStorageTrack();
	            break;
	        default:
	            console.error(`${this.name}: invalid side (${side})`);
	    }

	    return storageTrack;
	};

	StorageUnit.prototype.getStorageRacksNameBySide = function(side) {
	    let storageRacksName;

	    switch (side) {
	        case KOVAN.LEFT:
	            storageRacksName = 'leftStorageRacks-' + this.name;
	            break;
	        case KOVAN.RIGHT:
	            storageRacksName = 'rightStorageRacks-' + this.name;
	            break;
	        default:
	            console.error(`${this.name}: invalid side (${side})`);
	    }

	    return storageRacksName;
	};

	StorageUnit.prototype.getPusherSeqBySide = function(side) {
	    switch (side) {
	        case KOVAN.LEFT:
	            return this.leftPusherSeq;
	            break;
	        case KOVAN.RIGHT:
	            return this.rightPusherSeq;
	            break;
	        default:
	            console.error(`${this.name}: invalid side (${side})`);
	    }
	};

	StorageUnit.prototype.getWidth = function() {
	    let leftStorageTrack = this.getLeftStorageTrack(),
	        rightStorageTrack = this.getRightStorageTrack();

	    let leftStorageTrackPointA = leftStorageTrack.pointA,
	        rightStorageTrackPointA = rightStorageTrack.pointA;

	    return Math.sqrt(Math.pow(leftStorageTrackPointA.x - rightStorageTrackPointA.x, 2) + Math.pow(leftStorageTrackPointA.y - rightStorageTrackPointA.y, 2));
	};

	StorageUnit.prototype.getPickerTrack = function() {
	    return this.getTrackByIndex(0);
	};

	StorageUnit.prototype.getLeftStorageTrack = function() {
	    return this.getTrackByIndex(1);
	};

	StorageUnit.prototype.getRightStorageTrack = function() {
	    return this.getTrackByIndex(2);
	};

	StorageUnit.prototype.getGeometries = function() {
	    let geometries = [];

	    geometries.push(this.getPickerTrack().geometry);
	    geometries.push(this.getLeftStorageTrack().geometry);
	    geometries.push(this.getRightStorageTrack().geometry);

	    return geometries;
	};

	StorageUnit.prototype.getLines = function() {
	    let lines = [];

	    lines.push(this.getPickerTrack());
	    lines.push(this.getLeftStorageTrack());
	    lines.push(this.getRightStorageTrack());

	    return lines;
	};


	// StorageUnit.prototype.generatePointMarks = function() {
	//     if (KOVAN.LOG_ENABLED) console.log(`${this.jsonObj.storageUnitSeq}: generating point marks.`);
	// }

	StorageUnit.prototype.getTagGeometries = function() {
	    if (KOVAN.LOG_ENABLED) console.log(`${this.jsonObj.storageUnitSeq}: getting tag geometries.`);
	};

	StorageUnit.prototype.getTagMeshes = function() {
	    if (KOVAN.LOG_ENABLED) console.log(`${this.jsonObj.storageUnitSeq}: getting tag meshes.`);
	};

	StorageUnit.prototype.getTags = function() {
	  if (KOVAN.LOG_ENABLED) console.log(`${this.jsonObj.storageUnitSeq}: getting tags.`);
	};

	StorageUnit.prototype.getStatus = function() {
	  let status = {};

	  status.storageUnitSeq = this.name;

	  status.leftStorageIndices = this.leftStorageIndices;
	  status.rightStorageIndices = this.rightStorageIndices;

	  status.currentLeftStorageCount = this.currentLeftStorageCount;
	  status.currentRightStorageCount = this.currentRightStorageCount;

	  return status;
	};

	StorageUnit.prototype.setStatus = function(status) {
	  this.leftStorageIndices = status.leftStorageIndices;
	  this.rightStorageIndices = status.rightStorageIndices;

	  this.currentLeftStorageCount = status.currentLeftStorageCount;
	  this.currentRightStorageCount = status.currentRightStorageCount;

	  setTimeout(() => {
	    this.updateStorageRack(KOVAN.LEFT);
	    this.updateStorageRack(KOVAN.RIGHT);
	  }, 0); // make it async to reduce delay
	};

	/**
	 * @author wjq / http://wangjiaqi.xyz
	 */

	function DigitalMap(mapJsonObj) {
	    THREE.Line.call(this);

	    this.jsonObj = mapJsonObj || {};

	    this.type = 'DIGITAL_MAP';

	    // nodes
	    this.nodeMaterial = KOVAN.BaseTrackMaterial;
	    this.nodeGeometry = new THREE.Geometry();

	    this.nodes = {};

	    // switch robots
	    this.switchRobots = new THREE.Object3D();
	    this.switchRobots.name = 'switchRobots';

	    // pushers
	    this.pushers = new THREE.Object3D();
	    this.pushers.name = 'pushers';

	    // pickers
	    this.pickers = new THREE.Object3D();
	    this.pickers.name = 'pickers';

	    // escalators
	    this.escalators = new THREE.Object3D();
	    this.escalators.name = 'escalators';

	    // storage units
	    this.storageUnits = new THREE.Object3D();
	    this.storageUnits.name = 'storageUnits';

	    // tags
	    this.tagMaterial = KOVAN.TagMaterial;
	    this.tagsGeometry = new THREE.Geometry();

	    // points
	    this.pointMaterial = KOVAN.PointMaterial;
	    this.pointsGeometry = new THREE.Geometry();

	    // this.tracks = new THREE.Object3D(); // Initialize tracks as a property, and it will not be rendered by threejs
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


	DigitalMap.prototype = Object.create(THREE.Object3D.prototype);
	DigitalMap.prototype.constructor = DigitalMap;

	// Deprecated
	DigitalMap.prototype.generateRails = function() {
	    var rails = new THREE.Object3D();
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
	};

	DigitalMap.prototype.generateStraightRails = function() {
	    var straightRails = new THREE.Object3D();
	    straightRails.name = 'straightRails';

	    for (let i = 0; i < this.jsonObj.straightRailList.length; i++) {
	        var straightRailJsonObj = this.jsonObj.straightRailList[i];
	        var straightRail = new StraightRail(straightRailJsonObj);
	        // straightRails.add(straightRail);
	        this.addNode(straightRail);

	        this.addPointToPointList(straightRailJsonObj.trackList);
	    }

	    //this.add(straightRails);

	};

	DigitalMap.prototype.generateCornerRails = function() {
	    var cornerRails = new THREE.Object3D();
	    cornerRails.name = 'cornerRails';

	    for (let i = 0; i < this.jsonObj.cornerRailList.length; i++) {
	        var cornerRailJsonObj = this.jsonObj.cornerRailList[i];
	        var cornerRail = new CornerRail(cornerRailJsonObj);
	        // cornerRails.add(cornerRail);

	        this.addNode(cornerRail);

	        this.addPointToPointList(cornerRailJsonObj.trackList);
	    }

	    // this.add(cornerRails);
	};

	DigitalMap.prototype.generateSwitches = function() {
	    var switches = new THREE.Object3D();
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
	};

	DigitalMap.prototype.generateRechargeAreas = function() {
	    var rechargeAreas = new THREE.Object3D();
	    rechargeAreas.name = 'rechargeAreas';

	    for (let i = 0; i < this.jsonObj.rechargeAreaList.length; i++) {
	        var rechargeAreaJsonObj = this.jsonObj.rechargeAreaList[i];
	        var rechargeArea = new exports.RechargeArea(rechargeAreaJsonObj);
	        // rechargeAreas.add(rechargeArea);

	        this.addNode(rechargeArea);

	        this.addPointToPointList(rechargeAreaJsonObj.trackList);
	    }

	    // this.add(rechargeAreas);
	};

	DigitalMap.prototype.generateShipmentAreas = function() {
	    var shipmentAreas = new THREE.Object3D();
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
	};

	DigitalMap.prototype.generateStationDocks = function() {
	    var stationDocks = new THREE.Object3D();
	    stationDocks.name = 'stationDocks';

	    for (let i = 0; i < this.jsonObj.stationDockList.length; i++) {
	        var stationDockJsonObj = this.jsonObj.stationDockList[i];
	        var stationDock = new StationDock(stationDockJsonObj);
	        // stationDocks.add(stationDock);

	        this.addNode(stationDock);

	        this.addPointToPointList(stationDockJsonObj.trackList);
	    }

	    // this.add(stationDocks);
	};

	DigitalMap.prototype.generateCrossroads = function() {
	    var crossroads = new THREE.Object3D();
	    crossroads.name = 'crossroads';

	    for (let i = 0; i < this.jsonObj.crossroadList.length; i++) {
	        var crossroadJsonObj = this.jsonObj.crossroadList[i];
	        var crossroad = new Crossroad(crossroadJsonObj);
	        // crossroads.add(crossroad);

	        this.addNode(crossroad);

	        for (let j in crossroad.components) {
	            this.switchRobots.add(crossroad.components[j]);
	        }

	        this.addPointToPointList(crossroadJsonObj.trackList);
	    }

	    // this.add(crossroads);
	};

	DigitalMap.prototype.generatePushAreas = function() {
	    var pushAreas = new THREE.Object3D();
	    pushAreas.name = 'pushAreas';

	    for (let i = 0; i < this.jsonObj.pushAreaList.length; i++) {
	        var pushAreaJsonObj = this.jsonObj.pushAreaList[i];
	        var pushArea = new exports.PushArea(pushAreaJsonObj);
	        // pushAreas.add(pushArea);

	        this.addNode(pushArea);

	        // this.pushers.add(pushArea.pusher);

	        for (let j in pushArea.components) {
	            this.switchRobots.add(pushArea.components[j]);
	        }

	        this.addPointToPointList(pushAreaJsonObj.trackList);
	    }

	    // this.add(pushAreas);
	};

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
	};

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
	        leftPushArea.side = KOVAN.LEFT;

	        storageUnit.leftPushArea = leftPushArea;

	        // left pusher
	        leftPushArea.generatePusher();

	        storageUnit.leftPusher = leftPushArea.pusher;

	        // right push area
	        let rightPushArea = this.nodes[storageUnit.rightPushAreaSeq];

	        rightPushArea.storageUnit = storageUnit;
	        rightPushArea.side = KOVAN.RIGHT;

	        storageUnit.rightPushArea = rightPushArea;

	        // right pusher
	        rightPushArea.generatePusher();

	        storageUnit.rightPusher = rightPushArea.pusher;
	    }


	};

	DigitalMap.prototype.generateTags = function() {
	    var tags = new THREE.Object3D();
	    tags.name = "tags";

	    for (let i = 0; i < this.jsonObj.tagList.length; i++) {
	        var tagJsonObj = this.jsonObj.tagList[i];
	        var tag = new Tag(tagJsonObj);

	        tag.setPosition(this.getObjectByName(tagJsonObj.trackSeq));

	        tags.add(tag);
	    }

	    this.add(tags);
	};

	// TODO
	DigitalMap.prototype.loadMapFromJson = function(mapJsonObj) {
	    // this.jsonObj = mapJsonObj;

	    for (let i = 0; i < mapJsonObj.straightRailList.length ; i++) {
	        this.addStraightRail(mapJsonObj.straightRailList[i]);
	    }
	    for (let i = 0; i < mapJsonObj.cornerRailList.length ; i++) {
	        this.addCornerRail(mapJsonObj.cornerRailList[i]);
	    }
	    for (let i = 0; i < mapJsonObj.switchList.length ; i++) {
	        this.addSwitch(mapJsonObj.switchList[i]);
	    }
	    for (let i = 0; i < mapJsonObj.rechargeAreaList.length ; i++) {
	        this.addRechargeArea(mapJsonObj.rechargeAreaList[i]);
	    }
	    for (let i = 0; i < mapJsonObj.shipmentAreaList.length ; i++) {
	        this.addShipmentArea(mapJsonObj.shipmentAreaList[i]);
	    }
	    for (let i = 0; i < mapJsonObj.stationDockList.length ; i++) {
	        this.addStationDock(mapJsonObj.stationDockList[i]);
	    }
	    for (let i = 0; i < mapJsonObj.crossroadList.length ; i++) {
	        this.addCrossroad(mapJsonObj.crossroadList[i]);
	    }
	    for (let i = 0; i < mapJsonObj.pushAreaList.length ; i++) {
	        this.addPushArea(mapJsonObj.pushAreaList[i]);
	    }
	    for (let i = 0; i < mapJsonObj.escalatorList.length ; i++) {
	        this.addEscalator(mapJsonObj.escalatorList[i]);
	    }
	    for (let i = 0; i < mapJsonObj.storageUnitList.length ; i++) {
	        this.addStorageUnit(mapJsonObj.storageUnitList[i]);
	    }

	    this.jsonObj.pointList = mapJsonObj.pointList;

	    this.setComponentCounts();
	};

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
	};

	DigitalMap.prototype.addStraightRail = function(straightRailObj) {
	    var straightRails;

	    if (this.getObjectByName('straightRails') == null) {
	        straightRails = new THREE.Object3D();
	        straightRails.name = 'straightRails';

	        this.add(straightRails);

	    } else {
	        straightRails = this.getObjectByName('straightRails');
	    }

	    var straightRail = new StraightRail(straightRailObj, {
	        displayed: true
	    });
	    straightRails.add(straightRail);

	    this.jsonObj.straightRailList.push(straightRailObj);

	    return straightRail;
	};

	DigitalMap.prototype.addCornerRail = function(cornerRailObj) {
	    var cornerRails;

	    if (this.getObjectByName('cornerRails') == null) {
	        cornerRails = new THREE.Object3D();
	        cornerRails.name = 'cornerRails';

	        this.add(cornerRails);

	    } else {
	        cornerRails = this.getObjectByName('cornerRails');
	    }

	    var cornerRail = new CornerRail(cornerRailObj, {
	        displayed: true
	    });
	    cornerRails.add(cornerRail);

	    this.jsonObj.cornerRailList.push(cornerRailObj);

	    return cornerRail;
	};

	DigitalMap.prototype.addSwitch = function(switchObj) {
	    var switches;

	    if (this.getObjectByName('switches') == null) {
	        switches = new THREE.Object3D();
	        switches.name = 'switches';

	        this.add(switches);

	    } else {
	        switches = this.getObjectByName('switches');
	    }

	    var sw = new Switch(switchObj, {
	        displayed: true
	    });
	    switches.add(sw);

	    this.jsonObj.switchList.push(switchObj);

	    return sw;
	};

	DigitalMap.prototype.addRechargeArea = function(rechargeAreaObj) {
	    var rechargeAreas;

	    if (this.getObjectByName('rechargeAreas') == null) {
	        rechargeAreas = new THREE.Object3D();
	        rechargeAreas.name = 'rechargeAreas';

	        this.add(rechargeAreas);

	    } else {
	        rechargeAreas = this.getObjectByName('rechargeAreas');
	    }

	    var rechargeArea = new exports.RechargeArea(rechargeAreaObj, {
	        displayed: true
	    });
	    rechargeAreas.add(rechargeArea);

	    this.jsonObj.rechargeAreaList.push(rechargeAreaObj);

	    return rechargeArea;
	};

	DigitalMap.prototype.addShipmentArea = function(shipmentAreaObj) {
	    var shipmentAreas;

	    if (this.getObjectByName('shipmentAreas') == null) {
	        shipmentAreas = new THREE.Object3D();
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
	};

	DigitalMap.prototype.addStationDock = function(stationDockObj) {
	    var stationDocks;

	    if (this.getObjectByName('stationDocks') == null) {
	        stationDocks = new THREE.Object3D();
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
	};

	DigitalMap.prototype.addCrossroad = function(crossroadObj) {
	    var crossroads;

	    if (this.getObjectByName('crossroads') == null) {
	        crossroads = new THREE.Object3D();
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
	};

	DigitalMap.prototype.addPushArea = function(pushAreaObj) {
	    var pushAreas;

	    if (this.getObjectByName('pushAreas') == null) {
	        pushAreas = new THREE.Object3D();
	        pushAreas.name = 'pushAreas';

	        this.add(pushAreas);
	    } else {
	        pushAreas = this.getObjectByName('pushAreas');
	    }

	    var pushArea = new exports.PushArea(pushAreaObj, {
	        displayed: true
	    });
	    pushAreas.add(pushArea);

	    this.jsonObj.pushAreaList.push(pushAreaObj);

	    return pushArea;
	};

	DigitalMap.prototype.addEscalator = function(escalatorObj) {
	    var escalators;

	    if (this.getObjectByName('escalators') == null) {
	        escalators = new THREE.Object3D();
	        escalators.name = 'escalators';

	        this.add(escalators);
	    } else {
	        escalators = this.getObjectByName('escalators');
	    }

	    var escalator = new Escalator(escalatorObj);
	    escalators.add(escalator);

	    this.jsonObj.escalatorList.push(escalatorObj);

	    return escalator;
	};

	DigitalMap.prototype.addStorageUnit = function(storageUnitObj) {
	    var storageUnits;

	    if (this.getObjectByName('storageUnits') == null) {
	        storageUnits = new THREE.Object3D();
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
	};

	// Deprecated
	DigitalMap.prototype.addTag = function(tagObj) {
	    var tags;

	    if (this.getObjectByName('tags') == null) {
	        tags = new THREE.Object3D();
	        tags.name = 'tags';

	        this.add(tags);
	    } else {
	        tags = this.getObjectByName('tags');
	    }

	    var tag = new Tag(tagObj);
	    tag.setPosition(this.getObjectByName(tagObj.trackSeq));
	    tags.add(tag);

	    this.jsonObj.tagList.push(tagObj);
	};

	DigitalMap.prototype.getComponentByPointSeq = function(pointSeq, type) {
	    let components = this.getObjectByName(type);

	    for (let i = 0; i < components.children.length; i++) {
	        let component = components.children[i];

	        if (component.containsPoint(pointSeq)) {
	            return component;
	        }
	    }
	};

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

	};

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
	    this.removePoint("PTB" + cornerRail.children[0].name);
	    this.removePoint("PTB" + cornerRail.children[1].name);
	    this.removePoint("PTC" + cornerRail.children[1].name);

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
	};

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
	};

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
	};

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
	};

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
	};

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
	};

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
	};

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


	};


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

	    var escalators = this.getObjectByName('escalators');
	    if (escalators) {
	        escalators.remove(es);
	        return true;
	    } else {
	        return false;
	    }
	};

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

	};

	DigitalMap.prototype.removePoint = function(pointSeq) {
	    var pointList = this.jsonObj.pointList;
	    for (let i = 0; i < pointList.length; i++) {
	        var pointObj = pointList[i];
	        if (pointObj.pointSeq == pointSeq) {
	            this.jsonObj.pointList.splice(i, 1);
	        }
	    }
	};

	// KOVAN.DigitalMap.prototype.removePointsByTrack = function(trackObj) {
	//   var pointsRemoved = this.removePoint(trackObj.pointA.pointSeq);
	//   pointsRemoved = pointsRemoved && this.removePoint(trackObj.pointB.pointSeq);
	//
	//   return pointsRemoved;
	// }
	//
	// KOVAN.DigitalMap.prototype.removePoints = function(trackList) {
	//   for (let i = 0; i < trackList.length; i++) {
	//     if (!this.removePointsByTrack(trackList[i])) {
	//       return false;
	//     }
	//   }
	//   return true;
	// }

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
	            this.jsonObj.pointList.push(pointB);
	        }
	    }
	};

	DigitalMap.prototype.getPointObjBySeq = function(pointSeq) {
	    var pointList = this.jsonObj.pointList;
	    for (let i = 0; i < pointList.length; i++) {
	        var pointObj = pointList[i];
	        if (pointObj.pointSeq == pointSeq) {
	            return pointObj;
	        }
	    }

	    return undefined;
	};

	DigitalMap.prototype.getPointObjByLocation = function(x, y, z, options) {
	    var options = options || {},
	        tolerance = options.tolerance || 10; // 1 cm tolerance

	    var pointList = this.jsonObj.pointList;

	    for (let i = 0; i < pointList.length; i++) {
	        var pointObj = pointList[i];

	        var passed = KOVAN.TestPointSimilarity(pointObj, x, y, z, tolerance);

	        if (passed) {
	            return pointObj;
	        }
	    }

	    return undefined;
	};

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
	};

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
	};

	DigitalMap.prototype.addNode = function(node) {
	    var geometries = node.getGeometries(),
	        lines = node.getLines();

	    this.addGeometryToNodes(geometries, lines);

	    this.nodes[node.name] = node;
	};

	DigitalMap.prototype.addGeometryToNodes = function(geometries, lines) {
	    for (let i = 0; i < geometries.length; i++) {
	        lines[i].updateMatrix();
	        this.nodeGeometry.merge(geometries[i], lines[i].matrix);
	    }
	};

	DigitalMap.prototype.generateNodes = function() {
	    this.add(new THREE.LineSegments(this.nodeGeometry, this.nodeMaterial));
	};

	DigitalMap.prototype.getDisplayedByName = function(name) {
	    let displayed;
	    switch (name) {
	        case KOVAN.SWITCH_ROBOT:
	            displayed = KOVAN.ShowSwitchRobot;
	            break;
	        case KOVAN.TAG:
	            displayed = KOVAN.ShowTag;
	            break;
	        case KOVAN.POINT:
	            displayed = KOVAN.ShowPoint;
	            break;
	        case KOVAN.STATION:
	            displayed = KOVAN.ShowStation;
	            break;
	        case KOVAN.TAG_ANNOTATION:
	            displayed = KOVAN.ShowTagAnnotation;
	            break;
	        case KOVAN.POINT_ANNOTATION:
	            displayed = KOVAN.ShowPointAnnotation;
	            break;
	        case KOVAN.STATION_ANNOTATION:
	            displayed = KOVAN.ShowStationAnnotation;
	            break;
	        case KOVAN.MOVER_ANNOTATION:
	            displayed = KOVAN.ShowMoverAnnotation;
	            break;
	        case KOVAN.RACK_ANNOTATION:
	            displayed = KOVAN.ShowRackAnnotation;
	            break;
	        case KOVAN.PICKER_ANNOTATION:
	            displayed = KOVAN.ShowPickerAnnotation;
	            break;
	        case KOVAN.PUSHER_ANNOTATION:
	            displayed = KOVAN.ShowPusherAnnotation;
	            break;
	        default:
	            console.error(`${this.name}: invalid name (${name}).`);
	    }

	    return displayed;
	};

	DigitalMap.prototype.getObjByName = function(name) {
	    let obj;
	    switch (name) {
	        case KOVAN.SWITCH_ROBOT:
	            obj = this.switchRobots;
	            break;
	        case KOVAN.TAG:
	            obj = this.tagsMesh;
	            break;
	        case KOVAN.POINT:
	            obj = this.pointsMesh;
	            break;
	        case KOVAN.STATION:
	            obj = this.stations;
	            break;
	        case KOVAN.TAG_ANNOTATION:
	            obj = this.tagAnnotations;
	            break;
	        case KOVAN.POINT_ANNOTATION:
	            obj = this.pointAnnotations;
	            break;
	        case KOVAN.STATION_ANNOTATION:
	            obj = this.stationAnnotations;
	            break;
	        case KOVAN.MOVER_ANNOTATION:
	            obj = this.movers;
	            break;
	        case KOVAN.RACK_ANNOTATION:
	            obj = this.racks;
	            break;
	        case KOVAN.PICKER_ANNOTATION:
	            obj = this.pickers;
	            break;
	        case KOVAN.PUSHER_ANNOTATION:
	            obj = this.pushers;
	            break;
	        default:
	            console.error(`${this.name}: invalid name (${name}).`);
	    }
	    return obj;
	};

	DigitalMap.prototype.getGeneratorByName = function(name) {
	    let generator;

	    switch (name) {
	        case KOVAN.TAG:
	            generator = this.generateTagsMesh;
	            break;
	        case KOVAN.POINT:
	            generator = this.generatePointsMesh;
	            break
	        case KOVAN.STATION:
	            generator = this.generateStationsMesh;
	            break
	        case KOVAN.TAG_ANNOTATION:
	            generator = this.generateTagAnnotations;
	            break;
	        case KOVAN.POINT_ANNOTATION:
	            generator = this.generatePointAnnotations;
	            break
	        case KOVAN.STATION_ANNOTATION:
	            generator = this.generateStationAnnotations;
	            break
	        default:
	            console.error(`${this.name}: invalid name (${name}).`);
	    }

	    return generator;
	};

	DigitalMap.prototype.generateTagsMesh = function() {
	    if (!this.tags) this.addTags();

	    for (let i = 0; i < this.tags.length; i++) {
	        let tag = this.tags[i];

	        tag.updateMatrix();
	        this.tagsGeometry.merge(tag.geometry, tag.matrix);
	    }

	    this.tagsMesh = new THREE.Mesh(new THREE.BufferGeometry().fromGeometry(this.tagsGeometry), this.tagMaterial);
	    this.tagsMesh.name = 'tagsMesh';

	    return this.tagsMesh;
	};

	DigitalMap.prototype.addTags = function() {
	    this.tags = [];
	    for (let i in this.nodes) {
	        let node = this.nodes[i];

	        let tags = node.getTags();

	        for (let j in tags) {
	            this.tags.push(tags[j]);
	        }
	    }
	};

	DigitalMap.prototype.generatePointsMesh = function() {
	    if (!this.points) this.addPoints();

	    this.pointAnnotations = new THREE.Object3D();
	    this.pointAnnotations.name = 'pointAnnotations';

	    for (let i = 0; i < this.points.length; i++) {
	        let point = this.points[i];

	        let pointMark = new PointMark(point.name);
	        pointMark.setPosition(point);

	        pointMark.updateMatrix();
	        this.pointsGeometry.merge(pointMark.geometry, pointMark.matrix);

	        this.pointAnnotations.add(pointMark.annotation);
	    }

	    this.pointsMesh = new THREE.Mesh(new THREE.BufferGeometry().fromGeometry(this.pointsGeometry), this.pointMaterial);
	    this.pointsMesh.name = 'pointsMesh';

	    return this.pointsMesh;
	};

	DigitalMap.prototype.addPoints = function() {
	    this.points = [];

	    for (let i in this.nodes) {
	        let node = this.nodes[i];

	        let points = node.getPoints();

	        for (let j in points) {
	            this.points.push(points[j]);
	        }
	    }
	};

	DigitalMap.prototype.generateStationsMesh = function() {
	    this.stations = new THREE.Object3D();
	    this.stations.name = 'stations';

	    this.stationAnnotations = new THREE.Object3D();
	    this.stationAnnotations.name = 'stationAnnotations';

	    for (let i in this.nodes) {
	        let node = this.nodes[i];

	        if (KOVAN.STATION_DOCK == node.type) {
	            node.addStation();

	            this.stations.add(node.station);
	            this.stationAnnotations.add(node.stationAnnotation);
	        }
	    }

	    return this.stations;
	};

	DigitalMap.prototype.generateTagAnnotations = function() {
	    if (!this.tags) this.addTags();

	    this.tagAnnotations = new THREE.Object3D();
	    this.tagAnnotations.name = 'tagAnnotations';

	    for (let i = 0; i < this.tags.length; i++) {
	        let tag = this.tags[i];

	        this.tagAnnotations.add(tag.annotation);
	        // this.add(tag.annotation);
	    }

	    return this.tagAnnotations;
	};

	DigitalMap.prototype.generatePointAnnotations = function() {
	    if (!this.pointAnnotations) this.generatePointsMesh();

	    return this.pointAnnotations;
	};

	DigitalMap.prototype.generateStationAnnotations = function() {
	    if (!this.stationAnnotations) this.generateStationsMesh();

	    return this.stationAnnotations;
	};

	DigitalMap.prototype.getNodeByName = function(name) {
	  let node = this.nodes[name] || this.escalators.getObjectByName(name);

	  return node;
	};

	DigitalMap.prototype.getCarrierByType = function(carrierSeq, carrierType) {
	    let carrier;
	    switch (carrierType) {
	        case KOVAN.MOVER:
	            carrier = this.movers.getObjectByName(carrierSeq);
	            break;
	        case KOVAN.PICKER:
	            carrier = this.pickers.getObjectByName(carrierSeq);
	            break;
	        case KOVAN.PUSHER:
	            carrier = this.pushers.getObjectByName(carrierSeq);
	            break;
	        default:
	            console.warn(`DigitalMap: invalid carrier type: ${carrierType}.`);
	    }

	    return carrier;
	};

	DigitalMap.prototype.printMap = function() {
	    console.log(this);
	    console.log(this.jsonObj.pointList);
	};

	exports.Animator = Animator;
	exports.Player = Player;
	exports.Annotation = Annotation;
	exports.Point = Point;
	exports.PointMark = PointMark;
	exports.BaseTrack = BaseTrack;
	exports.StraightTrack = StraightTrack;
	exports.CurvedTrack = CurvedTrack;
	exports.PathTag = PathTag;
	exports.CurvePath = CurvePath;
	exports.BaseRail = BaseRail;
	exports.StraightRail = StraightRail;
	exports.CornerRail = CornerRail;
	exports.Switch = Switch;
	exports.RechargeArea0 = RechargeArea0;
	exports.RechargeArea1 = RechargeArea1;
	exports.ShipmentArea = ShipmentArea;
	exports.StationDock = StationDock;
	exports.SwitchRobot = SwitchRobot;
	exports.BaseModule = BaseModule;
	exports.Crossroad = Crossroad;
	exports.PushArea0 = PushArea0;
	exports.PushArea1 = PushArea1;
	exports.EscalatorPort = EscalatorPort;
	exports.EscalatorCar = EscalatorCar;
	exports.Escalator = Escalator;
	exports.StorageUnit = StorageUnit;
	exports.Tag = Tag;
	exports.DigitalMap = DigitalMap;
	exports.BaseBox = BaseBox;
	exports.BaseCarrier = BaseCarrier;
	exports.BaseFixedCarrier = BaseFixedCarrier;
	exports.Mover = Mover;
	exports.Pusher = Pusher;
	exports.Picker = Picker;
	exports.SECOND = SECOND;
	exports.LEFT = LEFT;
	exports.RIGHT = RIGHT;
	exports.FACES_PER_BOX = FACES_PER_BOX;
	exports.TRACK = TRACK;
	exports.STRAIGHT_TRACK = STRAIGHT_TRACK;
	exports.CURVED_TRACK = CURVED_TRACK;
	exports.STRAIGHT_RAIL = STRAIGHT_RAIL;
	exports.CORNER_RAIL = CORNER_RAIL;
	exports.SWITCH = SWITCH;
	exports.SWITCH_ROBOT = SWITCH_ROBOT;
	exports.RECHARGE_AREA = RECHARGE_AREA;
	exports.STATION_DOCK = STATION_DOCK;
	exports.SHIPMENT_AREA = SHIPMENT_AREA;
	exports.CROSSROAD = CROSSROAD;
	exports.PUSH_AREA = PUSH_AREA;
	exports.STORAGE_UNIT = STORAGE_UNIT;
	exports.ESCALATOR = ESCALATOR;
	exports.ESCALATOR_CAR = ESCALATOR_CAR;
	exports.ESCALATOR_PORT = ESCALATOR_PORT;
	exports.ESCALATOR_CHANNEL = ESCALATOR_CHANNEL;
	exports.MOVER = MOVER;
	exports.RACK = RACK;
	exports.PICKER = PICKER;
	exports.PUSHER = PUSHER;
	exports.TAG = TAG;
	exports.POINT = POINT;
	exports.STATION = STATION;
	exports.TAG_ANNOTATION = TAG_ANNOTATION;
	exports.POINT_ANNOTATION = POINT_ANNOTATION;
	exports.STATION_ANNOTATION = STATION_ANNOTATION;
	exports.MOVER_ANNOTATION = MOVER_ANNOTATION;
	exports.RACK_ANNOTATION = RACK_ANNOTATION;
	exports.PICKER_ANNOTATION = PICKER_ANNOTATION;
	exports.PUSHER_ANNOTATION = PUSHER_ANNOTATION;
	exports.VERSION = VERSION;
	exports.BUILD_TIME = BUILD_TIME;
	exports.LOG_ENABLED = LOG_ENABLED;
	exports.INFO_ENABLED = INFO_ENABLED;
	exports.FPS = FPS;
	exports.PLAY_SPEED = PLAY_SPEED;
	exports.ShowSwitchRobot = ShowSwitchRobot;
	exports.ShowTag = ShowTag;
	exports.ShowPoint = ShowPoint;
	exports.ShowStation = ShowStation;
	exports.ShowTagAnnotation = ShowTagAnnotation;
	exports.ShowPointAnnotation = ShowPointAnnotation;
	exports.ShowStationAnnotation = ShowStationAnnotation;
	exports.ShowMoverAnnotation = ShowMoverAnnotation;
	exports.ShowRackAnnotation = ShowRackAnnotation;
	exports.ShowPickerAnnotation = ShowPickerAnnotation;
	exports.ShowPusherAnnotation = ShowPusherAnnotation;
	exports.ShowTrackAnnotation = ShowTrackAnnotation;
	exports.GridMaterial = GridMaterial;
	exports.RendererClearColor = RendererClearColor;
	exports.BaseTrackMaterial = BaseTrackMaterial;
	exports.RenderTrackMaterial = RenderTrackMaterial;
	exports.CurveGeometryResolution = CurveGeometryResolution;
	exports.BaseBoxMaterial = BaseBoxMaterial;
	exports.BaseBoxAnnotationOption = BaseBoxAnnotationOption;
	exports.MoverLength = MoverLength;
	exports.MoverWidth = MoverWidth;
	exports.MoverHeight = MoverHeight;
	exports.MoverGeometry = MoverGeometry;
	exports.MoverMaterial = MoverMaterial;
	exports.MoverTranslationZ = MoverTranslationZ;
	exports.RackLength = RackLength;
	exports.RackWidth = RackWidth;
	exports.RackHeight = RackHeight;
	exports.RackGeometry = RackGeometry;
	exports.RackMaterial = RackMaterial;
	exports.StorageRackMaterial = StorageRackMaterial;
	exports.RackGap = RackGap;
	exports.RackTranslationZ = RackTranslationZ;
	exports.PusherLength = PusherLength;
	exports.PusherWidth = PusherWidth;
	exports.PusherHeight = PusherHeight;
	exports.PusherGeometry = PusherGeometry;
	exports.PusherMaterial = PusherMaterial;
	exports.PusherTranslationZ = PusherTranslationZ;
	exports.PickerLength = PickerLength;
	exports.PickerWidth = PickerWidth;
	exports.PickerHeight = PickerHeight;
	exports.PickerGeometry = PickerGeometry;
	exports.PickerMaterial = PickerMaterial;
	exports.TagGeometry = TagGeometry;
	exports.TagMaterial = TagMaterial;
	exports.TagAnnotationOption = TagAnnotationOption;
	exports.PointGeometry = PointGeometry;
	exports.PointMaterial = PointMaterial;
	exports.PointAnnotationOption = PointAnnotationOption;
	exports.StationLength = StationLength;
	exports.StationWidth = StationWidth;
	exports.StationHeight = StationHeight;
	exports.StationGeometry = StationGeometry;
	exports.StationMaterial = StationMaterial;
	exports.StationMesh = StationMesh;
	exports.StationDirection = StationDirection;
	exports.StationBoxColor = StationBoxColor;
	exports.PickerStandbyDistance = PickerStandbyDistance;
	exports.PickerDropoffDistances = PickerDropoffDistances;
	exports.PickingSpeed = PickingSpeed;
	exports.PickingDelay = PickingDelay;
	exports.PusherStartDistance = PusherStartDistance;
	exports.PusherEndDistance = PusherEndDistance;
	exports.LineCurvePathMap = LineCurvePathMap;
	exports.EllipseCurvePathMap = EllipseCurvePathMap;
	exports.GetLineCurvePath = GetLineCurvePath;
	exports.GetEllipseCurvePath = GetEllipseCurvePath;
	exports.LineCurveGeometryMap = LineCurveGeometryMap;
	exports.EllipseCurveGeometryMap = EllipseCurveGeometryMap;
	exports.GetLineCurveGeometry = GetLineCurveGeometry;
	exports.GetEllipseCurveGeometry = GetEllipseCurveGeometry;
	exports.FillVertices = FillVertices;
	exports.RoundTo = RoundTo;
	exports.ParseNumber = ParseNumber;
	exports.Pad = Pad;
	exports.TestNumberSimilarity = TestNumberSimilarity;
	exports.TestPointSimilarity = TestPointSimilarity;
	exports.RectifyAngle = RectifyAngle;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
