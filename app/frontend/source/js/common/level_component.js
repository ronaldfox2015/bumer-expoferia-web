/**
 * Módulo encargado de rellenar el campo nivel
 * @class LevelComponent
 * @main Common
 * @author Angelo Panez
 */

/*global $*/

export default class LevelComponent {
  constructor() {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
  }

  setSettings () {
    this.data = settings.levels,
    this.st   = {
      txtLevel       : ".js-level"
    }
  }

  catchDom() {
    this.dom = {}
    this.dom.txtLevel = $(this.st.txtLevel);
  }

  afterCatchDom() {
    this.setLevel(this.data, this.dom.txtLevel);
  }

  setLevel(data, $level) {
    $level.append("<option value='default'>Selecciona un nivel</option>")
    $.each(data, function(item) {
      $level.append($("<option>", {
        value       : data[item].id,
        label       : data[item].name,
        text        : data[item].name
      }))
    });
  }
}