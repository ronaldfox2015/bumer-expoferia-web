/**
 * Clase encargada de hacer cargar librerias solo en desktop
 * @class HandlerPerformance
 * @main Companies
 * @author Janet Quispe
 */
import HandlerTooltipHall from './handler_tooltip_hall';
import HandlerImagePerformance from './../common/handler_image_performance';
/*global $*/

export default class HandlerPerformance {
  constructor() {
    this.setSettings();
    this.afterCatchDom();
    this.subscribeEvents();
  }

  setSettings () {
    this.WIDTH_LAYOUT_MOBILE = 690;
    this.global = {
      flagSetPlugin    : true
    };
  }

  afterCatchDom() {
    this.onResize();
  }

  subscribeEvents() {
    $(window).on('resize', () => this.onResize());
  }

  onResize() {
    if(this.WIDTH_LAYOUT_MOBILE <= $(window).width()){
      if (!this.global.flagSetPlugin) return false;
      this.global.flagSetPlugin = false;
      new HandlerTooltipHall();
      new HandlerImagePerformance();
    }
  }
}
