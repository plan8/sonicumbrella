/**
* 	Modified version of ViveController by:
 * @author mrdoob / http://mrdoob.com
 * @author stewdio / http://stewd.io
 */

THREE.VRGamePad = function ( id ) {

	THREE.Object3D.call( this );

	var buttonMap = {};
	var scope = this;
	var gamepad;

	var axes = [ 0, 0 ];
	var thumbpadIsPressed = false;
	var triggerIsPressed = false;
	var gripsArePressed = false;
	var menuIsPressed = false;

	function findGamepad( id ) {

		// Iterate across gamepads as Vive Controllers may not be
		// in position 0 and 1.

		var gamepads = navigator.getGamepads();

		for ( var i = 0, j = 0; i < 4; i ++ ) {

			var gamepad = gamepads[ i ];

			if ( gamepad ) { //&& ( gamepad.id === 'OpenVR Gamepad' || gamepad.id === 'Daydream Controller' ) ) {

				if ( j === id ) return gamepad;

				j ++;

			}

		}

	}

	this.matrixAutoUpdate = false;
	this.standingMatrix = new THREE.Matrix4();

	this.getGamepad = function () {

		return gamepad;

	};

	this.tryVibrate = function( force, duration ){
		if ( gamepad && 'hapticActuators' in gamepad && gamepad.hapticActuators.length > 0) {
	  	gamepad.hapticActuators[0].pulse( force || 0.7, duration || 10 );
	  }
	}

	this.update = function () {

		gamepad = findGamepad( id );

		if ( gamepad !== undefined && gamepad.buttons  ) {

			if ( gamepad.pose !== undefined && gamepad.pose !== null ) { // No user action yet

				//  Position and orientation.

				var pose = gamepad.pose;

				if ( pose.position !== null ) scope.position.fromArray( pose.position );
				if ( pose.orientation !== null ) scope.quaternion.fromArray( pose.orientation );
				scope.matrix.compose( scope.position, scope.quaternion, scope.scale );
				scope.matrix.multiplyMatrices( scope.standingMatrix, scope.matrix );
				scope.matrixWorldNeedsUpdate = true;
				scope.visible = true;

				//  Thumbpad and Buttons.
			}

			if ( axes[ 0 ] !== gamepad.axes[ 0 ] || axes[ 1 ] !== gamepad.axes[ 1 ] ) {

				axes[ 0 ] = gamepad.axes[ 0 ]; //  X axis: -1 = Left, +1 = Right.
				axes[ 1 ] = gamepad.axes[ 1 ]; //  Y axis: -1 = Bottom, +1 = Top.
				scope.dispatchEvent( { type: 'axischanged', axes: axes } );

			}

			for ( var k = 0; k < gamepad.buttons.length; k++ ){
				if ( buttonMap[ k ] !== gamepad.buttons[ k ].pressed ){
					buttonMap[ k ] = gamepad.buttons[ k ].pressed;
					scope.dispatchEvent( { type: buttonMap[ k ] ? 'buttondown' : 'buttonup', index: k });
				}
			}

		} else {

			scope.visible = false;

		}

	};

};

THREE.VRGamePad.prototype = Object.create( THREE.Object3D.prototype );
THREE.VRGamePad.prototype.constructor = THREE.VRGamePad;
