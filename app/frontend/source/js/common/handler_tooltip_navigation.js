/**
 * Clase para poner los tooltip en la navegación de Stand
 * @class HandlerTooltipNavigation
 * @main All
 * @author Janet Quispe
 */

import 'tooltipster';
/*global $*/

export default class HandlerTooltipMap {
  constructor() {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
  }

  setSettings() {
    this.st = {
      contentTooltip: '.js-content-tooltip',
      areaTooltip   : '.js-area-tooltip'
    };
    this.dom = {};
  }

  catchDom() {
    this.dom.contentTooltip = $(this.st.contentTooltip);
    this.dom.areaTooltip    = $(this.st.areaTooltip, this.dom.contentTooltip);
  }

  afterCatchDom() {
    this.dom.areaTooltip.tooltipster({
      theme   : ['tooltipster-default'],
      maxWidth: 160,
      position: 'bottom'
    });
  }
}

