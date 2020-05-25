/* global $ */
/* global grecaptcha */

/**
 * Genere captcha
 * @class FormContactCaptcha
 * @main Aviso
 * @author Christiam Mendives
 */

export default class ContactCaptcha {

  constructor() {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
  }

  setSettings() {
    this.st = {
      url       : "https://www.google.com/recaptcha/api.js?hl=es",
      container : ".js-recaptcha"
    };
    this.dom = {};
  }

  catchDom() {
    this.dom.container  = $(this.st.container);
  }

  afterCatchDom(){
    if (this.dom.container.length > 0)
      this.loadScript(this.st.url)
  }

  loadScript(url){
    $.ajax({
      url,
      dataType: "script"
    });
  }


  resetCaptcha () {
    if (typeof grecaptcha !== "undefined" && this.dom.container.html() !== '')
      grecaptcha.reset();
    }
}
