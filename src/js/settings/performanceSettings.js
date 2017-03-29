var webvrCheck = require('../helpers/webvrCheck');
var device     = require('../helpers/device');

var performanceSettings = {
  high: {
    soundPoolSize:30,
    soundPoolPanners:8,
    soundPoolUseSharedPanners: false,
    soundPoolMinTimeBetweenSounds: 0.0,
    soundPoolSwitchToEqualPowerThreshold:20,
    useQuadroAmbience: true,
    numberOfRainObjects: 400,
    maxSplatParticles: 2500,
    numberOfImpactCircles: 60,
    particlesPerSplat: 10

  },
  standard: {
    soundPoolSize:15,
    soundPoolPanners:8,
    soundPoolUseSharedPanners: false,
    soundPoolMinTimeBetweenSounds: 0.0,
    soundPoolSwitchToEqualPowerThreshold:10,
    useQuadroAmbience: true,
    numberOfRainObjects: 150,
    maxSplatParticles: 2500,
    numberOfImpactCircles: 60,
    particlesPerSplat: 10

  },
  low: {
    soundPoolSize:6,
    soundPoolPanners:5,
    soundPoolUseSharedPanners: false,
    soundPoolMinTimeBetweenSounds: 0.0,
    soundPoolSwitchToEqualPowerThreshold: 8,
    useQuadroAmbience: false,
    numberOfRainObjects: 50,
    maxSplatParticles: 500,
    numberOfImpactCircles: 30,
    particlesPerSplat: 0
  }
}

var settingsToUse;
if ( device.isMobile ) {
  settingsToUse = performanceSettings.low;
} else {
  settingsToUse = performanceSettings.standard;
}
module.exports = settingsToUse;
