/******************************************************************************
* Title
******************************************************************************/
var ThreeObj = require('../ThreeObj');


module.exports = ThreeObj.create({

  assets:{
    textures:{
      uriPrefix: 'assets/textures/',
      title: 'title_logo_1line_2048x256.png'
    }
  },

  setup: function( $scene ){
    var material = new THREE.MeshBasicMaterial( { map: this.assets.textures.title, fog: false, transparent: true } );

    var width = material.map.image.width;
    var height = material.map.image.height;
    var size = 3;

    var geometry = new THREE.PlaneGeometry( width/width * size, height/width *size );
    var title = new THREE.Mesh( geometry, material );

    //title.scale.set( width/width * size, height/width *size, 1 );

    title.position.y = 2.2;

    this.$transform = title;
   }

});
