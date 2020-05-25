/**
 * Módulo encargado de autocompletar el campo area
 * @class AutocompleteInstitutions
 * @main Common
 * @author Angelo Panez
 */

/*global $*/

export default class AreaComponent {
  constructor() {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
  }

  setSettings () {
    this.data = settings.areas,
    this.st   = {
      area          : ".js-area",
      subtitleModal : ".js-subtitle-job"
    }
  }

  catchDom() {
    this.dom = {};
    this.dom.area          = $(this.st.area);
    this.dom.subtitleModal = $(this.st.subtitleModal);
  }

  afterCatchDom() {
    this.setFieldArea(this.data, this.dom.area);
  }

  setFieldArea(data, $area) {
    $area.append("<option value='default'>Seleccione un área</option>")
    $.each(data, function(item) {
      $area.append($("<option>", {
        value       : data[item].id,
        label       : data[item].name,
        text        : data[item].name
      }))
    });
  }
}