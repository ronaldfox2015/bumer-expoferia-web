/*global $*/
import { Utils } from '../libs/utils.js'
import Modal from '../common/handler_modal';

export default class ModalRecoveryPassword {
  constructor () {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
    this.subscribeEvents();
  }

  setSettings() {
    this.st = {
      btnRecover          : ".js-recover-init",
      modalRecoverPassword: "#modalRecoverPassword",
      frmRecoverPassword  : "#frmRecoverPassword",
      txtEmailForgot      : "#txtEmailForgot",
      btnForm             : ".js-button",
      fieldset            : ".js-fieldset",
      urlAjax             : "/recovery-password"
    };
    this.dom = {};
    this.modal = new Modal();
  }

  catchDom() {
    this.dom.btnRecover         = $(this.st.btnRecover);
    this.dom.frmRecoverPassword = $(this.st.frmRecoverPassword);
    this.dom.txtEmailForgot     = $(this.st.txtEmailForgot);
    this.dom.btnForm            = $(this.st.btnForm, this.dom.frmRecoverPassword);
    this.dom.fieldset           = $(this.st.fieldset, this.dom.frmRecoverPassword);
  }

  afterCatchDom() {
    this.initValidateForm();
  }

  subscribeEvents() {
    this.dom.btnRecover.on("click", () => this.openModal());
  }

  openModal(){
    let settings = this.getSettings();
    this.modal.openModal(this.st.modalRecoverPassword, settings);
  }

  initValidateForm() {
    this.dom.frmRecoverPassword.tooltipster({
      timer  : 1500,
      trigger: "custom",
      theme  : ["tooltipster-aptitus"]
    });
    this.st.validator = this.dom.frmRecoverPassword.validate({
      onfocusout  : false,
      rules       : {
        txtEmailForgot: {
          nEmail: true
        }
      },
      errorPlacement: Utils.setErrorPlacement,
      success       : Utils.setSuccessForm,
      submitHandler : () => this.initAjax()
    });
  }

  initAjax () {
    this.dom.btnForm.attr({
      "disabled": "",
      "loading" : ""
    });
    $.ajax({
      type: "POST",
      url : this.st.urlAjax,
      data: this.dom.frmRecoverPassword.serialize(),
    })
    .done((response)=> {
      this.showMessageTooltip(this.dom.frmRecoverPassword, response.message);
      setTimeout(() => {
        this.modal.closeModal();
      }, 1500);
    })
    .fail((jqXHR) =>{
      this.dom.txtEmailForgot.val("");
      this.dom.txtEmailForgot.focus();
      this.showMessageTooltip(this.dom.frmRecoverPassword, jqXHR.responseJSON.message);
    })
    .always(() => {
      this.dom.btnForm.removeAttr("disabled loading");
    })
  }

  getSettings() {
    let settings = {
      arrows  : false,
      beforeClose:  () => {
        this.dom.frmRecoverPassword.tooltipster("hide");
        this.dom.fieldset.tooltipster("hide");
      },
      afterClose: () => {
        this.clearForm(this.dom.frmRecoverPassword);
        this.dom.fieldset.removeClass("is-error");
      }
    };
    return settings;
  }
  clearForm ($form) {
    $form[0].reset();
    $(".error", $form).removeClass("is-error");
  }
  showMessageTooltip ($frm, message) {
    $frm.tooltipster("content", message);
    $frm.tooltipster("show");
  }
}

