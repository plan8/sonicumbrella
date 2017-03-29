var THREE = require('three');
var Text  = require('./Text.js');

var TWO_PI = Math.PI * 2;

function Reticle( camera ){

  this.camera = camera;
  this.radius = 0.025;
  this.lineWidth = 0.005;
  var geometry = new THREE.RingGeometry( this.radius - this.lineWidth, this.radius, 64, 4, 0, Math.PI * 2 );
  var material = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: false, side: THREE.BackSide } );
  var reticleMesh = new THREE.Mesh( geometry, material );

  var progressMesh = new THREE.Mesh( geometry.clone(), material.clone() );

  var textObject = new THREE.Object3D();
  // flip'em so that progress goes in the right direction
  reticleMesh.position.set(0, 0, -1.0);
  progressMesh.position.set(0,0,-1.0);
  progressMesh.rotation.set( 0, -Math.PI, 0 );
  textObject.position.set(0,0,-1.0);
  textObject.rotation.set( 0, -Math.PI, 0 );
  reticleMesh.rotation.set( 0, -Math.PI, 0 );

  this.reticleMesh = reticleMesh;
  this.progressMesh = progressMesh;
  this.$textObject = textObject;
  this.$transform = new THREE.Object3D();

  this.$transform.add(reticleMesh);
  this.$transform.add(progressMesh);
  this.$transform.add(textObject);
  camera.add( this.$transform );

  //this._reticle.reticle_arm_object.add(reticleMesh);
  this._colliders = [];
  this._gazingObject = null;
  this._gazingDuration = 1000;
  this._gazeReleaseDuration = 0;
  this._gazeLongTimer = 0;
};

Reticle.prototype = {

  generateProgressMesh: function( progress ){

    this.progressMesh.geometry.dispose();
    this.progressMesh.geometry = new THREE.RingGeometry( this.radius + this.lineWidth, this.radius + this.lineWidth * 2, 64, 4, Math.PI * 0.5, TWO_PI * progress );
  },

  updateGazeProgress: function( progress ){
    progress = Math.max( 0, Math.min( progress, 1 ) );
    this.generateProgressMesh( progress );
  },

  update: function( dt, t ){
    //this._reticle.reticle_loop();
    this.hitDetection( dt, t );

  },

  hide: function() {
    this.camera.remove(this.$transform);
  },

  show: function() {
    this.camera.remove(this.$transform);
  },

  destroy:function(){
    this.hide();
    this._colliders = [];
  },

  resetAnimation: function(){
    this.updateGazeProgress(  0 );
  },

  hitDetection: function( dt, t ){
    //hack, these values should be calculated
    var vector = new THREE.Vector3(-0.0012499999999999734, -0.0053859964093356805, 0.5);
    vector.unproject(this.camera);
    var ray = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
    var intersects = ray.intersectObjects(this._colliders);
    //if an object is hit
    if (intersects.length > 0) {
        //save the new hit object and time
        this._reticleHitObject = intersects[0].object;
        this._reticleHitTime = t;

        //is the hit object gazeable
        if (this._reticleHitObject.gazeable) {

            this._isReleased = false;

            //check if there's a gazing object
            if (this._gazingObject != null) {
                //if the gazing object is the same as the hit object: check to see if the elapsed time exceeds the hover duration
                if (this._gazingObject === this._reticleHitObject) {

                    //if it does: trigger the click
                    var progress = ( this._reticleHitTime - this._gazingTime ) / this._gazingDuration;
                    this.updateGazeProgress( progress );

                    if ( progress >= 1 ) {
                        if (this._gazingObject.ongazelong != undefined) {
                            this._gazingObject.ongazelong();
                        }
                    }
                } else {
                    //if there is but it doesn't match the hit object: save the new hit object and time
                    this.resetAnimation();
                    this._gazingObject = this._reticleHitObject;
                    this._gazingTime = this._reticleHitTime;
                    if (this._gazingObject.ongazeout != undefined) {
                        this._gazingObject.ongazeout();
                    }

                }

            } else {
                this._gazingObject = this._reticleHitObject;
                this._gazingTime = this._reticleHitTime;
                if (this._gazingObject.ongazeover != undefined) {
                    this._gazingObject.ongazeover();
                }
            }

        }
    } else {
        if (this._gazingObject != null) {

            this.resetAnimation();
            if (this._gazingObject.ongazeout != undefined) {
                this._gazingObject.ongazeout();
            }

            //clear gazing and hit object and times
            this._reticleHitObject = null;
            this._reticleHitTime = null;
            this._gazingObject = null;
            this._gazingTime = null;
            this._gazeOutTIme = t;

        }

        if ( !this._reticleHitObject || !this._reticleHitObject.gazeable ) {

          if ( this._gazeReleaseDuration > 0 ){
            var progress = ( this._gazeOutTIme - t ) / this._gazeReleaseDuration;

            if ( progress >= -1 ){
              this.updateGazeProgress(  1+progress );

            } else if ( !this._isReleased ){
              this.ongazerelease && this.ongazerelease();
              this._isReleased  = true;
            }
          }
        }
    }
  },

  addColliders: function( objects ){
    for(var i = 0; i < objects.length; i++ ){
      this.addCollider( objects[ i ] );
    }
    return this;
  },
  addCollider: function( threeObj ){
    threeObj.gazeable = true;
    this._colliders.push( threeObj );
    return this;
  },

  removeCollider: function( threeObj ){

      threeObj.gazeable = false;
      var index = this._colliders.indexOf(threeObj);

      if (index > -1) {
        this._colliders.splice(index, 1);
      }
  },

  showText: function( text, fontSize ){

    fontSize = fontSize || 60;

    if ( !( text instanceof Array ) ){
      text = [ text ];
    }

    if (this.$textContainer ) {
      this.$textObject.remove( this.$textContainer  );
    }

    this.$textContainer = new THREE.Object3D();

    var lines = text.length;

    for ( var i = 0; i < lines; i++ ){
      var txt = text[i];
      var textSprite;

      if ( typeof txt === 'object' ){
        textSprite = Text.makeTextMesh( txt.text, fontSize);
        textSprite.scale.multiplyScalar( txt.fontSize / fontSize );
      } else {
        textSprite = Text.makeTextMesh( txt, fontSize );
      }

      textSprite.position.y = 0.1+ -i / 2;
      this.$textContainer.add( textSprite );

    }
    this.$textContainer.rotation.y = -Math.PI;

    this.$textObject.add( this.$textContainer );

  },

  hideText: function(){
    var _this = this;
    setTimeout( function(){
        _this.$textObject.remove( _this.$textContainer );
    }, 300 );
  },
};

module.exports = Reticle;
