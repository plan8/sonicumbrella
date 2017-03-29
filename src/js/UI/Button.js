var Text = require('./Text.js');
var _this = this;

var defaults = {
    color1: 0x444444,
    color2: 0x999999
};

function Button(settings) { //reticle, color1, color2, id, label, type, gazeOutCallback, callback
  this.settings = Object.assign( {}, defaults, settings || {});
  THREE.Object3D.call( this );
  this.label = this.settings.label;
  this.callback = this.settings.callback;
  this.handleClick = this.settings.handleClick;
  this._id = this.settings.id;

  this.color = this.settings.color1;
  this.wipeColor = this.settings.color2;
  this.type = this.settings.type || "button";
  this._default = this.settings.default;
  this.gazeOutCallback = settings.gazeOutCallback;
  var material = new THREE.MeshBasicMaterial({color: this.color, transparent:true, opacity:0.5});
  var geometry = new THREE.PlaneGeometry(settings.width || 1.8, settings.height || 0.4);
  this.mesh = new THREE.Mesh(geometry, material);

  this.add(this.mesh);

  var swipeMaterial = new THREE.MeshBasicMaterial({color: this.wipeColor, transparent:false});
  var swipeGeometry = new THREE.PlaneGeometry(1, 1);
  this.wipeMesh = new THREE.Mesh(swipeGeometry, swipeMaterial);

  this.wipeMesh.scale.y = 0.0000001;

  var bgMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF, transparent:false});
  var bgGeometry = new THREE.PlaneGeometry(1, 1);
  this.bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);

  this.mesh.ongazeover = this.ongazeover.bind(this);
  this.mesh.ongazeout = this.ongazeout.bind(this);
  this.mesh.handleClick = this.handleClick;
  this.gazeLongFix = this.gazeLongFix.bind(this);

  this.selected = false;

  this.gazeTimer = 0;

  if (this.label) {
    this.createLabel();
  }
  if (this._default) {
    this.setSelected();
  }
}

Button.prototype = Object.assign( Object.create(THREE.Object3D.prototype), {
  constructor: Button,

  handleClick: function(){
    this.callback && this.callback(this._id);
  },

  gazeLongFix: function(){

    if (this.type != "toggle" && this.selected) return;

    if (this.type == "toggle") {

      if (this.selected) {
        this.setUnSelected(-1);
      }else {
        this.setSelected();
      }

    }else if (this.type != "button"){
      this.setSelected();
    }
    this.callback && this.callback(this._id);
    this.handleClick && this.handleClick();
  },



  ongazeover: function(){
    var yScaleTarget = 0.8;
    if (this.type == "button") {
      yScaleTarget = 1;
    }
    // temp fix without createjs
    //this.tween = createjs.Tween.get(this.wipeMesh.scale).to({ y: yScaleTarget }, 1000).call( this.gazeLongFix );
    this.gazeTimeout = setTimeout(function(){
      this.gazeLongFix();
    }.bind(this), 1000)

  },

  ongazeout: function(){

    clearTimeout(this.gazeTimeout);
    this.gazeTimer = 0;

    if (!this.selected) {
      this.setUnSelected(-1);
    }

    if (this.gazeOutCallback) {
      this.gazeOutCallback(this._id);
    }


  },
  setSelected: function() {

    this.selected = true;

    if (this.type == "toggle") {
      this.wipeMesh.scale.set(0.8, 0.00001, 1);
    }else {
      this.wipeMesh.scale.set(0.8, 0.8, 1);
    }
    if (this.settings.selectedColor) {
      this.mesh.material.color.setHex(this.settings.selectedColor);
    }
    //this.mesh.scale.set(0.8, 0.8, 1);

  },
  setUnSelected: function( id ) {

    if (id == undefined || id == this._id) return;

    this.selected = false;
    this.wipeMesh.scale.set(1, 0.00001, 1);
    this.mesh.scale.set(1, 1, 1);

    if (this.tween) {
      this.tween.setPaused(true);
    }
    if (this.settings.selectedColor) {
      this.mesh.material.color.setHex(this.color);
    }
  },
  createLabel: function() {
    this.textSprite = Text.makeTextMesh(this.label, 100);
    //this.textSprite.rotation.x = -Math.PI * 0.5;
    this.textSprite.scale.multiplyScalar( 0.3 );
  	this.add( this.textSprite );
    this.textSprite.position.x = 0;
    this.textSprite.position.y -= 0.05;
    this.textSprite.position.z += 0.01;
  }

});


module.exports = Button;
