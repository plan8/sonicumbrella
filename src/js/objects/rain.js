/******************************************************************************
* Main rain mesh objects
******************************************************************************/
var ThreeObj            = require('../ThreeObj');
var soundPool           = require('./soundPool');
var umbrella            = require('./umbrella')
var impactCircles       = require('./impactCircles');
var util                = require('../helpers/Util.js');
var globalSettings      = require('../settings/globalSettings');
var materials           = require('../settings/materials');
var rainAutomation      = require('./rainAutomation');
var floor               = require('./floor');
var random              = require('../helpers/random');
var TWEEN               = require('tween.js/src/Tween.js');
var cameraRig           = require('./cameraRig');
var objectWeights       = require('../settings/objectWeights');
var performanceSettings = require('../settings/performanceSettings');

// special physics for mixed reality mode
var USE_PHYSICS =  !!util.getParameterByName('mrmode') || false;

var zeroVec = new THREE.Vector3( 0, 0, 0 );
Object.freeze(zeroVec);

var settings = {
  splatRings: true,
  splatParticles: true
};

// Helper function to animate opacity on all objects
function opacityHelper( meshes, opacity ){
  for ( var i = 0; i < meshes.length; i++ ){
    if ( meshes[ i ].material.materials ){
      meshes[ i ].material.materials.forEach(function(m){
        m.opacity = opacity;
      });
    } else {
      meshes[ i ].material.opacity = opacity;
    }
  }
}

// used to calculate bounding box / collision radius
var bbox = new THREE.Box3();
var fixNormals = require('../helpers/fixNormals');

