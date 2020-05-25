/**
 * Clase para mostrar y ocultar el menú mobile
 * @class ToggleMobileMenu
 * @main All
 * @author Claudia Valdivieso
 */

/*global $*/
import { Utils } from '../libs/utils';

export default class ToggleMobileMenu {
  constructor() {
    this.setSettings();
    this.catchDom();
    this.subscribeEvents();
  }

  setSettings() {
    this.st = {
      btnShowMenu   : '.js-btn-mobile-menu',
      menuMobile    : '.js-mobile-menu',
      menuMobileMask: '.js-mobile-menu-mask',
      listShowMenu  : '.js-item',
      backMenu      : '.js-menu-back'
    };
    this.dom = {};
    this.BREACKPOINT_MOBILE = 834;
  }

  catchDom() {
    this.dom.menuMobile      = $(this.st.menuMobile);
    this.dom.btnShowMenu     = $(this.st.btnShowMenu);
    this.dom.menuMobileMask  = $(this.st.menuMobileMask);
    this.dom.listShowMenu    = $(this.st.listShowMenu);
    this.dom.backMenu        = $(this.st.backMenu);
    this.dom.window          = $(window);
    this.dom.body            = $('body');
  }

  subscribeEvents() {
    this.dom.btnShowMenu.on('click', (event) => this.onToggleMenu(event));
    this.dom.listShowMenu.on('click', (event) => this.onToggleMenu(event));
    this.dom.backMenu.on('click', (event) => this.onToggleMenu(event));
    this.dom.menuMobileMask.on('click', () => this.onHideMenu());
    this.dom.window.on('resize', (event) => this.onResizeWindow(event));
  }

  onToggleMenu(event) {
    const $element = $(event.currentTarget);
    const key = $element.data("key");

    if (!$element.hasClass("is-active") && key!=='item') {
      this.showMenu($element);
    } else {
      this.onHideMenu();
    }
  }

  onHideMenu() {
    Utils.hideMenu();
    this.dom.btnShowMenu.removeClass("is-active");
  }

  onResizeWindow(event) {
    const $element = $(event.currentTarget);
    if (this.dom.window.width() > this.BREACKPOINT_MOBILE) {
      Utils.hideMenu($element);
    }
  }

  showMenu($element) {
    const key = $element.data("key");
    $element.removeClass("is-active");
    this.dom.menuMobile.removeClass("is-active");
    this.dom.listShowMenu.removeClass("is-active");
    this.dom.backMenu.removeClass("is-active");

    $element.addClass("is-active");
    $(`.l-header-mobile--${key}`).addClass("is-active");
    this.dom.body.addClass("is-mobile-menu-active");
  }
}

