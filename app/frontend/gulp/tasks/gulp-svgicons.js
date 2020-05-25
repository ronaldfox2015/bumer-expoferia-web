const gulp      = require('gulp'),
      plugins   = require('../plugins'),
      pathFiles = require('../path'),
      fn        = require('../functions');


module.exports = function () {
  let runTasks = function () {
    gulp.task('svgicons', function() {
      return gulp.src(pathFiles.input.icons + "/*.svg")
        .pipe(plugins.rename({prefix: 'g-icon-'}))
        .pipe(plugins.svgmin())
        .pipe(plugins.svgstore({ inlineSvg: true }))
        .pipe(gulp.dest(pathFiles.output.icons ))
        .on('end', fn.successHandler);
    });
  };

  return {
    run : runTasks
  }
};
