/*******************************************************************************
* Auto Generated file, this file may be replaced at any moment.
* Do not edit directly
*******************************************************************************/

var ThreeObj = require('../../ThreeObj');
var device = require('../../helpers/device');
var THREE = require('three');
var SpatialAudioSource = require('../SpatialAudioSource');
var SoundPackSettings = require('../SoundPackSettings');

var violin = ThreeObj.create({
  assets: {
    audio: {
      uriPrefix: 'assets/audio/soundpacks/violin/',
      umbrella_up: ["up/violin_pizzglide_umbrella_2_1.mp3|ogg","up/violin_pizzglide_umbrella_2_10.mp3|ogg","up/violin_pizzglide_umbrella_2_11.mp3|ogg","up/violin_pizzglide_umbrella_2_12.mp3|ogg","up/violin_pizzglide_umbrella_2_2.mp3|ogg","up/violin_pizzglide_umbrella_2_3.mp3|ogg","up/violin_pizzglide_umbrella_2_4.mp3|ogg","up/violin_pizzglide_umbrella_2_5.mp3|ogg","up/violin_pizzglide_umbrella_2_6.mp3|ogg","up/violin_pizzglide_umbrella_2_7.mp3|ogg","up/violin_pizzglide_umbrella_2_8.mp3|ogg","up/violin_pizzglide_umbrella_2_9.mp3|ogg"],
      umbrella_down: ["down/violin_pizzglide_ground_1.mp3|ogg","down/violin_pizzglide_ground_10.mp3|ogg","down/violin_pizzglide_ground_11.mp3|ogg","down/violin_pizzglide_ground_12.mp3|ogg","down/violin_pizzglide_ground_13.mp3|ogg","down/violin_pizzglide_ground_14.mp3|ogg","down/violin_pizzglide_ground_15.mp3|ogg","down/violin_pizzglide_ground_16.mp3|ogg","down/violin_pizzglide_ground_17.mp3|ogg","down/violin_pizzglide_ground_18.mp3|ogg","down/violin_pizzglide_ground_19.mp3|ogg","down/violin_pizzglide_ground_2.mp3|ogg","down/violin_pizzglide_ground_20.mp3|ogg","down/violin_pizzglide_ground_3.mp3|ogg","down/violin_pizzglide_ground_4.mp3|ogg","down/violin_pizzglide_ground_5.mp3|ogg","down/violin_pizzglide_ground_6.mp3|ogg","down/violin_pizzglide_ground_7.mp3|ogg","down/violin_pizzglide_ground_8.mp3|ogg","down/violin_pizzglide_ground_9.mp3|ogg"],
    },
    ambience_audio:{
      uriPrefix: 'assets/audio/soundpacks/violin/',
      separateChannels: ["ambience/mono/violin_pizzglide_monoloop_01.mp3|ogg","ambience/mono/violin_pizzglide_monoloop_02.mp3|ogg","ambience/mono/violin_pizzglide_monoloop_03.mp3|ogg","ambience/mono/violin_pizzglide_monoloop_04.mp3|ogg"],
      stereoChannels: ["ambience/stereo/violin_stereoloop.mp3|ogg"],
    }

  },
  name: 'violin',
  settings: SoundPackSettings.violin,
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

module.exports = violin;
