var gulp = require('gulp');
var sass = require('gulp-sass');

module.exports = function () {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/assets/css'));
};
