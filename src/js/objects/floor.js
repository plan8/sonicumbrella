/******************************************************************************
* Floor - Simple plane geometry with a texture
******************************************************************************/
var ThreeObj       = require('../ThreeObj');
var globalSettings = require('../settings/globalSettings');
var util           = require('../helpers/Util');

var settings = {
  size: 35,
  segments: 65
};

var floorColor = new THREE.Color(0xFFFFFF);

module.exports = ThreeObj.create({

  assets: {
    textures: {
      floor: 'assets/textures/grid_plus_100_4px.png'
    }
  },

  setup: function( $scene ){

    this.$scene = $scene;

    var texture = this.assets.textures.floor;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 100, 100 );

    var material = new THREE.MeshBasicMaterial( {
      map: texture,
      color: 0xFFFFFF,
      side: THREE.FrontSide,
      transparent:false,
    });

    var geometry = new THREE.PlaneBufferGeometry( settings.size, settings.size );
    var plane = new THREE.Mesh( geometry, material);

    plane.position.x = 0;
    plane.position.z = 0;
    plane.position.y = -0.1;

    plane.rotation.x = -Math.PI * 0.5;
    this.$transform = plane;

    this.addToScene();

  },

  addToScene: function() {
    this.$scene.add(this.$transform);
  },

  removeFromScene: function() {
    this.$scene.remove(this.$transform);
  }

});
