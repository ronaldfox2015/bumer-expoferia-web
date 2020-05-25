/**
 * Clase encargada de hacer zoom in/out a una imagen
 * @class HandlerZoom
 * @main Companies
 * @author Victor Sandoval
 */
import '../libs/smart_zoom'
/*global $*/

export default class HandlerZoom {
  constructor() {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
    this.subscribeEvents();
  }

  setSettings () {
    this.st = {
      imageContainer: '.js-zoom-image-container',
      imageMain     : '.js-zoom-image',
      zoomIn        : '.js-zoom-in',
      zoomOut       : '.js-zoom-out',
      ratioScale    : 0.2
    };
    this.dom = {};
    this.global = {
      timer           : null,
      flagPlugin      : true,
      initialPositionY: 0
    };
    this.WIDTH_LAYOUT_MOBILE = 690;
  }

  catchDom() {
    this.dom.imageContainer = $(this.st.imageContainer);
    this.dom.imageMain      = $(this.st.imageMain, this.dom.imageContainer);
    this.dom.zoomIn         = $(this.st.zoomIn);
    this.dom.zoomOut        = $(this.st.zoomOut);
  }

  afterCatchDom() {
    this.global.initialPositionY = this.dom.imageMain.data("pos-y");
    if(this.WIDTH_LAYOUT_MOBILE <= $(window).width()){
      this.fnMainInitializePlugin();
    }
  }

  subscribeEvents() {
    $(window).on('resize', () => this.onResize());
    this.dom.zoomIn.on('click', () => this.onZoomIn());
    this.dom.zoomOut.on('click', () => this.onZoomOut());
  }

  onResize() {
    // Si no está activo
    if(this.WIDTH_LAYOUT_MOBILE <= $(window).width()){
      this.global.flagPlugin = true;
      if(this.dom.imageMain.smartZoom('isPluginActive')) {
        this.dom.imageMain.smartZoom('destroy');
      } else {
        if(this.global.timer) clearInterval(this.global.timer);
        this.global.timer = setTimeout(() => {
          this.fnMainInitializePlugin();
        }, 1000);
      }
    } else {
      if (!this.global.flagPlugin) return false;
      this.global.flagPlugin = false;

      if(this.global.timer) clearInterval(this.global.timer);
      this.dom.imageMain.smartZoom('destroy');
    }
  }

  onZoomIn() {
    if(this.dom.imageMain.smartZoom('isPluginActive')) {
      this.dom.imageMain.smartZoom('zoom', this.st.ratioScale);
    }
  }
  onZoomOut() {
    if(this.dom.imageMain.smartZoom('isPluginActive')) {
      this.dom.imageMain.smartZoom('zoom', -this.st.ratioScale);
    }
  }

  getRegionWidth() {
    let regionWidth, containerWidth;
    regionWidth = $(window).width();
    containerWidth = this.dom.imageContainer.width();

    // Valido si el ancho de la pagina es mayor a la region del lienzo
    if(regionWidth >= containerWidth) {
      // En caso de que sea así tomo el ancho del setting que es 1100 máximo
      regionWidth = containerWidth
    }
    return regionWidth;
  }

  fnMainInitializePlugin() {
    let regionWidth;
    regionWidth = this.getRegionWidth();
    this.dom.imageMain.smartZoom({
      maxScale           : 1,
      scrollEnabled      : false,
      width              : `${regionWidth}px`,
      containerBackground: 'transparent',
      adjustOnResize     : false,
      initCallback       : () => {
        this.dom.imageMain.smartZoom('zoom', 0.3, {
          x: 0,
          y: this.global.initialPositionY
        });
      }
    })
  }
}
