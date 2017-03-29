module.exports = {

  // delay before rain automation starts
  rainAutomation: {
    intro: {
      startDelay: 1000,

      // switches between in in view, left, right before moving on to random.
      positionInViewTime: 2000,
      positionLeftTime: 2000,
      positionRightTime: 2000,

      // after target positioning, this is how long it will rain before moving on to the next soundpack
      positionRandomTime: 12000,

      // how long it should take to change rain type
      transitionOutTime: 2000
    },

    main: {
      positionInViewTime: 4000,

      positionRandomTime: 17000,

      transitionOutTime: 1000
    }
  },

  speakerWinchTime: 6000,
  speakerWinchStartDelay: 3000,
  firstRainDropStart: 7000,
  rainChangeInterval: 10000,
  rainFallSpeed: 0.98,
  transitionToVRTime: 3000,
};
