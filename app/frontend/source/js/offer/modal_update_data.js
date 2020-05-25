/**
 * Clase para actualizar los datos del postulante
 * @class ModalUpdateData
 * @main Empleos
 * @author Juan Carlos Contreras
**/

/*global $*/
/*global _*/
/*global dataLayer*/
import Inputmask from 'inputmask';
import { Utils } from '../libs/utils.js';
import Modal from './../common/handler_modal';
import EnabledButton from './../common/handler_enabled_button.js';
import _ from "underscore";

export default class ModalUpdateData {
  constructor() {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
    this.subscribeEvents();
  }

  setSettings() {
    this.st = {
      modal            : '#modalUpdate',
      globalError      : '.js-global-form-errors',
      btnShowModal     : '.js-not-enough-information',
      linkAccount      : '.js-link-account',
      urlAjax          : '/register',
      modalLogin       : '#modalLogin',
      btnSession       : '#btnSession',
      btnCloseModal    : '.js-close-modal',
      tplMessage       : '#tplMessage',
      flashMessage     : '#flashMessage',
      tplSuggestLogin  : '#tplSuggestLogin',
      form             : {
        frmModal           : '#frmUpdate',
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
        btnUpdate          : '#btnUpdate',
        btnNext            : '.js-btn-next',
        btnPrev            : '.js-btn-prev',
        fieldSerialize     : '.js-field-serialize',
        fieldset           : '.js-fieldset',
        containerDisable   : '.js-container-disable',
        disableEndDate     : '.js-disable-end-date',
        sectionDate        : '.js-section-date',
        dateRange          : '.js-date-range',
        dateSelected       : '.js-date',
        btnLoginOpen       : '#loginOpen',
        loaderValue        : ".js-loader-value",
        loading            : ".js-loading",
        btnApply           : ".js-btn-apply"
      }
    };
    this.global = {
      validator      : null,
      urlGetData     : "/postulant/information",
      urlUpdateData  : "/postulant/update-profile",
      tplSuggestLogin: null,
      updatedData    : false
    };
    this.jsonPost = {};
    this.PERU_CODE = '2533';
    this.modal = new Modal();
    this.EnabledButton = new EnabledButton();
    this.data = {};
  }

  catchDom() {
    this.dom = {};
    this.dom.btnShowModal        = $(this.st.btnShowModal);
    this.dom.modalUpdate         = $(this.st.modal);
    this.dom.subtitleModal       = $(this.st.form.subtitleModal, this.dom.modalUpdate);
    this.dom.globalError         = $(this.st.globalError);
    this.dom.linkAccount         = $(this.st.linkAccount);
    this.dom.frmModal            = $(this.st.form.frmModal);
    this.dom.formPersonalData    = $(this.st.form.formPersonalData, this.dom.frmModal);
    this.dom.formLastStudy       = $(this.st.form.formLastStudy, this.dom.frmModal);
    this.dom.formLastJob         = $(this.st.form.formLastJob, this.dom.frmModal);
    this.dom.formJob             = $(this.st.form.formJob, this.dom.frmModal);
    this.dom.titleModal          = $(this.st.form.titleModal);
    this.dom.firstModal          = $(this.st.form.firstModal);
    this.dom.secondModal         = $(this.st.form.secondModal);
    this.dom.name                = $(this.st.form.name, this.dom.frmModal);
    this.dom.lastname            = $(this.st.form.lastname, this.dom.frmModal);
    this.dom.email               = $(this.st.form.email, this.dom.frmModal);
    this.dom.txtPassword         = $(this.st.form.txtPassword, this.dom.frmModal);
    this.dom.txtBirthDay         = $(this.st.form.txtBirthDay, this.dom.frmModal);
    this.dom.phoneNumber         = $(this.st.form.phoneNumber, this.dom.frmModal);
    this.dom.dateStartStudy      = $(this.st.form.dateStartStudy, this.dom.frmModal);
    this.dom.dateEndStudy        = $(this.st.form.dateEndStudy, this.dom.frmModal);
    this.dom.dateStartExperience = $(this.st.form.dateStartExperience, this.dom.frmModal);
    this.dom.dateEndExperience   = $(this.st.form.dateEndExperience, this.dom.frmModal);
    this.dom.position            = $(this.st.form.position, this.dom.frmModal);
    this.dom.txtIdUbicacion      = $(this.st.form.txtIdUbicacion, this.dom.frmModal);
    this.dom.selDocument         = $(this.st.form.selDocument, this.dom.frmModal);
    this.dom.txtNumberDoc        = $(this.st.form.txtNumberDoc, this.dom.frmModal);
    this.dom.selCountry          = $(this.st.form.selCountry, this.dom.frmModal);
    this.dom.txtUbigeo           = $(this.st.form.txtUbigeo, this.dom.frmModal);
    this.dom.studyDateEnd        = $(this.st.form.studyDateEnd, this.dom.frmModal);
    this.dom.currentStudy        = $(this.st.form.currentStudy, this.dom.frmModal);
    this.dom.btnUpdate           = $(this.st.form.btnUpdate, this.dom.frmModal);
    this.dom.btnNext             = $(this.st.form.btnNext, this.dom.frmModal);
    this.dom.btnPrev             = $(this.st.form.btnPrev, this.dom.frmModal);
    this.dom.disableEndDate      = $(this.st.form.disableEndDate, this.dom.frmModal);
    this.dom.btnCreateAccount    = $(this.st.form.btnCreateAccount);
    this.dom.fieldset            = $(this.st.form.fieldset, this.dom.frmModal);
    this.dom.btnLoginOpen        = $(this.st.form.btnLoginOpen);
    this.dom.btnSession          = $(this.st.btnSession);
    this.dom.loading             = $(this.st.form.loading);
    this.dom.btnApply            = $(this.st.form.btnApply);
    this.dom.tplMessage          = $(this.st.tplMessage);
    this.dom.flashMessage        = $(this.st.flashMessage);
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
    this.openModalAuto();
  }

