/**
 * Módulo encargado de hacer funcionar la navegacion por url
 * @class HistoryAPI
 * @main Stand
 * @author Janet Quispe
 */

/*global $*/
export default class HistoryAPI {
  constructor () {
    this.setSettings();
    this.catchDom();
  }

  setSettings () {
    this.st = {
      tab : '.js-tab-link:nth-child(1)'
    };
    this.dom = {};
  }

  catchDom() {
    this.dom.tab = $(this.st.tab);
  }

  manageNavigation (callback, remoteThis) {
    if (history.state !== null){
      callback.call(remoteThis, history.state);
    } else {
      callback.call(remoteThis, -1);
    }
  }

  pushHistory (data, url) {
    history.pushState(data, 'change_tab', url);
  }

  getState () {
    return history.state
  }
}
