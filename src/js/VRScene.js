var Scene               = require('./Scene.js');
var VREffect            = require('three/examples/js/effects/VREffect.js');
var device              = require('./helpers/device');
var webvrCheck          = require('./helpers/webvrCheck');
var VRControl           = require('three/examples/js/controls/VRControls');
var util                = require('./util');
var FLY_CAM             = !!util.getParameterByName('fly');

var FORCE_VR_ENABLE = !!util.getParameterByName('oculus');

require('three/examples/js/controls/FlyControls');

function VRScene() {
  Scene.call( this );
}

VRScene.prototype = Object.assign( Object.create( Scene.prototype ), {

    constructor: VRScene,

    init: function($scene) {
      var _this = this;

      this.VREffect = new THREE.VREffect(this.$renderer);
      this.$controls = null;

      this.$renderer.sortObjects = true;

      var enterVR = new webvrui.EnterVRButton(this.$renderer.domElement, {
            color: 'white',
            background: false,
            corners: 'square'
      });



      if (!FORCE_VR_ENABLE && device.isTablet) {
        enterVR.disable();
      }

      enterVR.domElement.addEventListener( 'click', function(){
        ga('send', 'event', {
          eventCategory: 'InGame',
          eventAction: 'EnterVR'
        });
      }, false );


      var enter360 = document.createElement('a');
      enter360.href="#";
      enter360.addEventListener('click', function(){
        enterVR.requestEnterFullscreen();
      }, false);
      enter360.className = "enter360";
      //enter360.innerHTML = 'Try it in 360';
      document.getElementById('enterVrButtonContainer').appendChild(enterVR.domElement);
      document.getElementById('enterVrButtonContainer').appendChild(enter360);
      window.addEventListener('vrdisplaypresentchange', this._onWindowResize, true);

      this.vrButton = enterVR;

      return Scene.prototype.init.call(this, $scene);
    },

    render: function(dt, ts) {

      this.$renderer.render(this.$scene,this.$camera);

      if(this.vrButton.state === webvrui.State.PRESENTING){
        this.VREffect.render(this.$scene, this.$camera);
      }
    },

    update: function(dt){
      if( this.$controls && this.$controls.update ){
          this.$controls.update( dt*0.001 );
          if( this.vrGamePad && this.$controls.getStandingMatrix ) {
            this.vrGamePad.standingMatrix = this.$controls.getStandingMatrix();
          }
      }
    },

    _startUpdateLoop:function() {
      var _this = this;
      var lastTime = 0;
      var animationDisplay;

      function loop(timestamp) {

        //stats.begin();
        animationDisplay.requestAnimationFrame(loop);

        // clamp delta to max 50 to avoid too drastic changes

        var dt = Math.min(timestamp - lastTime, 500);

        lastTime = timestamp;

        _this.update && _this.update(dt, timestamp);

        _this.render();

        //stats.end();
      };

      this.vrButton.getVRDisplay()
        .then(function(display) {
            animationDisplay = display;
            display.requestAnimationFrame(loop);
        })
        .catch(function(){
            // If there is no display available, fallback to window
            animationDisplay = window;
            window.requestAnimationFrame(loop);
        });


    },

    enableControlls: function(){

      if ( this.vrButton.state === webvrui.State.PRESENTING_FULLSCREEN ){
        // VRFrameData is immutable if instantiated from the native constructor,
        // so we're overriding it here to allow the polyfill to update it with the MouseKeyboardVRDisplay
        // perhaps a better solution would be to override VRControls to be aware of the polyfill
        window.VRFrameData = function(){
          this.leftProjectionMatrix = new Float32Array(16);
          this.leftViewMatrix = new Float32Array(16);
          this.rightProjectionMatrix = new Float32Array(16);
          this.rightViewMatrix = new Float32Array(16);
          this.pose = null;
        }

        this.$controls = FLY_CAM ? new THREE.FlyControls(this.$camera) :new THREE.VRControls( this.$camera );

        // mouse, keyboard (dekstop) and magic window (mobile) relies on the webvr-polyfill displays
        navigator.getVRDisplays().then( function( displays ){
          var targetTag = device.isMobile ?  'Cardboard VRDisplay (webvr-polyfill)' : 'Mouse and Keyboard VRDisplay (webvr-polyfill)';
          var display360 = displays.find(function(d){ return d.displayName === targetTag; })
          if ( display360 ){
            this.$controls.setVRDisplay( display360 );
          } else {
            console.error('No polyfilled VR display found for this device');
          }
        }.bind(this)).catch ( function () {
          console.warn( 'VRScene Unable to get VR Displays' );
        });

      } else {
        this.$controls = new THREE.VRControls( this.$camera );
      }
      if ( !FLY_CAM ){
        this.$controls.standing = true;
        this.$controls.resetPose();
      }
    }

});

VRScene.create = Scene.create;


module.exports = VRScene;
