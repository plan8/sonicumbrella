/******************************************************************************
* Change Rain Intensity over time
******************************************************************************/
var soundpacks  = require('../audio/soundpacks');
var MasterBus   = require('../audio/MasterBus');
var TWEEN       = require('tween.js/src/Tween.js');
var timing      = require('../settings/timing');
var events      = require('../helpers/events');
var util        = require('../util');

var FORCE_RANDOM = !!util.getParameterByName('mrmode');

var rainFramesIntro = [{
  fn: function(){
    // dummy delay
  },
   duration: timing.rainAutomation.intro.startDelay
  },
  {
  fn: function(){
    this.tweenTo( this.settings.min, timing.rainAutomation.intro.positionInViewTime * 0.5, TWEEN.Easing.Sinusoidal.InOut );
    this.dispatchEvent( { type: 'RAIN_POSITION_CHANGE', data: FORCE_RANDOM ? 'RANDOM' : "IN_VIEW" } );
  },
   duration: timing.rainAutomation.intro.positionInViewTime
  },
  {
   fn: function(){
     this.dispatchEvent( { type: 'RAIN_POSITION_CHANGE', data: FORCE_RANDOM ? 'RANDOM' : "LEFT" } );
   },
   duration: timing.rainAutomation.intro.positionLeftTime
  },
  {
   fn: function(){
     this.dispatchEvent( { type: 'RAIN_POSITION_CHANGE', data: FORCE_RANDOM ? 'RANDOM' : "RIGHT" } );
   },
   duration: timing.rainAutomation.intro.positionRightTime
  },
  {
   fn: function(){
    // this.tweenTo( (Math.random() * this.settings.randomRain) + this.settings.light, fadeTime, TWEEN.Easing.Sinusoidal.InOut);
     var rain = this.settings.max;
     if ( soundpacks[ this.currentSoundPack ].name === 'kalimba') {
       rain = 60;
     }
     this.tweenTo( rain, timing.rainAutomation.intro.positionRandomTime * 0.75, TWEEN.Easing.Sinusoidal.InOut);
     this.dispatchEvent( {type: 'RAIN_POSITION_CHANGE', data: FORCE_RANDOM ? 'RANDOM' : "RANDOM" } );
     this.dispatchEvent( {type: 'RAIN_HEAVY_START' } );
   },
   duration: timing.rainAutomation.intro.positionRandomTime
  },
  {
    fn: function(){
      var _this = this;
      this.tweenTo( 0, timing.rainAutomation.intro.transitionOutTime * 0.5, TWEEN.Easing.Sinusoidal.InOut, function() {
        _this.changeRain();
        _this.dispatchEvent( {type: 'RAIN_POSITION_CHANGE', data: FORCE_RANDOM ? 'RANDOM' : "IN_VIEW" } );
        _this.dispatchEvent( {type: 'RAIN_HEAVY_END' } );

      });

    },
    duration: timing.rainAutomation.intro.transitionOutTime
  },
];

var rainFramesNormal = [{

   fn: function(){
     this.tweenTo( this.settings.min, timing.rainAutomation.main.positionInViewTime * 0.5, TWEEN.Easing.Sinusoidal.InOut);
     this.dispatchEvent( {type: 'RAIN_POSITION_CHANGE', data: FORCE_RANDOM ? 'RANDOM' : "IN_VIEW" } );
   },
   duration: timing.rainAutomation.main.positionInViewTime
  },
  {
   fn: function(){
     //this.tweenTo( (Math.random() * this.settings.randomRain) + this.settings.light, fadeTime, TWEEN.Easing.Sinusoidal.InOut);
     var rain = this.settings.max;
     if ( soundpacks[this.currentSoundPack].name === 'kalimba' ) {
       rain = 60;
     }
     this.tweenTo( rain, timing.rainAutomation.main.positionRandomTime * 0.75, TWEEN.Easing.Sinusoidal.InOut);
     this.dispatchEvent( {type: 'RAIN_POSITION_CHANGE', data: "RANDOM" } );
     this.dispatchEvent( {type: 'RAIN_HEAVY_START' } );

   },
   duration: timing.rainAutomation.main.positionRandomTime
  },
  {
   fn: function(){
     var _this = this;

     this.tweenTo( 0, timing.rainAutomation.main.transitionOutTime * 0.5, TWEEN.Easing.Sinusoidal.InOut, function() {
       _this.changeRain();

       _this.dispatchEvent( {type: 'RAIN_POSITION_CHANGE', data: FORCE_RANDOM ? 'RANDOM' : "IN_VIEW"  } );
       _this.dispatchEvent( {type: 'RAIN_HEAVY_END' } );

     });

   },
   duration: timing.rainAutomation.main.transitionOutTime
  },
];

function RainAutomation(){
  this.tweenObject.rainPercent = 1;
  this.currentSoundPack = -1;
}

RainAutomation.prototype = Object.assign( Object.create( THREE.EventDispatcher.prototype ), {

    constructor: RainAutomation,

    settings: {
      max: 100,
      min: 1,
      light: 10,
      randomRain: 50
    },

    tweenObject: {
      rainPercent: 0,
    },

    setup: function() {
      this.dispatchEvent( {type: 'RAIN_ANIMATION_CHANGE', data: this.tweenObject.rainPercent } );
    },

    tweenTo: function( val, duration, easing, cb ) {
      var tween = new TWEEN.Tween(this.tweenObject);

      if (easing) {
        tween.easing(easing);
      }

      tween.to({ rainPercent: val }, duration);

      var _this = this;
      tween.onUpdate(function() {
        _this.dispatchEvent( {type: 'RAIN_ANIMATION_CHANGE', data: _this.tweenObject.rainPercent } );
      });

      tween.onComplete(function() {
        _this.dispatchEvent( {type: 'RAIN_ANIMATION_CHANGE', data: val } );
        cb && cb();
      });

      tween.start();
    },

    handleRestart: function(){
      this.currentSoundPack = -1;
      this.changeRain(true);
      this.restartRainSequence();
    },

    stop: function(){
      if ( this._frameAnimTimeout !== undefined ) {
        clearTimeout(this._frameAnimTimeout);
        this._frameAnimTimeout = undefined;
      }
    },

    restartRainSequence: function(){
      this._startFrameAnimation( this._hasStarted ? rainFramesNormal : rainFramesIntro );
      this._hasStarted = true;
    },

    _startFrameAnimation: function( frames ) {

      this.stop();

      var frameIdx = 0;
      var _this = this;

      var loadTest = false;


      (function loop(){

        if ( frameIdx < frames.length ){
          var f = frames[ frameIdx ];
          f.fn.call( _this );

          _this._frameAnimTimeout = setTimeout( loop, loadTest ? 1000 : f.duration );
        }

        frameIdx++;

      })();

    },

    changeRain: function( force ) {

      //don't change when tab is not in focus
      if (!MasterBus.isHidden() || force ) {

        this.currentSoundPack ++;

        if (this.currentSoundPack < soundpacks.length ) {
          var nextPack = soundpacks[ this.currentSoundPack ].name;
          this.dispatchEvent( {type: 'SOUND_PACK_CHANGE', data: nextPack } );
        }else {
          this.dispatchEvent( {type: 'RAIN_ANIMATION_CHANGE', data: 0 } );
          this.dispatchEvent( {type: 'COMPLETE' } );
        }
      }
    }
});

module.exports = new RainAutomation();
