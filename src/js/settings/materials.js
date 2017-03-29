var shadingType = THREE.FlatShading;
var globalSettings = require('./globalSettings');

var materials = {
  violin       : {
    random: true,
    note_1     : [
      new THREE.MeshLambertMaterial({
        color: 0x55dbeb,
        emissive: 0x375b97,
        shading: shadingType
      }),

    ],
    note_2     : [
      new THREE.MeshLambertMaterial({
        color: 0xf555e0,
        emissive: 0x702767,
        shading: shadingType
      })
    ],
    note_3     : [
      new THREE.MeshLambertMaterial({
        color: 0xF9EA38,
        shading: shadingType
      })
    ]
  },
  kalimba      : {
    mallet     : [
      //rod
      new THREE.MeshLambertMaterial({
        color: 0xDFE7A1,
        emissive: 0x7E634B,
        shading: shadingType
      }),
      //tip
      new THREE.MeshLambertMaterial({
        color: 0x4D75F8,
        emissive: 0x183976,
        shading: shadingType
      })
    ]
  },
  eggs      : {
    egg     : [
      new THREE.MeshLambertMaterial({
        color: 0x00FDFF,
        emissive: 0x6D73FF,
        shading: shadingType
      })
    ]
  },
  pingpong  : {
    pingpong : [
      new THREE.MeshLambertMaterial({
        color: 0xFFFFF2,
        emissive: 0x807871,
        shading: shadingType
      })
    ]
  },
  squeaky_toys: {
    duck: [
      new THREE.MeshLambertMaterial({
        color: 0xf7ff00,
        emissive: 0xa05607,
        shading: shadingType
      }),
      new THREE.MeshLambertMaterial({
        color: 0xe68948,
        emissive: 0x6b2a03,
        shading: shadingType
      }),
    ]
  },

  fruits:{
    banana: [
      new THREE.MeshLambertMaterial({
        color: 0xffff00,
        emissive: 0xa05607,
        shading: shadingType
      }),
      new THREE.MeshLambertMaterial({
        color: 0x613925,
        emissive: 0x331F16,
        shading: shadingType
      })
    ],
    orange: [
      new THREE.MeshLambertMaterial({
        color: 0xffff00,
        emissive: 0xa05607,
        shading: shadingType
      }),
      new THREE.MeshLambertMaterial({
        color: 0xe68948,
        emissive: 0x6b2a03,
        shading: shadingType
      })
    ],
    grapes: [
      new THREE.MeshLambertMaterial({
        //stem
        color: 0x613925,
        emissive: 0x331F16,
        shading: shadingType
      }),
      //grapes
      new THREE.MeshLambertMaterial({
        color: 0xAF21FF,
        emissive: 0x100011,
        shading: shadingType
      })
    ],
    apple: [
      new THREE.MeshLambertMaterial({
        color: 0x33ff12,
        emissive: 0x313c07,
        shading: shadingType
      }),
      new THREE.MeshLambertMaterial({
        color: 0x613925,
        emissive: 0x57270E,
        shading: shadingType
      })
    ]
  },
  cans: {
    can_1: [
      new THREE.MeshLambertMaterial({
        color: 0xE8E7EA,
        emissive: 0x4B4A4C,
        shading: shadingType
      }),
      new THREE.MeshLambertMaterial({
        color: 0xE74A47,
        emissive: 0x7B1418,
        shading: shadingType
      }),
    ]
  },
  rain_drops: {
    drop_1:[
      new THREE.MeshLambertMaterial({
        color: 0xFEFDFF,
        emissive: 0x6E1688,
        shading: shadingType
      }),
    ]
  },
  drums: {
    snare     : [
      new THREE.MeshLambertMaterial({
        color: 0xE74A47,
        emissive: 0x7B1418,
        shading: shadingType
      }),
      new THREE.MeshLambertMaterial({
        color: 0xFEFDFF,
        emissive: 0x4C4C4D,
        shading: shadingType
      }),

    ],
    cymbal    : [
      new THREE.MeshLambertMaterial({
        color: 0xEBEB4E,
        emissive: 0xAC530A,
        shading: shadingType
      }),
    ],
    drumstick : [
      new THREE.MeshLambertMaterial({
        color: 0xFAD579,
        emissive: 0xD86610,
        shading: shadingType
      })
    ]
  },
  speaker: [
    new THREE.MeshLambertMaterial({
      //Rod + Cone
      color: 0x59595C,
      emissive: 0x161616,
      shading: shadingType
    }),
    new THREE.MeshLambertMaterial({
      // speaker box
      color: 0x5F3423,
      emissive: 0x33150C,
      shading: shadingType
    }),
    new THREE.MeshLambertMaterial({
      // cone outline
      color: 0x777777,
      emissive: 0x4B4B4B,
      shading: shadingType
    })
  ],
  umbrella: [
    //rod
    new THREE.MeshLambertMaterial({
      color: 0x777777,
      emissive: 0x4B4B4B,
      shading: shadingType,
      morphTargets: true
    }),
    //handle
    new THREE.MeshLambertMaterial({
      color: 0x613925,
      emissive: 0x421B0C,
      shading: shadingType,
      morphTargets: true
    }),
    //canvas
    new THREE.MeshLambertMaterial({
      color: 0x252C59,
      emissive: 0x111037,
      side: THREE.DoubleSide,
      shading: shadingType,
      opacity: 0.98,
      transparent:true,
      morphTargets: true
    }),
  ]
};

module.exports = materials;
