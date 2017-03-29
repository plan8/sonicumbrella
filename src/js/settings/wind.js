var rainAutomation        = require('../objects/rainAutomation');
var globalSettings        = require('./globalSettings');
var util                  = require('../util');
var ThreeObj              = require('../ThreeObj');
var rateLimitedListener   = require('../audio/rateLimitedListener');
var PositionalAudioSource = require('../audio/PositionalAudioSource');

var WIND = !!util.getParameterByName('wind');

if ( WIND ){

    var audio = ThreeObj.create({
      assets: {
        audio: {
          wind: 'assets/audio/wind_extra.wav'
        }
      }
    });


    audio.load().then(function(){
      var audioSrc = new PositionalAudioSource( rateLimitedListener );
      audioSrc.setBuffer( audio.assets.audio.wind );

      audioSrc.setLoop(true);
      audioSrc.setVolume(0);
      audioSrc.play();


        var soundPack = '';

        var soundPackWinds = {
          pingpong: { x: 0, y: 0.08 },
          fruits: { x: 0.02, y: 0.05 },
          kalimba: { x:0, y: 0 },
          drums: { x: 0.1, y: 0 },
          eggs: { x: 0.1, y: -0.1 },
          squeaky_toys: { x: 0, y: 0 },
          violin: { x: 0, y: 0 },
          cans: { x: 0.6, y: -0.4 }
        };

        var windDir = { x: 0, y: 0 };

        rainAutomation.addEventListener('RAIN_ANIMATION_CHANGE', function( e ){
          var r = e.data * 0.01;
          r *= r;

          globalSettings.wind.x = r * windDir.x;
          globalSettings.wind.z = r * windDir.y;
         var windLen = THREE.Vector2.prototype.length.call({x:globalSettings.wind.x, y:globalSettings.wind.z});

          audioSrc.setVolume( r * windLen * 2 );

        });


        rainAutomation.addEventListener('SOUND_PACK_CHANGE', function( e ){
          windDir = soundPackWinds[ e.data ] || { x: 0, y: 0 };
          console.log('wind SOUND_PACK_CHANGE ',e.data,windDir);
          var normal = new THREE.Vector2( windDir.x, windDir.y ).normalize();

          audioSrc.position.set( -normal.x, 1.6, -normal.y );
        });

    });
}
