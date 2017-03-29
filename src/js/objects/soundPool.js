/******************************************************************************
* Pool of reusable audio sources
******************************************************************************/

var ThreeObj            = require('../ThreeObj');
var Util                = require('../helpers/Util.js');
var RainAudio           = require('../audio/RainAudio');
var random              = require('../helpers/random');
var umbrella            = require('../objects/umbrella');
var rateLimitedListener = require('../audio/rateLimitedListener');
var performanceSettings = require('../settings/performanceSettings');

var soundPool = ThreeObj.create({
  
    settings: {
      numSounds: performanceSettings.soundPoolSize,
      numPanners: performanceSettings.soundPoolPanners,
      volume: 4,
      refDistance: 1,
      rollOffFactor: 1,
      panningModel: 'HRTF',
      distanceModel: 'inverse',
      useSharedPanners: performanceSettings.soundPoolUseSharedPanners,
      minTimeBetweenSounds: performanceSettings.soundPoolMinTimeBetweenSounds,
      switchToEqualPowerThreshold: performanceSettings.soundPoolSwitchToEqualPowerThreshold
    },

    setup: function() {
      this.sounds = [];
      this.panners = [];
      this.soundIdToUse = 0;
      this.pannerIdToUse = 0;
      this.lastPlayTime = 0;
    },

    createSounds: function( soundPack, $scene ) {
      if (this.settings.useSharedPanners) {
        this.createPanners();
      }

      this.currentSoundPack = soundPack;
      for (var i = 0; i < this.settings.numSounds; i++) {
        var groundSounds = soundPack.assets.audio.umbrella_down;
        var umbrellaSounds = soundPack.assets.audio.umbrella_up;
        var sound = new RainAudio(rateLimitedListener, groundSounds[i % groundSounds.length], umbrellaSounds[i % umbrellaSounds.length], this.settings.useSharedPanners);
        if (this.settings.useSharedPanners) {
          sound.setPanner(this.panners[0]);
        }else {
          sound.panner.panningModel = this.settings.panningModel;
          sound.panner.distanceModel = this.settings.distanceModel;
          sound.setRefDistance( this.settings.refDistance );
          sound.setRolloffFactor(this.settings.rollOffFactor);
        }
        sound.setVolume(this.settings.volume);
        sound.autoplay = false;
        sound.setLoop(false);
        $scene.add(sound);
        this.sounds.push(sound);
      }
      Util.shuffle(this.sounds);

    },

    createPanners: function() {
      for (var i = 0; i < this.settings.numPanners; i++) {
        var panner = THREE.AudioContext.getContext().createPanner();
        panner.panningModel = this.settings.panningModel;
        panner.distanceModel = this.settings.distanceModel;
        panner.refDistance = this.settings.refDistance;
        panner.rolloffFactor = this.settings.rollOffFactor;
        panner.connect(rateLimitedListener.getInput());

        this.panners.push(panner);
      }
    },

    setBuffers: function(soundPack) {
      this.prevSoundPack = this.currentSoundPack;
      this.currentSoundPack = soundPack;
      var downBuffers = soundPack.assets.audio.umbrella_down;
      var upBuffers = soundPack.assets.audio.umbrella_up;
      for (var i = 0; i < this.sounds.length; i++) {
        this.sounds[i].setBuffers( downBuffers[ i % downBuffers.length ], upBuffers[ i % upBuffers.length ] );
      }
      Util.shuffle(this.sounds);
    },

    mute: function() {
      this.muted = true;
    },

    unMute: function() {
      this.muted = false;
    },

    getNext: function( playUmbrellaUp, priority ) {
      var i = 0;
      this.playingSounds = 0;
      var freeIndex = -1;
      for ( i = 0; i < this.sounds.length; i++ ){
        if ( this.sounds[i].isPlaying ){
          this.playingSounds++;
        } else if ( freeIndex === -1 ){
          freeIndex = i;
        }
      }

      if ( freeIndex === -1 && playUmbrellaUp){
        // no free sound, abrupt stop

        for ( i = 0; i < this.sounds.length; i++ ){
          if ( this.sounds.priority <= priority ){
            this.sounds[ i ].stop();
            break;
          }
        }
        if ( freeIndex === -1 ){
          // bye bye
          this.sounds[ 0 ].stop();
          freeIndex = 0;
          console.warn('no audio to stop, force stoping at index 0');
        }
      } else {
        // make sure we have at least 20% of the pool free
        var soundsToStop = this.playingSounds - this.settings.numSounds * 0.8;

        for ( i = 0; i < soundsToStop; i++ ){
          var k = freeIndex - 1 - i;
          if ( k < 0 ){
            k += this.settings.numSounds;
          }
          if ( this.sounds[ k ].priority <= priority ){
            this.sounds[ k ].fadeoutAndStop( 0, 0.05 );
          }
        }
      }


      this.soundIdToUse = freeIndex;

      var sound;
      if (this.soundIdToUse > -1) {
        sound = this.sounds[this.soundIdToUse]
      }else {
        sound = false;
      }
      //this.soundIdToUse = (this.soundIdToUse+1) % this.sounds.length;
      return sound;
    },

    getNextPanner: function() {
      this.pannerIdToUse = (this.pannerIdToUse+1) % this.panners.length;
      return this.panners[this.pannerIdToUse];
    },


    playSound: function(particle, usePrevious, playUmbrellaUp, rainIntensity, priority ) {

      priority = priority || 0;

      var sound = this.getNext( playUmbrellaUp, priority );
      sound.priority = priority;

      if (!sound) {
        console.log("no sound available");
        return;
      }

      if (sound.isPlaying) {
        sound.stop();
      }

      var pack = usePrevious ? this.prevSoundPack : this.currentSoundPack;
      var downBuffers = pack.assets.audio.umbrella_down;
      var upBuffers = pack.assets.audio.umbrella_up;


      sound.setBuffers( random.select( downBuffers ), random.select( upBuffers ) );


      if (this.settings.useSharedPanners) {
        // if (sound.panner) {
        //   sound.panner.disconnect():
        // }
        sound.setPanner(this.getNextPanner());
      }

      var randomPlaybackRate = pack.settings.randomPlaybackRate;

      if (randomPlaybackRate > 0) {
        sound.setPlaybackRate( 1 - (randomPlaybackRate/2) + (Math.random() * randomPlaybackRate) );
      }else {
        sound.setPlaybackRate( 1  );
      }

      if (this.playingSounds > this.settings.switchToEqualPowerThreshold) {
        sound.panner.panningModel = "equalpower";
      }else {
        sound.panner.panningModel = "HRTF";
      }
      sound.position.x = particle.x;
      sound.position.z = particle.z;
      sound.position.y = particle.y;

      if (!this.muted) {
        if (THREE.AudioContext.getContext().currentTime - this.lastPlayTime > this.settings.minTimeBetweenSounds) {

          if (umbrella.state == umbrella.UP && !playUmbrellaUp) {
            sound.setVolume(this.settings.volume * 0.5);
          }else {
            sound.setVolume(this.settings.volume);

            // equalpower is a bit louder than HRTF
            if (sound.panner.panningModel == "equalpower") {
              sound.setVolume(this.settings.volume * 0.8);
            }
          }

          sound.play( 0, playUmbrellaUp );
          this.lastPlayTime = THREE.AudioContext.getContext().currentTime;
        }
      }


    }
});

module.exports = soundPool;
