/*
 * Debug parameters.
 */
window.WebVRConfig = {
  /**
   * webvr-polyfill configuration
   */

  // Forces availability of VR mode.
  //FORCE_ENABLE_VR: true, // Default: false.
  // Complementary filter coefficient. 0 for accelerometer, 1 for gyro.
  //K_FILTER: 0.98, // Default: 0.98.
  // How far into the future to predict during fast motion.
  //PREDICTION_TIME_S: 0.040, // Default: 0.040 (in seconds).
  // Flag to disable touch panner. In case you have your own touch controls
  //TOUCH_PANNER_DISABLED: true, // Default: false.
  // Enable yaw panning only, disabling roll and pitch. This can be useful for
  // panoramas with nothing interesting above or below.
  //YAW_ONLY: true, // Default: false.
  // Enable the deprecated version of the API (navigator.getVRDevices).
  //ENABLE_DEPRECATED_API: true, // Default: false.
  // Scales the recommended buffer size reported by WebVR, which can improve
  // performance. Making this very small can lower the effective resolution of
  // your scene.
  BUFFER_SCALE: 0.5, // default: 1.0
  // Allow VRDisplay.submitFrame to change gl bindings, which is more
  // efficient if the application code will re-bind it's resources on the
  // next frame anyway.
  // Dirty bindings include: gl.FRAMEBUFFER_BINDING, gl.CURRENT_PROGRAM,
  // gl.ARRAY_BUFFER_BINDING, gl.ELEMENT_ARRAY_BUFFER_BINDING,
  // and gl.TEXTURE_BINDING_2D for texture unit 0
  // Warning: enabling this might lead to rendering issues.
  //DIRTY_SUBMIT_FRAME_BINDINGS: true // default: false
  ALWAYS_APPEND_POLYFILL_DISPLAY: true,
};
