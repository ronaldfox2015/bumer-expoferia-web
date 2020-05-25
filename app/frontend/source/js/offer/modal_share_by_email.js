/*global $*/
import { Utils } from '../libs/utils.js'
import Modal from '../common/handler_modal';

export default class ModalShareByEmail {
  constructor () {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
    this.subscribeEvents();
  }

  setSettings() {
    this.st = {
      modalShareEmail: '#modalShareEmail',
      btnShareEmail  : '.js-share-email',
      title          : '.js-title',
      frm            : '#frmModalShareEmail',
      txtEmail       : '#txtEmail',
      btnForm        : '#btnSaveShareBox',
      fieldset       : '.js-fieldset',
      urlAjax        : '/share-email',
      xhrAjax        : null,
      btnCloseModal  : '.js-cancel'
    };
    this.dom = {};
    this.modal = new Modal();
  }

  catchDom() {
    this.dom.btnShareEmail   = $(this.st.btnShareEmail);
    this.dom.subMenuBox      = $(this.st.subMenuBox);
    this.dom.modalShareEmail = $(this.st.modalShareEmail);
    this.dom.frm             = $(this.st.frm, this.dom.modalShareEmail);
    this.dom.title           = $(this.st.title, this.dom.modalShareEmail);
    this.dom.txtEmail        = $(this.st.txtEmail, this.dom.frm);
    this.dom.hidAuthToken    = $(this.st.hidAuthToken);
    this.dom.btnForm         = $(this.st.btnForm, this.dom.frm);
    this.dom.fieldset        = $(this.st.fieldset, this.dom.frm);
    this.dom.btnCloseModal   = $(this.st.btnCloseModal, this.dom.modalShareEmail);
  }

  afterCatchDom(){
    this.initValidateForm();
  }

  subscribeEvents() {
    this.dom.btnCloseModal.on('click', () => this.closeModal());
    this.dom.btnShareEmail.on('click', () => this.openModal());
  }

  openModal() {
    let settings = this.getSettings();
    this.modal.openModal(this.st.modalShareEmail, settings);
  }

  getSettings () {
    return {
      padding    : 0,
      arrows     : false,
      beforeClose: () => {
        Utils.deleteMessage();
        this.dom.frm[0].reset();
        $('.is-error', this.dom.frm).removeClass('is-error');
        this.dom.fieldset.tooltipster('hide');
      }
    }
  }

  closeModal() {
    if (this.st.xhrAjax !== null)
      this.st.xhrAjax.abort()
    this.modal.closeModal();
  }

  getIdAd() {
    let url, id;
    url = window.location.href
    id = url.match(/\w+$/i);
    return id;
  }

  initValidateForm() {
    this.dom.frm.tooltipster({
      timer : 1500,
      trigger: 'custom',
      theme  : ['tooltipster-aptitus']
    });
    this.dom.frm.validate({
      onfocusout  : false,
      rules       : {
        txtSenderName : {
          alphabet : true
        },
        txtName : {
          alphabet : true
        },
        txtMessage : {
          comment  : true
        },
        txtEmail :{
          nEmail : true
        },
      },
      errorPlacement: Utils.setErrorPlacement,
      success       : Utils.setSuccessForm,
      submitHandler : () => this.initAjax()
    });
  }

  initAjax () {
    Utils.deleteMessage();
    this.dom.btnForm.attr({
      'disabled': '',
      'loading': ''
    });
    this.dom.btnCloseModal.attr('disabled', '');
    this.st.xhrAjax = $.ajax({
      url: this.st.urlAjax,
      type: 'POST',
      dataType: 'json',
      data: `${this.dom.frm.serialize()}&id=${this.getIdAd()}`
    })
    .done((response) => {
      this.dom.btnForm.removeAttr('loading');
      Utils.showMessage(this.dom.title, 'success', response.msg);
      setTimeout(() => {
        this.modal.closeModal();
      }, 1800);
    })
    .fail((jqXHR) => {
      let message;
      message = "Hubo un error.";
      if (typeof jqXHR.responseJSON !== "undefined") {
        message = jqXHR.responseJSON.message;
      }
      Utils.showMessage(this.dom.title, 'error', message);
      this.dom.btnForm.removeAttr('disabled loading');
    })
    .always(() => {
      this.dom.btnForm.removeAttr('disabled');
      this.dom.btnCloseModal.removeAttr('disabled');
    });
  }
}

