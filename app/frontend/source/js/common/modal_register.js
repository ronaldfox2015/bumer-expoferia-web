/*global $*/
/*global dataLayer*/
/*global _*/
import Inputmask from 'inputmask';
import { Utils } from '../libs/utils.js';
import Modal from './handler_modal';
import _ from "underscore";

export default class ModalRegister {
  constructor() {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
    this.subscribeEvents();
  }

  setSettings() {
    this.st = {
      modal            : '#modalRegisterComplete',
      modalConfirmation: '#modalRegisterConfirmation',
      globalError      : '.js-global-form-errors',
      btnShowModal     : '.js-register-init',
      urlAjax          : '/register',
      modalLogin       : '#modalLogin',
      btnSession       : '#btnSession',
      tplSuggestLogin    : '#tplSuggestLogin',
      form             : {
        frmModal           : '#frmRegisterComplete',
        formPersonalData   : '#formPersonalData',
        formLastStudy      : '#formLastStudy',
        formLastJob        : '#formLastJob',
        formJob            : '#formJob',
        titleModal         : '.js-title-modal',
        firstModal         : '.js-first-modal',
        secondModal        : '.js-second-modal',
        subtitleModal      : '.js-subtitle',
        hide               : 'u-hide',
        formHide           : 'g-form-box--hide',
        wrapSelectPretty   : '.g-wrap-select-pretty',
        name               : '#name',
        lastname           : '#lastname',
        email              : '#email',
        txtPassword        : '#txtPassword',
        txtBirthDay        : '#txtBirthDay',
        phoneNumber        : '#phoneNumber',
        dateStartStudy     : '#dateStartStudy',
        dateEndStudy       : '#dateEndStudy',
        dateStartExperience: '#dateStartExperience',
        dateEndExperience  : '#dateEndExperience',
        txtIdUbicacion     : '#txtIdUbicacion',
        selDocument        : '#selDocument',
        txtNumberDoc       : '#txtNumberDoc',
        selCountry         : '#selCountry',
        txtUbigeo          : '#txtUbigeo',
        studyDateEnd       : '#studyDateEnd',
        position           : '#position',
        currentStudy       : '#currentStudy',
        notExperience      : '#notExperience',
        btnRegisterUser    : '#btnRegisterUser',
        btnNext            : '.js-btn-next',
        btnPrev            : '.js-btn-prev',
        fieldSerialize     : '.js-field-serialize',
        fieldset           : '.js-fieldset',
        containerDisable   : '.js-container-disable',
        disableEndDate     : '.js-disable-end-date',
        sectionDate        : '.js-section-date',
        dateRange          : '.js-date-range',
        dateSelected       : '.js-date',
        btnLoginOpen       : '#loginOpen'
      }
    };
    this.global = {
      validator      : null,
      tplSuggestLogin: null
    };
    this.jsonPost = {};
    this.PERU_CODE = '2533';
    this.modal = new Modal();
  }

