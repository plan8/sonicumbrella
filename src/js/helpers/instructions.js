var ThreeObj  = require('../ThreeObj');
var speaker   = require('../objects/voSpeaker');
var events    = require('./events');
var umbrella  = require('../objects/umbrella');
var device    = require('../helpers/device');
var timing    = require('../settings/timing');
var cameraRig = require('../objects/cameraRig');
var webvrCheck = require('../helpers/webvrCheck');
var globalVars = require('../helpers/globalVars');

var conditions = {
  umbrellaDown: function(){
    return umbrella.state === umbrella.DOWN;
  },
  umbrellaUp: function(){
    return umbrella.state === umbrella.UP;
  },
  mobileOnly: function(){
    return device.isMobile;
  },
  hasController: function(){
    return webvrCheck.hasController();
  }
};

var voArr = [
  {
    name: 'instruction01',
    type: 'auto',
  },
  {
    name: 'instruction02',
    type: 'auto',
  },
  {
    name: 'instruction03',
    type: 'auto',
  },
  [
    {
      name: 'cardboardInstructions',
      type: 'repeat_once',
      condition: function(){ return conditions.umbrellaDown() && device.isMobile && !globalVars.is360 && !webvrCheck.isDaydream(); },
      timeout: [ 7000, 7000, 4000, 7000],
      interaction: umbrella.UP,
    },
    {
      name: 'controllerInstructions',
      type: 'repeat_once',
      condition: function(){ return conditions.umbrellaDown() && globalVars.isVR && device.isDesktop },
      timeout: [9000, 9000, 9000, 9000, 2700, 9000],
      interaction: umbrella.UP
    },
    {
      name: 'daydreamInstructions',
      type: 'repeat_once',
      condition: function(){ return conditions.umbrellaDown() && webvrCheck.isDaydream(); },
      timeout: [9000, 9000, 9000, 9000, 2700, 9000],
      interaction: umbrella.UP
    },
    {
      name: 'threeSixtyInstructionsMobile',
      type: 'repeat_once',
      condition: function(){ return conditions.umbrellaDown() && device.isMobile && globalVars.is360 },
      timeout: [9000],
      interaction: umbrella.UP
    },
    {
      name: 'threeSixtyInstructionsDesktop',
      type: 'repeat_once',
      condition: function(){ return conditions.umbrellaDown() && globalVars.is360 && device.isDesktop },
      timeout: [9000],
      interaction: umbrella.UP
    }
  ],
  {
    name: 'instruction06',
    type: 'repeat_once',
    delay: 500,
    timeout: [ 7000, 7000, 7000],
    interaction: umbrella.DOWN
  },
  {
    name: 'instruction11',
    type: 'interaction_only',
    timeout: 1000,
    interaction: umbrella.UP
  },
  {
    name: 'instruction12',
    type: 'repeat_once',
    interaction: 'look_up',
    delay: 500,
    timeout: [9000, 9000, 9000]
  },
  {
    name: 'instruction13',
    type: 'instructions_complete',
  },
  {
    name: 'instruction15',
    type: 'end',
  },
];

