// webpack.config.js
// guide: http://symfony.com/doc/current/frontend.html
// documentation: https://github.com/symfony/webpack-encore/blob/master/index.js
// Pug with symfony: https://github.com/pug-php/pug-symfony
let Encore = require('@symfony/webpack-encore');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let frontendPath = require('./gulp/path');

Encore
  // directory where all compiled assets will be stored
  .setOutputPath('../web/')

  // what's the public path to this directory (relative to your project's document root dir)
  .setPublicPath('/')

  // empty the outputPath dir before  each build
  // .cleanupOutputBeforeBuild()

  // modify the default Babel configuration
  // http://symfony.com/doc/current/frontend/encore/babel.html
  .configureBabel(function(babelConfig) {
      babelConfig.presets.push('es2017');
  })

  // will output as web/build/app.js
  .addEntry('babel-polyfill', 'babel-polyfill')
  .addEntry('home', './source/js/home.js')
  .addEntry('close', './source/js/close.js')
  .addEntry('stand', './source/js/stand.js')
  .addEntry('offer', './source/js/offer.js')
  .addEntry('error', './source/js/error.js')
  .addEntry('companies', './source/js/companies.js')
  .addEntry('education-offer', './source/js/education-offer.js')
  .createSharedEntry('vendor', [
    'jquery',
    '@fancyapps/fancybox',
    './source/js/libs/pretty_select.js',
    'jquery-validation/dist/localization/messages_es.js',
    'jquery-lazyload/jquery.lazyload.js',

    'normalize.css/normalize.css',
    '@fancyapps/fancybox/dist/jquery.fancybox.css',
    'tooltipster/dist/css/tooltipster.bundle.min.css',
    'tooltipster/dist/css/tooltipster.main.min.css',
    'jquery-ui/themes/base/core.css',
    'jquery-ui/themes/base/autocomplete.css'
  ])

  // will output as web/build/global.css
  .addStyleEntry('global', './source/css/global.scss')

  // allow sass/scss files to be processed
  .enableSassLoader()
  .enablePostCssLoader()

  // allow legacy applications to use $/jQuery as a global variable
  .autoProvidejQuery()
  .enableSourceMaps(!Encore.isProduction())
  .addPlugin(new CopyWebpackPlugin([
      { context: frontendPath.input.img, from: '**/*', to: 'images/' },
  ]))
;

// export the final configuration
module.exports = Encore.getWebpackConfig();
