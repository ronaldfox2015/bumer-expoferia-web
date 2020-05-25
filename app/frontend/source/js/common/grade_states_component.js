/**
 * Módulo encargado de autocompletar los campos grados y estados
 * @class AutocompleteInstitutions
 * @main Common
 * @author Angelo Panez
 */

/*global $*/

export default class GradeStatesComponent {
  constructor() {
    this.setSettings();
    this.catchDom();
    this.afterCatchDom();
    this.subscribeEvents();
  }

  setSettings () {
    this.data = settings.gradeStates,
    this.st   = {
      grade        : ".js-grade",
      states       : ".js-state",
      career       : ".js-career",
      modalRegister: "#modalRegisterComplete",
      modalUpdate  : "#modalUpdate"
    }
  }

  catchDom() {
    this.dom = {}
    this.dom.grade         = $(this.st.grade);
    this.dom.states        = $(this.st.states);
    this.dom.career        = $(this.st.career);
    this.dom.modalRegister = $(this.st.modalRegister);
    this.dom.modalUpdate   = $(this.st.modalUpdate);
  }

  afterCatchDom() {
    this.setFieldGrade(this.data, this.dom.grade);
  }

  subscribeEvents() {
    this.dom.grade.on("change", (e) => this.onChangeFieldGrade());
  }

  onChangeFieldGrade() {
    let $grade, $career, $states;
    $grade  = this.dom.grade;
    $career = this.dom.career;
    $states = this.dom.states;

    $states.empty();
    $states.val('').removeClass('is-error').parent().removeClass('is-error');
    if( $grade.val() === "2" || $grade.val() === "3" ) {
      $states.prop({
        disabled: true,
        required: false
      });
      $states.html("<option value=''>Selecciona un estado</option>");
      $states.attr("disabled", "disabled");
      $states.removeAttr("required");
      $states.removeClass("error");
      $states.parent().removeClass("tooltipster is-error");
      $states.parent().addClass("is-disabled");
      $career.attr("disabled", "disabled");
      $career.removeAttr("required");
      $career.removeClass("error");
      $career.parent().removeClass("tooltipster is-error");
      $career.parent().addClass("is-disabled");
    } else {
      $states.removeAttr("disabled");
      $states.attr("required", "required");
      $states.parent().removeClass("is-disabled");
      $career.removeAttr("disabled");
      $career.attr("required", "required");
      $career.parent().removeClass("is-disabled");
      this.setFieldStates( this.data, $grade.val() );
    }
  }

  setFieldGrade(data, $grade) {
    $grade.append("<option value='default' selected>Selecciona un grado</option>");
    $.each(data, function(item) {
      $grade.append($("<option>", {
        value       : data[item].id,
        label       : data[item].name,
        text        : data[item].name
      }))
    });
  }

  setFieldStates(data, idStates) {
    let $states;
    $states = this.dom.states;
    $states.append("<option value='default' selected>Selecciona un estado</option>");
    $.each(data, function(_index) {
      if (data[_index].id === parseInt(idStates)) {
        $.each(data[_index].states, function(index) {
          $states.append($("<option>", {
            value: data[_index].states[index].id,
            label: data[_index].states[index].name,
            text : data[_index].states[index].name
          }))
        })
      }
    })
  }
}