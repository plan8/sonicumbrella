var dat   = require('dat-gui');
var THREE = require('three');

var settings = Object.assign({

  timeScale: 1,

  wind: new THREE.Vector3(0,0,0),

  set: function( param, value ){
    this[ param ] = value;
    this.dispatchEvent( { type: 'CHANGE', param: param, value: value } );
    this.dispatchEvent( { type: 'CHANGE:' + param, value: value } );
  },

  get: function( param ){
    return this[ param ];
  },

  pause:function(){
    this.set('timeScale',0)
  }

}, THREE.EventDispatcher.prototype);


var gui = new dat.GUI();
gui.add( settings, 'timeScale', -10, 10 ).onChange(function( value ){
  settings.set( 'timeScale', value );
});

gui.add( settings, 'pause' );
gui.close();

var windSettings = { windX: 0, windZ: 0 };
gui.add( windSettings, 'windX', -0.1, 0.1 ).onChange(function( val ){
  settings.wind.x = val;
});
gui.add( windSettings, 'windZ', -0.1, 0.1 ).onChange(function( val ){
  settings.wind.z = val;
});

settings.gui = gui;
dat.GUI.toggleHide();
module.exports = settings;
