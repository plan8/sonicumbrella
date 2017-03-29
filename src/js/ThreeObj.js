var jsonLoader          = require('./helpers/jsonloader');
var device              = require('./helpers/device');
var ManagedAssetObject  = require('./ManagedAssetsObject');


function ThreeObj() {
  ManagedAssetObject.call( this );
};


ThreeObj.prototype = Object.assign( Object.create( ManagedAssetObject.prototype ), {

  init: function( $scene ) {

  },

  setup: function(){

  }

});

Object.assign( ThreeObj.prototype, THREE.EventDispatcher.prototype );


ThreeObj.create = function( handlers ){
  var o = Object.create( this.prototype );
  Object.assign( o, handlers );
  o.constructor.call( o );

  var eventHandlers = handlers.eventHandlers;

  if ( eventHandlers ){
    var keys = Object.keys( eventHandlers );
    for ( var i = 0; i < keys.length; i++ ){
      var fn = eventHandlers[ keys[ i ] ];

      if ( typeof fn === 'function' ){
        eventHandlers[ keys[ i ] ] = fn.bind( o );
      }
    }
  }

  return o;
};


module.exports = ThreeObj;
