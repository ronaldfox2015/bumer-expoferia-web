import 'jquery-ui/ui/widgets/autocomplete';
import Rx from 'rxjs/Rx';
import { Utils } from '../libs/utils.js'

/**
 * Módulo encargado de autcompletar el campo Puesto
 * @class AutocompletePosition
 * @main Common
 * @author Angelo Panez
 */

/*global $*/

export default class AutocompletePosition {
  constructor() {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
    this.subscribeEvents();
  }

  setSettings() {
    this.st = {
      position     : ".js-position",
      txtPositionId: ".js-position-id",
      txtPosition  : ".js-position-txt",
      subtitleModal: ".js-subtitle-job",
      urlPosition  : "/ajax/positions",
      subscription : null
    };
  }

  catchDom() {
    this.dom = {};
    this.dom.position      = $(this.st.position);
    this.dom.txtPositionId = $(this.st.txtPositionId);
    this.dom.txtPosition   = $(this.st.txtPosition);
    this.dom.subtitleModal = $(this.st.subtitleModal, this.dom.form);
  }

  subscribeEvents () {
    this.dom.position.on("focusout", () => {
      this.fnAbortAutocomplete()
    })
  }

  afterCatchDom() {
    this.initPositionsAutocomplete();
  }

  initPositionsAutocomplete() {
    this.dom.position.autocomplete({
      source: (autocompleteRequest, autocompleteResponse) => {
        let ajax, observable;
        ajax = {
          url: this.st.urlPosition + `?q=${autocompleteRequest.term}`,
          dataType: 'json'
        };
        this.dom.position.attr('loading', 'loading');
        this.fnAbortAutocomplete()
        observable = this.fnMiddleObserverGetItems(ajax);
        this.subscription = observable.subscribe(
            (data) => {
              if (!data.length) {
                this.dom.txtPosition.val(this.dom.position.val());
              }
              this.dom.position.removeAttr('loading', 'loading');
              autocompleteResponse(data);
            },
            (error) => {
              this.dom.position.removeAttr('loading', 'loading');
              Utils.showMessage(this.dom.subtitleModal, 'error', 'Hubo un error en la busqueda de las carreras');
            }
        );
      },
      select: (event, ui) => {
        this.dom.position.removeClass('is-error');
        this.dom.position.parent().removeClass('is-error');
        this.dom.txtPositionId.val(ui.item.id);
        this.dom.txtPosition.val(ui.item.label);
      }, 
      change: (event, ui) => {
        if( ui.item === null) {
          this.dom.txtPosition.val(this.dom.position.val());
          this.dom.txtPositionId.val('');
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
      this.dom.position.removeAttr('loading', 'loading');
    }
  }
}