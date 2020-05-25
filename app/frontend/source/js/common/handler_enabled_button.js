/**
 * Clase para validar el primer formulario
 * @class HandlerEnabledButton
 * @main All
 * @author Angelo Panez
 */

/*global $*/

export default class EnabledButton {
  constructor() {
    this.setSettings();
    this.catchDom();
  }

  setSettings() {
    this.st = {
      selCountry      : '#selCountry',
      txtUbigeoId     : '.js-locations-id',
      btnNext         : '#btnNext',
      email           : '#email',
      txtBirthDay     : '#txtBirthDay',
      name            : '#name',
      lastname        : '#lastname',
      txtPassword     : '#txtPassword',
      txtNumberDoc    : '#txtNumberDoc',
      phoneNumber     : '#phoneNumber',
      formPersonalData: '#formPersonalData',
      modalUpdate     : '#modalUpdate'
    };
    this.PERU_CODE = '2533'
  }

  catchDom() {
    this.dom = {};
    this.modalUpdate                = $(this.st.modalUpdate);
    this.dom.selCountry             = $(this.st.selCountry);
    this.dom.btnNext                = $(this.st.btnNext);
    this.dom.email                  = $(this.st.email);
    this.dom.txtBirthDay            = $(this.st.txtBirthDay);
    this.dom.name                   = $(this.st.name);
    this.dom.lastname               = $(this.st.lastname);
    this.dom.txtPassword            = $(this.st.txtPassword);
    this.dom.txtNumberDoc           = $(this.st.txtNumberDoc);
    this.dom.phoneNumber            = $(this.st.phoneNumber);
    this.dom.txtUbigeoId            = $(this.st.txtUbigeoId);
    this.dom.formPersonalData       = $(this.st.formPersonalData);

    this.dom.selCountryUpdate       = $(this.st.selCountry, this.modalUpdate);
    this.dom.btnNextUpdate          = $(this.st.btnNext, this.modalUpdate);
    this.dom.emailUpdate            = $(this.st.email, this.modalUpdate);
    this.dom.txtBirthDayUpdate      = $(this.st.txtBirthDay, this.modalUpdate);
    this.dom.nameUpdate             = $(this.st.name, this.modalUpdate);
    this.dom.lastnameUpdate         = $(this.st.lastname, this.modalUpdate);
    this.dom.txtPasswordUpdate      = $(this.st.txtPassword, this.modalUpdate);
    this.dom.txtNumberDocUpdate     = $(this.st.txtNumberDoc, this.modalUpdate);
    this.dom.phoneNumberUpdate      = $(this.st.phoneNumber, this.modalUpdate);
    this.dom.txtUbigeoIdUpdate      = $(this.st.txtUbigeoId, this.modalUpdate);
    this.dom.formPersonalDataUpdate = $(this.st.formPersonalData, this.modalUpdate);
  }

  enabledBtnNextUpdate () {
    if( this.dom.selCountryUpdate.val() === String(this.PERU_CODE) &&
        this.dom.txtUbigeoIdUpdate.val() === "" ) {
      this.dom.btnNextUpdate.attr("disabled", "disabled")
    } else if( this.dom.nameUpdate.val() === "" || this.dom.lastnameUpdate.val() === "" ||
        this.dom.emailUpdate.val() === "" ||
        this.dom.txtBirthDayUpdate.val() === "" || this.dom.phoneNumberUpdate.val() === "" ||
        this.dom.txtNumberDocUpdate.val() === "" ) {
      this.dom.btnNextUpdate.attr("disabled", "disabled")
    } else if ( this.dom.formPersonalDataUpdate.find(".is-error").length > 0 ) {
      this.dom.btnNextUpdate.attr("disabled", "disabled")
    } else {
      this.dom.btnNextUpdate.removeAttr("disabled")
    }
  }
}
