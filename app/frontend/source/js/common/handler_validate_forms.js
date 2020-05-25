/*global $*/
import 'jquery-validation';
import 'tooltipster';

export default class HandlerValidateForms {

  constructor() {
    this.setSettings();
    this.beforeCatchDom();
    this.catchDom();
    this.afterCatchDom();
    this.subscribeEvents();
  }

  setSettings () {
    this.st = {
      formTypeBox  : '.js-form-box',
      formTooltip  : '.js-form-valide',
      fieldset     : 'fieldset',
      inputs       : 'input,textarea',
      classSelected: 'is-selected'
    };
    this.dom = {};
  }

  beforeCatchDom () {
    this.configMessages();
    this.validateExtraFunctions();
  }

  catchDom () {
    this.dom.window      = $(window);
    this.dom.formTypeBox = $(this.st.formTypeBox);
    this.dom.formTooltip = $(this.st.formTooltip);
    this.dom.fieldset    = $(this.st.fieldset, this.dom.formTooltip);
  }

  afterCatchDom () {
    this.initTooltip();
  }

  subscribeEvents () {
    this.dom.formTypeBox.on("click", this.st.fieldset, (e) => this.onShowInputSelected(e));
    this.dom.formTypeBox.on("blur", this.st.inputs, (e) => this.onRemoveClassSelected(e));
    this.dom.formTypeBox.on("focus", this.st.inputs, (e) => this.onAddClassSelected(e));
  }

  onShowInputSelected (event) {
    let _this, _thisInput;
    _this      = $(event.target);
    _thisInput = $(this.st.inputs, _this);

    if ($("select", _this).length !== 0) {
      return;
    }
    if (this.isValidInput(_thisInput)) {
      _this.parents(this.st.formTypeBox).find(`.${this.st.classSelected}`).removeClass(this.st.classSelected);
      _this.addClass(this.st.classSelected);
      _thisInput.focus();
    }
  }

  onAddClassSelected (event) {
    let _thisInput;
    _thisInput = $(event.target);
    _thisInput.parents(HandlerValidateForms.fieldset).addClass(HandlerValidateForms.classSelected);
  }

  onRemoveClassSelected (event) {
    let _thisInput;
    _thisInput = $(event.target);
    _thisInput.parents(this.st.fieldset).addClass(this.st.classSelected);
  }