  subscribeEvents() {
    this.dom.btnShowModal.on('click', (e) => this.onShowModal(e));
    this.dom.btnNext.on('click', (e) => this.setHideFirstForm(e));
    this.dom.btnPrev.on('click', (e) => this.setHideSecondForm(e));
    this.dom.email.on('change', (e) => this.validateEmailField());
    this.dom.selDocument.on('change', (e) => this.onChangeDocument(e));
    this.dom.selCountry.on('change', (e) => this.onChangeCountry(e));
    this.dom.frmModal.on('keyup', this.st.form.dateSelected , (e) => this.setValidationDateRange(e));
    this.dom.frmModal.on('click', this.st.form.disableEndDate, (e) => this.disableEndDate(e));
    this.dom.frmModal.on('change', this.st.form.notExperience, (e) => this.disabledExperienceJob(e));
    this.dom.btnLoginOpen.on('click', (e) => this.openLogin(e));
    this.dom.btnSession.on('click', (e) => this.sessionRedirect(e));
    this.dom.linkAccount.on('click', (e) => this.accountRedirect(e));
    this.dom.frmModal.on('click', this.st.btnCloseModal, () => this.closeModal() );
  }

  onShowModal (event) {
    event.preventDefault();
    Utils.hideMenu();
    Utils.deleteMessage();
    this.dom.loading.addClass("is-loading");
    if (this.global.updatedData) {
      this.modal.openModal("#modalQuestions", this.getModalSettings());
    } else {
      this.modal.openModal(this.st.modal, this.getModalSettings());
      this.initGetData();
    }
  }

  accountRedirect (event) {
    event.preventDefault();
    window.open(window.aptitusUrl + 'postulante/mi-perfil');
  }

  sessionRedirect () {
    this.modal.closeModal();
    window.location.href = "/";
  }

  openLogin () {
    this.modal.openModal(this.st.modalLogin, this.getModalSettings());
  }

  onChangeDocument () {
    this.setValidationDocument(this.dom.selDocument, this.dom.txtNumberDoc);
  }

