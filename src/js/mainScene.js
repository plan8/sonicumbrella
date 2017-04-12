/******************************************************************************
* Main Scene
******************************************************************************/
var TWEEN                     = require('tween.js/src/Tween.js');
var screenShot                = require('./helpers/screenShot');

// Framework
var Reticle                   = require('./UI/Reticle');
var VRScene                   = require('./VRScene');

var device                    = require('./helpers/device');
var masterBus                 = require('./audio/masterBus');
var Button                    = require('./UI/Button');
var util                      = require('./util');
var webvrCheck                = require('./helpers/webvrCheck');


require('./libs/three/controls/VRGamePad');

// Objects
var umbrella                  = require('./objects/umbrella');
var rain                      = require('./objects/rain');
var rainAutomation            = require('./objects/rainAutomation');
var soundpackController       = require('./objects/soundpackController');
var umbrellaToggleButton      = require('./objects/umbrellaButton');
var thunder                   = require('./objects/thunder');
var floor                     = require('./objects/floor');
var voSpeaker                 = require('./objects/voSpeaker');
var cameraRig                 = require('./objects/cameraRig');
var restartButton             = require('./objects/restartButton');
var endingScreen              = require('./objects/endingScreen');

// Helpers
var instructions              = require('./helpers/instructions');
var MouseRaycaster            = require('./helpers/MouseRaycaster');
var globalVars                = require('./helpers/globalVars');

var events                    = require('./helpers/events');
var getWindowOrientation      = require('./helpers/getWindowOrientation');

// Audio
var sharedSounds              = require('./audio/sharedSounds');

// Settings
var wind                      = require('./settings/wind');
var timing                    = require('./settings/timing');
var globalSettings            = require('./settings/globalSettings');

// DOM Elements
var loadScreen                = require('./dom/loadScreen');
var landingScreen             = require('./dom/landingScreen');
var aboutScreen               = require('./dom/aboutScreen');

var SKIP_INSTRUCTIONS = !!util.getParameterByName('skip_instructions');
var START_IN_VR = !!util.getParameterByName('vr');

var webvrAvailible = (function () {
  return navigator.getVRDisplays !== undefined || navigator.getVRDevices !== undefined;
}());

