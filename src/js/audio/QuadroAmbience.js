var MasterBus                 = require('./masterBus');
var rateLimitedAudioListener  = require('./rateLimitedListener');
var device                    = require('../helpers/device');
var AudioSource               = require('../audio/AudioSource');
var PositionalAudioSource     = require('../audio/PositionalAudioSource');

var QuadroAmbience = function(audioContext){
  this.$transform = new THREE.Object3D();
  this.isPlaying = false;
};

QuadroAmbience.load = function( assets, onDone ){

  this._instance.load( assets ).then( function(){
    onDone && onDone( this._instance );
    return this._instance;
  });

};
QuadroAmbience.getInstance = function() {
  if (!this._instance) {
    this._instance = new QuadroAmbience(THREE.AudioContext.getContext());
    this._instance.setupAudio();
  }
  return this._instance;
},
QuadroAmbience.prototype.play = function(when, fadeTime){
  when = when || 0;
  fadeTime = fadeTime || 0;
  if (!this.sounds || this.isPlaying) return;

  for (var i = 0; i < this.sounds.length; i++) {
    var sound = this.sounds[i];
    if (fadeTime) {
      sound.gain.gain.setValueAtTime(0, THREE.AudioContext.getContext().currentTime + when);
      sound.gain.gain.linearRampToValueAtTime(1, THREE.AudioContext.getContext().currentTime + when + fadeTime);
    }
    sound.play(when);
    this.isPlaying = true;
  }
};

QuadroAmbience.prototype.stop = function(when, fadeTime){

  when = when || 0;
  fadeTime = fadeTime || 0;
  if (this.sounds && this.isPlaying === true) {
    for (var i = 0; i < this.sounds.length; i++) {
      //this.sounds[i].gain.gain.linearRampToValueAtTime(0, THREE.AudioContext.getContext().currentTime + when + fadeTime);
      this.sounds[i].stop(when + fadeTime);
    }
    this.isPlaying = false;
  }
};

QuadroAmbience.prototype.loadSingle = function( loader, url ){
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

QuadroAmbience.prototype.fadeVolume = function( volume, duration ){
  for (var i = 0; i < this.sounds.length; i++) {
    this.sounds[i].gain.gain.linearRampToValueAtTime(volume, THREE.AudioContext.getContext().currentTime + duration);
  }
};

QuadroAmbience.prototype.setVolume = function(intensity, averageDropTime) {

  averageDropTime = averageDropTime || 0;
  for (var i = 0; i < this.sounds.length; i++) {
    //this.sounds[i].gain.gain.cancelScheduledValues(THREE.AudioContext.getContext().currentTime);
    this.sounds[i].gain.gain.setValueAtTime(intensity * 0.8, THREE.AudioContext.getContext().currentTime + averageDropTime);
  }
};

QuadroAmbience.prototype.load = function(assets) {

  var urls = assets.separateChannels;
  var loader = new THREE.AudioLoader();
  var promises = [];

  for ( var i = 0; i < urls.length; i++ ){
    promises.push( this.loadSingle( loader, assets.uriPrefix + urls[i] ) );
  }
  return Promise.all( promises ); //.then( this.setupBuffers.bind(this) );
};


QuadroAmbience.prototype.setupBuffers =  function( assets, delay ) {
  var _this = this;

  setTimeout(function(){
    for (var i = 0; i < _this.sounds.length; i++) {
      var buffer = _this.buffers[assets.ambience_audio.uriPrefix + assets.ambience_audio.separateChannels[i]];
      //§var source = THREE.AudioContext.getContext().createBufferSource();
      //§source.loop = true;
      //_this.sounds[i].setNodeSource(source);
      _this.sounds[i].setBuffer(buffer);

      //_this.sounds[i].hasPlaybackControl = true;
      //source.buffer = this.buffers[i];
    }
    _this.play();
  }, delay * 1000);


}
QuadroAmbience.prototype.setupAudio =  function() {
  this.buffers = {};
  this.sounds = [];

  for (var i = 0; i < 4; i++) {

    //var obj = this.buffers[item];
    if (i == 0) {
      pos = {x:2, y:0,z: 2}
    }else if (i == 1) {
      pos = {x:-2, y:0,z: 2};
    }else if (i == 2) {
      pos = {x:2, y:0, z:-2};
    }else if (i == 3) {
      pos = {x:-2, y:0, z:-2}
    }
    var soundSettings = {
      pos: pos,
      autoPlay: false,
      loop: true,
      vol:0,
    };
    this.createAudio( soundSettings );

  }
};

QuadroAmbience.prototype.createAudio =  function( soundSettings ) {

  var sound;
  if (soundSettings.pos) {
    sound = new PositionalAudioSource( rateLimitedAudioListener );
    sound.gain.disconnect();
    sound.gain.connect(MasterBus.getInput());
    sound.panner.panningModel = 'HRTF';
    sound.setRefDistance( 1 );
    sound.position.x = soundSettings.pos.x;
    sound.position.y = soundSettings.pos.y;
    sound.position.z = soundSettings.pos.z;
    var debug = false;
    if (debug) {
      var geometry = new THREE.BoxGeometry(0.03, 0.03, 0.03);
      var material = new THREE.MeshNormalMaterial();
      var cube = new THREE.Mesh(geometry, material);
      cube.position.set(soundSettings.pos.x, soundSettings.pos.y, soundSettings.pos.z);
      this.$scene.add(cube);
    }
  }else {
    sound = new AudioSource( rateLimitedAudioListener );
  }
  //sound.setBuffer(buffer);
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
  this.$transform.add(sound);
  this.sounds.push(sound);
};

// QuadroAmbience.prototype.addToScene =  function($scene) {
//   $scene.add(this.$transform);
// };


module.exports = QuadroAmbience;
