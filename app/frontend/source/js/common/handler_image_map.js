/**
 * Clase para ajustar los map a la imagen
 * @class HandlerImageMap
 * @main All
 * @author Claudia Valdivieso
 */

/*global $*/

import '../libs/image_map_resizer';

export default class HandlerImageMap {
  constructor() {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
  }

  setSettings() {
    this.st = {
      map: '.js-map'
    };
  }

  catchDom() {
    this.dom     = {};
    this.dom.map = $(this.st.map);
  }

  afterCatchDom() {
    this.dom.map.imageMapResize();
  }
}

