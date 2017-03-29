module.exports = {

  fadeVolume: function(sound, vol, duration) {
    sound.gain.gain.linearRampToValueAtTime(vol, THREE.AudioContext.getContext().currentTime+duration);
  },

  initIOS: function(){
      var buff = THREE.AudioContext.getContext().createBuffer(1,2,44100);
      var clip = THREE.AudioContext.getContext().createBufferSource();
      clip.buffer = buff;
      clip.connect(THREE.AudioContext.getContext().destination);
      clip.start(0,0);
  },
}