  validateExtraFunctions () {
    $.validator.addMethod("alphNumeric", (function(value, element) {
      return this.optional(element) || /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑäëïöüÿÄËÏÖÜ ]+$/gi.test($.trim(value));
    }), "Solo letras y números.");
    $.validator.addMethod("businessName", (function(value, element) {
      return this.optional(element) || /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑäëïöüÿÄËÏÖÜ&-.', ]+$/gi.test($.trim(value));
    }), "Formato no válido.");
    $.validator.addMethod("alphabet", (function(value, element){
      return this.optional(element) || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ&äëïöüÿÄËÏÖÜ ]+$/gi.test($.trim(value));
    }), "Solo letras.");
    $.validator.addMethod("comment", (function(value, element){
      return this.optional(element) || /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ&\.,äëïöüÿÄËÏÖÜ\?¿!¡\-_\*;:\+\(\)#%\$@=\"\"\/\n ]+$/gi.test(value); // eslint-disable-line no-useless-escape
    }), "Texto inválido.");
    $.validator.addMethod("dateMask", (function(value, element){
      return this.optional(element) || /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/gi.test(value);
    }), "Fecha inválida.");
    $.validator.addMethod("nEmail", (function(value, element){
      return this.optional(element) || /^[\w\d]+(\.?[\w\d\_\-]+)*@[\w\-]{2,}(\.?\w{2,})+$/i.test(value); // eslint-disable-line no-useless-escape
    }), "El email ingresado es incorrecto.");
    $.validator.addMethod("video", (function(value, element){
      return this.optional(element) || /((?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+))|(?:https?:\/{2})?(?:w{3}\.)?vimeo.com\/(.*)/.test(value);
    }), "Ingrese una url válida");
    $.validator.addMethod("address", (function(value, element){
      return this.optional(element) || /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ&.,äëïöüÿÄËÏÖÜ \-]+$/gi.test(value); // eslint-disable-line no-useless-escape
    }), "La dirección no es válida");
    $.validator.addMethod("autocompleteValidator", (function(value, element){
      let flag;
      flag = true;
      if ($.trim(value) === "") {
        flag = false;
      }
      return this.optional(element) || flag;
    }), "Seleccione una opción de las sugerencias que le brindamos.");
    $.validator.addMethod("telephone", (function(value, element) {
      return this.optional(element) || /^(\*|#)?(\(?([0-9]{2,3})\)?)?[-. ]?([0-9]{2,3})[-. ]?([0-9]{4})$/.test(value);
    }), "Ingresa un teléfono válido. Formato: (044)23-4567 ó (01)123-1234 ó 123-1234 ó 987654321");
    $.validator.addMethod("ruc", (function(value, element){
      let dig, dig_valid, dig_verif, dig_verif_aux, factor, flag_dig, i, item, j, narray, residuo, resta, suma, flag;
      factor = "5432765432";
      if (typeof value === "undefined" || value.length !== 11) {
        return false;
      }
      dig_valid = [10, 20, 17, 15];
      dig = value.substr(0, 2);
      flag_dig = dig_valid.indexOf(parseInt(dig, 10));
      if (flag_dig === -1) {
        return false;
      }
      dig_verif = value.substr(10, 1);
      narray = [];
      i = 0;
      while (i < 10) {
        item = value.substr(i, 1) * factor.substr(i, 1);
        narray.push(item);
        i++;
      }
      suma = 0;
      j = 0;
      while (j < narray.length) {
        suma = suma + narray[j];
        j++;
      }
      residuo = suma % 11;
      resta = 11 - residuo;
      dig_verif_aux = resta.toString().substr(-1);
      if (dig_verif === dig_verif_aux) {
        flag = true;
      } else {
        flag = false;
      }
      return this.optional(element) || flag;
    }), "El campo RUC es inválido.");
    $.validator.addMethod("tradeName", (function(value, element) {
      let flag = true;
      if (value.length < 2 || value.length > 56) {
        flag = false;
      }
      return this.optional(element) || flag;
    }), "Puedes escribir entre 2 y 56 caracteres.");
    $.validator.addMethod("acronymQuantity", (function(value, element) {
      let flag = true;
      if (value.length < 2 || value.length > 8) {
        flag = false;
      }
      return this.optional(element) || flag;
    }), "Puedes escribir entre 2 y 8 caracteres.");
    $.validator.addMethod("acronymCharacters", (function(value, element) {
      return this.optional(element) || /^[a-zA-Z0-9\.]+$/gi.test(value); // eslint-disable-line no-useless-escape
    }), "Solo letras, números y punto ('.').");
    $.validator.addMethod("url", (function(value, element) {
      return this.optional(element) || /((http|https):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/.test(value); // eslint-disable-line no-useless-escape
    }), "Ingresa una URL válida.");
    $.validator.addMethod("valueNotEquals", (function(value, element){
      let idField;
      idField = $(element).val();
      return $.trim(idField) !== 'default';
    }), "Seleccione una opción");
    $.validator.addMethod('verifyInstitution', (function(value, element, param) {
      let idField;
      idField = $(param).val();
      return $.trim(idField) !== '';
    }), 'Selecciona una institución');
    $.validator.addMethod("rangeDate", function(valueElement, element) {
      const $this              = $(element);
      const containerDateRange = $this.parents(".js-date-range");
      const inputStartDate     = containerDateRange.find(".js-date[data-date=start]");
      const inputEndDate       = containerDateRange.find(".js-date[data-date=end]");
      const brotherDate        = $this.parent().siblings().find(".js-date");
      let flag                 = true;
      const messagesError      = {
        start: "La fecha de inicio de ser menor a la fecha de fin",
        end  : "La fecha de fin debe ser mayor a la fecha de inicio"
      };

      // Capturando lo valores de las fechas
      const startDate = inputStartDate.val();
      const endDate   = inputEndDate.val();

      // Convirtiendo a formato fecha
      const startDateFormat = startDate.split("/").reverse().join("-");
      const endDateFormat   = endDate.split("/").reverse().join("-");

      // Cambiando el tipo de la fecha de String a Date
      const newStartDate = new Date(startDateFormat);
      const newEndDate   = new Date(endDateFormat);

      // Si el campo fecha esta lleno
      if (valueElement.length) {
        // Agrega la regla de requerido a la fecha hermana
        brotherDate.rules("add", "required");

        // Validando las fechas
        if(newStartDate > newEndDate) {
          const typeDate = $this.data("date");

          // Agregando mensaje dinámico a la validación
          $this.rules("add", {
            messages: {
              rangeDate: messagesError[typeDate]
            }
          });

          flag = false;
        }
      }
      return this.optional(element) || flag;
    }, "");
  }

  isValidInput ($input) {
    let isNotCheckbox, isNotRadio, isTextArea;
    isNotCheckbox = !$input.is(":checkbox");
    isNotRadio    = !$input.is(":radio");
    isTextArea    = $input.is("textarea");
    return isNotCheckbox || isNotRadio || isTextArea;
  }

  initTooltip () {
    this.dom.fieldset.tooltipster({
      multiple       : true,
      updateAnimation: null,
      timer          : 1000,
      distance       : 0,
      trigger        : "custom",
      theme          : ["tooltipster-aptitus"]
    });
  }

  configMessages () {
    $.extend($.validator.messages, {
      email   : "Ingrese un email válido",
      equalTo : "El valor debe ser idéntico",
      minlength: $.validator.format( "No escriba menos de {0} caracteres." ),
      required: "Este campo es requerido"
    });
  }

}
