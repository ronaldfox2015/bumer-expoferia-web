const Path = {};

Path.base          = __dirname + '/../..';
Path.input         = {};
Path.output        = {};

Path.input.icons   = Path.base + '/frontend/source/icons';
Path.input.img     = Path.base + '/frontend/source/images';
Path.input.fonts   = Path.base + '/frontend/source/fonts';
Path.input.views   = Path.base + '/frontend/source/views';

Path.output.base   = Path.base + '/web';
Path.output.icons  = Path.base + '/frontend/source/views/_layout/includes';
Path.output.views  = Path.base + '/app/Resources/views';
Path.output.img    = Path.output.base + '/images';
Path.output.fonts  = Path.output.base + '/fonts';

module.exports = Path;
