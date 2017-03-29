/*******************************************************************************
* Auto Generated file, this file may be replaced at any moment.
* Do not edit directly
*******************************************************************************/

var ThreeObj = require('../../ThreeObj');
var device = require('../../helpers/device');
var THREE = require('three');
var SpatialAudioSource = require('../SpatialAudioSource');
var SoundPackSettings = require('../SoundPackSettings');

var cans = ThreeObj.create({
  assets: {
    audio: {
      uriPrefix: 'assets/audio/soundpacks/cans/',
      umbrella_up: ["up/cans_umbrella_01.mp3|ogg","up/cans_umbrella_02.mp3|ogg","up/cans_umbrella_03.mp3|ogg","up/cans_umbrella_04.mp3|ogg","up/cans_umbrella_05.mp3|ogg","up/cans_umbrella_06.mp3|ogg","up/cans_umbrella_07.mp3|ogg","up/cans_umbrella_08.mp3|ogg","up/cans_umbrella_09.mp3|ogg","up/cans_umbrella_10.mp3|ogg","up/cans_umbrella_11.mp3|ogg","up/cans_umbrella_12.mp3|ogg"],
      umbrella_down: ["down/cans_ground_01.mp3|ogg","down/cans_ground_02.mp3|ogg","down/cans_ground_03.mp3|ogg","down/cans_ground_04.mp3|ogg","down/cans_ground_05.mp3|ogg","down/cans_ground_06.mp3|ogg","down/cans_ground_07.mp3|ogg","down/cans_ground_08.mp3|ogg","down/cans_ground_09.mp3|ogg","down/cans_ground_10.mp3|ogg","down/cans_ground_11.mp3|ogg","down/cans_ground_12.mp3|ogg","down/cans_ground_13.mp3|ogg","down/cans_ground_14.mp3|ogg","down/cans_ground_15.mp3|ogg","down/cans_ground_16.mp3|ogg","down/cans_ground_17.mp3|ogg","down/cans_ground_18.mp3|ogg","down/cans_ground_19.mp3|ogg","down/cans_ground_20.mp3|ogg","down/cans_ground_21.mp3|ogg","down/cans_ground_22.mp3|ogg","down/cans_ground_23.mp3|ogg","down/cans_ground_24.mp3|ogg"],
    },
    ambience_audio:{
      uriPrefix: 'assets/audio/soundpacks/cans/',
      separateChannels: ["ambience/mono/cans_monoloop_01.mp3|ogg","ambience/mono/cans_monoloop_02.mp3|ogg","ambience/mono/cans_monoloop_03.mp3|ogg","ambience/mono/cans_monoloop_04.mp3|ogg"],
      stereoChannels: ["ambience/stereo/cans_stereoloop.mp3|ogg"],
    }

  },
  name: 'cans',
  settings: SoundPackSettings.cans,
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

module.exports = cans;
