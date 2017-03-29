var soundpacks      = require('../audio/soundpacks/index');
var soundPool       = require('../objects/soundPool');
var rainAutomation  = require('../objects/rainAutomation');
var rain            = require('../objects/rain');
var ThreeObj        = require('../ThreeObj');
var sharedSounds    = require('../audio/sharedSounds');

var soundpackController = ThreeObj.create({

  currentSoundPackName: soundpacks[0].name,

  currentSoundPack: soundpacks[0],

  load: function(){
    return Promise.all([
      sharedSounds.load(),
      soundpacks[ 0 ].load()
    ]);
  },

  onChangeSoundPack: function( e ){
    var name = e.data;

    // no change.. return
    if ( name === this.currentSoundPackName ) return;

    this.currentSoundPackName = name;
    var soundPack = soundpacks.find( function( el ){
      return el.name === name;
    });

    this.setupSoundPack( soundPack );

  },

  onRainAnimationChange: function( e ){
    var rainIntensity = e.data;
    if ( this.currentSoundPack ) {
      var vol = rainIntensity  / 100;
      if ( rainIntensity === 1 ) vol = 0;
      this.currentSoundPack.audioSource.onRainIntensityChange(vol, rain.averageDropTime);
    }
  },
  onRainHeavyStart: function(e) {
    if (this.currentSoundPack ) {
      this.currentSoundPack.audioSource.onRainHeavyStart(rain.averageDropTime);
    }
  },
  onRainHeavyEnd: function(e) {
    if (this.currentSoundPack ) {
      this.currentSoundPack.audioSource.onRainHeavyEnd(rain.averageDropTime);
    }
  },

  setup: function( $scene ){

    sharedSounds.setup();
    soundPool.setup();
    soundPool.mute();
    soundPool.createSounds( soundpackController.currentSoundPack, $scene );
    this.currentSoundPack.audioSource.setup( $scene )

    rainAutomation.addEventListener( 'SOUND_PACK_CHANGE', this.onChangeSoundPack.bind( this ) );
    rainAutomation.addEventListener( 'RAIN_ANIMATION_CHANGE', this.onRainAnimationChange.bind( this ) );
    rainAutomation.addEventListener( 'RAIN_HEAVY_START', this.onRainHeavyStart.bind( this ) );
    rainAutomation.addEventListener( 'RAIN_HEAVY_END', this.onRainHeavyEnd.bind( this ) );

    this._experienceStarted = false;
  },

  startExperience: function(){
    soundPool.unMute();
    this._experienceStarted = true;
  },

  getCurrentAudioSource: function(){
    return this.currentSoundPack && this.currentSoundPack.audioSource && this.currentSoundPack.audioSource.source;
  },

  getNextSoundPackName: function() {
    var id = 0;
    for (var i = 0; i < soundpacks.length; i++) {
      if ( soundpacks[i].name === this.currentSoundPackName ) {
        id = i;
      }
    }
    return ( id + 1 ) % soundpacks.length;
  },

  loadNext: function(){
    //start to load next soundpack
    var nextId = this.getNextSoundPackName();
    soundpacks[ nextId ].load();
  },

  setupSoundPack: function( soundPack ){
    var _this = this;
    soundPack.load().then( function(){
      soundPool.setBuffers( soundPack );
      _this.changeAmbience( soundPack );
      _this.loadNext();
      rainAutomation.restartRainSequence();
    });
  },

  changeAmbience: function( soundPackOrIndex ) {

    if ( typeof soundPackOrIndex === 'number' ){
      soundPackOrIndex = soundpacks[ soundPackOrIndex ];
    }

    if ( this.currentSoundPack ) {
      this.currentSoundPack.audioSource.stop( rain.averageDropTime );
    }

    soundPackOrIndex.audioSource.changeAmbience( soundPackOrIndex.assets, !this._experienceStarted ? 0 : rain.averageDropTime );
    this.currentSoundPack = soundPackOrIndex;
  },
});

module.exports = soundpackController;
