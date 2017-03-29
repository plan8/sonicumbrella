/******************************************************************************
* Thunder (Light and sound)
******************************************************************************/
var rateLimitedListener       = require('../audio/rateLimitedListener');
var ThreeObj                  = require('../ThreeObj');
var rainAutomation            = require('../objects/rainAutomation');
var TWEEN                     = require('tween.js/src/Tween.js');
var globalSettings            = require('../settings/globalSettings');
var AudioSource               = require('../audio/AudioSource');

var settings = {
    maxInterval: 30000
};

module.exports = ThreeObj.create({

  assets:{
    audio:{
      thunder: 'assets/audio/thunder.ogg|mp3'
    }
  },

  setup: function( $scene ){
    var ambLight = new THREE.AmbientLight( 0xFFFFFF, 0 );
    this.$thunderLight= ambLight;
    $scene.add( ambLight );

    this.$audio = new AudioSource( rateLimitedListener );
    this.$audio.setBuffer( this.assets.audio.thunder );
    this.hasPlayed = false;
    this.$scene = $scene;
    this._lastThunderTime = 0;

    rainAutomation.addEventListener( 'RAIN_ANIMATION_CHANGE', function handleChange( e ){
      var now = Date.now();
      if ( now - this._lastThunderTime > settings.maxInterval ){

        var rainIntensity = e.data;

        if ( rainIntensity > 30 && !this.thunderHasPlayed){
        //  if ( this.hasPlayed ){

            this.trigger();
            //rainAutomation.removeEventListener( 'RAIN_ANIMATION_CHANGE', handleChange );
      //    }
        }
        this._lastThunderTime = now;
      }
    }.bind(this));

  },


  trigger: function(){
    var l = this.$thunderLight;
    var tween = new TWEEN.Tween( l );
    tween.easing(TWEEN.Easing.Sinusoidal.InOut);

    tween.to( {intensity: 1}, 100);

    tween.repeat(1);
    tween.yoyo(true);
    tween.start();

    this.hasPlayed = true;
    this.$audio.playbackRate = globalSettings.timeScale;
    this.$audio.play();
  },


});
