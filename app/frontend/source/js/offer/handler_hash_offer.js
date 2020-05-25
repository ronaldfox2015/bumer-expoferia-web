/**
 * Módulo para cargar las imágenes de baja calidad y luego las de calidad
 * @class HandlerHashOffer
 * @main Offer
 * @author Carlos Huamaní
 */

/*global $*/

export default class HandlerHashOffer {
  constructor () {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
  }

  setSettings() {
    this.st = {
      btnApply: ".js-init-apply"
    };
    this.dom = {};
  }

  catchDom() {
    this.dom.btnApply = $(this.st.btnApply);
  }

  afterCatchDom() {
    if(window.location.hash === "#questions") {
      this.dom.btnApply.first().trigger("click");
    }
  }
}
