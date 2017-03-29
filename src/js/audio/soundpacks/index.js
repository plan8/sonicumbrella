var isIphone5 = (function(){
	function iOSVersion(){
		var agent = window.navigator.userAgent,
		start = agent.indexOf( 'OS ' );
		if( (agent.indexOf( 'iPhone' ) > -1) && start > -1)
			return window.Number( agent.substr( start + 3, 3 ).replace( '_', '.' ) );
		else return 0;
	}
	return iOSVersion() >= 6 && window.devicePixelRatio >= 2 && screen.availHeight==548 ? true : false;
}());

var mobileLow = [
  require('./pingpong.js'),
  require('./fruits.js'),
  require('./squeaky_toys.js'),
  require('./drums.js'),
  require('./violin.js'),
];

var mobileHightAndDesktop = [
  require('./pingpong.js'),
  require('./fruits.js'),
  require('./kalimba.js'),
  require('./squeaky_toys.js'),
  require('./drums.js'),
  require('./violin.js'),
  require('./cans.js')
];

module.exports = isIphone5 ? mobileLow : mobileHightAndDesktop;
