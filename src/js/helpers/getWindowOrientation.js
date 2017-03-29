module.exports = function(){
  if ( window.orientation === undefined ){
    return window.innerWidth > window.innerHeight ? 90 : 0;
  }
  return window.orientation;
}
