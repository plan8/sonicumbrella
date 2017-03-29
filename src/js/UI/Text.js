module.exports = {
  textToCanvas: function( text, fontsize ){

    var ctx, canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    ctx.font = fontsize + "px Oswald";

    // setting canvas width/height before ctx draw, else canvas is empty
    canvas.width = ctx.measureText( text ).width;
    canvas.height = fontsize * 2; // fontsize * 1.5

    // after setting the canvas width/height we have to re-set font to apply!?! looks like ctx reset
    ctx.font = fontsize + "px Oswald";
    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.fillText( text, 0, fontsize );

    return canvas;
  },

  makeTextSprite : function(message, fontsize) {

      message = message.toUpperCase();

      var texture, sprite, spriteMaterial;

      var canv = this.textToCanvas( message, fontsize );

      texture = new THREE.Texture( canv );
      texture.minFilter = THREE.LinearFilter; // NearestFilter;
      texture.needsUpdate = true;

      spriteMaterial = new THREE.SpriteMaterial({map : texture});
      sprite = new THREE.Sprite(spriteMaterial);

      this.scaleSprite( sprite, 1 );

      return sprite;
  },
  makeTextMesh: function(message, fontsize) {

      message = message.toUpperCase();

      var texture, sprite, spriteMaterial;

      var canv = this.textToCanvas( message, fontsize );

      texture = new THREE.Texture(canv);
      texture.minFilter = THREE.LinearFilter; // NearestFilter;
      texture.needsUpdate = true;

      spriteMaterial = new THREE.MeshBasicMaterial({ map : texture, transparent:true, alphaTest: 0.5 });
      var ratio = canv.width / canv.height;
      var geometry = new THREE.PlaneGeometry( ratio, 1 );
      sprite = new THREE.Mesh(geometry, spriteMaterial);

      //sprite.position.z += 0.1;
      //sprite.position.y = 0.005;


      //sprite.position.x +=
      return sprite;
  },

  scaleSprite: function( sprite, scale ){
    var imageWidth = 1;
    var imageHeight = 1;

    if ( sprite && sprite.image && sprite.image.width ) {

      imageWidth = sprite.image.width;
      imageHeight = sprite.image.height;

    }

    sprite.scale.set( scale * imageWidth, scale * imageHeight, 1.0 );

  }
};
