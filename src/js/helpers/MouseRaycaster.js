
function MouseRaycaster( $camera ){

  this.$camera = $camera;

  this._$colliders = [];
  this.$raycaster = new THREE.Raycaster();
  this._$mousePos = new THREE.Vector2();

  var _this = this;

  this._onMouseDown = function( event ){
    //event.preventDefault();
    _this._$mousePos.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    _this._$mousePos.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    _this.$raycaster.setFromCamera( _this._$mousePos, _this.$camera );

    var intersects = _this.$raycaster.intersectObjects( _this._$colliders );
    if ( intersects.length > 0 ) {
      if ( intersects[ 0 ].object.handleClick ){
         intersects[ 0 ].object.handleClick( );
      }
      _this.dispatchEvent( { type: 'CLICK', target: intersects[ 0 ] } );
    }
  }
  document.addEventListener( 'mousedown',this._onMouseDown, false );
};


Object.assign( MouseRaycaster.prototype, THREE.EventDispatcher.prototype );

MouseRaycaster.prototype.addCollider = function( collider ){
  // if ( !(collider instanceof THREE.Object3D ) ){
  //   throw new Error("Collider needs to be a three object");
  // }
  for ( var i = 0; i < collider.children.length; i++ ){
    if ( collider.children[i].handleClick ){
      this._$colliders.push( collider.children[i] );
    }
  }

};
MouseRaycaster.prototype.removeCollider = function( collider ){
  var id;
  for ( var i = 0; i < this._$colliders.length; i++ ){
    if ( this._$colliders[i] === collider ){
      id = i;
    }
  }
  this._$colliders.splice(id, 1);
};
MouseRaycaster.prototype.destroy = function(){
  document.removeEventListener( 'mousedown',this._onMouseDown, false );
}

module.exports = MouseRaycaster;