  onChangeCountry() {
    if (this.dom.selCountry.val() === this.PERU_CODE) {
      this.dom.txtUbigeo.removeAttr('disabled');
      this.dom.txtUbigeo.parent().removeClass('is-disabled');
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
    Utils.deleteMessage();
    global.validator.element(this.st.form.email);
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
          "clearIncomplete": true
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
      "placeholder": "dd/mm/aaaa"
    }).mask($txtBirthDay);
  }

  setValidationCustomRules () {
    return $.validator.addMethod('verifySelection', (function(value, element, param) {
      let idField;
      idField = $(param).val();
      return $.trim(idField) !== '';
    }), 'Seleccione una ubicación')
  }

  // Cierra la modal
  closeModal () {
    this.dom.loading.addClass(".is-loading");
    this.dom.btnPrev.trigger("click");
    this.modal.closeModal();
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
      $isEdit.attr("disabled", "disabled");
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
          verifySelection: '#institutionId'
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
      errorPlacement: Utils.setErrorPlacement,
      success: Utils.setSuccessForm,
      submitHandler: () => {
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

  setValidationDocument ($selDocument, $txtNumber) {
    if ($selDocument.val() === 'dni') {
      $txtNumber.attr({
        minlength: 8,
        maxlength: 8
      }).rules('add', {
        digits: true
      });
      $txtNumber.rules('remove', 'alphNumeric');
    } else {
      $txtNumber.attr({
        minlength: 7,
        maxlength: 12
      }).rules('add', {
        alphNumeric: true
      });
      $txtNumber.rules('remove', 'digits');
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

  // Abre la modal automaticamente
  openModalAuto () {
    const hash = location.hash;
    if(hash === "#actualizarCV") {
      this.modal.openModal(this.st.modal, this.getModalSettings());
      this.initGetData();
    }
  }

  // Permite obtener todos los datos del postulante
  initGetData () {
    $.ajax({
      url: this.global.urlGetData,
      type: "GET",
      dataType: "json"
    })
    .done((response) => {
      this.loadDataApplicant(response);
      this.dom.loading.removeClass("is-loading");
    })
    .fail(() => {
      this.dom.loading.removeClass("is-loading");
    });
  }

  // Carga los datos de los postulantes
  loadDataApplicant(dataApplicant){
    for(let key in dataApplicant){
      for(let newKey in dataApplicant[key]){
        let valueDataApplicant = dataApplicant[key][newKey];
        this.loaderData(newKey, valueDataApplicant);
      }
    }
    this.onChangeCountry();
    this.onChangeDocument();
    this.dom.frmModal.valid();
  }

  // Cargador de datos
  loaderData (keyData, valueData) {
    const $element = $(`[name=${keyData}]`, this.dom.frmModal);

    if( valueData !== null ) {
      if( $element.is("input, textarea") && $element.val(valueData) );
      if( $element.is("select") && $element.val(valueData).trigger("change") );
      if( $element.is(":checkbox") && keyData !== "has_experience") {
        if(valueData && $element.trigger("click") );
      }else {
        if(!valueData && $element.trigger("click") );
      }
    }
  }

  loadMessage(message) {
    let template = _.template(this.dom.tplMessage.html());
    this.dom.flashMessage.append(template({message}));
  }

  initAjax () {
    let idUser, idAd;
    idUser = this.dom.btnApply.data("id-user");
    idAd   = this.dom.btnApply.data("id-ad");
    Utils.deleteMessage();

    this.jsonPost["job"] = {
      "job_id": $("#adID").data("job")
    }

    this.setSerializeForms( this.dom.formPersonalData, this.dom.formPersonalData.data('index') );
    this.setSerializeForms( this.dom.formLastJob, this.dom.formLastJob.data('index') );
    this.setSerializeForms( this.dom.formLastStudy, this.dom.formLastStudy.data('index') );
    this.dom.btnUpdate.attr("loading", "loading");
    this.dom.btnUpdate.attr("disabled", "disabled");
    this.dom.btnPrev.attr("disabled", "disabled");
    $.ajax({
      url: this.global.urlUpdateData,
      type: 'POST',
      dataType: 'json',
      data: this.jsonPost
    })
    .done((response) => {
      if(response.code === 200) {
        this.global.updatedData = true;
        this.modal.closeModal();
        this.setHideSecondForm();
        this.dom.btnUpdate.removeAttr('disabled loading');
        this.dom.btnNext.removeAttr('disabled');
        this.dom.btnPrev.removeAttr('disabled');
        // Si el aviso tiene preguntas
        if (response.next_action === "preguntasAdicionales") {
          this.modal.openModal("#modalQuestions", this.getModalSettings());
        } else if (response.next_action == "postular") {
          this.dom.btnApply.attr("disabled", true);
          this.dom.btnApply.addClass("g-btn--disabled");
          this.loadMessage(response.message);
          dataLayer.push({
            'event'   : 'ExpoAptitus',
            'category': 'Postulacion ExpoAptitus',
            'action'  : 'Postulacion',
            'label'   : `${idUser}_${idAd}`,
            'value'   : 1
          });
        }
      }
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
      this.dom.btnUpdate.removeAttr('disabled loading');
    });
  }

}
