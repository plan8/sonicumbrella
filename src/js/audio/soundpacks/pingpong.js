/*******************************************************************************
* Auto Generated file, this file may be replaced at any moment.
* Do not edit directly
*******************************************************************************/

var ThreeObj = require('../../ThreeObj');
var device = require('../../helpers/device');
var THREE = require('three');
var SpatialAudioSource = require('../SpatialAudioSource');
var SoundPackSettings = require('../SoundPackSettings');

var pingpong = ThreeObj.create({
  assets: {
    audio: {
      uriPrefix: 'assets/audio/soundpacks/pingpong/',
      umbrella_up: ["up/pingpong_umbrella_01.mp3|ogg","up/pingpong_umbrella_02.mp3|ogg","up/pingpong_umbrella_03.mp3|ogg","up/pingpong_umbrella_04.mp3|ogg","up/pingpong_umbrella_05.mp3|ogg","up/pingpong_umbrella_06.mp3|ogg","up/pingpong_umbrella_07.mp3|ogg","up/pingpong_umbrella_08.mp3|ogg","up/pingpong_umbrella_09.mp3|ogg","up/pingpong_umbrella_10.mp3|ogg","up/pingpong_umbrella_11.mp3|ogg","up/pingpong_umbrella_12.mp3|ogg"],
      umbrella_down: ["down/pingpong_ground_01.mp3|ogg","down/pingpong_ground_02.mp3|ogg","down/pingpong_ground_03.mp3|ogg","down/pingpong_ground_04.mp3|ogg","down/pingpong_ground_05.mp3|ogg","down/pingpong_ground_06.mp3|ogg","down/pingpong_ground_07.mp3|ogg","down/pingpong_ground_08.mp3|ogg","down/pingpong_ground_09.mp3|ogg","down/pingpong_ground_10.mp3|ogg","down/pingpong_ground_11.mp3|ogg","down/pingpong_ground_12.mp3|ogg"],
    },
    ambience_audio:{
      uriPrefix: 'assets/audio/soundpacks/pingpong/',
      separateChannels: ["ambience/mono/pingpong_monoloop_01.mp3|ogg","ambience/mono/pingpong_monoloop_02.mp3|ogg","ambience/mono/pingpong_monoloop_03.mp3|ogg","ambience/mono/pingpong_monoloop_04.mp3|ogg"],
      stereoChannels: ["ambience/stereo/pingpong_stereoloop.mp3|ogg"],
    }

  },
  name: 'pingpong',
  settings: SoundPackSettings.pingpong,
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

module.exports = pingpong;
