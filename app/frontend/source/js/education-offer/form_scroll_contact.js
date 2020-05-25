/*global $*/
/**
 *  Scroll formulario contacto
 * @class FormScrollContactForm
 * @main Education-Offer
 * @author Christiam Mendives, Carlos Huamaní
 */

export default class FormScrollContact {
  constructor () {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
    this.subscribeEvents();
  }

  setSettings() {
    this.st = {
      boxContact   : '.js-box-contact',
      fullContainer: '.js-container-offer',
      margin       : 50
    };
    this.dom = {};
    this.global = {
      posLimit : 0
    };
  }

  catchDom() {
    this.dom.boxContact    = $(this.st.boxContact);
    this.dom.fullContainer = $(this.st.fullContainer);
  }

  afterCatchDom() {
    this.global.posLimit = this.dom.fullContainer.offset().top + this.dom.fullContainer.height();
    this.setPosition()
  }

  subscribeEvents() {
    $(window).on('scroll', () => this.scrollform())
  }

  setPosition() {
    this.dom.boxContact.css('top', this.st.margin + "px");
  }

  scrollform() {
    let windowpos, box, pos;
    windowpos = $(window).scrollTop();
    box = this.dom.boxContact;
    if (windowpos < this.global.posLimit - box.height() - this.st.margin) {
      pos = windowpos + this.st.margin;
      this.dom.boxContact.css({
        top: pos + "px",
        bottom: ''
      });
    } else{
      pos = this.global.posLimit - box.height() - this.st.margin;
      this.dom.boxContact.css({
        top: pos + "px",
        bottom: ''
      });
    }
  }
}