var mainScene = VRScene.create({

  onLoad: function(){

    loadScreen.show();

    var promises = [
      soundpackController.load(),
      rain.load(),
      umbrella.load(),
      thunder.load(),
      floor.load(),
      voSpeaker.load(),
      endingScreen.load(),
      restartButton.load(),
      umbrellaToggleButton.load()
    ];

    // default to false
    this.isWebVRAvailible = false;

    // not really loading, but resolve the WebVR check before we start.
    if ( webvrAvailible ){
      promises.push( navigator.getVRDisplays().then(function(displays){
        this.isWebVRAvailible = displays.length > 0 && displays[0].displayName !== 'Mouse and Keyboard VRDisplay (webvr-polyfill)' ;
      }.bind(this)));
    }

    return Promise.all( promises );

  },

  setup: function( $scene ) {
    // expose scene on window to allow mixed reality and other plugins
    window.scene = $scene;

    thunder.setup( $scene );
    voSpeaker.setup( $scene );

    umbrellaToggleButton.setup( $scene );
    endingScreen.setup( $scene );

    soundpackController.changeAmbience( 0 );
    //start to load next soundpack
    soundpackController.loadNext();

    $scene.fog = new THREE.Fog( 0x000000, 3, 35 );
    $scene.background = new THREE.Color( 0x000000 );

    this.mouseRayCaster = new MouseRaycaster( cameraRig.$camera );

    this.setupLanding();
    this.setupAbout();

    masterBus.setup();
    soundpackController.setup( $scene );
    rain.setup( $scene );
    umbrella.setup( $scene );
    this.setupLights( $scene );

    //remove loading div
    loadScreen.fadeOut(function(){
      this.showLanding();
    }.bind( this) );

    rainAutomation.setup( $scene );

    events.addEventListener( events.RESTART_EXPERIENCE, this.restartExperience.bind( this ), false );

  },

  setupVRControllers: function(){

    if (!navigator.getGamepads) return;

    this.vrGamePad = new THREE.VRGamePad( 0 );

    this.vrGamePad.addEventListener( 'buttondown', function( e ){

      this.deinitGaze();

      if ( this._isKickedOut && !this._hasClickedRestart ) {
        this._hasClickedRestart = true;
        events.dispatchEvent({type: events.RESTART_EXPERIENCE});
      } else {
        umbrella.toggle();
      }

    }.bind(this));

    umbrella.addEventListener('IMPACT', function( e ){
      this.vrGamePad.tryVibrate( Math.max( 0.1, e.strength ), 20 );
    }.bind(this))

    if ( this.vrGamePad ){
      this.$scene.add( this.vrGamePad );
    }
  },

  startRain: function() {
    if ( SKIP_INSTRUCTIONS ){
      voSpeaker.transitionIn( 10, function(){
        voSpeaker.startListeningToSoundChange();
        rainAutomation.restartRainSequence();

      }.bind( this ));
    } else {
      voSpeaker.transitionIn( timing.speakerWinchTime, function(){
          instructions.start( function(){
            voSpeaker.startListeningToSoundChange();
            rainAutomation.restartRainSequence();
          });
      }.bind( this ));
    }
  },

  restartExperience: function(){

    ga('send', 'event', {
      eventCategory: 'InGame',
      eventAction: 'RestartExperience'
    });

    var scene = this.$scene;
    var reticle = this.reticle;
    cameraRig.restartExperience();

    setTimeout(function() {

      this._isKickedOut = false;
      this._hasClickedRestart = false;
      umbrella.addToScene();

      if ( this._displayGazeButtons ) {
        umbrellaToggleButton.addToScene();
        this.reticle.addCollider( umbrellaToggleButton.$mesh );
      }

      floor.addToScene();

      scene.background.setHex( 0x000000 );
      scene.fog.color.copy( scene.background );

      scene.add( voSpeaker.$transform );

      rainAutomation.handleRestart();
      this._experienceStarted = false;
      SKIP_INSTRUCTIONS = true;
      this.startRain();
      scene.remove(this.grid);

      if (reticle) {
        reticle.removeCollider( restartButton.sprite );
      }
      endingScreen.removeFromScene();
    }.bind(this), 3000);

    sharedSounds.play('kick_out');
    endingScreen.$transform.remove( restartButton.$transform );
    //scene.remove( this.$endingScreen );

  },

  startExperience: function(){

    if (device.isMobile) {
      document.getElementsByClassName('plan8-logo-container')[0].style.display = 'none';
      document.getElementsByClassName('webvr-logo-container')[0].style.display = 'none';
    }

    ga('send', 'event', {
      eventCategory: 'InGame',
      eventAction: 'StartExperience',
      eventLabel: this.vrButton.state === 'error-no-presentable-displays' ? '360' : this.vrButton.state
    });


    floor.setup( this.$scene );

    if ( this._experienceStarted ){
      console.error('startExperience called twice')
      return;
    }

    this._experienceStarted = true;

    events.addEventListener( events.TOGGLE_UMBRELLA, this.onUmbrellaStateChange.bind( this ) );

    this.startRain();
    rainAutomation.stop();

    // initial rain change, starts the rain
    rainAutomation.changeRain( true );

    rainAutomation.addEventListener( 'COMPLETE', this.onRainComplete.bind( this ) );

    var tween = cameraRig.tweenPosition( { x:0, y: 1.6, z: 0 }, 1000 ).delay( 800 );
    umbrella.toggle(umbrella.DOWN);

    tween.onComplete(function(){

      this.enableControlls();

      //if (  this.vrGamePad ){
      umbrella.followCamera( true );
      //}
      cameraRig.startExperience();
      soundpackController.startExperience();

    }.bind(this));

    if ( !device.isMobile ) {
      document.body.addEventListener( 'keyup', function( e ){
          if( e.keyCode === 32 ){
              umbrella.toggle();
              this.deinitGaze();
          } else if ( e.keyCode === 27 ){
            this.toggleVR();
          }
      }.bind(this), false );

    } else {
      document.addEventListener(device.isAndroid ? 'click' : 'touchstart', function() {
        umbrella.toggle();
        this.deinitGaze();
      }.bind(this));
    }

    if ( device.isIOS && !globalVars.is360 ) {
      this.initGaze();
    }

    rain.startExperience();

  },

  initGaze: function(){
    if ( !this.reticle ){
      this.reticle = new Reticle(cameraRig.$camera);
      this.reticle.addCollider( umbrellaToggleButton.$mesh );
    }
    // cache setting to use in restartExperience etc
    this._displayGazeButtons = true;

    umbrellaToggleButton.addToScene()
    this.reticle.addCollider( umbrellaToggleButton.$mesh );
  },

  deinitGaze: function(){
    if ( this._displayGazeButtons ){
      this._displayGazeButtons = false;
      this.destroyReticle();
      umbrellaToggleButton.removeFromScene();
    }
  },

  transitionIn: function(){
    cameraRig.tweenRotation( { x: 0, y: 0, z: 0 }, 1000 );
    rain.fadeOutIntroRain( this.startExperience.bind( this ) );
  },


  destroyReticle: function(){
    if ( this.reticle  ){
      this.reticle.destroy();
      this.reticle = null;
    }
  },

  setupLights: function($scene){

    var dirLight = new THREE.DirectionalLight( 0xFFFFFF, .75 );
    dirLight.position.set(-13, 10, 20);

    $scene.add( dirLight );

    var dirLight2 = new THREE.DirectionalLight( 0xFFFFFF, .6);
    dirLight2.position.set(13, 2, -10);
    $scene.add( dirLight2 );

    this.dirLight2 = dirLight2;

  },

  setupCamera: function() {
    cameraRig.setup();
    return cameraRig.$camera;
  },

  onRainComplete: function( e ) {
    instructions.startEnding(function() {
      this.endExperience();
    }.bind(this));
  },


  setupAbout: function() {
    var _this = this;
    document.getElementById('about-button').addEventListener('click', function() {
      aboutScreen.show();
      masterBus.setVolume(0.2, 0.5);
    });

    document.getElementById( 'about-xbutton' ).addEventListener( 'click', function() {
      aboutScreen.hide();
      masterBus.setVolume(1, 0.5);
    });

  },

  exitVR: function(){
    if ( this._isInVR ){
      this.showLanding();
    }
  },

  enterVR: function(){
    this.hideLanding();
    document.getElementsByClassName('plan8-logo-container')[0].style.display = 'none';
    document.getElementsByClassName('webvr-logo-container')[0].style.display = 'none';
  },

  toggleVR: function(){
    if ( this._isInVR ){
      this.exitVR();
    } else {
      this.enterVR();
    }
  },

  showNoVRLanding: function() {
    landingScreen.show( false );
  },

  showLanding: function() {
    landingScreen.show( true );
  },

  hideLanding: function() {
    landingScreen.fadeOut();
  },

  endExperience: function(){
    var scene = this.$scene;

    ga('send', 'event', {
      eventCategory: 'InGame',
      eventAction: 'EndExperience'
    });

    cameraRig.endExperience();

    setTimeout(function() {

      this._isKickedOut = true;

      restartButton.setup( scene, this._displayGazeButtons );
      endingScreen.$transform.add( restartButton.$transform );
      this.mouseRayCaster.addCollider( restartButton.$transform );
      restartButton.$transform.position.y = 1.6;

      if ( this._displayGazeButtons ) {

        this.reticle.addCollider( restartButton.sprite );
        this.reticle.removeCollider( umbrellaToggleButton.$mesh );
        umbrellaToggleButton.removeFromScene();
      }else if (device.isMobile && !webvrCheck.hasController()) {
        // cardboard without gazebutton restarts when clicking anywhere
        document.addEventListener(device.isAndroid ? 'click' : 'touchstart', onCardboardRestart = function() {
          document.removeEventListener(device.isAndroid ? 'click' : 'touchstart', onCardboardRestart);
          events.dispatchEvent({ type: events.RESTART_EXPERIENCE });
        }.bind(this));
      }else if (!device.isMobile && globalVars.is360) {
        //desktop 360
        document.body.addEventListener( 'keyup', onSpaceBarRestart = function( e ){
            if( e.keyCode === 32 ){
                document.removeEventListener('keyup', onSpaceBarRestart);
                events.dispatchEvent({ type: events.RESTART_EXPERIENCE });
            }
        }.bind(this), false );
      }

      umbrella.removeFromScene();
      floor.removeFromScene();

      this.$scene.remove(voSpeaker.$transform);
      this.grid = new THREE.GridHelper(50,100);
      this.grid.material.fog = true;
      scene.background = new THREE.Color(0.6, 0.6, 0.6);
      scene.fog.color.copy( scene.background );
      scene.add(this.grid);
      var orgY = endingScreen.$transform.position.y;

      endingScreen.$transform.position.set( 0, 0, - 3 );
      endingScreen.$transform.position.applyMatrix4( cameraRig.$camera.matrixWorld );

      endingScreen.$transform.position.y = orgY;
      endingScreen.$transform.rotation.y = cameraRig.$camera.rotation.y;
      endingScreen.addToScene();
      //scene.add(this.$endingScreen);

      voSpeaker.playLoungeLoop();

    }.bind( this ), 3000 );

    sharedSounds.play('kick_out');

  },


  setupLanding: function() {

    var _this = this;

    this.vrButton.on("enter", function(){

      if(_this.vrButton.state === webvrui.State.PRESENTING){
        globalVars.isVR = true;
        globalVars.is360 = false;
      }else {
        globalVars.isVR = false;
        globalVars.is360 = true;
      }

      setTimeout(function(){
        _this.setupVRControllers();
        _this.hideLanding();
        if ( device.isMobile ){
          rain.clear();
          _this.startExperience();
        } else {
          _this.transitionIn();
        }
      }, 800 );
    })
    .on("exit", function(){
        _this.showLanding();
        _this.$camera.quaternion.set(0,0,0,1);
        if ( _this.$controls ){
          _this.$camera.position.set(0, _this.$controls.userHeight,0);
        }
    })
    .on("error", function(error){
        console.error(error)
    });

    if ( START_IN_VR ){
      this.vrButton.getVRDisplay().then(function(display){
        _this.vrButton.requestEnterVR(display);
      })
    }
  },


  /**
  * Main update loop
  */
  update: function(dt, timestamp) {

    VRScene.prototype.update.call(this, dt,timestamp);

    if ( this.vrGamePad ){
      this.vrGamePad.update();
    }

    if (this.reticle) {
      this.reticle.update(dt, timestamp);
    }

    rain.update(dt, timestamp);
    umbrella.update(dt, timestamp);
    voSpeaker.update(dt, timestamp);
    instructions.update(dt, timestamp);

    // drive TWEEN.js animations
    TWEEN.update();
  },

  onUmbrellaStateChange: function( e ){
    // don't play sound when kicked out
    if (this.$scene.getObjectByName('umbrella_transform')) {
      sharedSounds.toggleUmbrella( e );
    }
  },

});

module.exports = mainScene;
