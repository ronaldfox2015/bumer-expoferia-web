/*global $*/
/**
 * Posiciona el header
 * @class ModalSaveQuestions
 * @main Aviso
 * @author Christiam Mendives
 */
import { Utils } from '../libs/utils.js'
import Modal from '../common/handler_modal';

export default class ModalSaveQuestions {
  constructor () {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
    this.subscribeEvents();
  }

  setSettings() {
    this.st = {
      modalQuestions: '#modalQuestions',
      btnOpenModal  : '.js-open-questions',
      frm           : '#frmModalQuestions',
      btnForm       : '#btnSaveQuestions',
      btnCloseModal : '.js-cancel',
      txtEmail      : '#txtEmail',
      fieldset      : '.js-fieldset',
      question      : '.js-question'
    };
    this.dom = {};
    this.modal = new Modal();
  }

  catchDom() {
    this.dom.modalQuestions = $(this.st.modalQuestions);
    this.dom.btnOpenModal   = $(this.st.btnOpenModal);
    this.dom.frm            = $(this.st.frm);
    this.dom.btnForm        = $(this.st.btnForm, this.dom.frm);
    this.dom.btnCloseModal  = $(this.st.btnCloseModal, this.dom.modalQuestions);
    this.dom.txtEmail       = $(this.st.txtEmail, this.dom.frm);
    this.dom.fieldset       = $(this.st.fieldset, this.dom.frm);
    this.dom.question       = $(this.st.question, this.dom.frm);
  }

  afterCatchDom(){
    this.initValidateForm();
    this.openModalAuto();
  }

  subscribeEvents() {
    this.dom.btnCloseModal.on('click', () => this.closeModal());
    this.dom.btnOpenModal.on('click', (e) => this.openModal(e));
    this.dom.question.on('blur', (e) => this.validateWhiteSpace(e));
  }

  openModal(event) {
    event.preventDefault();
    let settings = this.getSettings();
    this.modal.openModal(this.st.modalQuestions, settings);
  }

  // Abre la modal automaticamente
  openModalAuto () {
    const hash = location.hash;
    if(hash === "#preguntasAdicionales" &&
      this.modal.openModal(this.st.modalQuestions, this.getSettings()) );
  }

  getSettings () {
    return {
      padding   : 0,
      arrows    : false,
      beforeClose: () => {
        this.dom.frm[0].reset();
        $('.is-error', this.dom.frm).removeClass('is-error');
        this.dom.fieldset.tooltipster('hide');
      }
    }
  }

  validateWhiteSpace (event) {
    const $this = $(event.target);
    const trimValue = $this.val().trim();
    $this.val(trimValue);
  }

  closeModal() {
    this.modal.closeModal();
  }

  getRules() {
    let rules = {};
    this.dom.question.map((index, field) => {
      const fieldName = $(field).attr('name');
      const fieldType = $(field).attr('type');
      if (fieldType !== 'radio') {
        const ruleType = $(field).data('valid') === 'number' && 'number';
        ruleType === 'number' && (rules[fieldName] = { [ruleType]: true });
      }
    });
    return rules;
  }

  initValidateForm() {
    this.dom.frm.tooltipster({
      timer : 1500,
      trigger: 'custom',
      theme  : ['tooltipster-aptitus']
    });
    this.dom.frm.validate({
      focusInvalid  : false,
      rules: this.getRules(),
      errorPlacement: Utils.setErrorPlacement,
      success       : Utils.setSuccessForm,
      submitHandler : (form) => {
        this.dom.btnForm.attr({
          'disabled': '',
          'loading': ''
        });
        this.dom.btnCloseModal.attr('disabled', '');
        form.submit();
      }
    });
  }
}
