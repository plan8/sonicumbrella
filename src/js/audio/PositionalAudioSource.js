var umbrella = require('../objects/umbrella');
var events = require('../helpers/events');
var AudioSource = require('../audio/AudioSource');

var globalSettings = require('../settings/globalSettings');

function PositionalAudioSource( listener ) {

	AudioSource.call( this, listener );

	this.panner = this.context.createPanner();
	this.panner.connect( this.gain );

}

PositionalAudioSource.prototype = Object.assign( Object.create(AudioSource.prototype), {

	constructor: PositionalAudioSource,

	getOutput: function () {

		return this.panner;

	},

	getRefDistance: function () {

		return this.panner.refDistance;

	},

	setRefDistance: function ( value ) {

		this.panner.refDistance = value;

	},

	getRolloffFactor: function () {

		return this.panner.rolloffFactor;

	},

	setRolloffFactor: function ( value ) {

		this.panner.rolloffFactor = value;

	},

	getDistanceModel: function () {

		return this.panner.distanceModel;

	},

	setDistanceModel: function ( value ) {

		this.panner.distanceModel = value;

	},

	getMaxDistance: function () {

		return this.panner.maxDistance;

	},

	setMaxDistance: function ( value ) {

		this.panner.maxDistance = value;

	},

	updateMatrixWorld: ( function () {

		var position = new THREE.Vector3();

		return function updateMatrixWorld( force ) {

			THREE.Object3D.prototype.updateMatrixWorld.call( this, force );

			position.setFromMatrixPosition( this.matrixWorld );

			if ( this.panner.positionX !== undefined ) {

				this.panner.positionX.setTargetAtTime( position.x, this.context.currentTime, 0.1 );
				this.panner.positionY.setTargetAtTime( position.y, this.context.currentTime, 0.1 );
				this.panner.positionZ.setTargetAtTime( position.z, this.context.currentTime, 0.1 );
			} else {
				this.panner.setPosition( position.x, position.y, position.z );

			}


		};

	} )()

});

module.exports = PositionalAudioSource;
