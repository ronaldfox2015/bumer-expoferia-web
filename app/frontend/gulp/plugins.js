const Plugins = {};

// Plugins globals
Plugins.if             = require("gulp-if");
Plugins.runSequence    = require("run-sequence");
Plugins.notifier       = require("node-notifier");
Plugins.util           = require("gulp-util");
Plugins.gzip           = require("gulp-gzip");
Plugins.del            = require("del");
Plugins.urlVersioner   = require("gulp-css-url-versioner");

//Plugins gulp svgicons
Plugins.svgstore       = require("gulp-svgstore");
Plugins.svgmin         = require("gulp-svgmin");
Plugins.rename         = require("gulp-rename");

//Plugins gulp html
Plugins.pug            = require("gulp-pug");
Plugins.pugNative      = require("pug");
Plugins.pugLint        = require("gulp-pug-lint");
Plugins.rename         = require("gulp-rename");
Plugins.pugInheritance = require("pug-inheritance");


module.exports = Plugins;