var instructions = {

  step: 0,

  start: function( onComplete ){

    this.onComplete = onComplete;
    this.nextStep = this.nextStep.bind( this );
    this.onUmbrellaStateChange = this.onUmbrellaStateChange.bind( this );
    events.addEventListener( events.TOGGLE_UMBRELLA, this.onUmbrellaStateChange );
    this.count = 0;
    this.nextStep();
  },

  startEnding: function(cb) {

    setTimeout(function() {
      speaker.playVO('instruction01', function() {
        speaker.playVO('instruction15', cb);
      }.bind(this));

    }.bind(this), 1500)

  },

  nextStep: function(){

    if ( this.step < voArr.length ){

      var voObject;

      if (Array.isArray( voArr[this.step] )) {
        voObject = voArr[this.step].find(function(o){
          return o.condition();
        });

        if ( !voObject ){
          //console.error('No instruction path found. Skipping');
          voObject = {};
          //continue if umbrella is already up
          this.step++;
          this.nextStep();
          return;
        }

      } else {
        voObject = voArr[this.step];
      }

      var callback;

      if ( voObject.condition !== undefined) {
        var conditionCheck = voObject.condition();

        if ( !conditionCheck ){
          this.step++;
          this.nextStep();
          return;
        }
      }

      this.waitFor = voObject.interaction !== undefined ? voObject.interaction : 'nothing';

      if ( voObject.type == 'auto' ) {

        callback = this.nextStep.bind(this);

      } else if (voObject.type == 'wait') {

        if (voObject.timeout) {
          this._timeout = setTimeout( function loop(){
            this.nextStep();
          }.bind(this), voObject.timeout );
        }

      } else if (voObject.type == 'repeat' || voObject.type == 'repeat_once') {
        //count
        var _this = this;
        var count = 0;
        var delay = voObject.delay ? voObject.delay : 0;
        var timeDelay = (Array.isArray(voObject.timeout) ? voObject.timeout[0] : voObject.timeout) + delay;

        this._timeout = setTimeout( function loop(){
          count++; //first time is outside of the timeout
          if ( count === 1 && ( voObject.name === 'controllerInstructions' || voObject.name === 'cardboardInstructions' ) ){
            require('../mainScene').initGaze();
          }
          speaker.playVO(voObject.name, false, count);
          var nextDelay = Array.isArray(voObject.timeout) ? voObject.timeout[count % voObject.timeout.length] : voObject.timeout;

          if (voObject.type == 'repeat' || (voObject.type == 'repeat_once' && count <= voObject.timeout.length)) {
            instructions._timeout = setTimeout( loop, nextDelay || 5000);
          }

          // move on even if the user is not interacting
          if (voObject.type == 'repeat_once' && count > voObject.timeout.length) {
            clearTimeout( _this._timeout );
            _this.nextStep();
          }

        }, timeDelay );

      } else if (voObject.type == 'instructions_complete') {
        // if the user hasn't looked up yet, start anyway
        if (!this.isLookingUp) {
          this.instructionsComplete();
        }
      } else if (voObject.type == 'interaction_only') {

        this.step++;
        this.nextStep();
        return;
      }

      var soundId = 0;

      if (voObject.name == 'instruction02') {
        var time = new Date().getHours();

        if (time < 3) {
          soundId = 2;
        } else if (time < 10) {
          soundId = 0;
        } else if (time < 18) {
          soundId = 1;
        } else {
          soundId = 2;
        }
      }
      var delay = voObject.delay ? voObject.delay : 0;
      setTimeout(function() {
        speaker.playVO(voObject.name, callback, soundId);
      }, delay)

      this.step++;
    } else {
      //events.removeEventListener( events.TOGGLE_UMBRELLA, this.onUmbrellaStateChange );
      //this.onComplete && this.onComplete();
    }
  },
  getInstructionByName: function(name) {
    var instruction;
    for (var i = 0; i < voArr.length; i++) {
      if (voArr[i].name == name) {
        instruction = voArr[i];
      }
    }
    return instruction;
  },

  update: function( dt, t ){
    if (this.waitFor == 'look_up') {
      if (cameraRig.getCameraDirection().y > 0.8 ) {
        clearTimeout( this._timeout );
        this.waitFor = 'nothing';
        this.isLookingUp = true;
        this.instructionsComplete();
        this.nextStep();
      }
    }
  },
  instructionsComplete: function() {
    setTimeout(function() {
      this.onComplete && this.onComplete();
    }.bind(this), timing.firstRainDropStart);

  },
  onUmbrellaStateChange: function(){

    setTimeout( function(){

      if ( umbrella.state == this.waitFor ) {
        clearTimeout( this._timeout );
        this.nextStep();
      } else if (this.waitFor == 'look_up') {
        speaker.playVO('instruction11', false, this.count++);

      }
    }.bind(this), 500 );
  }
};

module.exports = instructions;
