var MasterBus                 = require('./MasterBus');
var rateLimitedAudioListener  = require('./rateLimitedListener');
var device                    = require('../helpers/device');
var AudioSource           = require('../audio/AudioSource');

var StereoAmbience = function(audioContext){
  this.$listener = rateLimitedAudioListener;
  this.isPlaying = false;
  this.volume = 0.5;
};

StereoAmbience.load = function( assets, onDone ){

  this._instance.load( assets ).then( function(){
    onDone && onDone( this._instance );
    return this._instance;
  });

};
StereoAmbience.getInstance = function() {
  if (!this._instance) {
    this._instance = new StereoAmbience(THREE.AudioContext.getContext());
    this._instance.setupAudio();
  }
  return this._instance;
},
StereoAmbience.prototype.play = function(when, fadeTime){

  // fadeTime = fadeTime || 0;
  // if (this.isPlaying) return;
  //
  // if (fadeTime) {
  //   this.ambience.gain.gain.setValueAtTime(0, THREE.AudioContext.getContext().currentTime + when);
  //   this.ambience.gain.gain.linearRampToValueAtTime(1, THREE.AudioContext.getContext().currentTime + when + fadeTime);
  // }
  //
  // if (this.ambience) {
  //   this.ambience.play(when);
  // }
  //
  // this.isPlaying = true;
};

StereoAmbience.prototype.stop = function(when, fadeTime){

  // when = when || 0;
  // fadeTime = fadeTime || 0;
  //
  // if ( this.ambience && this.isPlaying ) {
  //   this.ambience.stop(THREE.AudioContext.getContext().currentTime + when + fadeTime);
  // }
  //
  // this.isPlaying = false;
};

StereoAmbience.prototype.loadSingle = function( loader, url ){
  var _this = this;
  return new Promise(function(resolve, reject){
    var _url = url.replace('mp3|ogg', device.isChrome ? 'ogg' : 'mp3' )
              .replace('ogg|mp3', device.isChrome ? 'ogg' : 'mp3' );
    loader.load(_url, function(buffer) {
      _this.buffers[url] = buffer;
      resolve();
    })
  });
};

StereoAmbience.prototype.fadeVolume = function( volume, duration ){
  this.ambience.gain.gain.linearRampToValueAtTime(volume, THREE.AudioContext.getContext().currentTime + duration);
};

StereoAmbience.prototype.setVolume = function(intensity, averageDropTime) {

  //averageDropTime = averageDropTime || 0;
  //this.ambience.gain.gain.setValueAtTime(intensity * 0.5, THREE.AudioContext.getContext().currentTime + averageDropTime);

};

StereoAmbience.prototype.load = function(assets) {

  var urls = assets.stereoChannels;
  var loader = new THREE.AudioLoader();
  var promises = [];

  for ( var i = 0; i < urls.length; i++ ){
    promises.push( this.loadSingle( loader, assets.uriPrefix + urls[i] ) );
  }
  return Promise.all( promises );
};
StereoAmbience.prototype.onRainHeavyStart = function(averageDropTime) {
  this.ambience.gain.gain.setValueAtTime(0, THREE.AudioContext.getContext().currentTime + 3);
  this.ambience.gain.gain.linearRampToValueAtTime(this.volume, THREE.AudioContext.getContext().currentTime + 6);
};
StereoAmbience.prototype.onRainHeavyEnd = function(averageDropTime) {
  this.ambience.gain.gain.linearRampToValueAtTime(0, THREE.AudioContext.getContext().currentTime + 2);
};

StereoAmbience.prototype.setupBuffers =  function( assets, delay ) {
  var _this = this;

  setTimeout(function(){

    // stop current ambience
    var fadeTime = 1;
    if (_this.ambience.isPlaying) {
      _this.ambience.stop(THREE.AudioContext.getContext().currentTime + fadeTime);
    }
    //create new audio with loaded buffer
    var soundSettings = {
      autoPlay: false,
      loop: true,
      vol: 0,
    };
    var newAmb = _this.createAudio( soundSettings );
    var buffer = _this.buffers[assets.ambience_audio.uriPrefix + assets.ambience_audio.stereoChannels[0]];
    newAmb.setBuffer(buffer);
    newAmb.play();
    //set new to be current
    _this.ambience = newAmb;

  }, delay * 1000);


}
StereoAmbience.prototype.setupAudio =  function() {
  this.buffers = {};

  var soundSettings = {
    autoPlay: false,
    loop: true,
    vol: 0,
  };
  var amb = this.createAudio( soundSettings );

  this.ambience = amb;



};

StereoAmbience.prototype.createAudio =  function( soundSettings ) {

  var sound;

  sound = new AudioSource( this.$listener );

  sound.setPlaybackRate( soundSettings.playbackrate || 1 );
  sound.setVolume( soundSettings.vol != undefined ? soundSettings.vol : 0 );
  sound.setLoop( soundSettings.loop != undefined ? soundSettings.loop :  false);
  if (soundSettings.autoPlay) {
    sound.play();
    if (soundSettings.fadeIn) {
      sound.gain.gain.setValueAtTime(0, THREE.AudioContext.getContext().currentTime);
      sound.gain.gain.linearRampToValueAtTime(soundSettings.vol, THREE.AudioContext.getContext().currentTime + soundSettings.fadeIn);
    }
  }
  return sound;
};


module.exports = StereoAmbience;
