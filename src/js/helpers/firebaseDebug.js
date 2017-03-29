var firebase = require('firebase');
var dat = require('dat-gui');

// Initialize Firebase
var config = {
    apiKey: "AIzaSyC8TFd95kLtLUonvDc5c6gwUIQ8HoDF8e0",
    authDomain: "plan8settings.firebaseapp.com",
    databaseURL: "https://plan8settings.firebaseio.com",
    storageBucket: "",
};
firebase.initializeApp(config);

var app = {}
var projectRef = 'magic_umbrella';
var isCreated = false;

function init() {
    var settingsRef = firebase.database().ref(projectRef);
    settingsRef.on('value', function(snapshot) {
        console.log(snapshot.val())
        app = snapshot.val();
        if (!isCreated) {
            createGUI();
            isCreated = true;
        };
    });
}

function createGUI() {
    var gui = new dat.GUI();
    for (var i in app) {
        gui.add(app, i, 0, 100).onChange((function(key) {
            return function(value) {
                app[key] = value
                updateDB()
            }
        }(i)))
    }
}

function updateDB() {
    firebase.database().ref(projectRef).set(app);
}

module.exports = {
    init: init,
    get: function(key) {
        return app[key];
    }
};
