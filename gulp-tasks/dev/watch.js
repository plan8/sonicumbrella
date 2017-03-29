var gulp = require('gulp');
var watch = require('gulp-watch');
var debounce = require('debounce');

function browserifyBuild(){
  gulp.start('build:browserify');
}

function sassCompile(){
  gulp.start('build:sass');
}

module.exports = function(){
  watch( ['./src/js/**/*.js','!./src/js/audio/soundpacks/**/*.js'],  { ignoreInitial: false, read:false, events: ['add', 'change', 'unlink', 'addDir', 'unlinkDir'] }, debounce( browserifyBuild, 10 ) );
  watch( ['./src/sass/**/*.scss'],  { ignoreInitial: false, read:false, events: ['add', 'change', 'unlink', 'addDir', 'unlinkDir'] }, debounce( sassCompile, 10 ) );
};

// module.exports = function() {
//     //gulp.watch(['./src/**/*.js'], ['build:browserify']);
//     gulpWatch
//     gulp.watch(['./src/**/*.js'], [
//         'build:browserify'
//     ]);
// };
