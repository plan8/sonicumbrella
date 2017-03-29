/******************************************************************************
* Shared SFX / UI sounds across site
******************************************************************************/

var ThreeObj              = require('../ThreeObj');
var rateLimitedListener   = require('../audio/rateLimitedListener');
var events                = require('../helpers/events');
var umbrella              = require('../objects/umbrella');
var globalSettings        = require('../settings/globalSettings');
var cameraRig             = require('../objects/cameraRig');
var AudioSource           = require('../audio/AudioSource');
var PositionalAudioSource = require('../audio/PositionalAudioSource');

var sharedSounds = ThreeObj.create({

    settings: {
      refDistance: 1,
      rollOffFactor: 1,
      panningModel: 'HRTF',
      distanceModel: 'inverse',
      useSharedPanners: false
    },

    assets: {
      audio: {
        uriPrefix: 'assets/audio/',
        thunder: 'thunder.mp3|ogg',
        roomAmbience: 'room_ambience/noise_ambience_solo.mp3|ogg',
        kick_out: 'kick_out_2.mp3|ogg',
        umbrella_up : ['umbrella/umbrella_open_01.mp3|ogg', 'umbrella/umbrella_open_01.mp3|ogg', 'umbrella/umbrella_open_01.mp3|ogg'],
        umbrella_down : ['umbrella/umbrella_close_01.mp3|ogg', 'umbrella/umbrella_close_02.mp3|ogg', 'umbrella/umbrella_close_03.mp3|ogg']
      }
    },

    play:function( assetName, pos, when, fadeIn, vol ){
      var sound;
      when = when || 0;
      fadeIn = fadeIn || 0;
      if (Array.isArray(this.soundTable[ assetName ])) {
        var id = Math.floor(Math.random()*this.soundTable[ assetName ].length);
        sound = this.soundTable[ assetName ][id];
      }else {
        sound = this.soundTable[ assetName ];
      }
      if ( pos && sound.panner ){
        sound.position.set( pos.x, pos.y, pos.z );
      }

      if (assetName == "umbrella_down") {

        var distance = pos.distanceTo( cameraRig.$camera.position );

        if (distance > 1) {
          sound.setVolume(0.4);
        }else {
          sound.setVolume(1);
        }
      }
      sound.playbackRate = globalSettings.timeScale;

      if (fadeIn > 0) {
        sound.gain.gain.setValueAtTime(0, THREE.AudioContext.getContext().currentTime + when);
        sound.gain.gain.linearRampToValueAtTime(0.02, THREE.AudioContext.getContext().currentTime + when + fadeIn);
      }
      sound.play(when);


      return this;
    },

    setup: function() {
      this.soundTable = {};
      this.setupAudio();

    },

    setupAudio: function() {
      for (var asset in this.assets.audio) {
        if (asset == 'uriPrefix') continue;


        if (Array.isArray(this.assets.audio[ asset ])) {
          var sounds = [];
          for (var i = 0; i < this.assets.audio[ asset ].length; i++) {
            var sound = this.createAudio( this.assets.audio[ asset ][i], false);
            sounds.push(sound);
          }
          this.soundTable[asset] = sounds;
        }else {
          this.soundTable[asset] = this.createAudio( this.assets.audio[ asset ], false); //asset.indexOf( 'umbrella_' ) !== -1
        }


      }
      this.soundTable['roomAmbience'].setLoop(true);
      this.play("roomAmbience", false, 0.5, 3, 0.02);
    },

    toggleUmbrella: function( e ) {
      if (e.umbrellaState) {
      //  this.soundTable[ 'umbrella_up' ];
        this.play( 'umbrella_up', umbrella.$transform.position );
      }else {
      //  this.soundTable[ 'umbrella_down' ];
        this.play( 'umbrella_down', umbrella.$transform.position );
      }
    },

    createAudio: function(buffer, is3D) {
      var sound = is3D ? new PositionalAudioSource( rateLimitedListener ) : new AudioSource( rateLimitedListener );
      sound.setBuffer(buffer);
      if ( is3D ){
        sound.panner.panningModel = this.settings.panningModel;
        sound.panner.distanceModel = this.settings.distanceModel;
        sound.setRefDistance( this.settings.refDistance );
        sound.setRolloffFactor(this.settings.rollOffFactor);
      }
      return sound;
    }
});

module.exports = sharedSounds;
