var TWEEN = require('tween.js/src/Tween.js');

module.exports = {
  show: function(){
    document.getElementById("loading").style.opacity = 1;          
    document.getElementById("loaderGif").className += ' visible';
  },
  fadeOut: function( onComplete ){
    //remove loading div
    var tween = new TWEEN.Tween( document.getElementById('loaderGif').style );
    tween.delay(200);
    tween.easing(TWEEN.Easing.Sinusoidal.InOut);
    tween.to( {opacity: 0}, 1000);
    tween.start();
    tween.onComplete(function(){
      document.getElementById('loaderGif').style.display = 'none';
      // onCoplete fires a little early since we want the gif to fade out
      // after we transition out
      onComplete && onComplete();
    }.bind(this));

    var tween2 = new TWEEN.Tween( document.getElementById('loading').style );
    tween2.delay(1200);
    tween2.easing(TWEEN.Easing.Sinusoidal.InOut);
    tween2.to( {opacity: 0}, 1000);
    tween2.start();
    tween2.onComplete(function(){
      document.getElementById('loading').style.display = 'none';
      document.body.removeChild(document.getElementById('loading'));
    }.bind(this));
  }
}
