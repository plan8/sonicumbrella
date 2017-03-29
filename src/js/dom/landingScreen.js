var TWEEN = require('tween.js/src/Tween.js');

module.exports = {
  show: function( vr ){
    if ( vr ){
      document.getElementById('landing').style.visibility = 'visible';
      document.getElementById('desktop-vr-x-button').style.display = 'none';
    } else {
      document.getElementById('noVR').style.visibility = 'visible';
      document.getElementsByClassName('webvr-ui-button')[0].style.display = 'none';
      document.getElementById('headphones').style.display = 'none';
    }
    document.getElementById("landing").style.opacity = 1;
  },
  fadeOut: function( onComplete ){

    var tween = new TWEEN.Tween( document.getElementById('landing').style );

    tween.easing(TWEEN.Easing.Sinusoidal.InOut);
    tween.to( {opacity: 0}, 600);
    tween.start();
    tween.onComplete(function(){
       document.getElementById('landing').style.display = 'none';
       onComplete && onComplete();
    }.bind(this));

    //document.getElementById("landing").style.visibility = "hidden";
    if ( this.isWebVRAvailible && !this.isMobile ) {
      document.getElementById('desktop-vr-x-button').style.display = 'inline';
    }
  }
}
