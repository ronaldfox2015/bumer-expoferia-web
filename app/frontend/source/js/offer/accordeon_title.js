/**
 * Módulo encargado deslizar verticalmente contenidos.
 * @class AccordeonTitle
 * @main Detalle de Aviso
 * @author Janet Quispe
 */

/*global $*/

export default class AccordeonTitle {
  constructor () {
    this.setSettings();
    this.catchDom();
    this.subscribeEvents();
  }

  setSettings() {
    this.st = {
      accordionTitle: '.js-accordion-title'
    };
    this.dom = {};
  }

  catchDom() {
    this.dom.accordionTitle = $(this.st.accordionTitle);
  }

  subscribeEvents() {
     this.dom.accordionTitle.on('click', (event) => this.onShowInformation(event));
  }

  onShowInformation(event) {
    let $element;
    $element = $(event.currentTarget);

    if($element.hasClass('is-active')) {
      $element.removeClass('is-active');
      $element.next().show();
    } else {
      $element.addClass('is-active');
      $element.next().hide();
    }
  }
}
