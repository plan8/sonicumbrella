/******************************************************************************
* Container for THREE.Camera
******************************************************************************/
var ThreeObj            = require('../ThreeObj');
var globalSettings      = require('../settings/globalSettings');
var util                = require('../helpers/Util');
var TWEEN               = require('tween.js/src/Tween.js');
var rateLimitedListener = require('../audio/rateLimitedListener');

module.exports = ThreeObj.create({

  setup: function( $scene ){

    this.updateIntroCameraPos = this.updateIntroCameraPos.bind(this);

    var aspectRatio = window.innerWidth / window.innerHeight;

    var $cam = new THREE.PerspectiveCamera(75, aspectRatio, 0.001, 100);


    //fix since VRControl updates camera rotation with a YXZ rotation
    $cam.rotation.order = "YXZ";

    $cam.add( rateLimitedListener );

    this.$camera = $cam;

    this.updateIntroCameraPos();

    window.addEventListener('resize', this.updateIntroCameraPos, false );
  },

  updateIntroCameraPos: function(){
    this.$camera.position.z =  1 + ( 300 / window.innerWidth );
    this.$camera.position.y = window.innerWidth > 700 ? 2.3 : 2.6;
    //this.$camera.lookAt( new THREE.Vector3( 0, this.$camera.position.y+0.3, -1 ) );
  },
  endExperience: function() {
    this.shakeCamera();
  },
  shakeCamera: function() {
    var fovTween = new TWEEN.Tween(this.$camera);
    fovTween.easing(TWEEN.Easing.Cubic.In);
    var orgPosition = this.$camera.position;
    fovTween.to({
      position: 1,
    }, 3000 );

    fovTween.onUpdate(function( k ){
      this.$camera.position.x += k*k*Math.random()*0.08;
      this.$camera.position.y += k*k*Math.random()*0.08;
      this.$camera.position.z += k*k*Math.random()*0.08;

      this.$camera.updateProjectionMatrix();
    }.bind(this));

    var _this = this;
    fovTween.onComplete(function() {
      //reset
      _this.$camera.position = orgPosition;
      _this.$camera.updateProjectionMatrix();
    });
    fovTween.start();

  },
  restartExperience: function() {
    this.shakeCamera();
  },
  startExperience: function(){
    window.removeEventListener('resize', this.updateIntroCameraPos, false );

  },

  getCameraDirection: function() {
    var vector = new THREE.Vector3( 0, 0, - 1 );
    vector.applyQuaternion( this.$camera.quaternion );
    return vector;
  },

  tweenRotation: function( targetEuler, duration, onComplete ){

    var rotationVector = this.$camera.rotation.clone();
    var rotationTween = new TWEEN.Tween(rotationVector);

    rotationTween.to({
      x: targetEuler.x,
      y: targetEuler.y,
      z: targetEuler.z
    }, duration || 400 );
    rotationTween.onUpdate(function( p ){
      this.$camera.rotation.set( rotationVector.x, rotationVector.y, rotationVector.z );
    }.bind(this));

    if ( onComplete ){
      rotationTween.onComplete(onComplete);
    }

    rotationTween.start();

    return rotationTween;
  },

  tweenPosition: function( targetPosition, duration, onComplete ){
    var tween = new TWEEN.Tween(this.$camera.position);
    tween.easing(TWEEN.Easing.Sinusoidal.InOut);
    tween.to( {x:targetPosition.x, y:targetPosition.y, z:targetPosition.z}, duration || 400);
    tween.start();
    if ( onComplete ){
      tween.onComplete( onComplete );
    }
    return tween;
  }
});
