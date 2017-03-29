/*******************************************************************************
* Auto Generated file, this file may be replaced at any moment.
* Do not edit directly
*******************************************************************************/

var ThreeObj = require('../../ThreeObj');
var device = require('../../helpers/device');
var THREE = require('three');
var SpatialAudioSource = require('../SpatialAudioSource');
var SoundPackSettings = require('../SoundPackSettings');

var <@packname> = ThreeObj.create({
  assets: {
    audio: {
      uriPrefix: 'assets/audio/soundpacks/<@packname>/',
      umbrella_up: <@umbrella_up>,
      umbrella_down: <@umbrella_down>,
    },
    ambience_audio:{
      uriPrefix: 'assets/audio/soundpacks/<@packname>/',
      separateChannels: <@ambience_mono>,
      stereoChannels: <@ambience_stereo>,
    }

  },
  name: '<@packname>',
  settings: SoundPackSettings.<@packname>,
  onLoad: function(){
    this.limitMobileLoad = 6;
    if (device.isMobile && this.limitMobileLoad > 0) {

      if (Array.isArray(this.assets.audio.umbrella_up)) {
        this.assets.audio.umbrella_up = this.assets.audio.umbrella_up.slice(0, this.limitMobileLoad);
      }
      if (Array.isArray(this.assets.audio.umbrella_down)) {
        this.assets.audio.umbrella_down = this.assets.audio.umbrella_down.slice(0, this.limitMobileLoad);
      }
    }

    return SpatialAudioSource.load(this.assets.ambience_audio, function(inst){
      this.audioSource = inst;
    }.bind(this))
  }
});

module.exports = <@packname>;
