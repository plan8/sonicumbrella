var gulp = require('gulp');
module.exports = function(){
  gulp.src('index.html').pipe(gulp.dest('app/'))
}
