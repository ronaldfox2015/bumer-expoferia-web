/**
 * Módulo encargado cambiar de contenido mediante el evento click
 * @class ChangeTabs
 * @main Stand
 * @author Janet Quispe
 */

/*global $*/
import HistoryAPI from './handler_history';

export default class ChangeTabs {
  constructor(instance) {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
    this.subscribeEvents();
    this.el = instance;
  }

  setSettings() {
    this.st = {
      containerTabs: '.js-container-tabs',
      tab: '.js-tab-link',
      tabContent: '.js-tab-content',
      tabMainContent: '.js-tabs-parent',
      contentMap: '.js-content',
      mapLocation: '.js-map-location',
      mapCanvas: '#mapCanvas',
    };
    this.global = {
      latitude: 0,
      longitude: 0
    }
    this.NO_STATE_FOUND = -1;
    this.historyApi = new HistoryAPI();
  }

  afterCatchDom() {
    let tabActive = this.historyApi.getState();
    if (tabActive === null) {
      tabActive = this.NO_STATE_FOUND;
    }
    this.setTabActive(tabActive);
  }

  catchDom() {
    this.dom = {};
    this.dom.containerTabs = $(this.st.containerTabs);
    this.dom.tabMainContent = $(this.st.tabMainContent);
    this.dom.tab = $(this.st.tab, this.dom.containerTabs);
    this.dom.tabContent = $(this.st.tabContent, this.dom.tabMainContent);

    this.dom.contentMap = $(this.st.contentMap);
    this.dom.mapLocation = $(this.st.mapLocation, this.dom.contentMap);
    this.dom.mapCanvas = $(this.st.mapCanvas, this.st.mapLocation);
    this.global.latitude = this.dom.mapCanvas.attr('data-latitude');
    this.global.longitude = this.dom.mapCanvas.attr('data-longitude');
  }

  subscribeEvents() {
    this.dom.tab.on('click', (event) => this.changeTab(event));
    $(window).on('popstate', (event) => this.navigation(event));
  }

  changeTab(event) {
    event.preventDefault();
    if (!$(event.target).hasClass('is-active')) {
      const $this = $(event.target);
      const data = $this.data('key');
      const url = $this.attr('data-url');
      const title = $this.attr('data-title');
      if (typeof title !== 'undefined') {
        document.title = `${title} | ExpoAptitus 2019`;
      }
      this.historyApi.pushHistory(data, url);
      this.setTabActive(data);
      this.el.fnCreateMap(this.global.latitude, this.global.longitude);
    }
  }

  setTabActive(tabId) {
    let $tabId, title;

    if (tabId === this.NO_STATE_FOUND) {
      let url = window.location.pathname.split('/');
      if (url.length === 4) {
        tabId = url[3];
      } else {
        tabId = 'avisos';
      }
    }
    $tabId = $(`[data-key=${tabId}]`, this.dom.containerTabs);
    title = $tabId.attr('data-title');

    this.dom.tab.removeClass('is-active');
    this.dom.tabContent.removeClass('is-active');
    $tabId.addClass('is-active');
    $(`[id=${tabId}]`, this.dom.tabMainContent).addClass('is-active');
    if (typeof title !== 'undefined') {
      document.title = `${title} | ExpoAptitus 2019`;
    }
  }

  navigation() {
    this.historyApi.manageNavigation(this.setTabActive, this);
  }
}
