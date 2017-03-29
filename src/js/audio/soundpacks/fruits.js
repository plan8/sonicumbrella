/*******************************************************************************
* Auto Generated file, this file may be replaced at any moment.
* Do not edit directly
*******************************************************************************/

var ThreeObj = require('../../ThreeObj');
var device = require('../../helpers/device');
var THREE = require('three');
var SpatialAudioSource = require('../SpatialAudioSource');
var SoundPackSettings = require('../SoundPackSettings');

var fruits = ThreeObj.create({
  assets: {
    audio: {
      uriPrefix: 'assets/audio/soundpacks/fruits/',
      umbrella_up: ["up/fruits_apples_umbrella_01.mp3|ogg","up/fruits_apples_umbrella_02.mp3|ogg","up/fruits_apples_umbrella_03.mp3|ogg","up/fruits_apples_umbrella_04.mp3|ogg","up/fruits_apples_umbrella_05.mp3|ogg","up/fruits_apples_umbrella_06.mp3|ogg","up/fruits_apples_umbrella_07.mp3|ogg","up/fruits_apples_umbrella_08.mp3|ogg","up/fruits_apples_umbrella_09.mp3|ogg","up/fruits_apples_umbrella_10.mp3|ogg","up/fruits_apples_umbrella_11.mp3|ogg","up/fruits_apples_umbrella_12.mp3|ogg","up/fruits_bananas_umbrella_01.mp3|ogg","up/fruits_bananas_umbrella_02.mp3|ogg","up/fruits_bananas_umbrella_03.mp3|ogg","up/fruits_bananas_umbrella_04.mp3|ogg","up/fruits_bananas_umbrella_05.mp3|ogg","up/fruits_bananas_umbrella_06.mp3|ogg","up/fruits_bananas_umbrella_07.mp3|ogg","up/fruits_bananas_umbrella_08.mp3|ogg","up/fruits_bananas_umbrella_09.mp3|ogg","up/fruits_bananas_umbrella_10.mp3|ogg","up/fruits_bananas_umbrella_11.mp3|ogg","up/fruits_bananas_umbrella_12.mp3|ogg","up/fruits_grapes_umbrella_01.mp3|ogg","up/fruits_grapes_umbrella_02.mp3|ogg","up/fruits_grapes_umbrella_03.mp3|ogg","up/fruits_grapes_umbrella_04.mp3|ogg","up/fruits_grapes_umbrella_05.mp3|ogg","up/fruits_grapes_umbrella_06.mp3|ogg","up/fruits_grapes_umbrella_07.mp3|ogg","up/fruits_grapes_umbrella_08.mp3|ogg","up/fruits_grapes_umbrella_09.mp3|ogg","up/fruits_grapes_umbrella_10.mp3|ogg","up/fruits_grapes_umbrella_11.mp3|ogg","up/fruits_grapes_umbrella_12.mp3|ogg","up/fruits_splat_01.mp3|ogg","up/fruits_splat_02.mp3|ogg","up/fruits_splat_03.mp3|ogg","up/fruits_splat_04.mp3|ogg","up/fruits_splat_05.mp3|ogg"],
      umbrella_down: ["down/fruits_apples_ground_01.mp3|ogg","down/fruits_apples_ground_02.mp3|ogg","down/fruits_apples_ground_03.mp3|ogg","down/fruits_apples_ground_04.mp3|ogg","down/fruits_apples_ground_05.mp3|ogg","down/fruits_apples_ground_06.mp3|ogg","down/fruits_apples_ground_07.mp3|ogg","down/fruits_apples_ground_08.mp3|ogg","down/fruits_apples_ground_09.mp3|ogg","down/fruits_apples_ground_10.mp3|ogg","down/fruits_apples_ground_11.mp3|ogg","down/fruits_apples_ground_12.mp3|ogg","down/fruits_bananas_ground_01.mp3|ogg","down/fruits_bananas_ground_02.mp3|ogg","down/fruits_bananas_ground_03.mp3|ogg","down/fruits_bananas_ground_04.mp3|ogg","down/fruits_bananas_ground_05.mp3|ogg","down/fruits_bananas_ground_06.mp3|ogg","down/fruits_bananas_ground_07.mp3|ogg","down/fruits_bananas_ground_08.mp3|ogg","down/fruits_bananas_ground_09.mp3|ogg","down/fruits_bananas_ground_10.mp3|ogg","down/fruits_bananas_ground_11.mp3|ogg","down/fruits_bananas_ground_12.mp3|ogg","down/fruits_grapes_ground_01.mp3|ogg","down/fruits_grapes_ground_02.mp3|ogg","down/fruits_grapes_ground_03.mp3|ogg","down/fruits_grapes_ground_04.mp3|ogg","down/fruits_grapes_ground_05.mp3|ogg","down/fruits_grapes_ground_06.mp3|ogg","down/fruits_grapes_ground_07.mp3|ogg","down/fruits_grapes_ground_08.mp3|ogg","down/fruits_grapes_ground_09.mp3|ogg","down/fruits_grapes_ground_10.mp3|ogg","down/fruits_grapes_ground_11.mp3|ogg","down/fruits_grapes_ground_12.mp3|ogg"],
    },
    ambience_audio:{
      uriPrefix: 'assets/audio/soundpacks/fruits/',
      separateChannels: ["ambience/mono/fruits_monoloop_01.mp3|ogg","ambience/mono/fruits_monoloop_02.mp3|ogg","ambience/mono/fruits_monoloop_03.mp3|ogg","ambience/mono/fruits_monoloop_04.mp3|ogg"],
      stereoChannels: ["ambience/stereo/fruits_stereoloop.mp3|ogg"],
    }

  },
  name: 'fruits',
  settings: SoundPackSettings.fruits,
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

module.exports = fruits;
