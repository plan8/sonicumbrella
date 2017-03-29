/*******************************************************************************
* Auto Generated file, this file may be replaced at any moment.
* Do not edit directly
*******************************************************************************/

var ThreeObj = require('../../ThreeObj');
var device = require('../../helpers/device');
var THREE = require('three');
var SpatialAudioSource = require('../SpatialAudioSource');
var SoundPackSettings = require('../SoundPackSettings');

var kalimba = ThreeObj.create({
  assets: {
    audio: {
      uriPrefix: 'assets/audio/soundpacks/kalimba/',
      umbrella_up: ["up/kalimba_umbrella_01.mp3|ogg","up/kalimba_umbrella_02.mp3|ogg","up/kalimba_umbrella_03.mp3|ogg","up/kalimba_umbrella_04.mp3|ogg","up/kalimba_umbrella_05.mp3|ogg","up/kalimba_umbrella_06.mp3|ogg","up/kalimba_umbrella_07.mp3|ogg","up/kalimba_umbrella_08.mp3|ogg","up/kalimba_umbrella_09.mp3|ogg","up/kalimba_umbrella_10.mp3|ogg","up/kalimba_umbrella_11.mp3|ogg","up/kalimba_umbrella_12.mp3|ogg"],
      umbrella_down: ["down/kalimba_ground_01.mp3|ogg","down/kalimba_ground_02.mp3|ogg","down/kalimba_ground_03.mp3|ogg","down/kalimba_ground_04.mp3|ogg","down/kalimba_ground_05.mp3|ogg","down/kalimba_ground_06.mp3|ogg","down/kalimba_ground_07.mp3|ogg","down/kalimba_ground_08.mp3|ogg","down/kalimba_ground_09.mp3|ogg","down/kalimba_ground_10.mp3|ogg","down/kalimba_ground_11.mp3|ogg","down/kalimba_ground_12.mp3|ogg"],
    },
    ambience_audio:{
      uriPrefix: 'assets/audio/soundpacks/kalimba/',
      separateChannels: ["ambience/mono/kalimba_monoloop_01.mp3|ogg","ambience/mono/kalimba_monoloop_02.mp3|ogg","ambience/mono/kalimba_monoloop_03.mp3|ogg","ambience/mono/kalimba_monoloop_04.mp3|ogg"],
      stereoChannels: ["ambience/stereo/kalimba_stereoloop.mp3|ogg"],
    }

  },
  name: 'kalimba',
  settings: SoundPackSettings.kalimba,
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

module.exports = kalimba;
