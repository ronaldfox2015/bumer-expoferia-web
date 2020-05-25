/**
 * Clase encargada de generar Slider en el nav cuando sea mobile.
 * @class SliderStand
 * @main Stand
 * @author Janet Quispe
 */

/*global $*/

import IScroll from 'iscroll';

export default class SliderStand {
  constructor() {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
    this.subscribeEvents();
  }

  setSettings() {
    this.st = {
      wrapper: '.js-slider',
    };
    this.dom = {};
    this.WIDTH_LAYOUT_MOBILE = 423;
  }

  afterCatchDom() {
    this.onResetPlugin();
  }

  catchDom() {
    this.dom.wrapper = $(this.st.wrapper);
  }

  subscribeEvents() {
    $(window).one('resize', () => this.onResetPlugin());
  }

  onResetPlugin() {
    if($(window).width() <= this.WIDTH_LAYOUT_MOBILE){
      this.fnSetScroll();
    }
  }

  fnSetScroll() {
    new IScroll(this.dom.wrapper[0], {
      mouseWheel      : true,
      eventPassthrough: true,
      scrollX         : true,
      scrollY         : false,
      preventDefault  : false,
      disablePointer  : true,  // important to disable the pointer events that causes the issues
      disableTouch    : false, // false if you want the slider to be usable with touch devices
      disableMouse    : false,
      fadeScrollbars  : true,
      scrollbars      : false
    });
  }
}

