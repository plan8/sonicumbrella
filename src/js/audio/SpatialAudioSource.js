/******************************************************************************
* Wrapper class to enalbe switching between different ambience audio techniques
* (stereo / quad / ambisonic etc )
******************************************************************************/

var QuadroAmbience      = require('./QuadroAmbience');
var StereoAmbience      = require('./StereoAmbience');
var Device              = require('../helpers/device');
var performanceSettings = require('../settings/performanceSettings');

var SpatialAudioSource = function(audioContext){
  this.syncTime = 2;
  this.fadeTime = 2;
  this.useQuadroAmbience = performanceSettings.useQuadroAmbience;

  if (this.useQuadroAmbience) {
    this.source = QuadroAmbience.getInstance();
  }else {
    this.source = StereoAmbience.getInstance();
  }
};

SpatialAudioSource.load = function(assets, onDone) {
  var _source = new SpatialAudioSource();
  if (assets.ambisonic == null && assets.separateChannels == null) {
    onDone(_source);
    return Promise.resolve();
  }
  return _source.load(assets).then(function() {
    onDone && onDone(_source);
  });
};


SpatialAudioSource.prototype.setup = function( $scene ) {
  if ( this.useQuadroAmbience ){
    $scene.add( this.source.$transform );
  }
};

SpatialAudioSource.prototype.changeAmbience = function(assets, delay) {
  this.source.setupBuffers(assets, delay);
};

SpatialAudioSource.prototype.play = function(when, fadeTime){
  this.source.play(when, fadeTime);
};

SpatialAudioSource.prototype.stop = function(when, fadeTime){
  this.source.stop(when, fadeTime);
};


SpatialAudioSource.prototype.onRainIntensityChange = function(intensity, averageDropTime) {
  this.source.setVolume(Math.min(1.0, intensity ), averageDropTime);
  if (this.useQuadroAmbience) {
    this.source.setVolume(Math.min(1.0, intensity ), averageDropTime);
  }
};
SpatialAudioSource.prototype.onRainHeavyStart = function(averageDropTime) {
  if ( !this.useQuadroAmbience ){
    this.source.onRainHeavyStart(averageDropTime);
  }
};
SpatialAudioSource.prototype.onRainHeavyEnd = function(averageDropTime) {
  if ( !this.useQuadroAmbience ){
    this.source.onRainHeavyEnd(averageDropTime);
  }
};


SpatialAudioSource.prototype.fadeVolume = function(volume, fadeTime){
  this.source.fadeVolume(volume, fadeTime);
};

SpatialAudioSource.prototype.load = function(assets) {
  return this.source.load(assets);
};


module.exports = SpatialAudioSource;
