var util = require('../util');
var THREE = require('three');


function RateLimitedAudioListener() {
  THREE.AudioListener.call( this );
}

RateLimitedAudioListener.prototype = Object.assign( Object.create( THREE.AudioListener.prototype ), {
  updateMatrixWorld: util.rateLimit( 100, (function( force ){
    var position = new THREE.Vector3();
		var quaternion = new THREE.Quaternion();
		var scale = new THREE.Vector3();

		var orientation = new THREE.Vector3();

		return function updateMatrixWorld( force ) {

			THREE.Object3D.prototype.updateMatrixWorld.call( this, force );

			var listener = this.context.listener;
			var up = this.up;

			this.matrixWorld.decompose( position, quaternion, scale );

			orientation.set( 0, 0, - 1 ).applyQuaternion( quaternion );

			if ( listener.positionX !== undefined ) {

				var scheduleTime = this.context.currentTime;

				listener.positionX.cancelScheduledValues( scheduleTime );
				listener.positionY.cancelScheduledValues( scheduleTime );
				listener.positionZ.cancelScheduledValues( scheduleTime );
				listener.forwardX.cancelScheduledValues( scheduleTime );
				listener.forwardY.cancelScheduledValues( scheduleTime );
				listener.forwardZ.cancelScheduledValues( scheduleTime );
				listener.upX.cancelScheduledValues( scheduleTime );
				listener.upY.cancelScheduledValues( scheduleTime );
				listener.upZ.cancelScheduledValues( scheduleTime );

				listener.positionX.setTargetAtTime( position.x, scheduleTime, 0.1 );
				listener.positionY.setTargetAtTime( position.y, scheduleTime, 0.1 );
				listener.positionZ.setTargetAtTime( position.z, scheduleTime, 0.1 );
				listener.forwardX.setTargetAtTime( orientation.x, scheduleTime, 0.1 );
				listener.forwardY.setTargetAtTime( orientation.y, scheduleTime, 0.1 );
				listener.forwardZ.setTargetAtTime( orientation.z, scheduleTime, 0.1 );
				listener.upX.setTargetAtTime( up.x, scheduleTime, 0.1 );
				listener.upY.setTargetAtTime( up.y, scheduleTime, 0.1 );
				listener.upZ.setTargetAtTime( up.z, scheduleTime, 0.1 );

			}
			else {

				listener.setPosition( position.x, position.y, position.z );
				listener.setOrientation( orientation.x, orientation.y, orientation.z, up.x, up.y, up.z );

			}

		};
  }()))
});

var listener = new RateLimitedAudioListener();

module.exports = listener;
