const gulp      = require('gulp'),
  plugins   = require('./gulp/plugins'),
  pathFiles = require('./gulp/path');

const runTask = function (nameTask){
  return require("./gulp/tasks/gulp-" + nameTask)()
};

runTask('clean').run();
runTask('svgicons').run();
runTask('html').run();
runTask('gzip').run();

gulp.task('prod', function(cb) {
  plugins.runSequence('urlVersioner', 'gzip', cb);
});

gulp.task('watch', function() {
  gulp.watch(pathFiles.input.views + '/**/*.pug', ['html']);
});

gulp.task('default', function(cb) {
  plugins.runSequence('clean', 'svgicons', 'html', cb);
});
