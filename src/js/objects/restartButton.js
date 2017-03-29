/******************************************************************************
*
******************************************************************************/

var events                  = require('../helpers/events');
var ThreeObj                = require('../ThreeObj');
var webvrCheck              = require('../helpers/webvrCheck');
var device                  = require('../helpers/device');
var globalVars              = require('../helpers/globalVars');

module.exports = ThreeObj.create({

  assets: {
    textures:{
      uriPrefix: 'assets/textures/',
      title: 'play_again_2_btn@2x.png',
      controllerText: 'play_again/Play_again_oculus_vive@4x.png',
      spaceBarText: 'play_again/Play_again_desktop_360@4x.png',
      interactionButtonText: 'play_again/Play_again_cardboard@4x.png',
      tapScreenText: 'play_again/Play_again_phone_360@4x.png',
      touchpadText: 'play_again/Play_again_daydream@4x.png',
    }
  },

  setup: function( $scene, displayGazeButton ){

    this.alpha = 1.0;
    var textureToUse;
    var size = 1;
    if (globalVars.is360 && !device.isMobile) {
      //desktop 360
      textureToUse = this.assets.textures.spaceBarText;
      size = 1.5;
    }else if (globalVars.is360 && device.isMobile) {
      //mobile 360
      textureToUse = this.assets.textures.tapScreenText;
      size = 1.5;
    }else if (device.isMobile && !displayGazeButton && webvrCheck.isDaydream()) {
      //daydream
      textureToUse = this.assets.textures.touchpadText;
      size = 1.5;
    }else if (device.isMobile && !displayGazeButton && !webvrCheck.hasController()) {
      //cardboard without button
      textureToUse = this.assets.textures.interactionButtonText;
      size = 2.5;
    }else if (!displayGazeButton) {
      //vive, oculus
      textureToUse = this.assets.textures.controllerText;
      size = 2;
    }else if (displayGazeButton) {
      //gazebutton
      textureToUse = this.assets.textures.title;
      size = 1;
    }

    var material = new THREE.MeshBasicMaterial( { map: textureToUse, color: 0xffffff, fog: false, transparent: true } );

    var width = material.map.image.width;
    var height = material.map.image.height;

    var geometry = new THREE.PlaneGeometry( width / width * size, height / width * size );
    this.sprite = new THREE.Mesh( geometry, material );

    this.$transform = new THREE.Object3D();
    this.$transform.add(this.sprite);
    this.sprite.position.y += 0.1;
    this.sprite.material.opacity = this.alpha;
    this.sprite.ongazeover = this.ongazeover.bind(this);
    this.sprite.ongazeout = this.ongazeout.bind(this);
    this.sprite.handleClick = this.handleClick;
    this.gazeLongFix = this.gazeLongFix.bind(this);

  },

  handleClick: function(){
    events.dispatchEvent({ type: events.RESTART_EXPERIENCE });
  },

  gazeLongFix: function(){
    this.callback && this.callback( this._id );
    this.handleClick && this.handleClick();
  },

  ongazeover: function(){
    this.sprite.material.opacity = 1;

    this.gazeTimeout = setTimeout( function(){
      this.gazeLongFix();
    }.bind(this), 1000 );
  },

  ongazeout: function(){

    clearTimeout( this.gazeTimeout );
    this.sprite.material.opacity = this.alpha;

    if ( this.gazeOutCallback ) {
      this.gazeOutCallback( this._id );
    }
  },


});
