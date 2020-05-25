/*global jQuery*/
(function($) {
  return $.fn.prettySelect = function(options) {
    var defaults, init, settings, that;
    $.prettySelect = $.fn.prettySelect;
    defaults = {
      target: "g-wrap-select-pretty_select-category_name",
      content: "g-wrap-select-pretty",
      wrapper: "fieldset",
      classSelected: "is-selected",
      callback: function() {}
    };
    that = this;
    settings = $.extend({}, defaults, options);
    init = function(elem) {
      var _parentWrap, _this, events, functions, nameCategory, select, ulList;
      _this = $(elem);
      _parentWrap = _this.parents(settings.wrapper);
      functions = {
        generateList: function() {
          var output;
          output = "";
          $.each(elem.options, function(i) {
            output = output + '<li data-value="' + elem.options[i].value + '" data-index="' + elem.options[i].index + '">' + elem.options[i].text + '</li>';
          });
          return output = '<ul>' + output + '</ul>';
        },
        generateHTML: function() {
          var html, htmlCategory, valueDefault;
          valueDefault = elem.options[functions.getSelectIndex()].text;
          htmlCategory = '<div class="g-wrap-select-pretty_select-category"><span class="' + settings.target + '">' + valueDefault + '</span><span class="g-wrap-select-pretty__icon"></span></div>';
          html = '<div class="' + settings.content + '">' + htmlCategory + functions.generateList() + '</div>';
          $(html).insertAfter(_this);
        },
        getSelectIndex: function() {
          var selectedIndex;
          selectedIndex = elem.selectedIndex;
          if (elem.selectedIndex === -1) {
            selectedIndex = 0;
          }
          return selectedIndex;
        }
      };
      events = {
        onSelected: function() {
          var element, value;
          element = $(this)[0];
          value = element.options[element.selectedIndex].text;
          nameCategory.html(value);
          return settings.callback.call(this, value, settings);
        },
        showList: function(e) {
          var ulTag;
          e.stopPropagation();
          _this = $(this);
          ulTag = $("ul", _this);
          if (ulTag.is(":hidden")) {
            ulTag.show();
          } else {
            ulTag.hide();
          }
        },
        hideList: function(e) {
          if (!ulList.is(e.target) && ulList.has(e.target).length === 0) {
            ulList.hide();
          }
        },
        selectItem: function() {
          _this = $(this);
          select[0].selectedIndex = _this.data("index");
          select.trigger("change");
          nameCategory.text(_this.text());
        }
      };
      functions.generateHTML();
      ulList = $("ul", _parentWrap);
      select = $("select", _parentWrap);
      nameCategory = $("." + settings.target, _parentWrap);
      _this.on("change", events.onSelected);
    };
    $.extend($.prettySelect, {
      update: function() {
        that.each(function(i, element) {
          var value;
          value = element.options[element.selectedIndex].text;
          $("." + settings.target, $(element).parent()).html(value);
        });
      }
    });
    return that.each(function(i, elem) {
      init(elem);
    });
  };
})(jQuery);
