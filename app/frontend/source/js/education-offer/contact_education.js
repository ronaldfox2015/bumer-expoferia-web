/*global $*/
/**
 * Formulario contacto
 * @class ContactEducation
 * @main Education-Offer
 * @author Christiam Mendives
 */
import { Utils } from '../libs/utils.js';
import Modal from '../common/handler_modal';
import ContactCaptcha from './contact_captcha'

export default class ContactEducation {
  constructor () {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
    this.subscribeEvents();
  }

  setSettings() {
    this.st = {
      txtName            : "#txtName",
      txtPhone           : "#txtPhone",
      txtEmail           : "#txtEmail",
      button             : ".js-send-form",
      contactOfferDiv    : '.js-contact-offer',
      btnOpenModal       : '.js-open-contact',
      frmContact         : '#frmContactOffer',
      boxContact         : '.js-box-contact',
      errorBox           : '.js-error-message',
      divData            : ".js-contact-request-success",
      contactName        : ".js-contact-name",
      contactEmail       : ".js-contact-email",
      contactTelephone   : ".js-contact-telephone",
      nameDivData        : ".js-name",
      divCaptcha         : ".js-captcha",
      divCaptchaContainer: ".js-recaptcha",
      fieldset           : ".js-fieldset",
      inputForm          : ".js-input",
      errorClass         : ".is-error"
    };
    this.dom = {};
    this.modal = new Modal();
    this.ContactCaptcha = new ContactCaptcha();
  }

  catchDom() {
    this.dom.contactOfferDiv     = $(this.st.contactOfferDiv);
    this.dom.btnOpenModal        = $(this.st.btnOpenModal);
    this.dom.frmContact          = $(this.st.frmContact);
    this.dom.txtPhone            = $(this.st.txtPhone, this.dom.frmContact);
    this.dom.txtEmail            = $(this.st.txtEmail, this.dom.frmContact);
    this.dom.txtName             = $(this.st.txtName, this.dom.frmContact);
    this.dom.button              = $(this.st.button, this.dom.frmContact);
    this.dom.errorBox            = $(this.st.errorBox, this.dom.frmContact);
    this.dom.divData             = $(this.st.divData);
    this.dom.contactName         = $(this.st.contactName, this.dom.divData);
    this.dom.contactEmail        = $(this.st.contactEmail, this.dom.divData);
    this.dom.contactTelephone    = $(this.st.contactTelephone, this.dom.divData);
    this.dom.nameDivData         = $(this.st.nameDivData, this.dom.divData);
    this.dom.btnCloseModal       = $(this.st.btnCloseModal, this.dom.contactOfferDiv);
    this.dom.boxContact          = $(this.st.boxContact);
    this.dom.fieldset            = $(this.st.fieldset, this.dom.frmContact);
    this.dom.inputForm           = $(this.st.inputForm, this.dom.frmContact);
    this.dom.divCaptchaContainer = $(this.st.divCaptchaContainer,this.dom.contactOfferDiv);
  }

  afterCatchDom(){
    this.initValidateForm();
    this.setValidator();
  }

  subscribeEvents() {
    this.dom.btnOpenModal.on('click', (event) => {
      event.preventDefault();
      this.openModal();
    });
  }

  openModal() {
    let settings = this.getSettingsModal();
    this.modal.openModal(this.st.contactOfferDiv, settings);
    this.dom.boxContact.hide();
  }

