
var ThreeObj       = require('../ThreeObj');
var globalSettings = require('../settings/globalSettings');
var util           = require('../helpers/Util');
var titleTexture   = require('../objects/titleTexture');
var random         = require('../helpers/random');
var settings = {
  numberOfObjects: 40,
  range:2,
};


module.exports = ThreeObj.create({

  assets: {
    models: {
      uriPrefix: 'assets/models/plan8_lowpoly/lowpoly_',
      fruits: {
        banana  : 'banana.json',
        apple   : 'apple.json',
        grapes  : 'grapes.json',
      }
    }
  },
  onLoad: function(){
    var promises = [
      titleTexture.load(),
    ];
    return Promise.all( promises );
  },
  setup: function( $scene ){

    this.$scene = $scene;
    this.$transform = new THREE.Object3D();
    titleTexture.setup( $scene );

    this.$transform.position.z = -3;
    this.$transform.position.y = 0.4;
    this.$transform.add( titleTexture.$transform );

    this.createObjects();

  },

  addToScene: function() {
    this.$scene.add(this.$transform);
  },

  removeFromScene: function() {
    this.$scene.remove(this.$transform);
  },

  createObjects: function() {
    var count = 0;
    for (var key in this.assets.models.fruits) {

      var model = this.assets.models.fruits[key];
      mesh =  new THREE.Mesh( model.geometry, model.material );
      var scale = 0.1;

      mesh.scale.multiplyScalar( scale );

      var xPos, zPos;
      switch (count) {
        case 0 :
          xPos = -1;
          zPos = -0.5;
        break;
        case 1 :
          xPos = -2;
          zPos = -2;
        break;
        case 2 :
          xPos = -0.5;
          zPos = -1.5;
        break;
      }
      mesh.position.x = xPos;
      mesh.position.z = zPos;

      mesh.position.y = 0;

      mesh.material =  new THREE.MeshLambertMaterial({
        color: 0xb0b0b0,
        emissive: 0x3f3f3f,
        shading: THREE.FlatShading
      });
      if (key.indexOf('banana') > -1) {
        mesh.rotation.x = Math.PI/2;
      }else if (key.indexOf('grapes') > -1) {
        mesh.rotation.x = Math.PI/2;
        mesh.rotation.z = Math.PI/2;
      }
      this.$transform.add( mesh );
      count++;
    }


  }

});
