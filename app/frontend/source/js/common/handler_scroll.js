/**
 * Módulo encargado de realizar un scroll cuando este sea solicitado
 * @class handler_scroll
 * @main Common
 * @author Carlos Huamani
 */

/*global $*/

export default class HandlerScroll {
  constructor() {
    this.setSettings();
    this.catchDom();
    this.subscribeEvents();
  }

  setSettings () {
    this.st = {
      scrollInit: '.js-scroll-init',
      scrollStop: '.js-scroll-stop'
    };
    this.dom = {};
  }
  catchDom() {
    this.document       = $('html, body');
    this.dom.scrollInit = $(this.st.scrollInit);
    this.dom.scrollStop = $(this.st.scrollStop);
  }
  subscribeEvents() {
    this.dom.scrollInit.on('click', () => this.fnMainScrollDocument());
  }

  fnMainScrollDocument() {
    this.document.animate({
      scrollTop: this.dom.scrollStop.offset().top
    }, 500);
  }
}

