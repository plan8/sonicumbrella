var gulp = require('gulp');
var uglify = require('gulp-uglify');

module.exports =  function (cb) {
  gulp.src('app/assets/js/build/umbrella.js')
    .pipe(uglify())
    .pipe(gulp.dest('app/assets/js/build'));          
};
