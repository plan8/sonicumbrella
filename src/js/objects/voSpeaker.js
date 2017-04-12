/******************************************************************************
* Umrella Rods Mesh / Animation
******************************************************************************/

var ThreeObj              = require('../ThreeObj');
var events                = require('../helpers/events')
var rateLimitedListener   = require('../audio/rateLimitedListener');
var rainAutomation        = require('./rainAutomation');
var TWEEN                 = require('tween.js/src/Tween.js');
var globalSettings        = require('../settings/globalSettings');
var materials             = require('../settings/materials');
var timing                = require('../settings/timing');
var soundpacks            = require('../audio/soundpacks/index');
var util                  = require('../util');
var cameraRig             = require('./cameraRig');
var PositionalAudioSource = require('../audio/PositionalAudioSource');
var device                = require('../helpers/device');

var GHOST_SPEAKER = !!util.getParameterByName('ghost_speaker');

// speaker object exported with z up.. fix
var X_ROTATION_FIX =  -Math.PI * 0.5;

var rotation0 = new THREE.Vector3( X_ROTATION_FIX, 0, Math.PI * 0.14 );

var targetPosition = GHOST_SPEAKER ? new THREE.Vector3( -1, 1.5, -3.5 ) : new THREE.Vector3( -1, 16.2, -3.5 );

var audioAssetObject = {
  instruction01 : 'assets/audio/vo/01_speaker_on.mp3|ogg',
  instruction02 : ['assets/audio/vo/02_good_morning.mp3|ogg', 'assets/audio/vo/02_good_day.mp3|ogg', 'assets/audio/vo/02_good_evening.mp3|ogg'],
  instruction03 : 'assets/audio/vo/03_welcome_sonic_umbrella_2.mp3|ogg',

  instruction06 : ['assets/audio/vo/06_close_1.mp3|ogg', 'assets/audio/vo/08_close_2.mp3|ogg', 'assets/audio/vo/10_close_3.mp3|ogg'],

  instruction11 : ['assets/audio/vo/11_enough_1.mp3|ogg','assets/audio/vo/11_enough_2.mp3|ogg', 'assets/audio/vo/11_enough_3.mp3|ogg'],
  instruction12 : ['assets/audio/vo/12_look_up_1.mp3|ogg', 'assets/audio/vo/12_look_up_2.mp3|ogg', 'assets/audio/vo/12_look_up_3.mp3|ogg'],
  instruction13 : 'assets/audio/vo/13_roll_simulation_forecast_start.mp3|ogg',
  instruction15 : 'assets/audio/vo/15_thank_you_short.mp3|ogg',

  cans          : 'assets/audio/vo/cans.mp3|ogg',
  drums         : 'assets/audio/vo/drums.mp3|ogg',
  fruits        : 'assets/audio/vo/fruits.mp3|ogg',
  kalimba       : 'assets/audio/vo/kalimba.mp3|ogg',
  pingpong      : 'assets/audio/vo/pingpong.mp3|ogg',
  squeaky_toys  : 'assets/audio/vo/squeaky_toys.mp3|ogg',
  speaker_winch :  'assets/audio/speaker_winch/speaker_winch_loop.mp3|ogg',
  speaker_noise :  'assets/audio/speaker_winch/speaker_noise.mp3|ogg',
  engine_start :  'assets/audio/engine_start.mp3|ogg',

  violin        : 'assets/audio/vo/violin.mp3|ogg',

  lounge_loop   : 'assets/audio/lounge_loop.mp3|ogg'
};

var iosAudio = {
  cardboardInstructions : ['assets/audio/vo/05a_open_interaction_button_1.mp3|ogg', 'assets/audio/vo/05a_open_interaction_button_2.mp3|ogg', 'assets/audio/vo/05a_no_button.mp3|ogg', 'assets/audio/vo/05c_gaze_button.mp3|ogg' ],
  threeSixtyInstructionsMobile: ['assets/audio/vo/instructions_tap_screen_1.mp3|ogg', 'assets/audio/vo/instructions_tap_screen_2.mp3|ogg'],
};

var androidAudio = {
  cardboardInstructions : ['assets/audio/vo/05a_open_interaction_button_1.mp3|ogg', 'assets/audio/vo/05a_open_interaction_button_2.mp3|ogg', 'assets/audio/vo/05a_no_button.mp3|ogg', 'assets/audio/vo/05c_gaze_button.mp3|ogg' ],
  daydreamInstructions:   [ 'assets/audio/vo/05b_open_daydream_1.mp3|ogg', 'assets/audio/vo/05b_open_daydream_2.mp3|ogg' ],
  threeSixtyInstructionsMobile: ['assets/audio/vo/instructions_tap_screen_1.mp3|ogg', 'assets/audio/vo/instructions_tap_screen_2.mp3|ogg'],
};

