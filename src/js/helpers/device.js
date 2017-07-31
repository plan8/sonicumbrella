var ua = navigator.userAgent;
var isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
var isAndroid = /Android/i.test(ua);
var isIOS    = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
var hasTouch = ('ontouchstart' in window);
var isChrome = /Chrome/.test(ua) && /Google Inc/.test(navigator.vendor);
var isNexus6 = ua.indexOf('Nexus 6P') > -1;
//var isSafari = ua.match(/AppleWebKit/); //also matched webview based ios applications like Chrome
var isMobile = isMobileOrTablet && ( ( isAndroid && /Mobile Safari/i.test(ua) ) || ( isIOS && /iPhone/i.test(ua) ) || ( ( isAndroid &&  /Mobile VR Safari/i.test(ua) ) ) );
var isTablet = isMobileOrTablet && !isMobile;

module.exports = {

    hasTouch  : hasTouch,
    isMobile  : isMobile,
    isTablet  : isTablet,
    isDesktop : !isMobile,
    isAndroid : isAndroid,
    isChrome  : isChrome,
    isIOS     : isIOS,
    isNexus6  : isNexus6,
    //isSafari  : isSafari,

    browser: function() {
      var tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
      if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
        return {name:'IE',version:(tem[1]||'')};
      }
      if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR\/(\d+)/)
        if(tem!=null)   {return {name:'Opera', version:tem[1]};}
      }
      M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
      if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
      return {
        name: M[0],
        version: parseInt(M[1])
      };
    }(),
};
