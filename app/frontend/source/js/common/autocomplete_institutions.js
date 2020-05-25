import 'jquery-ui/ui/widgets/autocomplete';
import Rx from 'rxjs/Rx';
import { Utils } from '../libs/utils.js'

/**
 * Módulo encargado de autocompletar el campo instituciones
 * @class AutocompleteInstitutions
 * @main Common
 * @author Angelo Panez
 */

/*global $*/

export default class AutocompleteInstitutions {
  constructor() {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
    this.subscribeEvents();
  }

  setSettings() {
    this.st = {
      institution     : ".js-autocomplete-institution",
      txtInstitutionId: ".js-institution-id",
      txtInstitution  : ".js-institution-txt",
      subtitleModal   : ".js-subtitle-study",
      form            : '.js-modal',
      urlInstitutions : "/ajax/institutions",
      subscription    : null
    };
    this.dom = {};
  }

  catchDom() {
    this.dom.form             = $(this.st.form);
    this.dom.institution      = $(this.st.institution);
    this.dom.txtInstitutionId = $(this.st.txtInstitutionId);
    this.dom.txtInstitution   = $(this.st.txtInstitution);
    this.dom.subtitleModal    = $(this.st.subtitleModal, this.dom.form);
  }

  afterCatchDom() {
    this.initInstitutionsAutocomplete();
  }

  subscribeEvents () {
    this.dom.institution.on("focusout", () => {
      this.fnAbortAutocomplete()
    })
  }

  initInstitutionsAutocomplete() {
    this.dom.institution.autocomplete({
      source: (autocompleteRequest, autocompleteResponse) => {
        let ajax, observable;
        ajax = {
          url     : this.st.urlInstitutions + `?q=${autocompleteRequest.term}`,
          dataType: 'json'
        };
        this.dom.txtInstitutionId.val('');
        this.dom.institution.attr('loading', 'loading');
        this.fnAbortAutocomplete()
        observable = this.fnMiddleObserverGetItems(ajax);
        this.subscription = observable.subscribe(
            (data) => {
              if (!data.length) {
                Utils.showMessage(this.dom.subtitleModal, 'error', 'No se encontraron resultados para la institucion ingresada.');
                this.dom.institution.parent().addClass("is-error");
              } else {
                Utils.deleteMessage();
                this.dom.institution.parent().removeClass("is-error");
              }
              this.dom.institution.removeAttr('loading', 'loading');
              autocompleteResponse(data);
            },
            (error) => {
              this.dom.institution.removeAttr('loading', 'loading');
              Utils.showMessage(this.dom.subtitleModal, 'error', 'Hubo un error en la busqueda de las instituciones');
            }
        );
      },
      select: (event, ui) => {
        this.dom.institution.removeClass('is-error');
        this.dom.institution.parent().removeClass('is-error');
        this.dom.txtInstitutionId.val(ui.item.id);
        this.dom.txtInstitution.val(ui.item.label);
        this.dom.institution.removeAttr("")
      },
      change: (event, ui) => {
        if(ui.item === null) {
          this.dom.institution.parent().addClass('is-error');
          this.dom.txtInstitutionId.val('');
          this.dom.txtInstitution.val(this.dom.institution.val());
        } else {
          this.dom.institution.parent().removeClass('is-error');
        }
      }
    });
  }

  fnMiddleObserverGetItems(ajax) {
    return Rx.Observable.ajax(ajax)
      .map((result) => {
        let list;
        list = result.response.map((item)=> {
          return {'id': item.id, 'label': item.name}
        });
        return list;
      })
  }

  fnAbortAutocomplete() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.dom.institution.removeAttr('loading', 'loading');
    }
  }
}