var TWEEN = require('tween.js/src/Tween.js');

module.exports = {
  show: function( vr ){
    document.getElementById('about').style.visibility = 'visible';
  },
  hide: function(){
    document.getElementById( 'about' ).style.visibility = 'hidden';
  }
}
