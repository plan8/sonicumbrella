require('gulp-task-loader')();
var gulp = require('gulp');
gulp.task('default', ['dev:watch', 'dev:browsersync']);
gulp.task('build',['build:browserify','build:sass'])
