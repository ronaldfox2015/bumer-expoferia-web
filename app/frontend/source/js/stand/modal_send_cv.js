/*global $*/
/*global dataLayer*/
/**
 * Modal dejar Cv y funcionalidad de envió de data, mostrando modal de confirmación
 * @class ModalSendCV
 * @main Stand
 * @author Janet Quispe
 */

import { Utils } from '../libs/utils.js'
import Modal from '../common/handler_modal';

export default class ModalSendCV {
  constructor () {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
    this.subscribeEvents();
  }

  setSettings() {
    this.st = {
      modalSentSuccessful : '#modalSentSuccessful',
      modalQuestions      : '#modalQuestionCompany',
      frm                 : '#frmModalQuestionCompany',
      btnSend             : '#btnSend',
      txtQuestion         : '#txtQuestion',
      askCompany          : '.js-ask-company',
      btnOpenModal        : '.js-leave-cv',
      btnCloseModal       : '.js-btn-cancel',
      fieldset            : '.js-fieldset',
      urlAjax             : '/receive-cv/',
      xhrAjax             : null
    };
    this.dom = {};
    this.modal = new Modal();
  }
  catchDom() {
    this.dom.modalSentSuccessful = $(this.st.modalSentSuccessful);
    this.dom.modalQuestions      = $(this.st.modalQuestions);
    this.dom.btnOpenModal        = $(this.st.btnOpenModal);
    this.dom.frm                 = $(this.st.frm, this.dom.modalQuestions);
    this.dom.btnCloseModal       = $(this.st.btnCloseModal, this.dom.modalQuestions);
    this.dom.btnSend             = $(this.st.btnSend, this.dom.modalQuestions);
    this.dom.fieldset            = $(this.st.fieldset, this.dom.modalQuestions);
    this.dom.txtQuestion         = $(this.st.txtQuestion, this.dom.modalQuestions);
    this.dom.askCompany          = $(this.st.askCompany, this.dom.modalQuestions);
  }

  afterCatchDom() {
    this.initValidateForm();
  }

  subscribeEvents() {
    this.dom.btnCloseModal.on('click', () => this.closeModal());
    this.dom.btnOpenModal.on('click', (event) => {
      event.preventDefault();
      this.openModal(this.st.modalQuestions);
    });
  }

  openModal(nameModal) {
    let settings = this.getSettings();
    this.modal.openModal(nameModal, settings);
  }

  getSettings () {
    return {
      maxWidth  : 500,
      padding   : 0,
      arrows    : false,
      beforeClose: () => {
        this.dom.frm.trigger("reset");
        $('.is-error', this.dom.frm).removeClass('is-error');
        $('.is-error', this.dom.modalQuestions).hide();
        $('.is-success', this.dom.modalQuestions).hide();
        this.dom.fieldset.tooltipster('hide');
      }
    }
  }

  closeModal () {
    if (this.st.xhrAjax !== null)
      this.st.xhrAjax.abort();
    this.modal.closeModal();
  }

  initValidateForm() {
    this.dom.fieldset.tooltipster({
      timer : 1500,
      trigger: 'custom',
      theme  : ['tooltipster-aptitus']
    });
    this.dom.frm.validate({
      onfocusout  : false,
      rules       : {
        txtQuestion: {
          required: true,
          alphNumeric: true
        }
      },
      errorPlacement: Utils.setErrorPlacement,
      success       : Utils.setSuccessForm,
      submitHandler : () => {
        this.initAjax();
        this.dom.btnSend.attr({
          'disabled': '',
          'loading': ''
        });
        this.dom.btnCloseModal.attr('disabled', '');
      }
    });
  }

  initAjax() {
    let companyId, companyName, userId;
    companyId = this.dom.btnSend.attr('company-id');
    companyName = this.dom.btnOpenModal.data('company');
    userId = this.dom.btnOpenModal.data('user-id');
    let url= this.st.urlAjax + companyId;
    this.st.xhrAjax = $.ajax({
      url: url,
      type: 'POST',
      dataType: 'json',
      data: this.dom.frm.serialize()
    })
    .done((response) => {
      let code;
      this.dom.btnSend.removeAttr('loading');
      code = response.code ? response.code : 200;
      if (code === 400) {
        Utils.showMessage(this.dom.askCompany, 'success', response.message);
      } else {
        dataLayer.push({
          'event'   : 'ExpoAptitus',
          'category': 'ExpoAptitusDejarCV',
          'action'  : 'Cargaefectiva',
          'label'   : `${userId}_${companyId}`,
          'value'   : 0
        });
        this.modal.closeModal();
        this.openModal(this.st.modalSentSuccessful);
      }
    })
    .fail((jqXHR) => {
      if (typeof jqXHR.responseJSON === 'undefined') {return}
      Utils.showMessage(this.dom.askCompany, 'error', jqXHR.responseJSON.message);
      this.dom.btnSend.removeAttr('disabled loading');
    })
    .always(() => {
      this.dom.btnSend.removeAttr('disabled');
      this.dom.btnCloseModal.removeAttr('disabled');
    });
  }
}

