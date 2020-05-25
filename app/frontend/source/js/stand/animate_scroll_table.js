/**
 * Validar URL si existe y posicionar en la tabla de ofertas
 * @class AnimatedScrollTable
 * @main Stand
 * @author Janet Quispe
 */
/*global $*/
export default class AnimatedScrollTable {
  constructor () {
    this.setSettings();
    this.catchDom();
    this.beforeCatchDom();
  }

  setSettings() {
    this.st = {
      body: 'html,body',
      tabs: '.js-tabs-parent'
    };
    this.dom = {};
  }

  catchDom() {
    this.dom.body = $(this.st.body);
    this.dom.tabs = $(this.st.tabs);
  }

  beforeCatchDom() {
    this.fnValidateIfExist();
  }

  fnValidateIfExist () {
    let topPos;
    if(this.getParameterByName('page')) {
      topPos = this.dom.tabs.offset().top;
      this.dom.body.animate({ scrollTop: topPos });
    }
  }

  getParameterByName(name, url) {
    let regex, results;
    if (!url) url = window.location.href;
    regex = new RegExp("[[]]", "g");
    name = name.replace(regex, "\\$&");

    regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    results = regex.exec(url);

    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
}
