var ThreeObj  = require('./ThreeObj.js');
var util      = require('./util.js');
var device    = require('./helpers/device.js');
var DEBUG     = false;

function Scene() {

  ThreeObj.call( this );

  var domEl = document.body;

  this._el = domEl;


  // THREE
  this.$camera = ( this.setupCamera && this.setupCamera() ) || new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  this.$renderer = new THREE.WebGLRenderer({antialias: true});
  this.$scene = new THREE.Scene();
  this.$scene.$renderer = this.$renderer;

  //this.$renderer.setPixelRatio(window.devicePixelRatio);
  this.$renderer.setSize(window.innerWidth, window.innerHeight);

  domEl.appendChild(this.$renderer.domElement);

  this._onWindowResize  = this._onWindowResize.bind( this );

  window.addEventListener('resize', this._onWindowResize, false);

};

Scene.prototype = Object.assign( Object.create( ThreeObj.prototype ), {

  constructor: Scene,

  init: function(){

    this.$scene.add( this.$camera );

    ThreeObj.prototype.init.call( this, this.$scene  );

    this.setup && this.setup( this.$scene );

    this._startUpdateLoop();

    return this;
  },

  render: function( dt, t ){

  },

  _startUpdateLoop:function() {
      var _this = this;
      var lastTime = Date.now();
      (function loop() {
          requestAnimationFrame(loop);

          var now = Date.now();
          var dt = Math.min(50, now - lastTime);
          lastTime = now;

          _this.update(dt, now);
          _this.render(dt, now);

      }());
  },

  _onWindowResize: function(){
    this.$camera.aspect = window.innerWidth / window.innerHeight;
    this.$camera.updateProjectionMatrix();
    this.$renderer.setSize(window.innerWidth, window.innerHeight);
  },

});

Scene.create = ThreeObj.create;


module.exports = Scene;
