/*******************************************************************************
* Auto Generated file, this file may be replaced at any moment.
* Do not edit directly
*******************************************************************************/

var ThreeObj = require('../../ThreeObj');
var device = require('../../helpers/device');
var THREE = require('three');
var SpatialAudioSource = require('../SpatialAudioSource');
var SoundPackSettings = require('../SoundPackSettings');

var drums = ThreeObj.create({
  assets: {
    audio: {
      uriPrefix: 'assets/audio/soundpacks/drums/',
      umbrella_up: ["up/drums_umbrella_1.mp3|ogg","up/drums_umbrella_10.mp3|ogg","up/drums_umbrella_11.mp3|ogg","up/drums_umbrella_12.mp3|ogg","up/drums_umbrella_13.mp3|ogg","up/drums_umbrella_14.mp3|ogg","up/drums_umbrella_15.mp3|ogg","up/drums_umbrella_16.mp3|ogg","up/drums_umbrella_17.mp3|ogg","up/drums_umbrella_18.mp3|ogg","up/drums_umbrella_2.mp3|ogg","up/drums_umbrella_3.mp3|ogg","up/drums_umbrella_4.mp3|ogg","up/drums_umbrella_5.mp3|ogg","up/drums_umbrella_6.mp3|ogg","up/drums_umbrella_7.mp3|ogg","up/drums_umbrella_8.mp3|ogg","up/drums_umbrella_9.mp3|ogg"],
      umbrella_down: ["down/drums_ground_01.mp3|ogg","down/drums_ground_02.mp3|ogg","down/drums_ground_03.mp3|ogg","down/drums_ground_04.mp3|ogg","down/drums_ground_05.mp3|ogg","down/drums_ground_06.mp3|ogg","down/drums_ground_07.mp3|ogg","down/drums_ground_08.mp3|ogg","down/drums_ground_09.mp3|ogg","down/drums_ground_10.mp3|ogg","down/drums_ground_11.mp3|ogg","down/drums_ground_12.mp3|ogg","down/drums_ground_13.mp3|ogg","down/drums_ground_14.mp3|ogg","down/drums_ground_15.mp3|ogg","down/drums_ground_16.mp3|ogg","down/drums_ground_17.mp3|ogg","down/drums_ground_18.mp3|ogg","down/drums_ground_19.mp3|ogg","down/drums_ground_20.mp3|ogg"],
    },
    ambience_audio:{
      uriPrefix: 'assets/audio/soundpacks/drums/',
      separateChannels: ["ambience/mono/drums_monoloop_01.mp3|ogg","ambience/mono/drums_monoloop_02.mp3|ogg","ambience/mono/drums_monoloop_03.mp3|ogg","ambience/mono/drums_monoloop_04.mp3|ogg"],
      stereoChannels: ["ambience/stereo/drums_stereoloop.mp3|ogg"],
    }

  },
  name: 'drums',
  settings: SoundPackSettings.drums,
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

module.exports = drums;