  getSettingsModal () {
    return {
      autoDimensions: false,
      padding   : 0,
      arrows    : false,
      afterClose: () => {
        $("span", this.dom.fieldset).remove();
        $(this.st.fieldset, this.dom.frmContact).removeClass("is-error");
        $(this.st.errorClass, this.dom.divCaptcha).remove();
        this.dom.frmContact[0].reset();
        this.dom.boxContact.show();
        this.dom.contactOfferDiv.css('display', 'block');
      }
    }
  }
  initValidateForm() {
    this.dom.frmContact.tooltipster({
      interactive  : true,
      contentAsHTML: true,
      maxWidth     : 100,
      timer        : 2500,
      trigger      : 'custom',
      theme        : ['tooltipster-aptitus']
    });
    this.dom.frmContact.validate({
      onfocusout  : false,
      ignoreTitle : true,
      ignore      : "input[type=range]",
      errorElement: "span",
      rules       : {
        "name" : { required: true, alphabet: true },
        "phone": { telephoneContact: true },
        "email": { nEmail: true }
      },
      invalidHandler  : Utils.formDefault.invalidHandler,
      errorPlacement  : Utils.formDefault.errorPlacement,
      highlight       : Utils.formDefault.highlight,
      unhighlight     : Utils.formDefault.unhighlight,
      submitHandler   : () => {
        this.initAjax();
      }
    });
  }

  initAjax () {
    let urlAjax;
    urlAjax = '/ajax/education/lead';
    $.ajax({
      url: urlAjax,
      type: 'POST',
      dataType: 'json',
      data: this.dom.frmContact.serialize(),
      beforeSend:  () => {
        $("input, textarea", this.dom.frmContact).prop("disabled", true);
        this.dom.button.attr({
          "disabled": "",
          "loading" : ""
        });
      }
    })
    .done((response) => {
      let idUser, idAd, dataStakeholder;
      idUser = this.dom.button.data("id-user");
      idAd   = this.dom.button.data("id-ad");
      dataStakeholder = this.getDataStakeHolder();
      this.dom.nameDivData.text(dataStakeholder.name.split(" ")[0]);
      this.dom.divData.show();
      this.dom.contactName.text(response.data.contact);
      this.dom.contactEmail.text(response.data.email);
      this.dom.contactTelephone.text(response.data.telephone);
      this.dom.frmContact.remove();
      Utils.showMessage(this.dom.divData , 'success', response.message );
      dataLayer.push({
        'event'   : 'ExpoAptitus',
        'category': 'Expoaptitus Contacto Maseducacion',
        'action'  : 'Maseducacion Lead',
        'label'   : `${idUser}_${idAd}`,
        'value'   : 1
      });
    })
    .fail((jqXHR) => {
      if (jqXHR.statusText !== "abort") {
        this.afterSend();
        Utils.showMessage(this.dom.frmContact, "error", "Hubo un error, intentelo nuevamente.");
      }
      switch(jqXHR.status) {
        case(400) : {
          $(this.st.divCaptcha).children("div").addClass("is-error");
          Utils.showMessage(this.dom.divCaptchaContainer, "error", "Completar el captcha.");
          break;
        }
        case(500) : {
          $(this.st.txtEmail).parents(".js-email").addClass("is-error");
          Utils.showMessage(this.dom.divCaptchaContainer, "error", "No es un correo válido.");
          break;
        }
      }
    })
  }

  getDataStakeHolder() {
    let data = {};
    data.name  = this.dom.txtName.val();
    data.phone = this.dom.txtPhone.val();
    data.email = this.dom.txtEmail.val();
    return data;
  }

  afterSend() {
    $("input, textarea", this.dom.frmContact).prop("disabled", false);
    this.dom.button.removeAttr("disabled");
    this.dom.button.removeAttr("loading");
    this.ContactCaptcha.resetCaptcha();
  }

  setValidator () {
    $.validator.addMethod("telephoneContact", (function(value, element) {
      let arrValues, testValue, response;
      testValue = function(valueInput) {
        return /^([0-9]{9}(-[0-9]{1,5})?|(\(([0-9]{2,3})\))?[0-9]{3}-?(?:[0-9]{4}|[0-9]{6}))$/.test(valueInput)
      };
      arrValues = value.split("/");
      if (arrValues.length === 2) {
        response = testValue(arrValues[0]) && testValue(arrValues[1]);
      } else {
        response = testValue(value);
      }
      return this.optional(element) || response;
    }), "Ingresa un teléfono válido.");
  }

  showMessageTooltip ($frm, message) {
    $frm.tooltipster("content", message);
    $frm.tooltipster("open");
  }
}