  catchDom() {
    this.dom = {};
    this.dom.btnShowModal        = $(this.st.btnShowModal);
    this.dom.modalRegister       = $(this.st.modal);
    this.dom.subtitleModal       = $(this.st.form.subtitleModal, this.dom.modalRegister);
    this.dom.globalError         = $(this.st.globalError);
    this.dom.frmModal            = $(this.st.form.frmModal);
    this.dom.modalConfirmation   = $(this.st.modalConfirmation);
    this.dom.formPersonalData    = $(this.st.form.formPersonalData);
    this.dom.formLastStudy       = $(this.st.form.formLastStudy);
    this.dom.formLastJob         = $(this.st.form.formLastJob);
    this.dom.formJob             = $(this.st.form.formJob);
    this.dom.titleModal          = $(this.st.form.titleModal);
    this.dom.firstModal          = $(this.st.form.firstModal);
    this.dom.secondModal         = $(this.st.form.secondModal);
    this.dom.name                = $(this.st.form.name);
    this.dom.lastname            = $(this.st.form.lastname);
    this.dom.email               = $(this.st.form.email);
    this.dom.txtPassword         = $(this.st.form.txtPassword);
    this.dom.txtBirthDay         = $(this.st.form.txtBirthDay, this.dom.frmModal);
    this.dom.phoneNumber         = $(this.st.form.phoneNumber);
    this.dom.dateStartStudy      = $(this.st.form.dateStartStudy);
    this.dom.dateEndStudy        = $(this.st.form.dateEndStudy);
    this.dom.dateStartExperience = $(this.st.form.dateStartExperience);
    this.dom.dateEndExperience   = $(this.st.form.dateEndExperience);
    this.dom.position            = $(this.st.form.position);
    this.dom.txtIdUbicacion      = $(this.st.form.txtIdUbicacion, this.dom.frmModal);
    this.dom.selDocument         = $(this.st.form.selDocument, this.dom.frmModal);
    this.dom.txtNumberDoc        = $(this.st.form.txtNumberDoc, this.dom.frmModal);
    this.dom.selCountry          = $(this.st.form.selCountry, this.dom.frmModal);
    this.dom.txtUbigeo           = $(this.st.form.txtUbigeo, this.dom.frmModal);
    this.dom.studyDateEnd        = $(this.st.form.studyDateEnd);
    this.dom.currentStudy        = $(this.st.form.currentStudy);
    this.dom.btnRegisterUser     = $(this.st.form.btnRegisterUser, this.dom.frmModal);
    this.dom.btnNext             = $(this.st.form.btnNext);
    this.dom.btnPrev             = $(this.st.form.btnPrev);
    this.dom.btnCreateAccount    = $(this.st.form.btnCreateAccount);
    this.dom.fieldset            = $(this.st.form.fieldset, this.dom.frmModal);
    this.dom.btnLoginOpen        = $(this.st.form.btnLoginOpen);
    this.dom.btnSession          = $(this.st.btnSession);
    this.dom.tplSuggestLogin     = $(this.st.tplSuggestLogin);
  }

  afterCatchDom () {
    this.initInputMask(this.dom.txtBirthDay);
    this.initMaskDateRange([
      this.dom.dateStartStudy,
      this.dom.dateEndStudy,
      this.dom.dateStartExperience,
      this.dom.dateEndExperience
    ]);
    this.setValidationCustomRules();
    this.initValidateForm();
    this.global.tplSuggestLogin = _.template(this.dom.tplSuggestLogin.html());
  }

  subscribeEvents() {
    this.dom.btnShowModal.on('click', (e) => this.onShowModal(e));
    this.dom.btnNext.on('click', (e) => this.setHideFirstForm(e));
    this.dom.btnPrev.on('click', (e) => this.setHideSecondForm(e));
    this.dom.email.on('change', (e) => this.validateEmailField());
    this.dom.email.on('keyup', (e) => this.removeErrorEmailField());
    this.dom.selDocument.on('change', (e) => this.onChangeDocument(e));
    this.dom.selCountry.on('change', (e) => this.onChangeCountry(e));
    this.dom.frmModal.on('keyup', this.st.form.dateSelected , (e) => this.setValidationDateRange(e));
    this.dom.frmModal.on('click', this.st.form.disableEndDate, (e) => this.disableEndDate(e));
    this.dom.frmModal.on('click', this.st.form.notExperience, (e) => this.disabledExperienceJob(e));
    this.dom.btnLoginOpen.on('click', (e) => this.openLogin(e));
    this.dom.btnSession.on('click', (e) => this.sessionRedirect(e));
  }

  onShowModal (event) {
    event.preventDefault();
    Utils.hideMenu();
    Utils.deleteMessage();
    this.modal.openModal(this.st.modal, this.getModalSettings());
  }

  sessionRedirect () {
    this.modal.closeModal();
    window.location.reload();
  }

  openLogin () {
    this.modal.openModal(this.st.modalLogin, this.getModalSettings());
  }

  onChangeDocument () {
    this.setValidationDocument($(event.target), this.dom.txtNumberDoc);
  }

