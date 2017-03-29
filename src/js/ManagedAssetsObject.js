var device = require('./helpers/device');
var jsonLoader = require('./helpers/jsonloader')

var defaultLoadHandler = function( asset ){
  return asset;
};

var loadersShim = {
  json: {
    handler: defaultLoadHandler,
    loader: jsonLoader,
  },
  audio: {
    handler: defaultLoadHandler,
    loader: new THREE.AudioLoader(),
  },
  models: {
    handler: function( geometry, materials ){
      return {
          geometry: geometry,
          materials: materials
      };
    },
    loader: new THREE.JSONLoader(),
  },
  textures: {
    handler: defaultLoadHandler,
    loader: new THREE.TextureLoader()
  },
};

function ManagedAssetObject(){};

Object.assign( ManagedAssetObject.prototype, {

  onLoadProgress: function(xhr) {
      this._progressMap = this._progressMap || {};

      var uri = xhr.target.responseURL;

      if (this._progressMap[uri] === undefined) {
          this._progressMap[uri] = xhr.loaded;
          this._bytesToLoad += xhr.total;
      } else {
          this._bytesLoaded += xhr.loaded - this._progressMap[uri];
          this._progressMap[uri] = xhr.loaded;
      }
      var p = this._bytesLoaded / this._bytesToLoad;

  },

  loadAsset: function( uriPrefix, assetsObject, key, loader, handler) {
    var _this = this;

    return new Promise(function(resolve, reject) {
      var uri = uriPrefix + assetsObject[key];

      uri = uri.replace(/\.(?=[^.]*$)((ogg\|mp3)|(mp3\|ogg))/gi, device.isChrome ? '.ogg' : '.mp3' );

      loader.load(uri, function(){
        assetsObject[key] = handler.apply(assetsObject,arguments);
        resolve(assetsObject[key] );
      }, function(xhr) {
          _this.onLoadProgress(xhr);
      });
    });
  },

  loadAssetsSerial: function( uriPrefix, assetsObject, loader, handler, promiseChain ){

    var promise = promiseChain || Promise.resolve();
    var _this = this;
    var count = 0;

    for (var k in assetsObject) {
        if (assetsObject.hasOwnProperty(k) && k !== 'uriPrefix' ) {
          if ( typeof assetsObject[k] === 'object' ){
            promise = this.loadAssetsSerial( uriPrefix, assetsObject[k], loader, handler, promise )[0];
          } else {
            promise = promise.then(this.loadAsset.bind( this, uriPrefix, assetsObject, k, loader, handler ));

          }
        }
    }

    return [promise];
  },

  loadAssetsParallel: function(uriPrefix, assetsObject, loader, handler) {
      var promises = [];
      for (var k in assetsObject) {
          if (assetsObject.hasOwnProperty(k) && k !== 'uriPrefix' ) {
            if ( typeof assetsObject[ k ] === 'object' ){
              promises.push.apply( promises, this.loadAssetsParallel(uriPrefix, assetsObject[k], loader, handler ) );
            } else{
              promises.push( this.loadAsset( uriPrefix, assetsObject, k, loader, handler ) );
            }
          }
      }

      return promises;
  },


  /**
  /* Load all assets
  /* @return Promise
  */
  load: function() {

    if ( this._isLoading || this._hasLoaded ){
      return Promise.resolve();
    }

    var _this = this;

    var i;
    var promises = [];

    if  ( this.onLoad ){
      var p = this.onLoad();
      if ( p instanceof Promise ){
        promises.push( p );
      }
    }

    this._bytesToLoad = 0;
    this._bytesLoaded = 0;

    if (typeof this.assets === 'object') {
      var loaders = Object.keys( loadersShim );

      loaders.forEach(function( key ){
        if (_this.assets[ key ]) {
          uriPrefix = _this.assets[ key ].uriPrefix || '';
          promises.push.apply(promises,_this.loadAssetsSerial( uriPrefix,
            _this.assets[ key ],
              loadersShim[ key ].loader, loadersShim[ key ].handler ));
        }
      });
    }

    this._isLoading = true;

    return Promise.all(promises).then(function(){
      _this._isLoading = false;
      _this._hasLoaded = true;
    });
  }

});


module.exports = ManagedAssetObject;
