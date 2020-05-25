/*global $*/
import 'jquery-ui/ui/widgets/autocomplete';
import Rx from 'rxjs/Rx';
import { Utils } from '../libs/utils.js';
import EnabledButton from './handler_enabled_button.js';

export default class AutocompleteLocations {
  constructor() {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
    this.subscribeEvents();
  }

  setSettings () {
    this.st = {
      txtLocations  : '.js-autocomplete-locations',
      txtLocationsID: '.js-locations-id',
      form          : '.js-form-valide',
      subtitleModal : '.js-subtitle',
      urlAjax       : '/ajax/locations',
      btnNext       : '#btnNext',
      subscription  : null
    };
    this.dom = {};
    this.EnabledButton = new EnabledButton();
  }

  catchDom() {
    this.dom.form           = $(this.st.form);
    this.dom.txtLocations   = $(this.st.txtLocations, this.dom.form);
    this.dom.subtitleModal  = $(this.st.subtitleModal, this.dom.form);
    this.dom.txtLocationsID = $(this.st.txtLocationsID, this.dom.form);
    this.dom.btnNext        = $(this.st.btnNext);
  }

  afterCatchDom() {
    this.fnMainInitAutocomplete();
  }

  subscribeEvents () {
    this.dom.txtLocations.on("focusout", () => {
      this.fnAbortAutocomplete()
    })
  }

  fnMainInitAutocomplete() {
    this.dom.txtLocations.autocomplete({
      source: (autocompleteRequest, autocompleteResponse) => {
        let ajax, observable;
        ajax = {
          url: `${this.st.urlAjax}?q=${autocompleteRequest.term}`,
          dataType: 'json'
        };
        this.dom.txtLocationsID.val('');
        this.dom.txtLocations.attr('loading', 'loading');
        this.fnAbortAutocomplete()
        observable = this.fnMiddleObserverGetItems(ajax);
        this.subscription = observable.subscribe(
            (data) => {
              if (!data.length) {
                Utils.showMessage(this.dom.subtitleModal, 'error', 'No se encontraron resultados para la ubicación ingresada.');
                this.dom.txtLocations.parent().addClass("is-error");
              } else {
                Utils.deleteMessage();
                this.dom.txtLocations.parent().removeClass("is-error");
              }
              this.dom.txtLocations.removeAttr('loading', 'loading');
              autocompleteResponse(data)
            },
            (error) => {
              this.dom.txtLocations.removeAttr('loading', 'loading');
              Utils.showMessage(this.dom.subtitleModal, 'error', 'Hubo un error al buscar su dirección.');
            }
        );
      },
      select: (event, ui) => {
        this.dom.txtLocations.removeClass('is-error');
        this.dom.txtLocations.parent().removeClass('is-error');
        this.dom.txtLocationsID.val(ui.item.id);
      }
    });
  }

  fnMiddleObserverGetItems(ajax) {
    return Rx.Observable.ajax(ajax)
      .map((result) => {
        let list;
        list = result.response.map((item)=> {
          return {'id': item.id, 'label': item.display}
        });
        return list;
      })
  }

  fnAbortAutocomplete() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
