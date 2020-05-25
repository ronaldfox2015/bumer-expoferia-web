import 'jquery-ui/ui/widgets/autocomplete';
import Rx from 'rxjs/Rx';
import { Utils } from '../libs/utils.js'

/**
 * Módulo encargado de autocompletar el campo carreras
 * @class AutocompleteCareers
 * @main Common
 * @author Angelo Panez
 */

/*global $*/

export default class AutocompleteCareers {
  constructor() {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
    this.subscribeEvents();
  }

  setSettings() {
    this.st = {
      career       : ".js-career",
      subtitleModal: ".js-subtitle-study",
      txtCareerId  : ".js-career-id",
      txtCareer    : ".js-career-txt",
      urlCareers   : "/ajax/careers",
      subscription  : null
    };
  }

  catchDom() {
    this.dom = {};
    this.dom.career        = $(this.st.career);
    this.dom.txtCareerId   = $(this.st.txtCareerId);
    this.dom.txtCareer     = $(this.st.txtCareer);
    this.dom.subtitleModal = $(this.st.subtitleModal, this.dom.form);
  }

  afterCatchDom() {
    this.initCareersAutocomplete();
  }
  subscribeEvents () {
    this.dom.career.on("focusout", () => {
      this.fnAbortAutocomplete()
    })
  }

  initCareersAutocomplete() {
    this.dom.career.autocomplete({
      source: (autocompleteRequest, autocompleteResponse) => {
        let ajax, observable;
        ajax = {
          url     : this.st.urlCareers + `?q=${autocompleteRequest.term}`,
          dataType: 'json'
        };
        this.dom.career.attr('loading', 'loading');
        this.fnAbortAutocomplete()
        observable = this.fnMiddleObserverGetItems(ajax);
        this.subscription = observable.subscribe(
            (data) => {
              if (!data.length) {
                this.dom.txtCareer.val(this.dom.career.val());
              }
              this.dom.career.removeAttr('loading', 'loading');
              autocompleteResponse(data)
            },
            (error) => {
              this.dom.career.removeAttr('loading', 'loading');
              Utils.showMessage(this.dom.subtitleModal, 'error', 'Hubo un error en la busqueda de las carreras');
            }
        );
      },
      select: (event, ui) => {
        this.dom.career.removeClass('is-error');
        this.dom.career.parent().removeClass('is-error');
        this.dom.txtCareerId.val(ui.item.id);
        this.dom.txtCareer.val(ui.item.label);
      },
      change: (event, ui) => {
        if( ui.item === null) {
          this.dom.txtCareer.val(this.dom.career.val());
          this.dom.txtCareerId.val('');
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
      this.dom.career.removeAttr('loading', 'loading');
    }
  }
}