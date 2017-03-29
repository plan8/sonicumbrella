var rateLimitedListener = require('./rateLimitedListener');

var masterBus = {

  gain: THREE.AudioContext.getContext().createGain(),

  _superMaster: THREE.AudioContext.getContext().createGain(), //focus / blur volume

  fadeTime: 0.5,

  setup: function() {

    rateLimitedListener.getInput().disconnect();
    rateLimitedListener.getInput().connect(this.gain);
    this.gain.connect(this._superMaster);
    this._superMaster.connect(THREE.AudioContext.getContext().destination);

    var visProp = this.getHiddenProp();
    if (visProp) {
      var evtname = 'visibilitychange';
      var _this = this;
      document.addEventListener(evtname, function () {
        _this.visChange(_this.fadeTime);
      });
    }
  },

  visChange: function(time){
    this._superMaster.gain.cancelScheduledValues(THREE.AudioContext.getContext().currentTime);
    if(!this.isHidden()) {
      this._superMaster.gain.linearRampToValueAtTime(1, THREE.AudioContext.getContext().currentTime + time);
    } else {
      this._superMaster.gain.linearRampToValueAtTime(0, THREE.AudioContext.getContext().currentTime + time);
    }
  },

  getInput: function() {
    return this.gain;
  },

  setVolume: function(vol, time){
    if (time) {
      this.gain.gain.linearRampToValueAtTime(vol, THREE.AudioContext.getContext().currentTime + time);
    }else {
      this.gain.gain.setValueAtTime(vol, THREE.AudioContext.getContext().currentTime);
    }
  },

  getHiddenProp: function() {
    var prefixes = [
      'webkit',
      'moz',
      'ms',
      'o'
    ];
    // if 'hidden' is natively supported just return it
    if ('hidden' in document) {
      return 'hidden';
    }
    // otherwise loop over all the known prefixes until we find one
    for (var i = 0; i < prefixes.length; i++) {
      if ((prefixes[i] + 'Hidden') in document) {
        return prefixes[i] + 'Hidden';
      }
    }
    // otherwise it's not supported
    return null;
  },

  isHidden: function() {
    var prop = this.getHiddenProp();
    if (!prop) {
      return false;
    }
    return document[prop];
  }
}

module.exports = masterBus;