var desktopAudio = {
  controllerInstructions: [ 'assets/audio/vo/05b_open_controller_1.mp3|ogg', 'assets/audio/vo/05b_open_controller_2.mp3|ogg', 'assets/audio/vo/05b_no_controller.mp3|ogg', 'assets/audio/vo/05c_gaze_button.mp3|ogg' ],
  threeSixtyInstructionsDesktop: ['assets/audio/vo/instructions_space_bar_1.mp3|ogg', 'assets/audio/vo/instructions_space_bar_2.mp3|ogg'],
};


if ( device.isIOS ){
  Object.assign( audioAssetObject, iosAudio );
}

if ( device.isAndroid ){
  Object.assign( audioAssetObject, androidAudio );
}

if ( device.isDesktop ){
  Object.assign( audioAssetObject, desktopAudio );
}

/**
/* Asset paths defined here will automatically get replaced with loaded THREE assets
*/
var voSpeaker = ThreeObj.create({

      assets: {
        audio: audioAssetObject,
        json: {
          instruction01 : 'assets/audio/vo/01_speaker_on.json',
          instruction02 : ['assets/audio/vo/02_good_morning.json', 'assets/audio/vo/02_good_day.json', 'assets/audio/vo/02_good_evening.json'],
          instruction03 : 'assets/audio/vo/03_welcome_sonic_umbrella_2.json',
          cardboardInstructions : ['assets/audio/vo/05a_open_interaction_button_1.json', 'assets/audio/vo/05a_open_interaction_button_2.json', 'assets/audio/vo/05a_no_button.json', 'assets/audio/vo/05c_gaze_button.json'],
          controllerInstructions : [ 'assets/audio/vo/05b_open_controller_1.json', 'assets/audio/vo/05b_open_controller_2.json', 'assets/audio/vo/05b_no_controller.json', 'assets/audio/vo/05c_gaze_button.json'],
          daydreamInstructions : [ 'assets/audio/vo/05b_open_daydream_1.json', 'assets/audio/vo/05b_open_daydream_2.json' ],
          threeSixtyInstructionsMobile: ['assets/audio/vo/instructions_tap_screen_1.json', 'assets/audio/vo/instructions_tap_screen_2.json'],
          threeSixtyInstructionsDesktop: ['assets/audio/vo/instructions_space_bar_1.json', 'assets/audio/vo/instructions_space_bar_2.json'],
          instruction06 : ['assets/audio/vo/06_close_1.json', 'assets/audio/vo/08_close_2.json', 'assets/audio/vo/10_close_3.json'],
          instruction11 : ['assets/audio/vo/11_enough_1.json','assets/audio/vo/11_enough_2.json', 'assets/audio/vo/11_enough_3.json'],
          instruction12 : ['assets/audio/vo/12_look_up_1.json', 'assets/audio/vo/12_look_up_2.json', 'assets/audio/vo/12_look_up_3.json'],
          instruction13 : 'assets/audio/vo/13_roll_simulation_forecast_start.json',
          instruction15 : 'assets/audio/vo/15_thank_you_short.json',

          cans          : 'assets/audio/vo/cans.json',
          drums         : 'assets/audio/vo/drums.json',
          fruits        : 'assets/audio/vo/fruits.json',
          kalimba       : 'assets/audio/vo/kalimba.json',
          pingpong      : 'assets/audio/vo/pingpong.json',
          squeaky_toys  : 'assets/audio/vo/squeaky_toys.json',
          violin        : 'assets/audio/vo/violin.json'

      },
      models: {
        speaker       : 'assets/models/plan8_lowpoly/lowpoly_hanging_speaker.json',
      }
    },

    settings: {
      volume: 5,
      refDistance: GHOST_SPEAKER ? 4 : 1,
      rollOffFactor: 1,
      panningModel: 'HRTF',
      distanceModel: 'inverse'
    },

    onCollision: function( collidingObject, force ){
      force = force || 0.001;
      var normal = collidingObject.position.clone().sub(this.$transform.position).normalize();
      this.velocity.add( normal.multiplyScalar(force) );
    },

    setup: function($scene) {

      for ( var key in this.assets.models ){

        if ( key === 'uriPrefix' ) continue;

        if ( materials[ key ] ){

            for (var i = 0; i < materials[ key ].length; i++) {
              materials[ key ][i].morphTargets = true;
              materials[ key ][i].fog = true;
            }
            this.assets.models[ key ].material =  new THREE.MultiMaterial( materials[ key ] );
        } else {
          this.assets.models[ key ] = new THREE.MultiMaterial( [ new THREE.MeshBasicMaterial( 0xFFAA99 ) ] );
        }
      }

      var speakerData = this.assets.models.speaker;

      var material = speakerData.material ;

			material.morphTargets = true;


      this.velocity = new THREE.Vector3(0.1,0,0.01);

		  var speakerMesh = GHOST_SPEAKER ? new THREE.Object3D() : new THREE.Mesh( speakerData.geometry, material );
      speakerMesh.scale.multiplyScalar( 0.3 );
      speakerMesh.position.set(targetPosition.x,40,targetPosition.z);

      if ( GHOST_SPEAKER ){
        speakerMesh.lookAt( $scene.position );
      } else {
        speakerMesh.morphTargetInfluences[0] = 1;
        speakerMesh.rotation.set( rotation0.x, rotation0.y, rotation0.z );
      }
      this.$transform = speakerMesh;
      $scene.add( this.$transform );


      this.$winchObject = new THREE.Object3D();
      this.$winchObject.position.x = this.$transform.position.x;
      this.$winchObject.position.y = this.$transform.position.y;
      this.$winchObject.position.z = this.$transform.position.z;

      $scene.add(this.$winchObject);
    },

    startListeningToSoundChange: function(){



      if (!this.hasSoundChangeListener) {
        this.playVO( soundpacks[ 0 ].name  );

        rainAutomation.addEventListener( 'SOUND_PACK_CHANGE', function( e ){
          this.playVO( e.data );
        }.bind(this));

        this.hasSoundChangeListener = true;
      }

    },

    transitionIn: function( duration, onComplete ){
      if ( GHOST_SPEAKER ){
        setTimeout(function(){
            onComplete && onComplete();
        }, 3000)
        return;
      }

      var tween = new TWEEN.Tween( this.$transform.position );

      tween.to({
        y: targetPosition.y
      }, duration );
      tween.onComplete( function() {
        onComplete && onComplete();
        this.stopWinchBuffer(0.1);
      }.bind(this) );
      tween.delay( timing.speakerWinchStartDelay );
      tween.start();

      var SKIP_INSTRUCTIONS = !!util.getParameterByName('skip_instructions');

      if (!SKIP_INSTRUCTIONS) {
        this.playWinchBuffer( this.assets.audio.engine_start, {
          loop: false,
          volume: 1,
          when: timing.speakerWinchStartDelay / 1000
        });

        this.$winchAudio.source.addEventListener('ended', function() {
          this.playWinchBuffer( this.assets.audio.speaker_winch, {
            loop: true,
            volume: 0.7,
            fadeIn: 1
          });
        }.bind(this), false);

        this.playBuffer( this.assets.audio.speaker_noise, {
          loop: true,
          volume: 15,
          fadeIn: 1,
          when: timing.speakerWinchStartDelay/1000
        });
      }
    },


    stopWinchBuffer: function(fadeOut) {
      if ( this.$winchAudio ){
        if (fadeOut > 0) {
          this.$winchAudio.gain.gain.linearRampToValueAtTime(0, THREE.AudioContext.getContext().currentTime + fadeOut);
        }
        this.$winchAudio.stop(fadeOut);

        setTimeout(function() {
          this.$winchObject.remove(this.$winchAudio);
          this.$winchAudio.panningModel = "equalpower";
          this.$winchAudio.disconnect();
          this.$winchAudio = null;
        }.bind(this), (fadeOut*1000) + 500)

      }
    },

    playWinchBuffer: function( buff, args ){
      when = args.when || 0 ;
      if ( this.$winchAudio ){
        this.$winchAudio.stop();
      }else {
        this.$winchAudio = new PositionalAudioSource( rateLimitedListener );
        this.$winchObject.add(this.$winchAudio);
        this.$winchAudio.panner.panningModel = this.settings.panningModel;
        this.$winchAudio.panner.distanceModel = this.settings.distanceModel;
        this.$winchAudio.setRefDistance( this.settings.refDistance );
        this.$winchAudio.setRolloffFactor( this.settings.rollOffFactor );
      }

      this.$winchAudio.setVolume( args.volume || this.settings.volume );
      this.$winchAudio.setLoop( args.loop || false );
      this.$winchAudio.setBuffer( buff );

      if (args.fadeIn > 0) {
        this.$winchAudio.gain.gain.setValueAtTime(0, THREE.AudioContext.getContext().currentTime + when);
        this.$winchAudio.gain.gain.linearRampToValueAtTime(args.volume || this.settings.volume, THREE.AudioContext.getContext().currentTime + when + args.fadeIn);
      }
      this.$winchAudio.play( when );
    },

    playBuffer: function( buff, args ){
      when = args.when || 0 ;
      if ( this.$audio ){
        this.$audio.stop();
        //this.$transform.remove(this.$audio);
      }else {
        this.$audio = new PositionalAudioSource( rateLimitedListener );
        if ( !GHOST_SPEAKER ){
          this.$audio.position.z = -35.5;
          this.$audio.rotation.x = X_ROTATION_FIX;

        }

        var boxHelper = new THREE.Mesh( new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({color:0x00FF00, wireframe:true} ) );
        //this.$audio.add(boxHelper);
        this.$transform.add(this.$audio);

        this.$audio.panner.panningModel = this.settings.panningModel;
        this.$audio.panner.distanceModel = this.settings.distanceModel;
        this.$audio.setRefDistance( this.settings.refDistance );
        this.$audio.setRolloffFactor( this.settings.rollOffFactor );
      }
      this.$audio.gain.gain.cancelScheduledValues(THREE.AudioContext.getContext().currentTime)
      this.$audio.setVolume( args.volume || this.settings.volume );
      this.$audio.setLoop( args.loop || false );
      this.$audio.setBuffer( buff );

      if (args.fadeIn > 0) {
        this.$audio.gain.gain.setValueAtTime(0, THREE.AudioContext.getContext().currentTime + when);
        this.$audio.gain.gain.linearRampToValueAtTime(args.volume || this.settings.volume, THREE.AudioContext.getContext().currentTime + when + args.fadeIn);
      }
      this.$audio.play( when );
    },
    playLoungeLoop: function() {
      this.playBuffer( this.assets.audio.lounge_loop, {
        loop: true,
        volume: 0.7,
        fadeIn: 1,
        when: 1.5
      });
    },
    playVO: function( name, onComplete, soundId ){

      var obj = this.assets.audio[ name ];
      var buff;
      var id = 0;
      if (Array.isArray(obj)) {
        if (soundId !== undefined) {
          id = soundId % obj.length;
          buff = obj[id];
        }else {
          buff = obj[id];
        }

      }else {
        buff = obj;
      }

      if ( buff ){
        if (this.$audio) {
          if (name == soundpacks[ 0 ].name && this.$audio.isPlaying) {
            // if first soundpack, wait for audio to finish before playing
            this.$audio.source.addEventListener('ended', function() {
              this.playBuffer( buff, { when: 0 });
            }.bind(this), false);
            return;
          }
        }

        this.playBuffer( buff, { when: 0 });

        this.startAnim( name, id );

        if ( onComplete && this.$audio){
          this.$audio.source.addEventListener('ended', onComplete, false);
        }


      } else {
        console.warn('VO: No buffer found named ' + name );
      }

    },

    update: function ( dt, t ) {

      if ( GHOST_SPEAKER ){
        return;
      }

      this.$transform.rotation.y += (-globalSettings.wind.x + Math.cos( t * 0.005 ) * 0.2 * globalSettings.wind.x) * dt * 0.003;
      this.$transform.rotation.x += (-globalSettings.wind.z + Math.sin( t * 0.005 ) * 0.2 * globalSettings.wind.z) * dt * 0.003;
      this.$transform.rotation.x += ( rotation0.x - this.$transform.rotation.x ) * dt * 0.001;
      this.$transform.rotation.y += ( rotation0.y - this.$transform.rotation.y ) * dt * 0.001;

      if ( this.audioAnimationData ){
        this._animTick += dt * 0.001;
        var animProgress = this._animTick / this.audioAnimationData.frameSizeSec;
        var animFrame = Math.floor(animProgress);
        animProgress = Math.min( 1, 0.05 + ( animProgress - animFrame ));

        if ( animFrame < this.audioAnimationData.data.length - 1 ){
          var val = this.audioAnimationData.data[ animFrame ] * ( 1 - animProgress ) + this.audioAnimationData.data[ animFrame + 1 ] * animProgress ; // (Math.sin(dt / 1000) + 1 ) / 2;
          this.$transform.morphTargetInfluences[0] = val;
          this.$transform.morphTargetInfluences[0] *= 0.9;
        } else {
          this.audioAnimationData = null;
        }
      }
    },

    startAnim: function( name, id ){
      if ( this.assets.json[ name ] ){
        var json;
        if (Array.isArray(this.assets.json[ name ])) {
          json = this.assets.json[ name ][id];
        }else {
          json = this.assets.json[ name ];
        }

        this.audioAnimationData = json;
        this._animTick =  0; //dt * 0.001;
        this._animFrame = 0;
      }
    },

});


module.exports = voSpeaker;
