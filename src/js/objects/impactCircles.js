/******************************************************************************
* Render  impact circles (from reusable queue)
******************************************************************************/

var globalSettings 			= require('../settings/globalSettings');
var performanceSettings = require('../settings/performanceSettings');
var ThreeObj 			 			= require('../ThreeObj');
var Util 					 			= require('../helpers/Util.js');
var TWEEN 							= require('tween.js/src/Tween.js');

require ('../libs/three/GPUParticleSystem');

var tick = 0;

var options = {
  position: new THREE.Vector3(0,0,0),
  positionRandomness: .05,
  velocity: new THREE.Vector3(0,9,0),
  velocityRandomness: 1,
  color: 0x999999,
  colorRandomness: 0,
  turbulence: 0,
  lifetime: 1,
  size: 3,
  sizeRandomness: 1
};

var impactCircles = ThreeObj.create({
  assets: {
    textures: {
      particleNoise: 'assets/textures/perlin-512.png',
      particleSprite: 'assets/textures/splat_particle.png'
    }
  },

  settings: {
    numCircles: performanceSettings.numberOfImpactCircles,
  },

  setup: function( $scene ) {

    this.particleSystem = new THREE.GPUParticleSystem({
      maxParticles: performanceSettings.maxSplatParticles,
      particleNoiseTex: this.assets.textures.particleNoise,
      particleSpriteTex: this.assets.textures.particleSprite
    });

    $scene.add( this.particleSystem );

    this.impactCircles = true;

    this.impactCircles = [];
    this.circleIdToUse = 0;

    for (var i = 0; i < this.settings.numCircles; i++) {

      material = new THREE.MeshBasicMaterial( { color: 0xffffff, transparent:true, opacity:1, side: THREE.FrontSide, fog:true } );
      geometry = new THREE.RingGeometry( 0.50, 0.55, 18, 4, 0, Math.PI * 2 );

      mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI*0.5;
      mesh.material.opacity = 0;

      this.setupMeshTween( mesh );

      this.impactCircles.push(mesh);
    }

    this.$scene = $scene;

  },

  setupMeshTween: function( mesh ){
    var tween = new TWEEN.Tween( mesh.material );
    tween.delay( 200 * globalSettings.timeScale );
    tween.to( { opacity: 0 }, 200 * globalSettings.timeScale );
    tween.easing( TWEEN.Easing.Sinusoidal.Out );

    var _this = this;
    tween.onComplete( function() {
      _this.$scene.remove( mesh );
    });

    var tween2 = new TWEEN.Tween(mesh.scale);
    tween2.to( { x: 1, y: 1 }, 400 * globalSettings.timeScale );
    tween2.easing( TWEEN.Easing.Sinusoidal.Out );

    mesh.tween1 = tween;
    mesh.tween2 = tween2;
  },

  update: function( dt, t ){

    tick += dt * 0.001;

    this.particleSystem.update( tick * globalSettings.timeScale );
  },

  addImpact: function( position, color, circle, splat ) {
    if ( !this.impactCircles ) return;
    var numToSpawn = splat ? performanceSettings.particlesPerSplat : 0;

		if ( numToSpawn > 0 ){
			for (var x = 0; x < numToSpawn; x++) {
	      options.position.x = position.x;
	      options.position.y = 0.001;
	      options.position.z = position.z;
				options.color = color;
	      this.particleSystem.spawnParticle(options);
	    }
		}

		if ( circle ){
      var mesh = this.impactCircles[ this.circleIdToUse ];
      mesh.position.x = position.x;
      mesh.position.z = position.z;
      mesh.position.y = 0.001;
      mesh.scale.x = 0.1;
      mesh.scale.y = 0.1;

      mesh.material.opacity = 1;
      mesh.material.side = THREE.FrontSide;
      this.$scene.add(mesh);
      mesh.tween1.start();
      mesh.tween2.start();
      this.circleIdToUse = (this.circleIdToUse+1) % this.impactCircles.length;
		}
  }

});

module.exports = impactCircles;
