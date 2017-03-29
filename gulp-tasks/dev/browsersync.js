var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

module.exports = function() {
    browserSync.init({
      logLevel: "debug",
      files: ["app/assets/css/main.css"],
      server: {
          baseDir: "./app",
          debug: true,
          https: true,
          middleware: function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            next();
        }
      }
    });
    gulp.watch(['./app/assets/js/**/*.js']).on('change', reload);
};
