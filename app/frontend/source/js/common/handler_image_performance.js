/**
 * Módulo para cargar las imágenes de baja calidad y luego las de calidad
 * @class HandlerImagePerformance
 * @main Common
 * @author Carlos Huamaní
 */

/*global $*/

export default class HandlerImagePerformance {
  constructor (params) {
    this.setSettings(params);
    this.catchDom();
    this.afterCatchDom();
  }

  setSettings(params) {
    this.st = {
      lazyImage: ".js-lazy-image_banner"
    };
    this.dom = {};
    $.extend(this.st, params);
  }

  catchDom() {
    this.dom.lazyImage = $(this.st.lazyImage);
  }

  afterCatchDom() {
    let image, timer;
    if (!this.dom.lazyImage.data("image-src")) { return }
    timer = 1000;
    image = new Image();
    image.src = this.dom.lazyImage.data("image-src");
    image.onload = () => {
      setTimeout(() => {
        if (this.dom.lazyImage[0].nodeName === "IMG") {
          this.dom.lazyImage.attr("src", image.src);
          this.dom.lazyImage.removeClass("is-blured");
        } else {
          this.dom.lazyImage.css("background-image", `url(${image.src})`);
        }
      }, timer);
    };
  }
}
