const gulp      = require('gulp'),
      plugins   = require('../plugins'),
      pathFiles = require('../path'),
      fn        = require('../functions');

module.exports = function () {

  let runTasks = function () {
    gulp.task('clean', function(cb) {
      return plugins.del([
        pathFiles.output.img,
        pathFiles.output.fonts,
        pathFiles.output.base + '/**/*.js',
        pathFiles.output.base + '/**/*.css',
      ], { force: true }, cb);
    });
  };

  return {
    run : runTasks
  }
};