  onChangeCountry() {
    if (this.dom.selCountry.val() === this.PERU_CODE) {
      this.dom.txtUbigeo.removeAttr('disabled');
      this.dom.txtUbigeo.parent().removeClass('is-disabled')
    } else {
      this.dom.txtUbigeo.val('');
      this.dom.txtUbigeo.attr('disabled', '');
      this.dom.txtUbigeo.removeClass('is-error');
      this.dom.txtUbigeo.parent().removeClass('is-error');
      this.dom.txtUbigeo.parent().addClass('is-disabled');
      this.dom.txtIdUbicacion.val('');
    }
  }

  validateEmailField() {
    global.validator.element(this.st.form.email);
  }

  removeErrorEmailField () {
    Utils.deleteMessage();
  }
  getModalSettings() {
    let settings = {
      arrows: false,
      touch : false,
      beforeClose: () => {
        this.setHideSecondForm();
        this.dom.frmModal.trigger('reset');
      },
      afterClose: () => {
        this.dom.selCountry.val(this.PERU_CODE);
        this.dom.selCountry.trigger('change');
        $('.is-error', this.dom.frmModal).removeClass('is-error');
        this.dom.frmModal.tooltipster('close');
        this.dom.fieldset.tooltipster('close');
      }
    };
    return settings;
  }

  // Da formato a los inputs de fecha de inicio - fin
  initMaskDateRange ($elementsDate){
    const currentYear = new Date().getFullYear();
    $elementsDate.forEach( (elementDate) => {
      Inputmask(
        {
          "alias":  "mm/yyyy",
          "placeholder": "mm/aaaa",
          "yearrange" : {
            minyear: elementDate.attr('minyear'),
            maxyear: currentYear
          },
          "clearIncomplete": true,
          "showMaskOnHover": false
        }
      ).mask(elementDate);
    });
  }

  initInputMask ($txtBirthDay) {
    Inputmask('date', {
      yearrange: {
        minyear: $txtBirthDay.attr('minyear'),
        maxyear: $txtBirthDay.attr('maxyear')
      },
      "placeholder": "dd/mm/aaaa",
      "clearIncomplete": true,
      "showMaskOnHover": false
    }).mask($txtBirthDay);
  }

  setValidationCustomRules () {
    return $.validator.addMethod('verifySelection', (function(value, element, param) {
      let idField;
      idField = $(param).val();
      return $.trim(idField) !== '';
    }), 'Seleccione una ubicación');
  }

  // Setea la validación inicial para que los campos no sean requeridos
  setValidationDateRange (event) {
    const $this              = $(event.target);
    const containerDateRange = $this.parents(this.st.form.dateRange);
    const inputStartDate     = containerDateRange.find(".js-date[data-date=start]");
    const inputEndDate       = containerDateRange.find(".js-date[data-date=end]");

    // Si las fechas estan vacias
    if(!inputStartDate.val().length && !inputEndDate.val().length){
      // Quitando tooltips de error
      inputStartDate.parent().tooltipster("close");
      inputEndDate.parent().tooltipster("close");

      // Quitando validación de requerido
      inputStartDate.rules("remove", "required");
      inputEndDate.rules("remove", "required");

      // Quitando el estilo de error de las cajas
      inputStartDate.parent().removeClass("is-error");
      inputEndDate.parent().removeClass("is-error");
    }
  }

