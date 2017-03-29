var hasProp = {}.hasOwnProperty;

module.exports = {
  rateLimit: function( time, fn ){
    var lastTime = 0;

    return function(){
      var now = Date.now();
      if ( now - lastTime > time ){
          fn.apply( this, arguments );
          lastTime = now;
      }
    }
  },
  getParameterByName: function(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  },
};
