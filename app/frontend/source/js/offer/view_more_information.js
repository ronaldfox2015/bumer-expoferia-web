/**
 * Módulo encargado de ver más información en una descripción.
 * @class ViewMoreInformation
 * @main Detalle de Aviso
 * @author Janet Quispe
 */

import ContainerFloat from './container_float';
/*global $*/

export default class ViewMoreInformation {
  constructor () {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
    this.subscribeEvents();
  }

  setSettings() {
    this.st = {
      content    : '.js-current-content',
      btnViewMore: '.js-btn-view-more'
    };
    this.containerFloat = new ContainerFloat();
    this.dom = {};
  }

  catchDom() {
    this.dom.content = $(this.st.content);
    this.dom.btnViewMore = $(this.st.btnViewMore);
  }

  afterCatchDom() {
    this.getHeightBox();
  }

  subscribeEvents() {
    this.dom.btnViewMore.on('click', (event) => this.onShowInformation(event));
  }

  onShowInformation(event) {
    let $element, $content;
    event.preventDefault();

    $element = $(event.target);
    $content = $element.siblings(this.st.content);
    $content.toggleClass('is-active');
    this.containerFloat.updatePositions();

    if ($content.hasClass('is-active')) {
      $element.text('Ver menos').attr('title', 'ver menos');
    } else {
      $element.text('Ver más').attr('title', 'ver más');
    }
  }

  getHeightBox () {
    $.each(this.dom.content, (i, elem) => {
      let $elem = $(elem);
      if ($elem.data("height") && $elem.height() >= parseInt($elem.data("height"), 10)) {
        $elem.siblings(this.st.btnViewMore).show();
      } 
    });
  }
}
