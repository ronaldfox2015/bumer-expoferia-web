const gulp      = require('gulp'),
      plugins   = require('../plugins'),
      pathFiles = require('../path'),
      fn        = require('../functions');

module.exports = function () {
  let pathPugFiles = [
    pathFiles.input.views + '/*.pug',
    pathFiles.input.views + '/**/*.pug',
    '!' + pathFiles.input.views + '/_**/*.pug',
    '!' + pathFiles.input.views + '/_**/**/*.pug'
  ];

  let runTasks = function () {
    gulp.task('html', function() {
      let pugCustom = fn.pugAdapter(plugins.pugNative);
      return gulp.src(pathPugFiles)
        .pipe(plugins.pugLint())
        .pipe(plugins.pug({ pretty: !fn.isProduction(), pug: pugCustom }))
        .pipe(plugins.rename({ extname: '.twig' }))
        .pipe(gulp.dest(pathFiles.output.views));
    });
  };

  return {
    run : runTasks
  }
};
