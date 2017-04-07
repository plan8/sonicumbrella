'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var notifier = require('node-notifier');
var stringify = require('stringify');

// add custom browserify options here
var customOpts = {
  entries: ['./src/js/umbrella_main.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);


var b = process.argv[2] === 'build' ? browserify(opts) : watchify(browserify(opts));

b.transform( stringify, {
  appliesTo: { includeExtensions: ['.template', '.html', '.vert', '.frag' ] }
});

// add transformations here
// i.e. b.transform(coffeeify);

b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal



function bundle(  ) {
  return b.bundle()
    // log errors if they happen
    .on('error', function(e){
      gutil.log('Browserify Error',e)
      notifier.notify({
        'title': 'Compile Error',
        'message': e.message
      });
    })
    .pipe(source('umbrella.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./app/assets/js/build')).on('end', function(){
      notifier.notify({
        'title': 'Success!',
        'message': ":)"
      });
    });
}

module.exports = bundle;