  // Bloquea el campo fecha fin
  disableEndDate (event) {
    const $this              = $(event.target);
    const containerDateRange = $this.parents(this.st.form.containerDisable)
                                    .siblings(this.st.form.sectionDate);
    const inputStartDate     = containerDateRange.find(".js-date[data-date=start]");
    const inputEndDate       = containerDateRange.find(".js-date[data-date=end]");
    if($this.is(":checked")){
      // Quitando tooltips de error
      inputStartDate.parent().tooltipster("close");
      inputEndDate.parent().tooltipster("close");

      // Deshabilitando el campo fecha fin
      inputEndDate.attr("disabled", true);
      inputEndDate.parent().addClass("is-disabled");
      inputEndDate.val('');
      // Quitando la validación de rangos fecha y agregando la de requerido
      inputStartDate.rules("remove");
      inputStartDate.rules("add", {
        required: true,
        messages: {
          required: "ESTE CAMPO ES REQUERIDO"
        }
      });

      // Si fecha inicio y/o fin esta erroneo
      if(inputStartDate.hasClass("error") && inputStartDate.parent().removeClass("is-error") );
      if(inputEndDate.hasClass("error") && inputEndDate.parent().removeClass("is-error") );

    } else {
      // Habilitando el campo fecha fin
      inputEndDate.removeAttr("disabled");
      inputEndDate.parent().removeClass("is-disabled");

      // Quitando la validación de requerido y agregando la de rangos fecha
      inputStartDate.rules("remove");
      inputStartDate.rules("add", {
        rangeDate: true,
        messages : {
          rangeDate: "La fecha de inicio de ser menor a la fecha de fin"
        }
      });

      // Si fecha inicio y/o fin esta erroneo
      if(inputStartDate.hasClass("error") && inputStartDate.parent().addClass("is-error") );
      if(inputEndDate.hasClass("error") && inputEndDate.parent().addClass("is-error") );
      // Si fecha de inicio y fin estan vacios
      if(!inputStartDate.val().length && !inputEndDate.val().length ){
        inputEndDate.rules("remove", "required");
        inputStartDate.parent().removeClass("is-error");
        inputEndDate.parent().removeClass("is-error");
      }
    }
  }


  disabledExperienceJob (event) {
    const $this = $(event.target);
    const $isEdit = this.dom.formJob.find(".is-edit");
    if ($this.is(":checked")) {
      $isEdit.attr("disabled", "");
      this.dom.formJob.find(".is-edit[type='text']").val("");
      this.dom.formJob.find("select.is-edit").val("default");
      this.dom.formJob.find(".is-edit[type='radio'], .is-edit[type='checkbox']").prop("checked", false);
      $isEdit.removeClass("error");
      this.dom.formJob.find("fieldset").removeClass("tooltipster is-error");
      $isEdit.parent().addClass("is-disabled");
    } else {
      $isEdit.removeAttr("disabled");
      this.dom.position.removeAttr("disabled");
      $isEdit.parent().removeClass("is-disabled");
    }
  }


  initValidateForm () {
    this.dom.frmModal.tooltipster({
      interactive  : true,
      contentAsHTML: true,
      maxWidth     : 450,
      timer        : 2500,
      trigger      : 'custom',
      theme        : ['tooltipster-aptitus']
    });
    global.validator = this.dom.frmModal.validate({
      onfocusout  : false,
      rules       : {
        name: {
          alphabet: true
        },
        last_name: {
          alphabet: true
        },
        email: {
          nEmail: true,
          remote: {
            url: "/user/not-exists",
            type: "get",
            complete: (response) => {
              console.log(response);
              const json = response["responseJSON"];
              const isError = !(json === true);
              if (isError && response["readyState"] === 4) {
                const data = {
                  email: this.dom.email.val()
                };
                const text = this.global.tplSuggestLogin(data);
                Utils.showMessage(this.dom.globalError, 'warning', text);
              }
            }
          }
        },
        cellphone: {
          digits: true
        },
        doc_number: {
          digits: true
        },
        institution_txt: {
          verifyInstitution: '#institutionId'
        },
        txtUbigeo: {
          verifySelection: '#txtIdUbicacion'
        },
        grade_id: {
          valueNotEquals: '#grade'
        },
        state_id: {
          valueNotEquals: '#state'
        },
        company: {
          businessName: true
        },
        industry: {
          alphabet: true
        },
        study_date_start: {
          rangeDate: true
        },
        area_id: {
          valueNotEquals: '#area'
        },
        level_id: {
          valueNotEquals: '#level'
        },
        study_date_end: {
          rangeDate: true
        },
        experience_date_start: {
          rangeDate: true
        },
        experience_date_end: {
          rangeDate: true
        }
      },
      messages: {
        email: {
          remote: "Este valor ya existe."
        }
      },
      errorPlacement: Utils.setErrorPlacement,
      success       : Utils.setSuccessForm,
      submitHandler : () => {
        this.initAjax()
      }
    });
  }

  setHideFirstForm () {
    const isEmailPending = $(this.st.form.email, this.dom.frmModal).hasClass("pending");
    if (this.dom.frmModal.valid() && !isEmailPending) {
      this.dom.titleModal.addClass(this.st.form.hide);
      this.dom.firstModal.addClass(this.st.form.formHide);
      this.dom.secondModal.removeClass(this.st.form.formHide);
    }
  }

