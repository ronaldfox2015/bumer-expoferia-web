/**
 * Clase encargada de mostrar un tooltip en la parte inferior izquierda de la imagen principal
 * @class HandlerTooltipHall
 * @main Companies
 * @author Victor Sandoval
 */

/*global $*/

export default class HandlerTooltipHall {
  constructor() {
    this.setSettings();
    this.catchDom();
    this.subscribeEvents();
  }

  setSettings () {
    this.st = {
      mapArea  : '.js-hall-area',
      container: '.js-hall-tooltip',
      itemRel  : '.js-hall-tooltip-item'
    };
    this.dom = {};
  }

  catchDom() {
    this.dom.mapArea   = $(this.st.mapArea);
    this.dom.container = $(this.st.container);
    this.dom.itemRel   = $(this.st.itemRel, this.dom.container);
  }

  subscribeEvents() {
    this.dom.mapArea.on('mouseenter', (event) => this.onShowTooltip(event));
    this.dom.mapArea.on('mouseleave', (event) => this.onHideTooltip(event));
  }

  onShowTooltip(event) {
    let imageRel;
    imageRel = $(event.target).attr('data-rel');
    this.dom.container.addClass('is-active');
    this.dom.itemRel
      .filter(`#${imageRel}`)
      .show()
      .siblings()
      .hide();
  }

  onHideTooltip() {
    this.dom.container.removeClass('is-active');
  }
}
