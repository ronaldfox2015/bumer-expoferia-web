/*global $*/

import { Utils } from '../libs/utils.js';

export default class Modal {
  constructor() {
    this.setSettings();
  }

  setSettings() {
    this.st = {
      pageModal: '.js-page-modal',
    }
  }

  openModal (modal, settings) {
    this.showModal(modal, settings);
    if (Utils.isInternetExplorer()) {
      this.refreshIconsIE11(modal)
    }
  }

  closeModal () {
    $.fancybox.close();
  }

  showModal (modal, settings) {
    let $modal = $(modal);
    $.fancybox.close();
    $.fancybox.open($modal, settings);
  }

  refreshIconsIE11(modal) {
    let $container, $modal;
    $container = $('.fancybox-container');
    $modal = $(modal, $container);
    $('use', $modal).each((index, element) => {
      let xlink, $element;
      $element = $(element);
      xlink = $element.attr('xlink:href');
      $element.attr('xlink:href', '#');
      $element.attr('xlink:href', xlink);
    })
  }
}
