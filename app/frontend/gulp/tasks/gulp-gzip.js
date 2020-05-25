const gulp      = require('gulp'),
      plugins   = require('../plugins'),
      pathFiles = require('../path'),
      fs        = require('fs');

const lastCommit = fs.readFileSync(pathFiles.base + '/last_commit', 'utf8');

module.exports = function () {
  let files = [
    pathFiles.output.img + '/**/!(*.mp4)',
    pathFiles.output.fonts + '/**/*.*',
    pathFiles.output.base + '/**/*.js',
    pathFiles.output.base + '/**/*.css',
  ];

  let runTasks = function () {
    gulp.task('urlVersioner', function() {
      return gulp.src(pathFiles.output.base + '/*.css', { base : './' })
        .pipe(plugins.urlVersioner({version: lastCommit}))
        .pipe(gulp.dest('./'));
    });

    gulp.task('gzip', function() {
      return gulp.src(files, { base : './' })
        .pipe(plugins.gzip({ append: false  }))
        .pipe(gulp.dest('./'));
    });
  };

  return {
    run : runTasks
  }
};