var rainCloud = ThreeObj.create({
    assets: {
      models: {
        uriPrefix: 'assets/models/plan8_lowpoly/lowpoly_',
        fruits: {
          banana  : 'banana.json',
          apple   : 'apple.json',
          grapes  : 'grapes.json',
          orange  : 'orange.json'
        },
        drums: {
          cymbal    : 'cymbal.json',
          drumstick : 'drumstick.json',
          snare     : 'snare.json'
        },
        pingpong: {
          pingpong  : 'pingpong.json',
        },
        squeaky_toys: {
          duck: 'duck.json'
        },
        kalimba: {
          mallet: 'mallet.json',
        },
        violin: {
          note_1: 'note_1.json',
          note_2: 'note_2.json'
        },
        cans: {
          can_1: 'sodacan.json'
        }

      }
    },

    settings: {
      dropStartHeight: 30,
      dropOffset: 7, //first single drops variance from center
      maxParticles: performanceSettings.numberOfRainObjects,
    },

    eventHandlers: {

      onRainChangePosition: function ( e ){
        this.changeDropPosition( e.data );
      },

      onRainAnimationChange: function( e ){
        var rainIntensity = e.data;
        this.changeIntensity( rainIntensity );
      },
    },

    onLoad: function(){
      return impactCircles.load();
    },

    setup: function( $scene ) {

      this.introRain = true;

      this.$position = new THREE.Vector3();

      this.$scene = $scene;

      impactCircles.setup( $scene );

      this.nextParticleTimeStamp = 0;
      this.rainIntensity = 0;
      this.range = 20;

      this.numParticles = 100;

      var rainObjects = new THREE.Object3D();
      this.$rainContainer = rainObjects;

      this.$transform = new THREE.Object3D();
      this.$transform.add(rainObjects);

      $scene.add( this.$transform );

      this.count = 0;

      var averageVelocityY = 0.02 + 0.5 * 0.005;
      this.averageDropTime = ( this.settings.dropStartHeight / averageVelocityY ) / 1000;

      for ( var key in this.assets.models ){
        if ( key === 'uriPrefix' ) continue;

        for ( var key2 in this.assets.models[ key ] ){
          if ( materials[ key ][ key2 ] ){
            this.assets.models[ key ][ key2 ].material =  new THREE.MultiMaterial( materials[ key ][ key2 ] );
          } else {
            this.assets.models[ key ][ key2 ] = new THREE.MeshBasicMaterial( 0xFFAA99 );
          }
            fixNormals( this.assets.models[ key ][ key2 ].geometry );

        }
      }

      rainAutomation.addEventListener( 'SOUND_PACK_CHANGE', this.onSoundPackChanged.bind(this));

      globalSettings.gui.add(settings, 'splatRings');
      globalSettings.gui.add(settings, 'splatParticles');

      this.setupIntro();

      return this;
    },

    startExperience: function(){
      this.introRain = false;
      rainAutomation.addEventListener( 'RAIN_ANIMATION_CHANGE', this.eventHandlers.onRainAnimationChange );
      rainAutomation.addEventListener( 'RAIN_POSITION_CHANGE', this.eventHandlers.onRainChangePosition );

    },

    addParticle: function() {
      var models;
      var mesh;

      if ( this.introRain ){
        models = random.select( this.assets.models );
      } else {
        models = this.assets.models[ this.currentSoundPackName ];
      }
      if ( !models ){
        console.warn( 'Missing model for '+this.currentSoundPackName );
        models = this.assets.models[ Object.keys( this.assets.models )[ 0 ] ];
      }

      var keys = Object.keys( models );
      var id = keys[ this.count % keys.length ];
      //  var geom = new THREE.PlaneGeometry();
      var model = models[ id ];
      mesh =  new THREE.Mesh( model.geometry, model.material );
      var scale = 0.1;

      mesh.scale.multiplyScalar( scale );
      mesh.velocity = new THREE.Vector3( globalSettings.wind.x * 0.1, -0.02 + Math.random() * 0.001, globalSettings.wind.z * 0.1 ); //0.8 + Math.random() / 2;
      mesh.angularVelocity = new THREE.Vector3( Math.random() * 2 - 1, Math.random() * 2 - 1 ,Math.random() * 2 - 1 );
      mesh.bounces = 0;

      var offset = this.settings.dropOffset;
      this.count++;

      mesh.position.y = this.settings.dropStartHeight;

      if ( this.introRain ){

        mesh.position.x = this.$position.x + ( Math.random() * this.range - this.range * 0.5 );
        mesh.position.z = this.$position.z +  Math.random()  * - 3.5 - 2;
        mesh.position.y = Math.abs( mesh.position.z ) * 3;

      } if ( this.dropTarget == "RANDOM" ) {

        if ( umbrella.state === umbrella.UP && Math.random() > 0.8 ){
          //a bit more chanse of landing on umbrella
          mesh.position.x = this.$position.x + ( Math.random() - 0.5 ) * 1;
          mesh.position.z = this.$position.z + ( Math.random() - 0.5 ) * 1;
        } else {
          mesh.position.x = this.$position.x + ( Math.random() * this.range - this.range * 0.5 );
          mesh.position.z = this.$position.z + ( Math.random() * this.range - this.range * 0.5 );
        }

      } else if (this.dropTarget == "IN_VIEW") {

        // if drop is in view
        var vector = new THREE.Vector3( 0, 0, - 1 );
        vector.applyQuaternion( cameraRig.$camera.quaternion );

        mesh.position.x = vector.x * offset;
        mesh.position.z = vector.z * offset;
        mesh.position.x += ((Math.random() * offset) - offset/2);
        mesh.position.z += ((Math.random() * offset) - offset/2);

      } else if (this.dropTarget == "LEFT") {
        mesh.position.x = -8;
        mesh.position.z = 0;
        mesh.position.x += ((Math.random() * offset) - offset/2);
        mesh.position.z += ((Math.random() * offset) - offset/2);

      } else if (this.dropTarget == "RIGHT") {
        mesh.position.x = 8;
        mesh.position.z = 0;
        mesh.position.x += ((Math.random() * offset) - offset/2);
        mesh.position.z += ((Math.random() * offset) - offset/2);
      }

      mesh.dropped = false;

      // select which meshs plays sounds
      var distanceToCam = util.getDistance( mesh.position.x,0, mesh.position.z, 0, 0, 0 );


      mesh.rotation.set( Math.random(), Math.random(), Math.random());
      mesh.bounces = 0;

      // no sound on intro
      if ( !this.introRain ){
        mesh.hasSound = true;
        mesh.soundPack = this.currentSoundPackName;
        if ( this.rainIntensity < 2 ) {
          mesh.bypassUmbrellaSound = true;
        }
      }

      bbox.setFromObject( mesh );
      mesh.collisionRadius = ( bbox.max.y - bbox.min.y ) * 0.5;

      var distanceToImpact = mesh.position.y - mesh.collisionRadius;
      var timeToImpact = ( distanceToImpact / -mesh.velocity.y ) * globalSettings.timeScale; // not perfect, since fluctuation in timeScale will affect time
      var invTimeToImpact = -timeToImpact;

      if ( mesh.velocity.x ){
        mesh.position.x += mesh.velocity.x * invTimeToImpact;
      }
      if ( mesh.velocity.z ){
        mesh.position.z += mesh.velocity.z * invTimeToImpact;
      }

      this.$rainContainer.add( mesh );
    },

    onSoundPackChanged: function( e ) {
      this.currentSoundPackName = e.data;
    },

    /**
    * Clears all falling objects
    */
    clear: function(){
      var rainContainer = this.$rainContainer;
      rainContainer.children.forEach(function(o){
        rainContainer.remove(o);
      });
      rainContainer.children = [];
      return this;
    },

    fadeOutIntroRain: function( onComplete ){
      var rainMeshes = this.$rainContainer.children;
      var tw = { opacity: 1 };
      var tween = new TWEEN.Tween( tw );
      for ( var i = 0; i < rainMeshes.length; i++ ){
        if ( rainMeshes[ i ].material.materials ){
          rainMeshes[ i ].material.materials.forEach(function(m){
            m.transparent = true;
          });
          //rainMeshes[ i ].velocity.y = 0;
        } else {
          rainMeshes[ i ].material.transparent = true;
        }
      }

      tween.to({
        opacity: 0
      }, 400 );

      tween.onUpdate(function(e){
        opacityHelper( rainMeshes, tw.opacity );
      });

      tween.onComplete(function(){
        // reset material opacities
        opacityHelper( rainMeshes, 1 );

        // clear children
        this.clear();

        onComplete && onComplete();
      }.bind(this));

      tween.start();

    },

    changeIntensity: function(intensity) {
      this.rainIntensity = Math.round((intensity / 100) * this.numParticles);
    },

    changeDropPosition: function(position) {
      this.dropTarget = position;
    },

    setupIntro: function(){
      for ( var i = 0; i < this.settings.maxParticles * 0.5; i++ ){
        this.addParticle();
        var mesh = this.$rainContainer.children[ i ];
        mesh.position.y = Math.random() * Math.abs( mesh.position.z ) * 3;
      }
    },

    update: function( dt, t ){

      var rainObjects = this.$rainContainer.children;
      var range = this.range;

      if ( rainObjects.length < this.settings.maxParticles ) {
        if ( t  >= this.nextParticleTimeStamp ) {
          var intesity = this.introRain ? 3 : this.rainIntensity;
          if ( intesity ) {
            this.nextParticleTimeStamp = t + ((700 / intesity) * (Math.random() + 0.3));
            this.addParticle();
          }
        }
      }

      var toRemove = [];
      var introVelocityRatio = this.introRain ? 0.035 : 1;

      for ( var i = 0; i < rainObjects.length; i++ ){

        var mesh = rainObjects[ i ];

        mesh.position.y += mesh.velocity.y * dt * globalSettings.timeScale * introVelocityRatio;
        mesh.position.x += mesh.velocity.x * dt * globalSettings.timeScale * introVelocityRatio;
        mesh.position.z += mesh.velocity.z * dt * globalSettings.timeScale * introVelocityRatio;

        //fake gravity
        if ( mesh.bounces > 0  ){
          mesh.velocity.y -= dt * globalSettings.timeScale * 0.0001;
        }

        mesh.rotation.x -= mesh.angularVelocity.x * dt * 0.01 * Math.random()  * introVelocityRatio;
        mesh.rotation.y -= mesh.angularVelocity.y * dt * 0.01 * Math.random()  * introVelocityRatio;
        mesh.rotation.z -= mesh.angularVelocity.z * dt * 0.01 * Math.random()  * introVelocityRatio;

        var coll = false;
        var umbrellaColl = false;
        var umbrellaIsFoldingDown = (umbrella.state === umbrella.DOWN) && !umbrella.animationFinished;

        var umbrellaPosition = umbrella.$transform.children[0].position.clone();
        umbrellaPosition = umbrella.$transform.localToWorld(umbrellaPosition);

        if ( !this.introRain && (umbrella.state === umbrella.UP || umbrellaIsFoldingDown ) && umbrellaPosition.distanceTo( mesh.position ) < 1 + mesh.collisionRadius ){

          var collisionNormal =  mesh.position.clone().sub( umbrellaPosition ).normalize();
          mesh.velocity.copy( collisionNormal.clone().multiplyScalar( mesh.velocity.length() * 0.4 ) );
          mesh.velocity.y += 0.001;
          mesh.position.copy( umbrellaPosition.clone().add( collisionNormal.clone().multiplyScalar( 1.03 + mesh.collisionRadius ) ) );

          coll = true;
          umbrellaColl = true;
          mesh.bounces++;
          if (!umbrellaIsFoldingDown) {
            var weight = objectWeights[this.currentSoundPackName] || 1;

            umbrella.impact( weight * 0.01 + Math.random() * 0.001 );
          }

        } else if ( mesh.position.y - mesh.collisionRadius <= ( this.introRain ? -15 : 0 ) ) {

          coll = true;
          if ( !this.introRain ){
            mesh.position.y = 0.001;
            impactCircles.addImpact( mesh.position, mesh.material.materials[ 0 ].color.getHex(),  settings.splatRings, settings.splatParticles );
          }
        }

        if (coll) {

          if ( !this.introRain && mesh.hasSound ) {
            if ( mesh.soundPack == this.currentSoundPackName ) {
              // play currentSoundPack
              var bypassUmbrellaSound = mesh.bypassUmbrellaSound || !umbrellaColl;;
              soundPool.playSound( mesh.position, false, !bypassUmbrellaSound,  this.rainIntensity, umbrellaColl ? 1 : 0 );

            } else {
              //play previous soundPack
              soundPool.playSound( mesh.position, true, umbrellaColl, this.rainIntensity, umbrellaColl ? 1 : 0 );
            }
          }

          if ( !USE_PHYSICS || !umbrellaColl ){
            toRemove.push( mesh );
          }

        }
      }

      for ( i = 0; i < toRemove.length; i++ ){
        this.$rainContainer.remove( toRemove[ i ], 1 );
      }

      impactCircles.update( dt, t );

    }
});

module.exports = rainCloud;
