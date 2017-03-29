/******************************************************************************
* Main Umrella mesh / animation. Full mesh consists of umbrellaCanvas,
* umbrellaRods and umbrellaHandle
******************************************************************************/
var globalSettings          = require('../settings/globalSettings');

var ThreeObj                = require('../ThreeObj');
var cameraRig               = require('./cameraRig');

var events                  = require('../helpers/events')
var device                  = require('../helpers/device')
var TWEEN                   = require('tween.js/src/Tween.js');

var materials               = require('../settings/materials');

var umbrellaPositionInitial = new THREE.Vector3( 0, -0.2, 0 );
var umbrellaPositionUp      = device.isMobile ? new THREE.Vector3( 0.15, -0.4, -0.35 ) : new THREE.Vector3( 0.2, -0.3, -0.45 );
var umbrellaPositionDown    = device.isMobile ? new THREE.Vector3( 0.15, -0.3, -0.35 ) : new THREE.Vector3( 0.2, -0.2, -0.45 );

// fix for normals in blender exported model
var fixNormals = require('../helpers/fixNormals');

var rotation0 = new THREE.Vector3();

var TWO_PI = Math.PI * 2;

/**
/* Asset paths defined here will automatically get replaced with loaded THREE assets
*/
var umbrella = ThreeObj.create({

    assets: {
      models: {
        'umbrella': 'assets/models/plan8_lowpoly/lowpoly_umbrella.json'
      }
    },

    state: 0,

    setup: function( $scene ) {

      this.$scene = $scene;

      for ( var i = 0; i < this.assets.models.umbrella.materials.length; i++ ){
        this.assets.models.umbrella.materials[ i ] =  materials.umbrella[ i ];
      }

      var umbrellaMesh = new THREE.Mesh( this.assets.models.umbrella.geometry, new THREE.MultiMaterial( this.assets.models.umbrella.materials ));

      fixNormals( umbrellaMesh.geometry );

      umbrellaMesh.scale.multiplyScalar( 1 );
      this.$transform = new THREE.Object3D();

      umbrellaMesh.position.y = -0.8;
      umbrellaMesh.position.z = 0.1;
      this.$rotationTransform = new THREE.Object3D();
      this.$rotationTransform.add( umbrellaMesh );
      this.$rotationTransform.scale.set( 0.7, 0.7, 0.7 );

      this.$transform.add( this.$rotationTransform );
      this.$transform.position.y = 1.6;
      this.$transform.rotation.x = -0.12;

      if ( this._followCamera ){
        this.$transform.position.set( cameraRig.$camera.position.x, cameraRig.$camera.position.y, cameraRig.$camera.position.z )
      }

      var animMixer1  =  new THREE.AnimationMixer( umbrellaMesh );
      var animClip1   = THREE.AnimationClip.CreateFromMorphTargetSequence( 'anim1', this.assets.models.umbrella.geometry.morphTargets, 30, true );
      var animAction1 = animMixer1.clipAction( animClip1 );
      animAction1.setDuration( 1 ).play().time = animClip1.duration;
      animAction1.paused = true;

      this.addToScene();

      this._rotationTween = new TWEEN.Tween( this.$rotationTransform.rotation )

      var tweenValue = this._tweenValue = { time: 0, lastTime: Date.now() };
      this._umbrellaTween = new TWEEN.Tween(this._tweenValue);
      this._umbrellaTween.easing( TWEEN.Easing.Sinusoidal.InOut );
      this._umbrellaTween.onUpdate(function( value ){
        var now = Date.now();
        var dt = now - tweenValue.lastTime;
        animAction1.time =  tweenValue.time;
        animMixer1.update( dt );
        tweenValue.lastTime = now;
      });

      this.toggle( umbrella.UP );

      //start down
      this.$rotationTransform.rotation.x = -Math.PI;
    },

    addToScene: function() {
      this.$transform.name = 'umbrella_transform';
      this.$scene.add(this.$transform);
    },

    removeFromScene: function() {
      this.$scene.remove(this.$transform);
    },

    tweenToFPV: function(){

    },

    updateUmbrellaPosition: function(){
      if ( this.state === umbrella.UP ){
        this.$rotationTransform.position.x = umbrellaPositionUp.x;
        this.$rotationTransform.position.y = umbrellaPositionUp.y;
        this.$rotationTransform.position.z = umbrellaPositionUp.z;
      } else {
        this.$rotationTransform.position.x = umbrellaPositionDown.x;
        this.$rotationTransform.position.y = umbrellaPositionDown.y;
        this.$rotationTransform.position.z = umbrellaPositionDown.z;
      }
    },

    followCamera: function( toggle ){

      toggle = !!toggle;

      if ( this._followCamera !== toggle ){

        this._followCamera = toggle;

        if ( this._followCamera ){

          // this.$transform.position.set( cameraRig.$camera.position.x, cameraRig.$camera.position.y, cameraRig.$camera.position.z );
          // this.$transform.rotation.z = 0;

          this.updateUmbrellaPosition();

        } else {
          this.$rotationTransform.position.x = 0;
          this.$rotationTransform.position.y = 0;
          this.$rotationTransform.position.z = 0;
        }
      }

    },

    impact: function( strength ){

      if ( this.impactTween ){
        this.impactTween.stop();
        this.updateUmbrellaPosition();
      } else {
        this.impactTween = new TWEEN.Tween( this.$rotationTransform.position );
      }


      this.impactTween.stop();
      this.impactTween.to( { y: umbrellaPositionUp.y -strength }, 100 );
      this.impactTween.yoyo(true);
      this.impactTween.repeat(1);
      this.impactTween.start();

      this.dispatchEvent({type: 'IMPACT', strength: strength });
    },

    toggle: function( state ) {

      var tween = this._umbrellaTween;
      tween.stop();

      var rotTween = this._rotationTween;

      if ( this._followCamera ){
        var posTween = new TWEEN.Tween( this.$rotationTransform.position );
        posTween.easing = TWEEN.Easing.Sinusoidal.InOut;
      }

      state = state === undefined ? ( this.state === umbrella.UP ? umbrella.DOWN : umbrella.UP ) : state;

      if (this.toggleTimeout) {
        clearTimeout( this.toggleTimeout );
      }
      this.animationFinished = false;
      this.toggleTimeout = setTimeout(function() {
        this.animationFinished = true;
      }.bind(this), this.state == umbrella.UP ? 400 : 0 );

      if ( state === umbrella.UP ){
        tween.to( { time: 0 }, 500);
        rotTween.to({
          x: 0
        }, 600 );

        tween.delay(200);

        if ( this._followCamera ){
          posTween.to({
            x: umbrellaPositionUp.x,
            y: umbrellaPositionUp.y,
            z: umbrellaPositionUp.z
          }, 300 );
        } else {
          this.$rotationTransform.position.set( umbrellaPositionInitial.x,
              umbrellaPositionInitial.y,
              umbrellaPositionInitial.z );
        }

      } else {
        tween.to( { time: 0.5 }, 500);
        rotTween.to({
          x: -Math.PI
        }, 600 );
        rotTween.delay(400);

        if ( this._followCamera ){
          posTween.to({
            x: umbrellaPositionDown.x,
            y: umbrellaPositionDown.y,
            z: umbrellaPositionDown.z
          }, 300);
        } else {
          this.$rotationTransform.position.set(
            umbrellaPositionInitial.x,
            umbrellaPositionInitial.y,
            umbrellaPositionInitial.z
          );
        }
      }



      rotTween.easing( TWEEN.Easing.Sinusoidal.InOut );

      rotTween.start();

      if ( this._followCamera ){
        posTween.delay( 200 );
        posTween.start();
      }

      tween.start();
      this.state = state;
      events.dispatchEvent({type: events.TOGGLE_UMBRELLA, umbrellaState: this.state });
    },

    update: function( dt, t ) {

      if ( this._followCamera ){
        var deltaRotY = cameraRig.$camera.rotation.y -  this.$transform.rotation.y;
        if ( Math.abs( deltaRotY ) > Math.PI ){
          if ( deltaRotY  < 0 ){
            deltaRotY += TWO_PI;
          } else {
            deltaRotY -= TWO_PI;
          }
        }

        this.$transform.rotation.x += ( globalSettings.wind.x + Math.sin( t * 0.005 ) * 0.2 * globalSettings.wind.x) * dt * 0.003;
        this.$transform.rotation.z += ( globalSettings.wind.z + Math.cos( t * 0.005 ) * 0.2 * globalSettings.wind.z) * dt * 0.003;

        this.$transform.rotation.x += ( rotation0.x - this.$transform.rotation.x ) * dt * 0.001;
        this.$transform.rotation.z += ( rotation0.z - this.$transform.rotation.z ) * dt * 0.001;

        this.$transform.position.lerp( cameraRig.$camera.position, dt * 0.001 );

        // ensure umbrella doesn't pop under the floor (in roomscale vr)
        this.$transform.position.y = Math.max( 1, this.$transform.position.y );
        this.$transform.rotation.y += deltaRotY * dt * 0.01;
        this.$transform.rotation.y %= TWO_PI;

      } else {
        this.$transform.position.y = 1.6 + Math.cos( t * 0.0015 ) * 0.02;
        this.$transform.rotation.z = Math.cos( t * 0.0005 ) * 0.05;
        this.$transform.rotation.y = t * 0.00005 * Math.PI * 2;
      }

    }
});


Object.defineProperty(window, 'umbrellaPositionDown', {
  set: function(v){
    umbrellaPositionDown.x = v.x;
    umbrellaPositionDown.y = v.y;
    umbrellaPositionDown.z = v.z;
    if ( umbrella.state === umbrella.DOWN ){
      umbrella.$rotationTransform.position.copy(umbrellaPositionDown);
    }
  },

  get: function(){
    return umbrellaPositionDown;
  }
});

Object.defineProperty(window, 'umbrellaPositionUp', {
  set: function(v){
    umbrellaPositionUp.x = v.x;
    umbrellaPositionUp.y = v.y;
    umbrellaPositionUp.z = v.z;
    if ( umbrella.state === umbrella.UP ){
      umbrella.$rotationTransform.position.copy(umbrellaPositionUp);
    }
  },

  get: function(){
    return umbrellaPositionUp;
  }
});

umbrella.DOWN = 0;
umbrella.UP = 1;

module.exports = umbrella;
