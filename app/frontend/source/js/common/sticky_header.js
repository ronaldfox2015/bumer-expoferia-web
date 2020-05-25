/**
 * Posiciona el header
 * @class StickyHeader
 * @main All
 * @author Victor Sandoval
 */

/*global $*/
export default class StickyHeader {
  constructor () {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
    this.subscribeEvents();
  }

  setSettings() {
    this.st = {
      header     : '#header',
      body       : 'body',
      headerInner: '#headerInner'
    };
    this.dom = {};
    this.global = {
      flagScroll  : false,
      pointToFixed: 0,
      lengthLayout: null
    };
  }

  catchDom() {
    this.dom.header      = $(this.st.header);
    this.dom.body        = $(this.st.body);
    this.dom.window      = $(window);
    this.dom.headerInner = $(this.st.headerInner);
  }

  afterCatchDom() {
    this.global.pointToFixed = this.dom.header.height();
    this.global.lengthLayout = this.fnEvaluateWidthLayout();
  }

  subscribeEvents() {
    this.dom.window.on('scroll', () => this.onSetHeaderFixed());
    this.dom.window.on('resize', () => this.onResizeWindow());
  }

  onSetHeaderFixed () {
    if (this.dom.window.scrollTop() > this.global.pointToFixed && this.dom.body.width() > this.global.lengthLayout) {
      this.dom.headerInner.addClass('is-active');
    } else {
      this.dom.headerInner.removeClass('is-active');
    }
  }

  onResizeWindow () {
    let posScroll;
    if (this.dom.window.width() > this.global.lengthLayout) {
      posScroll = this.dom.window.scrollTop();
      if (posScroll > this.global.pointToFixed) {
        if (!this.global.flagScroll) {
          this.dom.headerInner.addClass('is-active');
          this.global.flagScroll = true;
        }
      } else {
        this.dom.headerInner.removeClass('is-active');
        this.global.flagScroll = false;
      }
    }
  }

  fnEvaluateWidthLayout () {
    let lengthLayout;
    lengthLayout = 0;
    return lengthLayout;
  }
}

