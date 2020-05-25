/**
 * Contruye canvas del stand
 * @class HandlerCanvas
 * @main Stand
 * @author Victor Sandoval
 */
/*global $, CONFIG*/
import DrawCanvasLibrary from '../libs/draw-stand';

export default class HandlerCanvas {
  constructor () {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
  }

  setSettings() {
    this.st = {
      standCanvas       : '.js-stand_canvas',
      canvasLoader      : '.js-canvas-loader',
      exportCanvasHeight: 537
    };
    this.dom = {};
  }

  catchDom() {
    this.dom.standCanvas  = $(this.st.standCanvas);
    this.dom.canvasLoader = $(this.st.canvasLoader);
  }

  afterCatchDom() {
    this.fnDrawCanvas();
  }

  fnDrawCanvas() {
    let drawCanvasLibrary;

    drawCanvasLibrary = new DrawCanvasLibrary(this.dom.standCanvas[0], this.st.exportCanvasHeight);
    drawCanvasLibrary.buildStand(CONFIG, () => this.fnHideLoader());
  }

  fnHideLoader() {
    this.dom.canvasLoader.hide();
  }
}