  setHideSecondForm () {
    this.dom.titleModal.removeClass(this.st.form.hide);
    this.dom.firstModal.removeClass(this.st.form.formHide);
    this.dom.secondModal.addClass(this.st.form.formHide);
    this.dom.fieldset.tooltipster('close');
  }

  setValidationDocument ($selDocument, $txtNumero) {
    $txtNumero.val('').removeClass('is-error').parent().removeClass('is-error');
    if ($selDocument.val() === 'dni') {
      $txtNumero.attr({
        minlength: 8,
        maxlength: 8
      }).rules('add', {
        digits: true
      });
      $txtNumero.rules('remove', 'alphNumeric');
    } else {
      $txtNumero.attr({
        minlength: 7,
        maxlength: 12
      }).rules('add', {
        alphNumeric: true
      });
      $txtNumero.rules('remove', 'digits');
      $selDocument.parent().find(this.st.form.wrapSelectPretty).css("width", "73px");
    }
  }

  setSerializeForms($elForm, indexForm){
    let $fieldSerialize;
    $fieldSerialize = $elForm.find(this.st.form.fieldSerialize);
    this.jsonPost[indexForm] = {};
    $fieldSerialize.each((index) => {
      let key, value, input;
      input = $fieldSerialize.eq(index);
      key = input.attr("name");
      if(input.is("input[type=checkbox]") ) {
        value = !!input.prop("checked");
      } else {
        value = input.val();
      }
      this.jsonPost[indexForm][key] = value;
    })
  }

  settingsErrors (data) {
    $.each(data, (key) => {
      let $fieldError = $("*[name=" + key + "]");
      $fieldError.parent().addClass("is-error");
      $fieldError.addClass("error");
      $fieldError.attr("required", "required");
      $fieldError.attr("aria-invalid", true);
    })
  }

  initAjax () {
    Utils.deleteMessage();

    this.setSerializeForms( this.dom.formPersonalData, this.dom.formPersonalData.data('index') );
    this.setSerializeForms( this.dom.formLastJob, this.dom.formLastJob.data('index') );
    this.setSerializeForms(this.dom.formLastStudy, this.dom.formLastStudy.data('index') );
    this.dom.btnRegisterUser.attr("loading", "loading");
    this.dom.btnRegisterUser.attr("disabled", "disabled");
    this.dom.btnPrev.attr("disabled", "disabled");
    $.ajax({
      url: this.st.urlAjax,
      type: 'POST',
      dataType: 'json',
      data: this.jsonPost
    })
    .done((response) => {
      let email = this.dom.email.val();
      this.modal.closeModal();
      this.setHideSecondForm();
      this.modal.openModal(this.st.modalConfirmation, {
        afterClose: () => {
          window.location.reload();
        }
      });
      this.dom.btnRegisterUser.removeAttr('disabled loading');
      this.dom.btnNext.removeAttr('disabled');
      this.dom.btnPrev.removeAttr('disabled');
      dataLayer.push({
        'event':'ExpoAptitus Crear Cuenta',
        'category':'ExpoAptitus Crear Cuenta',
        'action': document.URL,
        'label': `${email}|${response.id}`,
        'value':1
      });
    })
    .fail((jqXHR) => {
      this.dom.btnPrev.removeAttr('disabled');
      if( jqXHR.responseJSON.errors ) {
        let dataErrors = jqXHR.responseJSON.errors;
        this.settingsErrors( dataErrors.personal_information, this.dom.formPersonalData.data('index') );
        this.settingsErrors( dataErrors.study, this.dom.formLastStudy.data('index') );
        this.settingsErrors( dataErrors.experience, this.dom.formLastJob.data('index') );
        Utils.showMessage(this.dom.globalError, 'error', jqXHR.responseJSON.message);
      } else {
        Utils.showMessage(this.dom.globalError, 'error', jqXHR.responseJSON.message);
      }
      this.dom.btnRegisterUser.removeAttr('disabled loading');
    });
  }

}
