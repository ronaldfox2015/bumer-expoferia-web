/**
 * Clase encargada mostrar aside.
 * @class SliderStand
 * @main Stand
 * @author Janet Quispe
 */

/*global $*/

export default class ShowAside {
  constructor() {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
    this.subscribeEvents();
  }

  setSettings() {
    this.st = {
      linkViewMore   : ".js-show-aside",
      textlink       : ".js-change-text",
      contentAside   : ".js-content-aside",
      contentAds     : ".js-content-ads",
      contentFeatures: ".js-content-features",
      video          : ".js-video",
      isOpenClass    : "is-active",
    };
    this.dom = {};
    this.global = {
      isAnimating: false
    };
  }

  catchDom() {
    this.dom.contentFeatures = $(this.st.contentFeatures);
    this.dom.linkViewMore    = $(this.st.linkViewMore);
    this.dom.contentAside    = $(this.st.contentAside, this.dom.contentFeatures);
    this.dom.contentAds      = $(this.st.contentAds, this.dom.contentFeatures);
    this.dom.video           = $(this.st.video, this.dom.contentAside);
  }

  afterCatchDom() {
    this.setUrlVideo();
  }

  subscribeEvents() {
    this.dom.linkViewMore.on('click', () => this.onAsideCompany());
    this.dom.contentAside.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', () => this.onTransition());
  }

  onAsideCompany() {
    if (!this.global.isAnimating) {
      this.global.isAnimating = true;
      if (this.dom.contentFeatures.hasClass(this.st.isOpenClass)) {
        this.dom.linkViewMore.find(this.st.textlink).text("Ver más información");
        this.dom.contentAds.removeClass("is-hidden");
        this.dom.contentAside.removeClass("is-active");
      }
      if (this.dom.video.lenght == 1) 
        this.dom.video[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');

      this.dom.contentFeatures.toggleClass(this.st.isOpenClass)
    }
  }

  onTransition() {
    this.global.isAnimating = false;
    if (this.dom.contentFeatures.hasClass(this.st.isOpenClass)) {
      this.dom.linkViewMore.find(this.st.textlink).text("Ocultar información");
      this.dom.contentAds.addClass("is-hidden");
      this.dom.contentAside.addClass("is-active");
    }
  }

  setUrlVideo () {
    const newSrc = this.dom.video.attr('src') + '?enablejsapi=1&version=3&playerapiid=ytplayer';
    this.dom.video.attr('src', newSrc);
  }
}

