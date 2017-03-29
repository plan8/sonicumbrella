require( './webvrconfig' );
require( 'webvr-polyfill/build/webvr-polyfill' );

var webvrCheck = require('./helpers/webvrCheck');

var THREE = require('three');
window.THREE = THREE;
if ( !THREE.AudioContext.getContext ){
  THREE.AudioContext.getContext = function(){
    return THREE.AudioContext;
  }
}

window.webvrui  = require( './libs/webvr-ui' );

var mainScene   = require( './mainScene' );
var audioHelper = require( './helpers/audioHelper' );
var device      = require( './helpers/device' );

mainScene.load().then( function(){

  webvrCheck.check().then(function(){
    if ( device.isMobile ){
      document.getElementById('landing').style.visibility = 'visible';
      document.getElementById('enterVrButtonContainer').addEventListener('touchend', function(e){
        audioHelper.initIOS();
      }, false );
    }
    mainScene.init();
  });

});
