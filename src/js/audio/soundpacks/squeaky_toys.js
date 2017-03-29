/*******************************************************************************
* Auto Generated file, this file may be replaced at any moment.
* Do not edit directly
*******************************************************************************/

var ThreeObj = require('../../ThreeObj');
var device = require('../../helpers/device');
var THREE = require('three');
var SpatialAudioSource = require('../SpatialAudioSource');
var SoundPackSettings = require('../SoundPackSettings');

var squeaky_toys = ThreeObj.create({
  assets: {
    audio: {
      uriPrefix: 'assets/audio/soundpacks/squeaky_toys/',
      umbrella_up: ["up/squeaky_toys_2_umbrella_1.mp3|ogg","up/squeaky_toys_2_umbrella_10.mp3|ogg","up/squeaky_toys_2_umbrella_11.mp3|ogg","up/squeaky_toys_2_umbrella_12.mp3|ogg","up/squeaky_toys_2_umbrella_13.mp3|ogg","up/squeaky_toys_2_umbrella_14.mp3|ogg","up/squeaky_toys_2_umbrella_15.mp3|ogg","up/squeaky_toys_2_umbrella_16.mp3|ogg","up/squeaky_toys_2_umbrella_17.mp3|ogg","up/squeaky_toys_2_umbrella_18.mp3|ogg","up/squeaky_toys_2_umbrella_19.mp3|ogg","up/squeaky_toys_2_umbrella_2.mp3|ogg","up/squeaky_toys_2_umbrella_20.mp3|ogg","up/squeaky_toys_2_umbrella_21.mp3|ogg","up/squeaky_toys_2_umbrella_22.mp3|ogg","up/squeaky_toys_2_umbrella_23.mp3|ogg","up/squeaky_toys_2_umbrella_24.mp3|ogg","up/squeaky_toys_2_umbrella_25.mp3|ogg","up/squeaky_toys_2_umbrella_26.mp3|ogg","up/squeaky_toys_2_umbrella_27.mp3|ogg","up/squeaky_toys_2_umbrella_28.mp3|ogg","up/squeaky_toys_2_umbrella_29.mp3|ogg","up/squeaky_toys_2_umbrella_3.mp3|ogg","up/squeaky_toys_2_umbrella_30.mp3|ogg","up/squeaky_toys_2_umbrella_31.mp3|ogg","up/squeaky_toys_2_umbrella_4.mp3|ogg","up/squeaky_toys_2_umbrella_5.mp3|ogg","up/squeaky_toys_2_umbrella_6.mp3|ogg","up/squeaky_toys_2_umbrella_7.mp3|ogg","up/squeaky_toys_2_umbrella_8.mp3|ogg","up/squeaky_toys_2_umbrella_9.mp3|ogg"],
      umbrella_down: ["down/squeaky_toys_2_ground_1.mp3|ogg","down/squeaky_toys_2_ground_10.mp3|ogg","down/squeaky_toys_2_ground_11.mp3|ogg","down/squeaky_toys_2_ground_12.mp3|ogg","down/squeaky_toys_2_ground_13.mp3|ogg","down/squeaky_toys_2_ground_14.mp3|ogg","down/squeaky_toys_2_ground_15.mp3|ogg","down/squeaky_toys_2_ground_16.mp3|ogg","down/squeaky_toys_2_ground_17.mp3|ogg","down/squeaky_toys_2_ground_18.mp3|ogg","down/squeaky_toys_2_ground_19.mp3|ogg","down/squeaky_toys_2_ground_2.mp3|ogg","down/squeaky_toys_2_ground_20.mp3|ogg","down/squeaky_toys_2_ground_21.mp3|ogg","down/squeaky_toys_2_ground_22.mp3|ogg","down/squeaky_toys_2_ground_23.mp3|ogg","down/squeaky_toys_2_ground_24.mp3|ogg","down/squeaky_toys_2_ground_25.mp3|ogg","down/squeaky_toys_2_ground_26.mp3|ogg","down/squeaky_toys_2_ground_27.mp3|ogg","down/squeaky_toys_2_ground_28.mp3|ogg","down/squeaky_toys_2_ground_29.mp3|ogg","down/squeaky_toys_2_ground_3.mp3|ogg","down/squeaky_toys_2_ground_30.mp3|ogg","down/squeaky_toys_2_ground_31.mp3|ogg","down/squeaky_toys_2_ground_32.mp3|ogg","down/squeaky_toys_2_ground_33.mp3|ogg","down/squeaky_toys_2_ground_34.mp3|ogg","down/squeaky_toys_2_ground_35.mp3|ogg","down/squeaky_toys_2_ground_36.mp3|ogg","down/squeaky_toys_2_ground_37.mp3|ogg","down/squeaky_toys_2_ground_38.mp3|ogg","down/squeaky_toys_2_ground_39.mp3|ogg","down/squeaky_toys_2_ground_4.mp3|ogg","down/squeaky_toys_2_ground_40.mp3|ogg","down/squeaky_toys_2_ground_41.mp3|ogg","down/squeaky_toys_2_ground_5.mp3|ogg","down/squeaky_toys_2_ground_6.mp3|ogg","down/squeaky_toys_2_ground_7.mp3|ogg","down/squeaky_toys_2_ground_8.mp3|ogg","down/squeaky_toys_2_ground_9.mp3|ogg"],
    },
    ambience_audio:{
      uriPrefix: 'assets/audio/soundpacks/squeaky_toys/',
      separateChannels: ["ambience/mono/squeaky_toys_monoloop_01.mp3|ogg","ambience/mono/squeaky_toys_monoloop_02.mp3|ogg","ambience/mono/squeaky_toys_monoloop_03.mp3|ogg","ambience/mono/squeaky_toys_monoloop_04.mp3|ogg"],
      stereoChannels: ["ambience/stereo/squeaky_toys_stereoloop.mp3|ogg"],
    }

  },
  name: 'squeaky_toys',
  settings: SoundPackSettings.squeaky_toys,
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

module.exports = squeaky_toys;
