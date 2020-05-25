const Plugins   = require('./plugins');
const Functions = {};

Functions.successHandler = function(){
  Plugins.notifier.notify({
    title   : 'Frontend Notify',
    message : 'Tarea terminada'
  });
};

Functions.isProduction = function (){
  let flag = true;
  if(Plugins.util.env.dev){
    flag = false;
  }
  return flag;
};

Functions.isGzip = function (){
  return Plugins.util.env.gzip;
};

Functions.pugAdapter = function (pug) {
  pug.runtime.attr = function (key, val, escaped, terse) {
    if (key == "__") {
      return ' ' + val;
    }

    if (val === false || val == null || !val && (key === 'class' || key === 'style')) {
      return '';
    }
    if (val === true) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    }
    if (typeof val.toJSON === 'function') {
      val = val.toJSON();
    }
    if (typeof val !== 'string') {
      val = JSON.stringify(val);
      if (!escaped && val.indexOf('"') !== -1) {
        return ' ' + key + '=\'' + val.replace(/'/g, '&#39;') + '\'';
      }
    }
    if (escaped) val = pug.runtime.escape(val);
    return ' ' + key + '="' + val + '"';
  };
  return pug;
};

module.exports = Functions;
