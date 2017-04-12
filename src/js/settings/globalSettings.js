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


module.exports = settings;
