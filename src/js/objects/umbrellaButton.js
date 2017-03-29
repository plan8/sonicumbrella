/******************************************************************************
*
******************************************************************************/

var events                  = require('../helpers/events');
var ThreeObj                = require('../ThreeObj');
var umbrella = require('./umbrella');

module.exports = ThreeObj.create({

  assets:{
    textures:{
      uriPrefix: 'assets/textures/',
      close: 'close_umbrella_btn@x2.png',
      open:  'open_umbrella_btn@x2.png'
    }
  },

  setup: function( $scene ){
    this.$scene = $scene;
    this.alpha = 0.6;


    var material = new THREE.MeshBasicMaterial( { map: this.assets.textures.open, color: 0xffffff, fog: false, transparent: true } );


    var width = material.map.image.width;
    var height = material.map.image.height;
    var size = 1;

    var geometry = new THREE.PlaneGeometry( width/width * size, height/width *size );
    this.$mesh = new THREE.Mesh( geometry, material );


    this.$transform = new THREE.Object3D();
    this.$transform.add(this.$mesh);

    this.$mesh.material.opacity = this.alpha;
    this.$mesh.ongazeover = this.ongazeover.bind(this);
    this.$mesh.ongazeout = this.ongazeout.bind(this);
    this.$mesh.handleClick = this.handleClick;
    this.gazeLongFix = this.gazeLongFix.bind(this);

    this.$transform.position.z = 0.0;
    this.$transform.position.y = 0.0;
    this.$transform.rotation.x = -0.5 * Math.PI;

  },

  handleClick: function(){
    umbrella.toggle();
    this.$mesh.material.map = umbrella.state ? this.assets.textures.close : this.assets.textures.open;
    this.$mesh.material.needsUpdate = true;
  },

  gazeLongFix: function(){
    this.callback && this.callback(this._id);
    this.handleClick && this.handleClick();
  },

  ongazeover: function(){
    this.$mesh.material.opacity = 1;

    this.gazeTimeout = setTimeout(function(){
      this.gazeLongFix();
    }.bind(this), 1000)
  },

  ongazeout: function(){

    clearTimeout(this.gazeTimeout);
    this.$mesh.material.opacity = this.alpha;

    if (this.gazeOutCallback) {
      this.gazeOutCallback(this._id);
    }
  },
  
  addToScene: function() {
    this.$transform.name = 'umbrella_button_transform';
    this.$scene.add(this.$transform);
  },

  removeFromScene: function() {
    this.$scene.remove(this.$transform);
  },

});
