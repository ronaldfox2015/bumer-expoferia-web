/*global $*/
/*global dataLayer*/
import { Utils } from '../libs/utils.js';
import Modal from './handler_modal';

export default class ModalLogin {

  constructor() {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
    this.subscribeEvents();
  }

  setSettings() {
    this.st = {
      modal           : '#modalLogin',
      btnShowModal    : '.js-login-init',
      urlAjax         : '/auth/login',
      rol             : null,
      btnLoginFacebook: '.js-login-facebook',
      fbLoginUrl      : '#fbLoginUrl',
      fbLoginApplyUrl : '#fbLoginApplyUrl',
      form            : {
        frmModal   : '#frmLogIn',
        txtUser    : '#txtUser',
        txtPassword: '#txtPasswordLogin',
        fieldset   : '.js-fieldset',
        btnLogin   : '#btnLoginUser'
      }
    };
    this.dom = {};
    this.global = {
      redirect: null,
      btnApply: false
    };
    this.modal = new Modal();
  }

  catchDom() {
    this.dom.btnShowModal     = $(this.st.btnShowModal);
    this.dom.modalLoginUser   = $(this.st.modal);
    this.dom.frmModal         = $(this.st.form.frmModal);
    this.dom.txtUser          = $(this.st.form.txtUser, this.dom.frmModal);
    this.dom.txtPassword      = $(this.st.form.txtPassword, this.dom.frmModal);
    this.dom.chkType          = $(this.st.form.chkType, this.dom.frmModal);
    this.dom.btnLogin         = $(this.st.form.btnLogin, this.dom.frmModal);
    this.dom.fieldset         = $(this.st.form.fieldset, this.dom.frmModal);
    this.dom.btnLoginFacebook = $(this.st.btnLoginFacebook);
    this.dom.fbLoginUrl       = $(this.st.fbLoginUrl);
    this.dom.fbLoginApplyUrl  = $(this.st.fbLoginApplyUrl);
  }

  afterCatchDom() {
    this.openModalWithHash();
    this.global.redirect = this.dom.frmModal.attr('action');
    this.initValidateForm();
  }

  subscribeEvents() {
    $('body').on('click', this.st.btnShowModal, (event) => this.showModal(event));
    $('body').on('click', this.st.btnShowModal, (event) => this.redirectActionFacebook(event));
  }

  showModal (event) {
    event.preventDefault();
    let $button;

    Utils.hideMenu();
    Utils.deleteMessage();
    $button = $(event.target);
    this.modal.openModal('#modalLogin', this.getModalSettings($button));

    const $this = $(event.target);
    if($this.is(".js-init-apply")){
      this.global.btnApply = true;
    }
  }

  redirectActionFacebook (event) {
    const $this = $(event.target);
    let urlRedirect = null;
    if($this.is(".js-init-apply")){
      urlRedirect = this.dom.fbLoginApplyUrl.val();
    }else {
      urlRedirect = this.dom.fbLoginUrl.val();
    }
    this.dom.btnLoginFacebook.prop("href", urlRedirect);
  }

  getModalSettings($button) {
    let settings = {
      arrows  : false,
      beforeShow: () => {
        this.clearForm();
        this.setRedirectAjax($button);
      },
      beforeClose: () => {
        this.dom.fieldset.tooltipster('close');
        this.dom.frmModal.tooltipster('close');
      },
      afterClose: () => {
        this.dom.frmModal.trigger("reset");
        $('.is-error', this.dom.frmModal).removeClass('is-error');
      }
    };
    return settings;
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
    this.dom.frmModal.validate({
      focusInvalid  : false,
      errorPlacement: Utils.setErrorPlacement,
      success       : Utils.setSuccessForm,
      submitHandler : () => this.initAjax(),
      rules         : {
        txtUser: {
          nEmail: true
        }
      }
    });
  }

  initAjax () {
    let email;
    this.dom.btnLogin.attr({'disabled': '', 'loading': ''});
    email = this.dom.txtUser.val();
    $.ajax({
      url : this.st.urlAjax,
      type: 'POST',
      data: this.dom.frmModal.serialize()
    })
    .done(() => {
      dataLayer.push({
        'event':'ExpoAptitus Login',
        'category':'ExpoAptitus Login',
        'action': window.location.href,
        'label': email,
        'value':1
      });
      setTimeout(() => {
        let currentPath, currentPathWithoutHash;
        currentPath = window.location.pathname + window.location.hash;
        currentPathWithoutHash = this.global.redirect.split("#")[0];
        if (currentPath === this.global.redirect || window.location.pathname === currentPathWithoutHash) {
          window.location = this.global.redirect;
          window.location.reload();
        } else {
          if(this.global.btnApply){
            window.location = this.global.redirect;
          }else {
            window.location.reload();
          }
        }
      }, 2000);
    })
    .fail((jqXHR) => {
      this.dom.frmModal.tooltipster('content', jqXHR.responseJSON.message);
      this.dom.frmModal.tooltipster('open');
      this.dom.btnLogin.removeAttr('disabled loading');
      this.dom.txtUser.parent().addClass('is-error');
      this.dom.txtPassword.val('').focus();
      this.dom.btnLogin.removeAttr('disabled loading');
    });
  }

  clearForm () {
    this.dom.frmModal[0].reset();
    $('.is-error', this.dom.frmModal).removeClass('is-error');
  }

  setRedirectAjax ($button) {
    let url;
    url = Utils.getParameterByName('redirect');
    if ($button !== undefined && typeof $button.data('redirect') !== 'undefined') {
      this.global.redirect = $button.data('redirect');
    } else if (url !== null) {
      this.global.redirect = url;
    }
  }

  openModalWithHash() {
    const isLogged = this.dom.btnShowModal.length > 1;
    const hash = window.location.hash;
    hash === '#login' && isLogged && this.modal.openModal('#modalLogin');
  }
}
