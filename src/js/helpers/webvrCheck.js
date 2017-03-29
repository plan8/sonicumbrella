var webvrCheck = {
  check: function(){
    var promises = [];
    var _this = this;
    promises.push( new Promise(function(resolve,reject){

      if ( _this.hasVrAndDisplays !== '?' ){
        resolve( this.hasVrAndDisplays );
      } else {
        if ( navigator.getVRDisplays !== undefined || navigator.getVRDevices !== undefined ){
          _this.browserSupportsWebVr = true;

          navigator.getVRDisplays().then(function(result){
            if ( !result.length ){
              _this.status = 'HMD not available';
              _this.hasVrAndDisplays = false;
              console.warn( 'HMD not available' );
            } else {
              _this.status = 'HMD available';
              _this.hasVrAndDisplays = true;
              if (result[0] && result[0].displayName) {
                _this.displayName = result[0].displayName;
              }
            }
            resolve( _this.hasVrAndDisplays )
          }).catch ( function () {
      			console.warn( 'THREE.VREffect: Unable to get VR Displays' );
      		});
        } else {
          _this.hasVrAndDisplays = false;
          resolve( false );
        }
      }
    }));

    promises.push( new Promise(function(resolve,reject){
      _this._hasController = false;
      if (!navigator.getGamepads) {
        _this._hasController = false;
      }else if (navigator.getGamepads().length > 0){
        var gamePads = navigator.getGamepads();
        for (var i = 0; i < gamePads.length; i++) {
          if (gamePads[i]) {
            _this._hasController = true;
          }
        }
      }
      resolve();
    }));

    return Promise.all(promises);
  },

  hasVrAndDisplays: '?',
  displayName: '?',
  hasController: function(){
    return this._hasController;
  },
  isOculus: function(){
    return webvrCheck.displayName.toLowerCase().indexOf('oculus') !== -1;
  },
  isVive: function(){
    return webvrCheck.displayName.toLowerCase().indexOf('vive') !== -1;
  },

  isDaydream: function(){
    return webvrCheck.displayName.toLowerCase().indexOf('daydream') !== -1;
  }
};

module.exports = webvrCheck;
