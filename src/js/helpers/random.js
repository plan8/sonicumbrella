module.exports = {

  between: function(min, max){
    return Math.random() * (max-min) + min;
  },
  betweenInt: function(min,max){
    return Math.round(this.between(min,max));
  },
  select: function(arrOrObj){
    var idx;
    if ( Array.isArray( arrOrObj ) ){
      idx = Math.round(Math.random()*(arrOrObj.length-1));
    } else {
      var keys = Object.keys( arrOrObj );
      idx = this.select( keys );
    }

    return arrOrObj[idx];
  }
};
