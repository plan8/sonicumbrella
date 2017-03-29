var umbrella                = require('../objects/umbrella');
var events                  = require('../helpers/events');
var AudioSource             = require('../audio/AudioSource');
var PositionalAudioSource   = require('../audio/PositionalAudioSource');

var globalSettings = require('../settings/globalSettings');

function RainAudio( listener, umbrellaDownBuffer, umbrellaUpBuffer, useSharedPanners ){
  if ( !listener || !umbrellaDownBuffer || !umbrellaUpBuffer ){
    throw new Error( "RainAudio must be initialized with listener, umbrellaDownBuffer, umbrellaUpBuffer" );
  }
  if (useSharedPanners) {
    AudioSource.call( this, listener );
  } else {
    PositionalAudioSource.call( this, listener  );
  }

  this.setBuffers( umbrellaDownBuffer, umbrellaUpBuffer );


};

RainAudio.prototype = Object.assign( Object.create(PositionalAudioSource.prototype), {

  constructor: RainAudio,

  setBuffers: function( umbrellaDownBuffer, umbrellaUpBuffer ){
    this._buffers = [];
    this._buffers[ umbrella.DOWN ] = umbrellaDownBuffer;
    this._buffers[ umbrella.UP ] = umbrellaUpBuffer;
  },

  setPanner: function(panner) {
    this.panner = panner;
    // panner is connected in SoundPool
  },

  play: function( when, isUp ){
    if ( this.isPlaying === true ) {

      console.warn( 'THREE.Audio: Audio is already playing.' );
      return;

    }
    this.playbackRate = globalSettings.timeScale;
    if ( isUp ) this.playUmbrella( when );
    else this.playGround( when );
  },

  fadeoutAndStop: function( when, duration ){
    if ( this.isPlaying ){
      when = Math.max(this.context.currentTime, when);
      duration = duration || 0.02;
      this.gain.gain.linearRampToValueAtTime( 0, when + duration );
      this.stop( when + duration );
    } else {
      console.warn('Trying to stop already stopped RainAudio');
    }
  },

  playGround: function( when ){
    this.gain.gain.cancelScheduledValues(this.context.currentTime + when);
    this.gain.gain.setValueAtTime( this.volume, this.context.currentTime + when );
    this.audioBuffer =  this._buffers[ umbrella.DOWN ];
    return PositionalAudioSource.prototype.play.call( this, when );
  },

  playUmbrella: function( when ){
    this.gain.gain.cancelScheduledValues(this.context.currentTime + when);
    this.gain.gain.setValueAtTime( this.volume, this.context.currentTime + when );
    this.audioBuffer =  this._buffers[ umbrella.UP ];
    return PositionalAudioSource.prototype.play.call( this, when );
  },

  setVolume: function(vol) {
    this.volume = vol;
    this.gain.gain.value = vol;

    return this;
  },

  getVolume: function () {

		return this.volume;

	},

});

module.exports = RainAudio;
