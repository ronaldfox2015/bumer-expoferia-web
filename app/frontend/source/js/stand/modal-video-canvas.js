/**
 * Módulo encargado de abrir modal en la región monitor
 * @class ModalVideoCanvas
 * @main Stand
 * @author Janet Quispe
 */
/*global $, CONFIG*/
/*global dataLayer*/

export default class ModalVideoCanvas {
  constructor () {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
    this.subscribeEvents();
  }

  setSettings() {
    this.st = {
      modalVideo    :'#modalViewVideo',
      standCanvas   :'.js-stand_canvas',
      containervideo:'.js-container-canvas',
      video         :'.js-video',
      iconClose     :'.js-icon-close',
    };
    this.currentStand = CONFIG;
    this.ratio = 0;
    this.dom = {};
  }

  catchDom() {
    this.dom.containervideo = $(this.st.containervideo);
    this.dom.modalVideo     = $(this.st.modalVideo);
    this.dom.standCanvas    = $(this.st.standCanvas, this.dom.containervideo);
    this.dom.video          = $(this.st.video, this.dom.modalVideo);
    this.dom.iconClose      = $(this.st.iconClose, this.dom.modalVideo);
  }

  afterCatchDom() {
    this.setUrlVideo();
  }

  subscribeEvents() {
    $(window).on('click', (event) => this.fnOutSide(event));
    this.dom.standCanvas.on('mousedown', (event) => this.fnHandlerMouseDown(event));
    this.dom.standCanvas.on('mousemove', (event) => this.fnHandlerMouseMove(event));
    this.dom.iconClose.on('click', () => this.fnCloseModal());
  }

  fnHandlerMouseDown(event) {
    let obj;
    obj = this.fnFlowRegionMonitor(event);

    if(obj) {
      if (obj.area.context.isPointInPath(obj.position.mouseX, obj.position.mouseY)) {
        this.fnShowModalYoutube();
        this.generateDatalayer();
      }
    }
  }

  fnHandlerMouseMove(event) {
    let obj;
    obj = this.fnFlowRegionMonitor(event);

    if(obj) {
      if (obj.area.context.isPointInPath(obj.position.mouseX, obj.position.mouseY)) {
        this.dom.standCanvas.css('cursor', 'pointer');
      } else {
        this.dom.standCanvas.css('cursor', 'default');
      }
    }
  }

  fnFlowRegionMonitor(event) {
    let position, canvasHeight, area;
    event.preventDefault();

    if (this.dom.modalVideo.length) {
      position = this.fnGetRealPoints(event);

      for (const property in this.currentStand.imageStands) {
        if (property == 'monitor') {
          if ($(window).width() > 1001 ) {
            canvasHeight = 537;
            area = this.fnDrawRegion(property, canvasHeight);
          } else {
            canvasHeight = this.dom.standCanvas.height();
            area = this.fnDrawRegion(property, canvasHeight);
          }
          return { area, position };
        }
      }
    }
  }

  fnGetRealPoints(event) {
    let canvasOffset, offsetX, offsetY, mouseX, mouseY;
    canvasOffset = this.dom.standCanvas.offset();
    offsetX = canvasOffset.left;
    offsetY = canvasOffset.top;
    mouseX = parseInt(event.clientX - offsetX);
    mouseY = parseInt(event.clientY - offsetY);

    return { mouseX, mouseY }
  }

  fnDrawRegion(property, canvasHeight) {
    let context, x, y, width, height;
    context = this.dom.standCanvas[0].getContext('2d');
    this.ratio = canvasHeight / this.currentStand.height;
    x = this.currentStand.imageStands[property].position_x * this.ratio;
    y = this.currentStand.imageStands[property].position_y * this.ratio;
    width = (this.currentStand.imageStands[property].size_width * 1000 - 35) * this.ratio;
    height = (this.currentStand.imageStands[property].size_height * 1000 - 135) * this.ratio;

    context.rect(x, y, width, height);

    return { context }
  }

  fnShowModalYoutube() {
    this.dom.modalVideo.addClass('is-active');
  }

  fnOutSide(event) {
    if(event.target.id === 'modalViewVideo') {
      this.dom.video[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
      this.dom.modalVideo.removeClass('is-active');
    }
  }

  fnCloseModal() {
    this.dom.video[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
    this.dom.modalVideo.removeClass('is-active');
  }

  setUrlVideo () {
    const newSrc = this.dom.video.attr('src') + '?enablejsapi=1&version=3&playerapiid=ytplayer';
    this.dom.video.attr('src', newSrc);
  }

  generateDatalayer() {
    const video = this.dom.video.attr('src');
    const idUser   = this.dom.containervideo.data('idUser')? this.dom.containervideo.data('idUser') : '0';
    dataLayer.push({
      'event':'Expoaptitus',
      'category':'Expoaptitus Video - Stand',
      'action':`${video}`,
      'label':`${idUser} | ${window.location.href}`,
      'value':1});
  }
}

