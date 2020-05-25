/**
 * Clase encargada de generar datalayer en el buscador
 * @class DatalayerSearch
 * @main Stand
 * @author Janet Quispe
 */

/*global $*/
/*global dataLayer*/

export default class DatalayerSearch {
  constructor() {
    this.setSettings();
    this.catchDom();
    this.subscribeEvents();
  }

  setSettings() {
    this.st = {
      bthSearch      : '.js-btn-search',
      containerCanvas: '.js-container-canvas',
      nameCompany    : '.js-name-company'
    };
    this.dom = {};
  }

  catchDom() {
    this.dom.bthSearch       = $(this.st.bthSearch);
    this.dom.containerCanvas = $(this.st.containerCanvas);
    this.dom.nameCompany     = $(this.st.nameCompany);
  }

  subscribeEvents() {
    this.dom.bthSearch.on('click', () => this.fnGenerateDatalayer());
  }

  fnGenerateDatalayer() {
    const wordKey = this.dom.bthSearch.prev().val();
    const idUser =  this.dom.containerCanvas.data('idUser');
    const nameCompany = this.dom.nameCompany.text();

    dataLayer.push({
      'event':'Expoaptitus',
      'category':' Expoaptitus Buscador',
      'action':`${wordKey}`,
      'label':`${idUser} | ${nameCompany}`,
      'value':1
    });
  }
}

