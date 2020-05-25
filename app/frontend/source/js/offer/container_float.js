/**
 * Módulo encargado de posicionar contenedores flotantes.
 * @class ViewMoreInformation
 * @main Detalle de Aviso
 * @author Janet Quispe
 */

/*global $*/

export default class ContainerFloat {
  constructor () {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom()
    this.subscribeEvents();
  }

  setSettings() {
    this.st = {
      titleAds          : ".js-ads-detail-title",
      titleFixed        : ".js-ads-fixed",
      btnApply          : ".js-btn-mobile",
      contentDescription: ".js-content-description",
      fill              : -20
    };
    this.global = {
      flagAddClassHeader   : false,
      flagRemoveClassHeader: false,
      flagAddClassBtn      : false,
      flagRemoveClassBtn   : false
    }
    this.MOBILE_BREAKPOINT = 740;
    this.dom = {};
  }

  catchDom() {
    this.dom.titleAds           = $(this.st.titleAds);
    this.dom.titleFixed         = $(this.st.titleFixed);
    this.dom.btnApply           = $(this.st.btnApply);
    this.dom.contentDescription = $(this.st.contentDescription);
  }

  afterCatchDom() {
    this.setPositions();
  }

  subscribeEvents() {
    $(window).on("scroll", () => this.onScroll());
    $(window).on("resize", () => this.onResize());
  }

  onResize() {
    this.setPositions();
  }

  onScroll() {
    let scrollTop = $(window).scrollTop();

    if (scrollTop > this.setPositionRef()) {
      if (!this.global.flagAddClassHeader) {
        this.dom.titleFixed.addClass("is-active");
        this.global.flagRemoveClassHeader = false;
        this.global.flagAddClassHeader = true;
      }
    } else {
      if (!this.global.flagRemoveClassHeader) {
        this.dom.titleFixed.removeClass("is-active");
        this.global.flagRemoveClassHeader = true;
        this.global.flagAddClassHeader = false;
      }
    }
    this.toggleButton(scrollTop);
  }

  toggleButton (scrollTop) {
    let scrollBottom;
    // Only for mobile width
    if ($(window).width() <= this.MOBILE_BREAKPOINT) {
      scrollBottom = scrollTop + this.getAttribute(this.dom.contentDescription, "data-offset-fill");
      // Logic for the button
      if (scrollBottom > this.getAttribute(this.dom.contentDescription, "data-offset-bottom")) {
        if (!this.global.flagAddClassBtn) {
          this.dom.btnApply.removeClass("is-active");
          this.global.flagRemoveClassBtn = false;
          this.global.flagAddClassBtn = true;
        }
      } else {
        if (!this.global.flagRemoveClassBtn) {
          this.dom.btnApply.addClass("is-active");
          this.global.flagRemoveClassBtn = true;
          this.global.flagAddClassBtn = false;
        }
      }
    }
  }

  setPositionRef() {
    return this.getAttribute(this.dom.titleAds, "data-offset-top");
  }

  getAttribute ($domElement, alias) {
    return parseInt($domElement.attr(alias), 10);
  }

  setPositions () {
    this.dom.titleAds.attr("data-offset-top", this.dom.titleAds.offset().top + this.st.fill);
    this.dom.contentDescription.attr("data-offset-top", this.dom.contentDescription.offset().top);
    this.dom.contentDescription.attr("data-offset-bottom", this.dom.contentDescription.offset().top + this.dom.contentDescription.outerHeight());
    this.dom.contentDescription.attr("data-offset-fill", $(window).outerHeight() - this.dom.btnApply.outerHeight());
  }

  updatePositions () {
    this.setPositions();
    this.toggleButton($(window).scrollTop());
  }
}
