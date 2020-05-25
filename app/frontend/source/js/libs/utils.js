/*global $*/
export const Utils = {}

/*
 * -----------------------------------------------------
 * Jquery Validation FormDefault
 * -----------------------------------------------------
 */

Utils.formDefault = {
  invalidHandler(form, validator) {
    var $firstElement;
    $firstElement = $(validator.errorList[0].element);
    $("body,html").scrollTop($firstElement.parents("fieldset").offset().top - 180);
    $firstElement.focus();
  },

  errorPlacement (error, element) {
    error.appendTo(element.parents("fieldset"));
  },

  highlight (element) {
    $(element).parents("fieldset").addClass("is-error");
  },

  unhighlight (element) {
    $(element).parents("fieldset").removeClass("is-error");
  }

};

Utils.setErrorPlacement = (error, element) => {
  let _fieldset, newError;
  _fieldset = $(element).parents("fieldset");
  newError = $(error).text();

  _fieldset.removeClass("is-selected");
  _fieldset.addClass("is-error");

  if (newError !== "") {
    _fieldset.tooltipster("content", newError);
    _fieldset.tooltipster("option", "position", "top");
    _fieldset.tooltipster("open");
  }
};

Utils.setSuccessForm = (label, element) => {
  let _fieldset;
  _fieldset = $(element).parents("fieldset");
  _fieldset.tooltipster("content", null);
  _fieldset.tooltipster("close");
  _fieldset.removeClass("is-error");
  _fieldset.removeClass("is-selected");
};


/*
 * -----------------------------------------------------
 * Determinate Your Browser
 * -----------------------------------------------------
 */

Utils.browser = (() => {
  let a, b;
  a = ((d) => {
    let c, e, f, g, h, i;
    d = d.toLowerCase();
    e = /(chrome)[ /]([\w.]+)/.exec(d);
    g = /(webkit)[ /]([\w.]+)/.exec(d);
    f = /(opera)(?:.*version|)[ /]([\w.]+)/.exec(d);
    i = /(msie) ([\w.]+)/.exec(d);
    c = /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(d);
    h = e || g || f || i || d.indexOf("compatible") < 0 && c || [];
    return {
      brw: h[1] || "",
      ver: h[2] || "0"
    };
  })(navigator.userAgent);
  b = {};
  if (a.brw) {
    b[a.brw] = true;
    b.version = a.ver;
  }
  if (b.chrome) {
    b.webkit = true;
  } else {
    if (b.webkit) {
      b.safari = true;
    }
  }
  return b;
})();

Utils.getIEVersion = () => {
  let re, rv, ua;
  rv = -1;
  ua = null;
  re = null;
  if (navigator.appName === "Microsoft Internet Explorer") {
    ua = navigator.userAgent;
    re = new RegExp("MSIE (0-9){1,}[.0-9]{0,}");
    if (re.exec(ua) !== null) {
      rv = parseFloat(RegExp.$1);
    }
  } else if (navigator.appName === "Netscape") {
    ua = navigator.userAgent;
    re = new RegExp("Trident/.*rv:([0-9]{1,}[.0-9]{0,})");
    if (re.exec(ua) !== null) {
      rv = parseFloat(RegExp.$1);
    }
  }
  return rv;
};

Utils.isInternetExplorer = () => {
  return Utils.getIEVersion() !== -1 || Utils.browser.msie === true;
};


/*
 * -----------------------------------------------------
 * Get params from URL
 * -----------------------------------------------------
 */

Utils.getParameterByName = (name, url) => {
  let regex, results;
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, '\\$&'); // eslint-disable-line no-useless-escape
  regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

/*
 * -----------------------------------------------------
 * Message Box
 * -----------------------------------------------------
 */

Utils.showMessage = ($box, type, message) => {
  var fn, statusClass, messageBox, top;
  statusClass = "";
  messageBox = ".g-message_box";
  message = message || "Hubo un error, intente nuevamente";
  fn = {
    getType: function() {
      switch (type) {
        case "success":
          statusClass = "is-success";
          break;
        case "error":
          statusClass = "is-error";
          break;
        case "warning":
          statusClass = "is-warning";
          break;
      }
    },
    showMessage: function() {
      var html;
      html = '<section class="g-message_box ' + statusClass + ' hide"><div class="u-center_box"><div class="message"><span>' + message + '</span></div><i class="icon icon_cross"></i></div></section>';
      $(html).insertAfter($box);
      $(messageBox).fadeIn();
    },
    deleteAnyMessageBoxExist: function() {
      if ($(messageBox).length !== 0) {
        $(messageBox).remove();
      }
    }
  };
  fn.getType();
  fn.deleteAnyMessageBoxExist();
  top = $box.offset().top - 80;
  if (top < 0) {
    top = 0;
  }
  $("html,body").animate({
    scrollTop: top
  }, 'slow');
  fn.showMessage();
  $(".icon_cross", messageBox).on("click", function() {
    $(this).parents(messageBox).fadeOut();
  });
};

Utils.deleteMessage = () => {
  var fn, messageBox;
  messageBox = ".g-message_box";
  fn = {
    deleteAnyMessageBoxExist: function() {
      if ($(messageBox).length !== 0) {
        $(messageBox).remove();
      }
    }
  };
  fn.deleteAnyMessageBoxExist();
};


Utils.hideMenu = () => {
  $('.js-mobile-menu').removeClass('is-active');
  $('body').removeClass('is-mobile-menu-active');
};

/*
 * -----------------------------------------------------
 * Observer
 * -----------------------------------------------------
 */

Utils.FactoryObserver = {
  observers: {},
  create(element, callback) {
    let config, mutationObs;
    config = {
      childList    : true,
      subtree      : true,
      attributes   : true,
      characterData: true
    };
    mutationObs = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === "childList") {
          callback({});
        }
      });
    });
    mutationObs.observe(element, config);
    return mutationObs;
  },
  register(name, elements, callback) {
    Utils.FactoryObserver.observers[name] = {};
    Utils.FactoryObserver.observers[name]["callback"] = callback;
    Utils.FactoryObserver.observers[name]["elements"] = elements;
    Utils.FactoryObserver.observers[name]["items"] = [];
    elements.each((index, element) => {
      const observer = Utils.FactoryObserver.create(element, callback);
      Utils.FactoryObserver.observers[name]["items"].push(observer);
    });
  },
  disconnect(name) {
    let j;
    let len;
    let observer;
    let observers;
    observers = Utils.FactoryObserver.observers[name]["items"];
    for (j = 0, len = observers.length; j < len; j++) {
      observer = observers[j];
      observer.disconnect();
    }
  },
  connect(name) {
    let callback;
    let elements;
    callback = Utils.FactoryObserver.observers[name]["callback"];
    elements = Utils.FactoryObserver.observers[name]["elements"];
    Utils.FactoryObserver.observers[name]["items"] = [];
    elements.each((index, element) => Utils.FactoryObserver.observers[name]["items"].push(Utils.FactoryObserver.create(element, callback)));
  }
};
